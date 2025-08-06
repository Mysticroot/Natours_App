const Review = require('../Models/Review.Model');
const AppError = require('../Utils/AppError.Util');
const catchAsync = require('../Utils/CatchAsync.Util');
const factory=require('./Handler.factory')


exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  
  next();
};

exports.getallReviews=  factory.getAll(Review, {
  path: 'user',
  select: 'name photo',
});

exports.createReview = factory.createOne(Review);
exports.deleteReview=factory.deleteOne(Review);
exports.updateReview=factory.updateOne(Review);
exports.getSingleReview = factory.getOne(Review);
