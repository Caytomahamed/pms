const express = require('express');

const router = express.Router();

const reportController = require('../controllers/reportController');

router.get('/status/:table', reportController.getStatus);
router.get('/prodution-status', reportController.getProductionStatus);
router.get('/comparison', reportController.getComparison);

router.get('/lastest-production', reportController.getLasetProduction);
router.get('/latest-orders', reportController.getLastesOrders);

router.get('/top-customers', reportController.getTopCustomers);
router.get('/top-salesman', reportController.getTopSalesman);

router.get('/sales-overview', reportController.getSalesOverview);
router.get('/', reportController.getFarmsAnalytics);

module.exports = router;
