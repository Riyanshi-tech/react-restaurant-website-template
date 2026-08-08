import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import connectDB from './db.js';

// Load environment variables
dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to database
    await connectDB();

    // 1. Clear existing users
    console.log('Clearing existing users...');
    await User.deleteMany();
    console.log('Database cleared of users.');

    // 2. Define test users
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

    // 3. Create users
    console.log('Inserting seed users...');
    for (const u of users) {
      const user = await User.create(u);
      console.log(`Created user: ${user.name} (${user.role}) - ${user.email}`);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedUsers();
