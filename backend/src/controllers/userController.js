import User from '../models/userModel.js';
import AuditLog from '../models/auditLogModel.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { createUserSchema, updateUserSchema } from '../validators/userValidator.js';

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Private (ADMIN only)
 */
const DEFAULT_PERMISSIONS = {
  ADMIN: [
    'menu.read', 'menu.write',
    'booking.read', 'booking.write',
    'staff.read', 'staff.write',
    'logs.read',
    'pos.read', 'pos.write',
    'order.read', 'order.write',
    'sales.read',
    'users.read', 'users.write',
    'settings.read', 'settings.write'
  ],
  MANAGER: [
    'menu.read', 'menu.write',
    'booking.read', 'booking.write',
    'staff.read',
    'logs.read'
  ],
  CASHIER: [
    'pos.read', 'pos.write',
    'order.read', 'order.write',
    'sales.read'
  ]
};

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Private (ADMIN only)
 */
export const createUser = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = createUserSchema.parse(req.body);
    const { name, email, password, role, isActive, permissions } = validatedData;

    // 2. Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, 'A user with this email address already exists.');
    }

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      isActive: isActive !== undefined ? isActive : true,
      permissions: permissions || DEFAULT_PERMISSIONS[role] || []
    });

    // Remove password from returned object
    user.password = undefined;

    return sendSuccess(res, 'User created successfully', { user }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (ADMIN, MANAGER only)
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Users list retrieved successfully', { users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (ADMIN only)
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate request body
    const validatedData = updateUserSchema.parse(req.body);

    // 2. Check if user exists
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, `User not found with ID: ${id}`);
    }

    // Primary Admin Safeguards
    const isPrimaryAdmin = user.email === 'admin@restaurant.com';
    if (isPrimaryAdmin) {
      if (validatedData.role && validatedData.role !== 'ADMIN') {
        throw new ApiError(400, 'The role of the primary System Administrator cannot be changed.');
      }
      if (validatedData.isActive === false) {
        throw new ApiError(400, 'The primary System Administrator account cannot be deactivated.');
      }
    }

    // 3. Apply updates
    if (validatedData.name) user.name = validatedData.name;
    if (validatedData.password) user.password = validatedData.password;
    if (validatedData.isActive !== undefined) user.isActive = validatedData.isActive;

    if (validatedData.role) {
      const oldRole = user.role;
      user.role = validatedData.role;
      // Reset default permissions if role has changed and new permissions are not explicitly passed
      if (oldRole !== validatedData.role && !validatedData.permissions) {
        user.permissions = DEFAULT_PERMISSIONS[validatedData.role] || [];
      }
    }

    if (validatedData.permissions !== undefined) {
      user.permissions = validatedData.permissions;
    }

    if (validatedData.email && validatedData.email !== user.email) {
      // Check if email is taken by another user
      const emailExists = await User.findOne({ email: validatedData.email });
      if (emailExists) {
        throw new ApiError(400, 'A user with this email address already exists.');
      }
      user.email = validatedData.email;
    }

    // 4. Save (triggers pre-save middleware)
    await user.save();

    // Hide password
    user.password = undefined;

    return sendSuccess(res, 'User updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (ADMIN only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Check if user exists
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, `User not found with ID: ${id}`);
    }

    // Prevent deleting primary admin
    if (user.email === 'admin@restaurant.com') {
      throw new ApiError(400, 'The primary System Administrator account cannot be deleted.');
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === user._id.toString()) {
      throw new ApiError(400, 'You are not allowed to delete your own administrative account.');
    }

    // 2. Delete user
    await user.deleteOne();

    return sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log Admin simulating another user role
 * @route   POST /api/users/:id/access-as
 * @access  Private (ADMIN only)
 */
export const logAccessAs = async (req, res, next) => {
  try {
    const { id } = req.params;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError(404, `User not found with ID: ${id}`);
    }

    // Write log to database
    await AuditLog.create({
      actor: req.user._id,
      action: 'ACCESS_AS',
      targetUser: targetUser._id,
      targetRole: targetUser.role,
      details: `Admin '${req.user.name}' simulated access as ${targetUser.role} '${targetUser.name}'`
    });

    return sendSuccess(res, 'Simulation access log successfully recorded');
  } catch (error) {
    next(error);
  }
};
