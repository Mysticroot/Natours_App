const User = require('../Models/User.Model');
const AppError = require('../Utils/AppError.Util');
const catchAsync = require('../Utils/CatchAsync.Util');
const factory=require('./Handler.factory')

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = {};
  const allowedFields = ['name', 'email'];
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});


exports.deleteMe=catchAsync(async (req,res,next)=>{

  await User.findByIdAndUpdate(req.user.id,{active:false})

  res.status(204).json({
    status:"success",
    data:null
  })
})

// Get all users from the database

// Placeholder for creating a user – not implemented yet
exports.addUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'use sign up for creating user.',
  });
};


exports.getMe=(req,res,next)=>{
  req.params.id=req.user.id;
  next();
}
// Placeholder for getting a single user – not implemented yet
exports.getAllUsers = factory.getAll(User);
exports.getSingleUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
