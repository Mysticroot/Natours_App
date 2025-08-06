const express = require('express');
const authController = require('../Controllers/Auth.Controller');

const {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resize,
} = require('../Controllers/User.Controller');
const User = require('../Models/User.Model');

const router = express.Router();

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Middleware to protect routes
router.use(authController.protect);

router.get('/me', getMe, getSingleUser);
router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', uploadUserPhoto, resize, updateMe);
router.delete('/deleteMe', deleteMe);
// router.patch(
//   '/updateMyPhoto',
//   upload.single('photo'),
//   authController.resizeUserPhoto,
//   authController.updateMyPhoto
// );

// Restrict to admin for the following routes
router.use(authController.restrictTo('admin'));
router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getSingleUser).delete(deleteUser).patch(updateUser);

module.exports = router;
