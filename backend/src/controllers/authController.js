import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { loginSchema } from '../validators/authValidator.js';

/**
 * Generate JWT token
 * @param {string} id - User ID
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * @desc    Login user & get token (cookie)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // 2. Check if user exists & select password explicitly
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 3. Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Setup cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days matching token default
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    // 6. Set cookie and send response
    res.cookie('token', token, cookieOptions);

    // Remove password from user object before sending response
    user.password = undefined;

    return sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    const cookieOptions = {
      expires: new Date(Date.now() + 5000), // expires in 5 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', '', cookieOptions);

    return sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 'Current user retrieved successfully', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};
