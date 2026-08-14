import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/userModel.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant-management');
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, { name: 1, email: 1, role: 1, isActive: 1 });
    console.log('Users in DB:');
    console.log(JSON.stringify(users, null, 2));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to DB or querying users:', error);
    process.exit(1);
  }
};

checkUsers();
