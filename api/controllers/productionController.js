const handleFactory = require('./handleFactory');
const produtionModel = require('../models/productionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getStatus = catchAsync(async (req, res, next) => {
  const top = await produtionModel.findStatus();
  if (!top) {
    return next(new AppError('No Status found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: top,
  });
});

exports.getFarmerId = catchAsync(async (req, res, next) => {
  const { farmerId } = req.params;

  if (!farmerId) {
    return next(new AppError('Please provide a farmerId.', 400));
  }

  const farmer = await produtionModel.findTopByFarmerId(farmerId);

  if (!farmer) {
    return next(new AppError('No farmer found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: farmer,
  });
});

exports.getLatestProdution = catchAsync(async (req, res, next) => {
  const findLatestProdution = await produtionModel.findLatestProdution();
  if (!findLatestProdution) {
    return next(new AppError('No findLatestProdution found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: findLatestProdution,
  });
});

exports.getAllProductions = handleFactory.getAll(produtionModel);
exports.createProductions = handleFactory.createOne(produtionModel);
exports.updateProductions = handleFactory.updateOne(produtionModel);
exports.deleteProductions = handleFactory.deleteOne(produtionModel);
