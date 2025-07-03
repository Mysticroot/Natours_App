const express = require('express');
const {
  getAllTours,
  getSingleTour,
  AddTour,
  updatetour,
  deleteTour,
  aliasTopTours
 
} = require('./../controller/tourcontroller');
const router = express.Router();


router.route('/top-5-cheap').get(aliasTopTours,getAllTours)
router.route('/').get(getAllTours).post(AddTour);
router.route('/:id').get(getSingleTour).patch(updatetour).delete(deleteTour);

module.exports = router;
