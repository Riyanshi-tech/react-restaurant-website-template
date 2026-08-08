import dotenv from 'dotenv';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import User from '../models/userModel.js';
import Table from '../models/tableModel.js';
import MenuItem from '../models/menuItemModel.js';
import Order from '../models/orderModel.js';
import connectDB from './db.js';

// Load environment variables
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081';

const generateSlug = (tableNumber) => {
  const pad = String(tableNumber).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 7);
  return `foresthub-t${pad}-${rand}`;
};

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // 1. Clear existing collections
    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Table.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    console.log('Database collections cleared.');

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

    // 4. Define and seed menu items
    const menuItems = [
      {
        name: 'Wild Chanterelle Frittata',
        price: 26,
        category: 'breakfast',
        description: 'Fluffy forest hen eggs baked with wild-harvested chanterelle mushrooms, local fontina cheese, and fresh sage greens.',
        tag: 'Staff Choice',
        image: 'our-story'
      },
      {
        name: 'Forest Honey & Oats Parfait',
        price: 19,
        category: 'breakfast',
        description: 'Creamy house-made sheep yogurt, organic wild honey, toasted heirloom oats, and seasonal pine-cone berry jam.',
        image: 'dish-coffee'
      },
      {
        name: 'Smoked Venison Flatbread',
        price: 34,
        category: 'lunch',
        description: 'Thin-crust wood-fired flatbread topped with cured venison strips, caramelized forest onions, and a wild huckleberry reduction.',
        tag: 'Signature',
        image: 'dish-steak'
      },
      {
        name: 'Rainforest Botanist Salad',
        price: 24,
        category: 'lunch',
        description: 'Lush moss greens, organic micro-herbs, roasted walnuts, shaved radish, and a sparkling citrus pine-needle vinaigrette.',
        image: 'ambience-1'
      },
      {
        name: 'Cedar-Planked Stream Trout',
        price: 48,
        category: 'dinner',
        description: 'Freshly caught local stream trout slow-grilled on aromatic cedar planks, served with wild ramp purée and blistered vine tomatoes.',
        tag: 'Highly Recommended',
        image: 'jungle-hero'
      },
      {
        name: 'Pine-Crusted Rack of Lamb',
        price: 58,
        category: 'dinner',
        description: 'Tender grass-fed lamb rack encrusted with crushed pine nuts and herbs, roasted parsnips, and a rich bone-marrow broth.',
        image: 'dish-steak'
      },
      {
        name: 'Wild Blackberry Lavender Tart',
        price: 18,
        category: 'desserts',
        description: 'Crispy sweet crust filled with fresh blackberries, infused with local mountain lavender oil, and topped with spun sugar.',
        tag: 'Delicate',
        image: 'our-story'
      },
      {
        name: 'Spruce-Infused Mousse',
        price: 16,
        category: 'desserts',
        description: 'Dark single-origin Peruvian chocolate whipped with a hint of young spruce shoot oil, served inside a miniature wood bowl.',
        image: 'dish-coffee'
      },
      {
        name: 'Smoked Botanical Gin & Tonic',
        price: 22,
        category: 'drinks',
        description: 'House-distilled forest gin infused with pine needles, juniper berries, elderflower, served with local tonic and active cedar smoke.',
        tag: 'House Special',
        image: 'heroBg'
      },
      {
        name: 'Geisha Pour-Over Coffee',
        price: 14,
        category: 'drinks',
        description: 'Single-origin Geisha beans brewed slow tableside. Offers distinct tasting notes of jasmine, peach nectar, and citrus honey.',
        image: 'dish-coffee'
      }
    ];

    console.log('Inserting seed menu items...');
    for (const item of menuItems) {
      const createdItem = await MenuItem.create(item);
      console.log(`Created menu item: ${createdItem.name} (${createdItem.category})`);
    }

    // 5. Define and seed tables
    const locations = ['Main Hall', 'Main Hall', 'Terrace', 'Terrace', 'VIP Lounge'];
    const capacities = [2, 4, 4, 6, 8];

    console.log('Inserting seed tables...');
    for (let i = 1; i <= 5; i++) {
      const tableNumber = i;
      const name = `Table ${String(tableNumber).padStart(2, '0')}`;
      const slug = generateSlug(tableNumber);
      const capacity = capacities[i - 1];
      const location = locations[i - 1];

      // Pre-generate QR Code data URL pointing to ordering page
      const orderingUrl = `${FRONTEND_URL}/orders/${slug}`;
      const qrCodeUrl = await QRCode.toDataURL(orderingUrl);

      const table = await Table.create({
        tableNumber,
        name,
        slug,
        capacity,
        location,
        status: 'AVAILABLE',
        isActive: true,
        qrCodeUrl
      });

      console.log(`Created table: ${table.name} at ${table.location} - Slug: ${table.slug}`);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
