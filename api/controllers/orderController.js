const ordersModel = require('../models/ordersModel');
const handleFactory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const models = require('../models');

const allowedFields = [
  'deadline',
  'notes',
  'quantity',
  'status',
  'farmerId',
  'reason',
];

exports.filterAllowedFields = (req, res, next) => {
  const filteredBody = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });
  req.body = filteredBody;
  next();
};

exports.getOrdersByFarmerId = catchAsync(async (req, res, next) => {
  const { farmerId } = req.params;

  if (!farmerId) {
    return next(new AppError('Please provide a farmerId.', 400));
  }

  const orders = await ordersModel.find({ farmerId });

  if (!orders) {
    return next(new AppError('No orders found for this farmer.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: orders,
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { farmerId } = req.body;

  if (!farmerId) {
    return next(new AppError('Please provide a farmerId.', 400));
  }

  const farmer = await models.findOne('users', {
    id: farmerId,
    roleId: 2,
  });

  console.log('farmer', farmer);

  if (!farmer) {
    return next(new AppError('No user found with this farmerId.', 404));
  }

  const order = await ordersModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: order,
  });
});

exports.automaticallyUpdateOrders = catchAsync(async (req, res, next) => {
  const currentTime = new Date();

  const updatedOrders = await ordersModel.updateOrdersToCompleted(currentTime);

  if (!updatedOrders) {
    return next(new AppError('No orders found to update.', 404));
  }

  console.log('Order updated successfully!');

  res.status(200).json({
    status: 'success',
    message: 'Orders updated successfully!',
  });
});

exports.getAllOrders = handleFactory.getAll(ordersModel);
exports.getOrder = handleFactory.getOne(ordersModel);
exports.updateOrder = handleFactory.updateOne(ordersModel);
exports.deleteOrder = handleFactory.deleteOne(ordersModel);
