const express = require('express');

const router = express.Router();

const productionController = require('../controllers/productionController');

router.get('/status', productionController.getStatus);
router.get('/farm/:farmerId', productionController.getFarmerId);
router.get('/latest', productionController.getLatestProdution);

router
  .route('/')
  .get(productionController.getAllProductions)
  .post(productionController.createProductions);

router
  .route('/:id')
  .patch(productionController.updateProductions)
  .delete(productionController.deleteProductions);
module.exports = router;
