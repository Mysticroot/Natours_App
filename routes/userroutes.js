const express = require('express');
const {
  getAllusers,
  getSingleuser,
  Adduser,
  updateuser,
  deleteuser,
} = require('./../controller/usercontroller');
const router = express.Router();

router.route('/').get(getAllusers).post(Adduser);
router.route('/:id').get(getSingleuser).patch(updateuser).delete(deleteuser);

module.exports = router;
