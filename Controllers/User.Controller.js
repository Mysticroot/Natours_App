const User = require('../Models/User.Model');
const AppError = require('../Utils/AppError.Util');
const catchAsync = require('../Utils/CatchAsync.Util');

// Get all users from the database
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: { users },
  });
});

// Placeholder for creating a user – not implemented yet
exports.addUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This route is not yet implemented.',
  });
};

// Placeholder for getting a single user – not implemented yet
exports.getSingleUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This route is not yet implemented.',
  });
};

// Placeholder for updating a user – not implemented yet
exports.updateUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This route is not yet implemented.',
  });
};

// Placeholder for deleting a user – not implemented yet
exports.deleteUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This route is not yet implemented.',
  });
};
