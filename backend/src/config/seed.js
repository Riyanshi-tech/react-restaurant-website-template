import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Table from '../models/tableModel.js';
import MenuItem from '../models/menuItemModel.js';
import Order from '../models/orderModel.js';
import connectDB from './db.js';

dotenv.config();

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

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing tables, menu, and orders...');
    await Table.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    console.log('Operational collections cleared.');

    const users = [
      {
        name: 'System Administrator',
        email: 'admin@restaurant.com',
        password: 'Admin@123',
        role: 'ADMIN'
      },
      {
        name: 'General Manager',
        email: 'manager@restaurant.com',
        password: 'Manager@123',
        role: 'MANAGER'
      },
      {
        name: 'Cashier POS User',
        email: 'cashier@restaurant.com',
        password: 'Cashier@123',
        role: 'CASHIER'
      }
    ];

    console.log('Upserting seed users...');
    for (const u of users) {
      const existing = await User.findOne({ email: u.email }).select('+password');
      if (existing) {
        existing.name = u.name;
        existing.role = u.role;
        existing.password = u.password;
        existing.isActive = true;
        existing.permissions = ROLE_PERMISSIONS[u.role];
        await existing.save();
        console.log(`Updated user: ${existing.email} (${existing.role})`);
      } else {
        const user = await User.create({
          ...u,
          permissions: ROLE_PERMISSIONS[u.role]
        });
        console.log(`Created user: ${user.email} (${user.role})`);
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
