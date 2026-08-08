import User from '../models/userModel.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { createUserSchema, updateUserSchema } from '../validators/userValidator.js';

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Private (ADMIN only)
 */
export const createUser = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = createUserSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

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
      role
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

    // 3. Apply updates
    if (validatedData.name) user.name = validatedData.name;
    if (validatedData.role) user.role = validatedData.role;
    if (validatedData.password) user.password = validatedData.password;

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
