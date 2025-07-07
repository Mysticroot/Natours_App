const express = require('express');
const { protect } = require('../Controllers/Auth.Controller');

const {
  getAllTours,
  getSingleTour,
  addTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../Controllers/Tour.Controller');

const router = express.Router();

// Public routes
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// Protected + CRUD routes
router.route('/').get(protect, getAllTours).post(addTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
