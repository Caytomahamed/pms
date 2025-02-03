const handleFactory = require('./handleFactory');
const reportModel = require('../models/reportsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const allowedTables = ['orders', 'sales', 'replacements'];
const months = Array.from({ length: 12 }, (_, i) => i + 1);

exports.getStatus = catchAsync(async (req, res, next) => {
  const { table } = req.params;
  if (!allowedTables.includes(table)) {
    return next(new AppError('Invalid reports', 400));
  }

  const inputMonth = req.query.month || new Date().getMonth() + 1;
  const inputYear = req.query.year || new Date().getFullYear();

  if (!months.includes(Number(inputMonth))) {
    return next(new AppError('Invalid month', 400));
  }

  if (inputYear < 2023 || inputYear > new Date().getFullYear()) {
    return next(new AppError('Invalid year', 400));
  }

  let increaseRate = await reportModel.findIncreaseRate(
    table,
    inputMonth,
    inputYear
  );

  let status = await reportModel.findGroupedStatus(
    table,
    inputMonth,
    inputYear
  );
  res.status(200).json({
    status: 'success',
    data: {
      data: status,
      rate: increaseRate,
    },
  });
});

exports.getComparison = catchAsync(async (req, res, next) => {
  const { year } = req.query;

  if (!year || year < 2023 || year > new Date().getFullYear()) {
    return next(new AppError('Please provide a year', 400));
  }

  let comparison = await reportModel.findComparison(year);

  res.status(200).json({
    status: 'success',
    data: comparison,
  });
});

exports.getLasetProduction = catchAsync(async (req, res, next) => {
  let lastProduction = await reportModel.findLatestProdution();

  res.status(200).json({
    status: 'success',
    data: lastProduction,
  });
});

exports.getLastesOrders = catchAsync(async (req, res, next) => {
  let lastOrders = await reportModel.findLatestOrders();

  res.status(200).json({
    status: 'success',
    data: lastOrders,
  });
});

exports.getTopCustomers = catchAsync(async (req, res, next) => {
  let topCustomers = await reportModel.findTopCustoemrs();

  res.status(200).json({
    status: 'success',
    data: topCustomers,
  });
});

exports.getTopSalesman = catchAsync(async (req, res, next) => {
  let topSalesman = await reportModel.findTopSaleman();

  res.status(200).json({
    status: 'success',
    data: topSalesman,
  });
});

exports.getSalesOverview = catchAsync(async (req, res, next) => {
  const { year } = req.query;

  if (!year) {
    return next(new AppError('Please provide a year', 400));
  }

  let salesOverview = await reportModel.findSalesOverview(year);

  res.status(200).json({
    status: 'success',
    data: salesOverview,
  });
});

exports.getProductionStatus = catchAsync(async (req, res, next) => {
  let { month, year } = req.query;

  if (!month || !year) {
    return next(new AppError('Please provide month and year', 400));
  }

  let increaseRate = await reportModel.findIncreaseRate(
    'productions',
    month,
    year
  );

  let productionStatus = await reportModel.findProudctionStatus(month, year);

  res.status(200).json({
    status: 'success',
    data: {
      data: productionStatus,
      rate: increaseRate,
    },
  });
});

exports.getFarmsAnalytics = handleFactory.getAll(reportModel);
