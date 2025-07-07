const express = require('express');
const authController=require('./../controller/Auth.controller')

const {
  getAllTours,
  getSingleTour,
  AddTour,
  updatetour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} = require('./../controller/tourcontroller');
const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(authController.protect,getAllTours).post(AddTour);
router.route('/:id').get(getSingleTour).patch(updatetour).delete(deleteTour);

module.exports = router;
