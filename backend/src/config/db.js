import mongoose from 'mongoose';
import User from '../models/userModel.js';

const ROLE_PERMISSIONS = {
  ADMIN: [
    'menu.read', 'menu.write',
    'staff.read', 'staff.write',
    'logs.read',
    'pos.read', 'pos.write',
    'order.read', 'order.write',
    'sales.read',
    'users.read', 'users.write',
    'settings.read', 'settings.write',
    'tables.read', 'tables.create', 'tables.update', 'tables.delete', 'tables.qr.generate'
  ],
  MANAGER: [
    'menu.read', 'menu.write',
    'staff.read',
    'logs.read',
    'order.read',
    'users.read',
    'tables.read', 'tables.create', 'tables.update', 'tables.delete', 'tables.qr.generate'
  ],
  CASHIER: [
    'pos.read', 'pos.write',
    'order.read', 'order.write',
    'sales.read',
    'menu.read',
    'tables.read'
  ]
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant-management');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed default users if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in database. Seeding default staff accounts...');
      const users = [
        {
          name: 'System Administrator',
          email: 'admin@restaurant.com',
          password: 'Admin@123',
          role: 'ADMIN',
          permissions: ROLE_PERMISSIONS.ADMIN
        },
        {
          name: 'General Manager',
          email: 'manager@restaurant.com',
          password: 'Manager@123',
          role: 'MANAGER',
          permissions: ROLE_PERMISSIONS.MANAGER
        },
        {
          name: 'Cashier POS User',
          email: 'cashier@restaurant.com',
          password: 'Cashier@123',
          role: 'CASHIER',
          permissions: ROLE_PERMISSIONS.CASHIER
        }
      ];

      for (const u of users) {
        await User.create(u);
      }
      console.log('Default staff accounts seeded successfully!');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
