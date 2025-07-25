const express = require('express');
const morgan = require('morgan');
const path = require('path');
const AppError = require('./Utils/AppError.Util');
const globalErrorHandler = require('./Controllers/Error.Controller');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const tourRouter = require('./Routes/Tour.Route');
const userRouter = require('./Routes/User.Route');
const reviewRouter = require('./Routes/Review.Route');

const app = express();
app.use(express.static(path.join(__dirname,'public')));

// app.set('view engine', 'pug');
// app.set('views',path.join(__dirname, 'views'));

app.use(helmet());
// Body parser middleware
app.use(
  express.json({
    limit: '10kb',
  }),
);

//parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//data sanitization against sql query injection
app.use(mongoSanitize());

//data sanitization against xss
app.use(xss());

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP,try after 1 hour!',
});

app.use('/api/', limiter);

// Serve static assets

// Add timestamp to each request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


// app.get('/', (req, res) => {
//   res.status(200).render('base')});


// Mount API routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Debug current environment
console.log('NODE_ENV:', process.env.NODE_ENV);

module.exports = app;
