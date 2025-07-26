const catchAsync = require('../Utils/CatchAsync.Util');
const AppError = require('../Utils/AppError.Util');
const ApiFeatures = require('../Utils/Api.Features');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError(`No ${Model.modelName} found with that ID`, 404));

    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return next(new AppError(`No ${Model.modelName} found with that ID`, 404));

    res.status(200).json({
      status: 'success',
      data: { Model: updated },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newdoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { Model: newdoc },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) return next(new AppError('No doc found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });


  exports.getAll = (Model) =>catchAsync(async (req, res, next) => {

    // To allow for nested GET reviews on tour (hack )
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  
    const docs = await features.query;
    // const docs = await features.query.explain();
  
    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: { docs },
    });
  });
  
