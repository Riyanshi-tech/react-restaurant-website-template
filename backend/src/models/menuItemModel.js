import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'desserts', 'drinks'],
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  tag: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // Dynamic asset image path or imported path
    trim: true,
  }
}, {
  timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
