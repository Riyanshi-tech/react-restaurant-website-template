import Order from '../models/orderModel.js';
import Table from '../models/tableModel.js';
import MenuItem from '../models/menuItemModel.js';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';

const OPEN_STATUSES = ['PENDING', 'PREPARING', 'READY', 'SERVED'];

const buildOrderItems = async (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  const orderItems = [];
  let orderTotal = 0;

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItemId);
    if (!menuItem) {
      throw new ApiError(404, `Menu item not found: ${item.menuItemId}`);
    }

    const qty = parseInt(item.quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new ApiError(400, `Invalid quantity for item ${menuItem.name}`);
    }

    orderTotal += menuItem.price * qty;
    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity: qty,
      priceAtOrder: menuItem.price
    });
  }

  return { orderItems, orderTotal };
};

const maybeFreeTable = async (tableId) => {
  const openCount = await Order.countDocuments({
    table: tableId,
    status: { $in: OPEN_STATUSES },
    paymentStatus: 'UNPAID'
  });

  if (openCount === 0) {
    await Table.findByIdAndUpdate(tableId, {
      status: 'AVAILABLE',
      activeOrder: null
    });
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      const statuses = String(req.query.status).split(',').map((s) => s.trim());
      filter.status = { $in: statuses };
    }

    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    if (req.query.today === 'true') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      filter.updatedAt = { $gte: start };
    }

    const orders = await Order.find(filter)
      .populate('table', 'tableNumber name location status')
      .sort({ createdAt: -1 });

    const totalSales = orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return sendSuccess(res, 'Orders retrieved', { orders, totalSales, count: orders.length });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'table',
      'tableNumber name location status'
    );
    if (!order) throw new ApiError(404, 'Order not found');
    return sendSuccess(res, 'Order retrieved', { order });
  } catch (error) {
    next(error);
  }
};

export const createStaffOrder = async (req, res, next) => {
  try {
    const { tableId, items } = req.body;
    if (!tableId) throw new ApiError(400, 'tableId is required');

    const table = await Table.findById(tableId);
    if (!table) throw new ApiError(404, 'Table not found');
    if (!table.isActive || table.status === 'INACTIVE') {
      throw new ApiError(400, 'Ordering is disabled for this table');
    }

    const { orderItems, orderTotal } = await buildOrderItems(items);
    let order;

    if (table.status === 'OCCUPIED' && table.activeOrder) {
      order = await Order.findById(table.activeOrder);
      if (order && order.paymentStatus === 'UNPAID' && order.status !== 'CANCELLED') {
        for (const newItem of orderItems) {
          const existingItemIndex = order.items.findIndex(
            (i) => i.menuItem.toString() === newItem.menuItem.toString()
          );
          if (existingItemIndex > -1) {
            order.items[existingItemIndex].quantity += newItem.quantity;
          } else {
            order.items.push(newItem);
          }
        }
        order.total += orderTotal;
        await order.save();
      } else {
        order = await Order.create({
          orderNumber: `FH-${1000 + Math.floor(Math.random() * 9000)}`,
          table: table._id,
          items: orderItems,
          total: orderTotal,
          status: 'PENDING',
          paymentStatus: 'UNPAID'
        });
        table.activeOrder = order._id;
      }
    } else {
      order = await Order.create({
        orderNumber: `FH-${1000 + Math.floor(Math.random() * 9000)}`,
        table: table._id,
        items: orderItems,
        total: orderTotal,
        status: 'PENDING',
        paymentStatus: 'UNPAID'
      });
      table.activeOrder = order._id;
      table.status = 'OCCUPIED';
    }

    await table.save();
    const populated = await Order.findById(order._id).populate(
      'table',
      'tableNumber name location status'
    );
    return sendSuccess(res, 'Order placed successfully', { order: populated }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found');

    if (status) {
      const allowed = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'PAID', 'CANCELLED'];
      if (!allowed.includes(status)) {
        throw new ApiError(400, `Invalid status: ${status}`);
      }
      order.status = status;
      if (status === 'PAID') order.paymentStatus = 'PAID';
      if (status === 'CANCELLED' && order.paymentStatus !== 'PAID') {
        // leave unpaid cancelled
      }
    }

    if (paymentStatus) {
      if (!['UNPAID', 'PAID'].includes(paymentStatus)) {
        throw new ApiError(400, `Invalid paymentStatus: ${paymentStatus}`);
      }
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'PAID') order.status = 'PAID';
    }

    await order.save();

    if (order.paymentStatus === 'PAID' || order.status === 'CANCELLED' || order.status === 'PAID') {
      await maybeFreeTable(order.table);
    }

    const populated = await Order.findById(order._id).populate(
      'table',
      'tableNumber name location status'
    );
    return sendSuccess(res, 'Order updated', { order: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload generated bill PNG to Cloudinary
 * @route   POST /api/orders/bill-image
 */
export const uploadBillImage = async (req, res, next) => {
  try {
    if (!isCloudinaryConfigured()) {
      throw new ApiError(500, 'Cloudinary is not configured');
    }
    const { dataUrl } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      throw new ApiError(400, 'Bill image dataUrl is required');
    }

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: 'foresthub/bills',
      resource_type: 'image'
    });

    return sendSuccess(res, 'Bill image uploaded', { url: result.secure_url });
  } catch (error) {
    next(error);
  }
};
