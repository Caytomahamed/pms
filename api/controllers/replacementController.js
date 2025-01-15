const catchAsync = require('../utils/catchAsync');
const replacementModel = require('../models/replacementModel');
const AppError = require('../utils/appError');
const handleFactory = require('./handleFactory');
const orderModel = require('../models/ordersModel');
const userModel = require('../models/userModel');

// check if orderId exist
exports.checkOrderId = catchAsync(async (req, res, next) => {
  const order = await orderModel.find({ id: req.body.orderId });

  console.log('order', order);
  if (!order || order.length === 0) {
    return next(new AppError('Order not found', 404));
  }
  next();
});

exports.getReplaceMentByFamer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const farmer = await userModel.find({ id, roleId: 2 });

  if (!id || farmer.length === 0) {
    return next(new AppError('No Farmer Found', 400));
  }

  const replacements = await replacementModel.findByFarmerReplacement(id);

  if (!replacements || replacements.length === 0) {
    return next(new AppError('No Replacement Found', 400));
  }

  res.status(200).json({
    status: 'success',
    data: replacements,
  });
});

exports.automaticallyUpdateReplacement = catchAsync(async (req, res, next) => {
  const currentTime = new Date();

  const updatedOrders = await replacementModel.updateReplacementToCompleted(
    currentTime
  );

  if (!updatedOrders) {
    return next(new AppError('No orders found to update.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Orders updated successfully!',
  });
});

exports.getAllReplacement = handleFactory.getAll(replacementModel);
exports.getReplacement = handleFactory.getOne(replacementModel);
exports.createReplacement = handleFactory.createOne(replacementModel);
exports.updateReplacement = handleFactory.updateOne(replacementModel);
exports.deleteReplacement = handleFactory.deleteOne(replacementModel);
