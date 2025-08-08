const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../Models/User.Model');
const catchAsync = require('../Utils/CatchAsync.Util');
const AppError = require('../Utils/AppError.Util');
const sendmail = require('../Utils/Email');
const crypto = require('crypto');
const Email = require('../Utils/Email'); // Adjust the path as necessary


// Sign a new JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


const createSendToken= (user,statusCode,res)=>{

  const token=signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };


  if(process.env.NODE_ENV==='production') cookieOptions.secure=true;

    res.cookie('jwt', token,cookieOptions);
    user.password=undefined;


  res.status(statusCode).json({
    status:"success",
    token,
    data:{
      user
    }
  })
}
// User signup handler
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const email = new Email(newUser, `${req.protocol}://${req.get('host')}/me`);
  await email.sendWelcome();

  createSendToken(newUser, 201, res);
});


// User login handler
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Find user and check password
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If OK, send token
  createSendToken(user, 200, res);

});

// Middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please login to get access', 401),
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401),
    );
  }

  // 4) Check if user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401),
    );
  }

  req.user = freshUser; // Grant access
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // 2) Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
    const resetURL = `${process.env.FRONTEND_URL}/ResetPass/${resetToken}`;

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {

    const email = new Email(user, resetURL);
    await email.sendPasswordReset();


    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }

  next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {

  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 2) If token has not expired, and there is user, set the new password
  user.password = req.body.password;  
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined; // Clear reset token
  user.passwordResetExpires = undefined; // Clear expiration time
  await user.save();


  // 3) Update changedPasswordAt property for the user
  // (This is handled in the User model's pre-save hook)  
  // 4) Log the user in, send JWT
   createSendToken(user, 200, res);

});


exports.updatePassword= catchAsync(async (req,res,next)=>{

    //get user from  collection 

    const user=await  User.findById(req.user.id).select("+password")

    //check is password is  correct

    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
      return next(new AppError('your current password is wrong',401))
    }

    //if correct update password
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();

      createSendToken(user, 200, res);


}
)


