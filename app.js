const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError=require('./utils/apperr')
const globalerrHandler=require('./controller/errorController')

const tourRouter = require('./routes/tourroutes');
const userRouter = require('./routes/userroutes');

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
  if (req.route) return next(); // matched some defined route

  next(new AppError(`Can't find ${req.originalUrl} on this server..`, 404));
});


app.use(globalerrHandler);

console.log('NODE_ENV:', process.env.NODE_ENV);

module.exports = app;
