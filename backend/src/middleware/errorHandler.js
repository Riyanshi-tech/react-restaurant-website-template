import { ApiError } from '../utils/apiError.js';
import { sendError } from '../utils/responseFormatter.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log full error stack in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack Trace:', err);
  }

  // 1. Zod Validation Errors
  if (err.name === 'ZodError' || (err.errors && err.name === 'ZodError')) {
    const message = 'Validation failed';
    const errors = err.errors.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    return sendError(res, message, 400, errors);
  }

  // 2. Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for field: ${field}. Please use another value.`;
    return sendError(res, message, 400);
  }

  // 3. Mongoose Cast Error (e.g., invalid ObjectID)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return sendError(res, message, 404);
  }

  // 4. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = 'Validation failed';
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    return sendError(res, message, 400, errors);
  }

  // 5. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authorization token. Please log in again.';
    return sendError(res, message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Authorization token has expired. Please log in again.';
    return sendError(res, message, 401);
  }

  // 6. Default ApiError or Generic Server Error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  return sendError(res, message, statusCode, error.errors || []);
};
