const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true,
    trim: true,
  },
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
  },
  difficulty: {
    type: String,
    required: true,
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
  images: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
