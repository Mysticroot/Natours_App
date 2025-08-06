const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User=require('./User.Model');
const { promises } = require('nodemailer/lib/xoauth2');

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
      min: [1, 'Rating too low'],
      max: [5, 'Rating too high'],
      set: val=> Math.round(val*10)/10
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
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // reviews:{
    //   type: mongoose.Schema.ObjectId,
    //   ref:'Review'
    // }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
  },
);

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});


tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({startLocation:  '2dsphere'})

//virtual populate
tourSchema.virtual('reviews',{
  ref: 'Review',
  foreignField: 'tour',
  localField:"_id"
})

// tourSchema.pre('save',async function (next) {
//  const guidespromises=this.guides.map((id)=>  User.findById(id));
//  this.guides=await Promise.all(guidespromises);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({path:'guides',
    select: '-__v -passwordChangedAt  ',
  })
  next();
});


// Middleware: Exclude secret tours in all `find` queries
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// Middleware: Exclude secret tours in aggregation queries
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this);
//   next();
// });

// Create and export Tour model
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
