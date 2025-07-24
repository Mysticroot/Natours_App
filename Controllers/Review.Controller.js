const Review = require('../Models/Review.Model');
const AppError = require('../Utils/AppError.Util');
const catchAsync = require('../Utils/CatchAsync.Util');



exports.getallReviews= catchAsync( async (req,res,next)=>{

    let filter={};
        if (req.params.tourId) filter = { tour:req.params.tourId};


    const Reviews = await Review.find(filter);

    res.status(200).json({
      status: 'success',
      result: Reviews.length,
      data: { Reviews },
    });
})


exports.createReview = catchAsync(async (req, res, next) => {

    //allow nested routes 
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user.id;


    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { Review: newReview },
    });
});
