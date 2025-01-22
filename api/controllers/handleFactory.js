const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdandDelete(+req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      message: `success`,
      data: 'successfully deleted',
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdandUpdate(+req.params.id, req.body);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(
        new AppError(
          "You can't create a this document same thing wrong.please add all requirement ",
          404
        )
      );
    }

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const [doc] = await Model.findById(+req.params.id);

    if (!doc) {
      return next(new AppError('No document found width this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // 2) get all
    const doc = await Model.find();

    if (!doc) {
      return next(new AppError('OH! No document found.Please try again', 404));
    }

    // 7) Sent back
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  });

exports.searching = (Model) =>
  catchAsync(async (req, res, next) => {
    // 2) get all
    const doc = await Model.searching(req.query);

    if (!doc || Object.keys(doc).length === 0) {
      return next(new AppError('OH! No document found.Please try again', 404));
    }

    // 7) Sent back
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  });
