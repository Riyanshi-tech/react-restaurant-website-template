import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import User from '../models/userModel.js';

/**
 * Authentication middleware to verify JWT
 */
export const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    // Retrieve token from HttpOnly cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // Fallback: Retrieve token from Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Access denied. No authentication token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError(401, 'User associated with this token no longer exists.');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware for role-based access control
 * @param {...string} roles - Permitted roles (ADMIN, MANAGER, CASHIER)
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403, 
          `Role '${req.user ? req.user.role : 'GUEST'}' is not authorized to access this resource.`
        )
      );
    }
    next();
  };
};
