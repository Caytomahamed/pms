const express = require('express');

const salesController = require('../controllers/salesController');

const router = express.Router();

router.get('/salesman/:id', salesController.getSalemanSales);

router
  .route('/')
  .get(salesController.getAllSales)
  .post(salesController.checkSalesmandAndCustomer, salesController.createSales);

router
  .route('/:id')
  .get(salesController.getSales)
  .patch(salesController.checkSalesmandAndCustomer, salesController.updateSales)
  .delete(salesController.deleteSales);

module.exports = router;
