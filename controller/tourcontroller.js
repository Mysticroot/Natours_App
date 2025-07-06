const Tour = require('../models/tourmodel');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/apperr');
const catchAsync = require('../utils/catchasync');

exports.aliasTopTours = (req, res, next) => {
  console.log('triggered');

  req.query.limit = '3';
  req.query.sort = 'ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  console.log(req.query);

  next();
};


exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitfields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getSingleTour = catchAsync(async (req, res, next) => {
  
  const single = await Tour.findById(req.params.id);
  if (!single) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      single,
    },
  });
});

exports.AddTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updatetour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('no tour found with that id', 404));
  }
  res.status(204).json({
    status: 'success',
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numtours: { $sum: 1 },
        numratings: { $sum: '$ratingsAverage' },
        avgrating: { $avg: '$ratingsAverage' },
        avgprice: { $avg: '$price' },
        minprice: { $min: '$price' },
        maxprice: { $max: '$price' },
      },
    },
    {
      $sort: { avgprice: 1 },
    },
    // ,
    // {
    //   $match:{ _id:{ $ne:"easy"}}
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numtours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: { numtours: -1 },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
