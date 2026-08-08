/**
 * Formats a successful API response
 * @param {object} res - Express response object
 * @param {string} message - Response message
 * @param {object|array} data - Response payload data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Formats an error API response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {array} errors - Detailed validation errors or logs
 */
export const sendError = (res, message, statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
