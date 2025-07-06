const User = require('../models/User.Model');
const AppError = require('../utils/apperr');
const catchAsync = require('../utils/catchasync');

// exports.checkId = (req, res, next, val) => {
//   console.log(`user id is ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Tour does not exist',
//     });
//   }
//   next();
// };

exports.getAllusers = catchAsync(async (req, res,next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
})

exports.Adduser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.getSingleuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.updateuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.deleteuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
