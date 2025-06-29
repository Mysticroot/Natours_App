const express = require('express');
const {
  getAllTours,
  getSingleTour,
  AddTour,
  updatetour,
  deleteTour,
} = require('./../controller/tourcontroller');
const router = express.Router();

router.route('/').get(getAllTours).post(AddTour);
router.route('/:id').get(getSingleTour).patch(updatetour).delete(deleteTour);

module.exports = router;
