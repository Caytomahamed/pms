const express = require('express');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router
  .route('/')
  .get(inventoryController.getAllInventory)
  .post(inventoryController.checkOrderId, inventoryController.createInventory);

router
  .route('/:id')
  .get(inventoryController.getInventory)
  .patch(inventoryController.updateInventory)
  .delete(inventoryController.deleteInventory);

module.exports = router;
