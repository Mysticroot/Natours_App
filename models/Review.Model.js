const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating cannot be empty'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must be written by a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ReviewSchema.pre(/^find/, function (next) {
  // this points to the current query
//   this.populate({
    //     path: 'tour',
    //     select: 'name',
    //   }).populate({
    //     path: 'user',
    //     select: 'name',
    //   });

    this.populate({
      path: 'user',
      select: 'name',
    });
  next();
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;


