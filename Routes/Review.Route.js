const express = require('express');
const authController=require('../Controllers/Auth.Controller')
const reviewController = require('../Controllers/Review.Controller');

const router = express.Router({ mergeParams:true});

router.route('/')
  .get( reviewController.getallReviews)
  .post(authController.protect,authController.restrictTo('user') ,reviewController.createReview);

module.exports = router;
