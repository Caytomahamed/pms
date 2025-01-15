const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/farmer/:farmerId', orderController.getOrdersByFarmerId);

router
  .route('/')
  .post(orderController.filterAllowedFields, orderController.createOrder)
  .get(orderController.getAllOrders);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.filterAllowedFields, orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
