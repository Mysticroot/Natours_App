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

// For serving static files in production using react build
// app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));




app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://unpkg.com',
        'https://cdnjs.cloudflare.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://unpkg.com',
        'https://cdnjs.cloudflare.com',
      ],
      imgSrc: ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
      connectSrc: ["'self'", 'https://*.tile.openstreetmap.org'],
      fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
      objectSrc: ["'none'"],
    },
  }),
);
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




// Mount API routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handle undefined routes ---> instead of error we send back our react app
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });

// app.use((req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });

// Global error handling middleware
app.use(globalErrorHandler);

// Debug current environment
console.log('NODE_ENV:', process.env.NODE_ENV);

module.exports = app;


