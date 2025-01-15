const catchAsync = require('../utils/catchAsync');
const inventoryModel = require('../models/inventoryModel');
const AppError = require('../utils/appError');
const handleFactory = require('./handleFactory');
const orderModel = require('../models/ordersModel');

// check if orderId exist
exports.checkOrderId = catchAsync(async (req, res, next) => {
  const order = await orderModel.find({ id: req.body.orderId });

  console.log('order', order);
  if (!order || order.length === 0) {
    return next(new AppError('Order not found', 404));
  }
  next();
});

exports.getAllInventory = handleFactory.getAll(inventoryModel);
exports.getInventory = handleFactory.getOne(inventoryModel);
exports.createInventory = handleFactory.createOne(inventoryModel);
exports.updateInventory = handleFactory.updateOne(inventoryModel);
exports.deleteInventory = handleFactory.deleteOne(inventoryModel);
