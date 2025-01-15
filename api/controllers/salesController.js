const handleFactory = require('./handleFactory');
const salesModel = require('../models/salesModel');
const userModel = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const allowedFields = [
  'quantity',
  'estimatedPrice',
  'deadline',
  'actualQuantity',
  'actualPrice',
  'status',
  'salesmanId',
  'customerId',
];

exports.checkSalesmandAndCustomer = catchAsync(async (req, res, next) => {
  const { customerId, salesmanId } = req.body;

  const [customer] = await userModel.find({ id: customerId, roleId: 1 });
  const [salesman] = await userModel.find({ id: salesmanId, roleId: 3 });

  if (!customer || !salesman) {
    return next(new AppError('Salesman or Customer not found', 404));
  }

  // filter out the fields that are not allowed
  Object.keys(req.body).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete req.body[field];
    }
  });

  next();
});

exports.getSalemanSales = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [salesman] = await userModel.find({ id, roleId: 3 });

  if (!salesman) {
    return next(new AppError('Salesman not found', 404));
  }

  const sales = await salesModel.find({ salesmanId: id });
  console.log('sales', sales);

  res.status(200).json({
    status: 'success',
    data: sales,
  });
});

exports.getAllSales = handleFactory.getAll(salesModel);
exports.getSales = handleFactory.getOne(salesModel);
exports.createSales = handleFactory.createOne(salesModel);
exports.updateSales = handleFactory.updateOne(salesModel);
exports.deleteSales = handleFactory.deleteOne(salesModel);
