const express = require('express');
const authController = require('../Controllers/Auth.Controller');

const {
  getAllUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
} = require('../Controllers/User.Controller');

const router = express.Router();

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// User routes
router.route('/').get(getAllUsers).post(addUser);

router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
