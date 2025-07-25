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
} = require('../Controllers/Tour.Controller');

const router = express.Router();


// router
//   .route('/:tourId/reviews')
//   .post(
//     protect,
//     restrictTo('user'),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews',reviewRouter);

// Public routes
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// Protected + CRUD routes
router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);



module.exports = router;
