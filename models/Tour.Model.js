const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// Tour schema definition
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name too long'],
      minlength: [10, 'Tour name too short'],
      // Optional: validate with validator.isAlpha
    },
    slug: String,
    duration: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 3.5,
      min: [1, 'Rating too low'],
      max: [5, 'Rating too high'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'difficult'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    primeDiscount: {
      type: Number,
      // Discount must be less than price
      validate: function (val) {
        return val < this.price;
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
  }
);

// Middleware: Exclude secret tours in all `find` queries
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// Middleware: Exclude secret tours in aggregation queries
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this);
  next();
});

// Create and export Tour model
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
