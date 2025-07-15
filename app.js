const express = require('express');
const morgan = require('morgan');
const AppError = require('./Utils/AppError.Util');
const globalErrorHandler = require('./Controllers/Error.Controller');
const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const mongoSanitize=require('express-mongo-sanitize')
const xss=require('xss-clean')

const tourRouter = require('./Routes/Tour.Route');
const userRouter = require('./Routes/User.Route');

const app = express();

app.use(helmet());
// Body parser middleware
app.use(express.json({
  limit:'10kb'
}));


//data sanitization against sql query injection 
app.use(mongoSanitize());

//data sanitization against xss
app.use(xss());



// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


const limiter= rateLimit({
  max:100,
  windowMs:60*60*1000,
  message: 'Too many request from this IP,try after 1 hour!'
})

app.use('/api/',limiter)

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
