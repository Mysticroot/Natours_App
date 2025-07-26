const express = require('express');
const authController = require('../Controllers/Auth.Controller');
const reviewController = require('../Controllers/Review.Controller');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getallReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getSingleReview)
  .patch(authController.restrictTo('user','admin'), reviewController.updateReview)
  .delete(
    authController.restrictTo('user','admin'),
    reviewController.deleteReview,
  );

module.exports = router;
