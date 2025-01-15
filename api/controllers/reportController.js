const handleFactory = require('./handleFactory');
const reportModel = require('../models/reportsModel');

exports.getFarmsAnalytics = handleFactory.getAll(reportModel);
