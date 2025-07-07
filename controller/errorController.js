const AppError = require('../utils/apperr');

const handlecastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleduplicateFields = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handlevalidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleinvalidSignatureError = (err) => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handletokenExpiredError = (err) => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statuscode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statuscode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR 💥', err.name);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;

    if (error.name === 'CastError') error = handlecastError(error);
    if (error.code === 11000) error = handleduplicateFields(error);
    if (error.name === 'ValidationError') error = handlevalidationError(error);
    if (error.name === 'JsonWebTokenError')
      error = handleinvalidSignatureError(error);
    if (error.name === 'TokenExpiredError')
      error = handletokenExpiredError(error);
    sendErrorProd(error, res);
  }
};
