const express = require('express');
const replacementController = require('../controllers/replacementController');
const { route } = require('./salesRoutes');

const router = express.Router();

router.get('/farmer/:id', replacementController.getReplaceMentByFamer);

router
  .route('/')
  .get(replacementController.getAllReplacement)
  .post(
    replacementController.checkOrderId,
    replacementController.createReplacement
  );

router
  .route('/:id')
  .get(replacementController.getReplacement)
  .patch(replacementController.updateReplacement)
  .delete(replacementController.deleteReplacement);

module.exports = router;
