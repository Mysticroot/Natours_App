const catchAsync=require('../Utils/CatchAsync.Util')
const AppError=require('../Utils/AppError.Util')


exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError(`No ${Model} found with that ID`, 404));

    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return next(new AppError(`No ${Model} found with that ID`, 404));

    res.status(200).json({
      status: 'success',
      data: { Model: updated },
    });
  });


