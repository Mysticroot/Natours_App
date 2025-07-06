const jwt = require('jsonwebtoken');
const User = require('../models/User.Model');
const catchasync = require('../utils/catchasync');
const AppError = require('../utils/apperr');

const signtoken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchasync(async (req, res, next) => {
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signtoken(newuser._id);
  

  res.status(201).json({
    status: 'succes',
    token,
    data: {
      user: newuser,
    },
  });
});

exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide  email,pass', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or pass', 401));
  }

  const token = signtoken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
