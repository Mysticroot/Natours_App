const AppError = require('../Utils/AppError.Util');

// Send detailed error in development
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send minimal error in production
const sendProdError = (err, res) => {
  // Operational: trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

// Global error handler middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // Default HTTP code
  err.status = err.status || 'error'; // Default status

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle known error types
    if (err.name === 'CastError') {
      error = new AppError('Invalid data format.', 400);
    }
    if (err.code === 11000) {
      error = new AppError('Duplicate field value.', 400);
    }
    if (err.name === 'ValidationError') {
      error = new AppError('Validation error.', 400);
    }
    if (err.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token. Please log in again.', 401);
    }
    if (err.name === 'TokenExpiredError') {
      error = new AppError('Token expired. Please log in again.', 401);
    }

    sendProdError(error, res);
  }
};
