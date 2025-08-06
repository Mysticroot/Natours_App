const express = require('express');
const { protect, restrictTo } = require('../Controllers/Auth.Controller');
const reviewRouter = require('../Routes/Review.Route');

const {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../Controllers/Tour.Controller');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// Public routes
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/centre/:latlng/unit/:unit')
  .get(getToursWithin);
//{{URL}}api/v1/tours/tours-within/200/centre/34.111745,-118.113491/unit/mi

router.route('/distances/:latlng/unit/:unit').get(getDistances);

// Protected + CRUD routes
// http://localhost:3000/api/v1/tours
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getSingleTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), uploadTourImages,resizeTourImages,updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
