const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: true,
      trim: true,
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
    secretour: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
  },
);

// tourSchema.virtual('durationweeks').get(function () {
//   return this.duration / 7;
// });

// tourSchema.pre('save', function (next) {
//   this.slug=slugify(this.name, { lower:true });
//   next();
// });

// tourSchema.post('save', function (doc,next) {
//   console.log(doc);

//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.find({ secretour: { $ne: true } });

  this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`query took ${Date.now()-this.start} milisec`);

//   //console.log(docs);

//   next();
// });

// tourSchema.pre('findOne', function (next) {
//   this.find({ secretour: { $ne: true } });
//   next();
// });

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretour: { $ne: true } } });
  console.log(this);
  next();
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;
