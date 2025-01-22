const express = require('express');
const replacementController = require('../controllers/replacementController');
const upload = require('../utils/uploadFile');

const router = express.Router();

router.get('/farmer/:id', replacementController.getReplaceMentByFamer);

router.route('/').get(replacementController.getAllReplacement).post(
  upload.uploadFile,
  replacementController.checkOrderId,
  replacementController.createReplacement
);

router
  .route('/:id')
  .get(replacementController.getReplacement)
  .patch(replacementController.updateReplacement)
  .delete(replacementController.deleteReplacement);

module.exports = router;
