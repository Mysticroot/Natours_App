const express = require('express');
const auth = require('./../controller/Auth.controller');


const {
  getAllusers,
  getSingleuser,
  Adduser,
  updateuser,
  deleteuser,
} = require('./../controller/usercontroller');
const router = express.Router();

router.post('/signup',auth.signup)
router.post('/login',auth.login)


router.route('/').get(getAllusers).post(Adduser);
router.route('/:id').get(getSingleuser).patch(updateuser).delete(deleteuser);

module.exports = router;
