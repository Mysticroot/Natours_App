const Tour = require('../models/tourmodel');
const ApiFeatures = require('../utils/ApiFeatures');

exports.aliasTopTours = (req, res, next) => {
  console.log('triggered');

  req.query.limit = '3';
  req.query.sort = 'ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  console.log(req.query);

  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getSingleTour = async (req, res) => {
  try {
    const single = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        single,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.AddTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updatetour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    res.status(200).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(200).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
          tours:{$push :'$name'}
        },
      },
      {
        $sort: { numtours:-1},
      },
      {
        $addFields:{
          month:'$_id'
        }
      },
      {
        $project:{
          _id:0
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(200).json({
      status: 'fail',
      message: error,
    });
  }
};
