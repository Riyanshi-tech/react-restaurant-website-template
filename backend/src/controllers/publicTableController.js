import Table from '../models/tableModel.js';
import MenuItem from '../models/menuItemModel.js';
import Order from '../models/orderModel.js';
import mongoose from 'mongoose';
import { getOrCreateSettings } from '../models/settingsModel.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';

const RESTAURANT_INFO = {
  name: 'ForestHub',
  logo: '/logo.webp',
  address: '100 Mossy Trail, Forest Valley',
  phone: '+1 (555) FOREST-HUB'
};

const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '');

/**
 * @desc    Guest order history by phone
 * @route   GET /api/public/tables/guest/orders?phone=
 * @access  Public
 */
export const getGuestOrdersByPhone = async (req, res, next) => {
  try {
    const phone = normalizePhone(req.query.phone);
    if (phone.length < 8) {
      throw new ApiError(400, 'Valid phone number is required');
    }

    const orders = await Order.find({ guestPhone: phone })
      .populate('table', 'tableNumber name location slug')
      .sort({ createdAt: -1 })
      .limit(40);

    return sendSuccess(res, 'Guest orders retrieved', {
      orders,
      count: orders.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public table status, active menu and active order
 * @route   GET /api/public/tables/:slug
 * @access  Public
 */
export const getPublicTableDetails = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const table = await Table.findOne({ slug });
    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    if (!table.isActive) {
      throw new ApiError(400, 'This table is currently inactive and unavailable');
    }

    let activeOrder = null;
    if (table.status === 'OCCUPIED' && table.activeOrder) {
      activeOrder = await Order.findById(table.activeOrder);
    }

    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    const categories = ['breakfast', 'lunch', 'dinner', 'desserts', 'drinks'];

    const payload = {
      table: {
        id: table._id,
        tableNumber: table.tableNumber,
        name: table.name,
        capacity: table.capacity,
        location: table.location,
        status: table.status,
        slug: table.slug
      },
      restaurant: RESTAURANT_INFO,
      menu: {
        categories,
        items: menuItems.map(item => ({
          id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          tag: item.tag,
          image: item.image
        }))
      },
      activeOrder: activeOrder ? {
        id: activeOrder._id,
        orderNumber: activeOrder.orderNumber,
        guestName: activeOrder.guestName,
        guestPhone: activeOrder.guestPhone,
        items: activeOrder.items,
        total: activeOrder.total,
        status: activeOrder.status,
        paymentStatus: activeOrder.paymentStatus
      } : null,
      ordering: {
        allowOrdering: table.status === 'AVAILABLE' || table.status === 'OCCUPIED',
        allowMultipleOrders: true
      }
    };

    return sendSuccess(res, 'Table details loaded successfully', payload);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Place/append order from a table
 * @route   POST /api/public/tables/:slug/orders
 * @access  Public
 */
export const placeTableOrder = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { items, guestName, guestPhone } = req.body;

    const name = String(guestName || '').trim();
    const phone = normalizePhone(guestPhone);
    if (!name || name.length < 2) {
      throw new ApiError(400, 'Guest name is required');
    }
    if (phone.length < 8) {
      throw new ApiError(400, 'Valid phone number is required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'Order must contain at least one item');
    }

    const table = await Table.findOne({ slug });
    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    if (!table.isActive || table.status === 'INACTIVE') {
      throw new ApiError(400, 'Ordering is disabled for this table');
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
        order.guestName = name;
        order.guestPhone = phone;
        await order.save();
      } else {
        order = await Order.create({
          orderNumber: `FH-${1000 + Math.floor(Math.random() * 9000)}`,
          table: table._id,
          guestName: name,
          guestPhone: phone,
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
        guestName: name,
        guestPhone: phone,
        items: orderItems,
        total: orderTotal,
        status: 'PENDING',
        paymentStatus: 'UNPAID'
      });
      table.activeOrder = order._id;
      table.status = 'OCCUPIED';
    }

    await table.save();

    return sendSuccess(res, 'Order placed successfully', { order }, 201);
  } catch (error) {
    next(error);
  }
};

const billingShape = (doc) => ({
  restaurantName: doc.restaurantName,
  address: doc.address,
  phone: doc.phone,
  gstin: doc.gstin,
  gstPercent: doc.gstPercent,
  cgstPercent: doc.cgstPercent,
  sgstPercent: doc.sgstPercent,
  whatsappCountryCode: doc.whatsappCountryCode,
  billFooter: doc.billFooter
});

/**
 * @desc    Public bill by order number or MongoDB id
 * @route   GET /api/public/bills/:slug
 * @access  Public
 */
export const getPublicBill = async (req, res, next) => {
  try {
    const slug = decodeURIComponent(String(req.params.slug || '')).trim();
    if (!slug) throw new ApiError(400, 'Bill id is required');

    let order = null;
    if (mongoose.isValidObjectId(slug)) {
      order = await Order.findById(slug).populate('table', 'tableNumber name location');
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: slug }).populate(
        'table',
        'tableNumber name location'
      );
    }
    if (!order) throw new ApiError(404, 'Bill not found');

    const settings = await getOrCreateSettings();
    return sendSuccess(res, 'Bill retrieved', {
      order,
      billing: billingShape(settings)
    });
  } catch (error) {
    next(error);
  }
};
