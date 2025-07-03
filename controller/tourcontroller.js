const Tour = require('../models/tourmodel');
const fs = require('fs');
const maker = require('./ap');



exports.aliasTopTours = (req, res, next) => {
  console.log('triggered');
  
  req.query.limit = '3';
  req.query.sort = 'ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class ApiFeatures{
  constructor(query,queryString){
    this.query=query;
    this.queryString=queryString;
  }

  filter(){
    const objquery = { ...this.queryString };
    const exclude = ['page', 'sort', 'limit', 'fields'];
    exclude.forEach((el) => delete objquery[el]);

    const qurstr = maker(objquery);

    this.query = Tour.find(qurstr);
    return this;
  }

  sort(){
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;

  }

  limitfields(){
    
  }
}
exports.getAllTours = async (req, res) => {
  try {
    // const objquery = { ...req.query };
    // const exclude = ['page', 'sort', 'limit', 'fields'];
    // exclude.forEach((el) => delete objquery[el]);

    // const qurstr = maker(objquery);

    // let query = Tour.find(qurstr);
    

    // if (req.query.sort) {
    //   const sortby = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortby);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query=query.skip(skip).limit(limit);

    if(req.query.page){
      const numtours=await Tour.countDocuments();
      if(skip>=numtours) throw new Error('Page dont exist')
    }
   
    const features=new ApiFeatures(Tour.find(),req.query).filter().sort()
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
