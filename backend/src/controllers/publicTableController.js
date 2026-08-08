import Table from '../models/tableModel.js';
import MenuItem from '../models/menuItemModel.js';
import Order from '../models/orderModel.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';

const RESTAURANT_INFO = {
  name: 'ForestHub',
  logo: '/logo.webp',
  address: '100 Mossy Trail, Forest Valley',
  phone: '+1 (555) FOREST-HUB'
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

    // Fetch active order details if occupied
    let activeOrder = null;
    if (table.status === 'OCCUPIED' && table.activeOrder) {
      activeOrder = await Order.findById(table.activeOrder);
    }

    // Fetch menu items from DB
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    const categories = ['breakfast', 'lunch', 'dinner', 'desserts', 'drinks'];

    // Construct DTO
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
    const { items } = req.body; // Array of { menuItemId, quantity }

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

    // Build order items list by resolving DB MenuItems
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

      const itemTotal = menuItem.price * qty;
      orderTotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: qty,
        priceAtOrder: menuItem.price
      });
    }

    let order;

    // Check if table already has an active unpaid order
    if (table.status === 'OCCUPIED' && table.activeOrder) {
      order = await Order.findById(table.activeOrder);
      if (order && order.paymentStatus === 'UNPAID' && order.status !== 'CANCELLED') {
        // Append items to existing active order session
        for (const newItem of orderItems) {
          // Check if item already exists in current order to merge
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
        // Create new active order
        const orderNumber = `FH-${1000 + Math.floor(Math.random() * 9000)}`;
        order = await Order.create({
          orderNumber,
          table: table._id,
          items: orderItems,
          total: orderTotal,
          status: 'PENDING',
          paymentStatus: 'UNPAID'
        });
        table.activeOrder = order._id;
      }
    } else {
      // Create fresh active order
      const orderNumber = `FH-${1000 + Math.floor(Math.random() * 9000)}`;
      order = await Order.create({
        orderNumber,
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

    return sendSuccess(res, 'Order placed successfully', { order }, 201);
  } catch (error) {
    next(error);
  }
};
