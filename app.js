const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tourroutes');
const userRouter = require('./routes/userroutes');

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports=app;