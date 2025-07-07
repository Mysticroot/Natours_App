const express = require('express');
const morgan = require('morgan');
const AppError = require('./Utils/AppError.Util');
const globalErrorHandler = require('./Controllers/Error.Controller');

const tourRouter = require('./Routes/Tour.Route');
const userRouter = require('./Routes/User.Route');

const app = express();

// Body parser middleware
app.use(express.json());

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static assets
app.use(express.static(`${__dirname}/public`));

// Add timestamp to each request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mount API routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Debug current environment
console.log('NODE_ENV:', process.env.NODE_ENV);

module.exports = app;
