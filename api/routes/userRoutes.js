const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const uploadFile = require('../utils/uploadFile');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

// router.post('/updateMe', authController.proctect, authController.updateMe);

// router.delete('/deleteMe', authController.proctect, userController.deleteMe);

// router.get(
//   '/getUserInfo',
//   authController.proctect,
//   userController.getCurrentUser
// );

router.get('/role/:role', userController.getAllUsersByRole);

router
  .route('/')
  .post(userController.createUser)
  .patch(userController.updateUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
