class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call built-in Error constructor

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Marks trusted errors (not programming bugs)

    // Captures the stack trace for debugging (excludes constructor itself)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
