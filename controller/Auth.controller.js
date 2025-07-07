const jwt = require('jsonwebtoken');
const {promisify}=require('util')
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


exports.protect=catchasync(async (req,res,next)=>{
    
  let token;
  // 1) Getting token and check if it exists
     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
     token= req.headers.authorization.split(' ')[1];
     }

     if(!token){
       return next(new AppError('you are not logged in, please login to get access',401));
      }
      
      // 2) Verify token
      const decoded = await promisify (jwt.verify)(token, process.env.JWT_SECRET) 
      
     
  //3) check if user exists
    const freshuser=await User.findById(decoded.id)
    if(!freshuser){
      return next(new AppError('the user belonging to this token does no longer exist',401));
    }

  //4) check if user changed password after the token was issued
   if(freshuser.changedPasswordAfter(decoded.iat)){
    return next(new AppError('user recently changed password! please login again',401));
   }

   req.user = freshuser; // attach user to request object
  next();
})