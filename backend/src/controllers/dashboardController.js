import User from '../models/userModel.js';
import Table from '../models/tableModel.js';
import MenuItem from '../models/menuItemModel.js';
import Order from '../models/orderModel.js';
import { sendSuccess } from '../utils/responseFormatter.js';

/**
 * @desc    Cafe POS overview stats
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      users,
      tables,
      menuItems,
      openOrders,
      occupiedTables,
      paidToday
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Table.countDocuments(),
      MenuItem.countDocuments(),
      Order.countDocuments({
        status: { $nin: ['PAID', 'CANCELLED'] },
        paymentStatus: 'UNPAID'
      }),
      Table.countDocuments({ status: 'OCCUPIED' }),
      Order.find({
        paymentStatus: 'PAID',
        updatedAt: { $gte: startOfDay }
      }).select('total')
    ]);

    const todaySales = paidToday.reduce((sum, o) => sum + (o.total || 0), 0);

    return sendSuccess(res, 'Dashboard stats retrieved', {
      users,
      tables,
      menuItems,
      openOrders,
      occupiedTables,
      todaySales,
      todayOrderCount: paidToday.length
    });
  } catch (error) {
    next(error);
  }
};
