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

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated. Please contact the administrator.');
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
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    // ADMIN automatically passes all checks, or if their role matches the permitted list
    if (req.user.role === 'ADMIN' || roles.includes(req.user.role)) {
      return next();
    }

    return next(
      new ApiError(
        403, 
        `Role '${req.user.role}' is not authorized to access this resource.`
      )
    );
  };
};

/**
 * Authorization middleware for permission-based access control
 * @param {string} permission - The required permission (e.g., 'menu.read')
 */
export const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    // ADMIN automatically passes all checks
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Check if user has the specific permission
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return next(
        new ApiError(
          403,
          `You do not have the required permission: '${permission}'`
        )
      );
    }

    next();
  };
};
