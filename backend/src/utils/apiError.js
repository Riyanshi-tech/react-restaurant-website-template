class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errors = errors;
    this.isOperational = true; // Flag for distinguished operational errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
