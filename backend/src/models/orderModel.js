import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtOrder: {
    type: Number,
    required: true,
    min: 0,
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  },
  guestName: {
    type: String,
    trim: true,
  },
  guestPhone: {
    type: String,
    trim: true,
    index: true,
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['PENDING', 'PREPARING', 'READY', 'SERVED', 'PAID', 'CANCELLED'],
    default: 'PENDING',
  },
  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'PAID'],
    default: 'UNPAID',
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
