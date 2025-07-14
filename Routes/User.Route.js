const express = require('express');
const authController = require('../Controllers/Auth.Controller');

const {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
  updateMe,
} = require('../Controllers/User.Controller');
const User = require('../Models/User.Model');

const router = express.Router();

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect,updateMe);
// User routes
router.route('/').get(getAllUsers).post(addUser);

router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
