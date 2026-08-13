import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Exclude password from query results by default
    },
    role: {
      type: String,
      enum: {
        values: ['ADMIN', 'MANAGER', 'CASHIER'],
        message: '{VALUE} is not a valid role. Allowed roles are ADMIN, MANAGER, CASHIER'
      },
      default: 'CASHIER'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      default: function() {
        if (this.role === 'ADMIN') {
          return [
            'menu.read', 'menu.write',
            'staff.read', 'staff.write',
            'logs.read',
            'pos.read', 'pos.write',
            'order.read', 'order.write',
            'sales.read',
            'users.read', 'users.write',
            'settings.read', 'settings.write',
            'tables.read', 'tables.create', 'tables.update', 'tables.delete', 'tables.qr.generate'
          ];
        } else if (this.role === 'MANAGER') {
          return [
            'menu.read', 'menu.write',
            'staff.read',
            'logs.read',
            'order.read',
            'users.read',
            'tables.read', 'tables.create', 'tables.update', 'tables.delete', 'tables.qr.generate'
          ];
        } else if (this.role === 'CASHIER') {
          return [
            'pos.read', 'pos.write',
            'order.read', 'order.write',
            'sales.read',
            'menu.read',
            'tables.read'
          ];
        }
        return [];
      }
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
