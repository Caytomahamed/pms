const bcrypt = require('bcrypt');

const handleFactory = require('./handleFactory');
const usersModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkEmailExist = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Please provide an email address.', 400));
  }

  const user = await usersModel.findOne({
    condition: 'u.email',
    field: email,
  });

  if (!user) {
    return next(new AppError('No user found with this email address.', 409));
  }

  delete user.password;

  res.status(200).json({
    status: 'success',
    message: 'Email already used. Please use another one.',
    data: user,
  });
});

exports.checkUsernameExist = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return next(new AppError('Please provide a username.', 400));
  }

  const user = await usersModel.findOne({
    condition: 'u.username',
    field: username,
  });

  // No user found with this username.
  if (user) {
    return next(
      new AppError('Username already used. Please use another one.', 409)
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'No user found with this username.',
  });
});

exports.getCurrentUser = catchAsync((req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError('You are not logged in.Please login!', 401));
  }

  res.status(200).json({
    status: 'sucess',
    data: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { phone, email, username } = req.body;

  if (!name || !email || !username) {
    return next(
      new AppError('Please provide a name, email and username.', 400)
    );
  }

  const me = await usersModel.findOne({
    condition: 'u.id',
    field: user.id,
  });

  const updatedUser = await usersModel.findByIdandUpdate(user.id, {
    phone,
    email,
    username,
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

// Update password
exports.updatepassword = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return next(
      new AppError('Please provide a password and confirm password.', 400)
    );
  }

  // 2) Hash the user's password
  const hash = bcrypt.hashSync(password, 12);

  const me = await usersModel.findOne({
    condition: 'u.id',
    field: user.id,
  });

  const updatedUser = await usersModel.findByIdandUpdate(user.id, {
    password: hash,
  });

  delete updatedUser.password;

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

// update the profile image
exports.updateProfileImg = catchAsync(async (req, res, next) => {
  const user = req.user;
  const filename = req.filename;

  if (!user) {
    return next(new AppError('User not Login.please login!', 401));
  }

  if (!filename) {
    return next(new AppError('Please provide a profile image.', 400));
  }

  const updatedUser = await usersModel.findByIdandUpdate(user.id, {
    profileImg: filename,
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  await usersModel.delete(user.id);

  res.status(204).json({
    status: 'success',
    message: "User's account has been deleted.",
  });
});

exports.getUserNotification = catchAsync(async (req, res, next) => {
  const user = req.user;

  const notifications = await usersModel.getNotifications(user.id);

  res.status(200).json({
    status: 'success',
    data: notifications,
  });
});

// get by role
exports.getAllUsersByRole = catchAsync(async (req, res, next) => {
  const { role } = req.params;

  const validRoles = ['admin', 'farmer', 'salesman', 'customer'];

  if (!validRoles.includes(role)) {
    return next(
      new AppError(
        `Invalid role: ${role}. Allowed roles are ${validRoles.join(', ')}.`,
        400
      )
    );
  }

  if (!role) {
    return next(new AppError('Please provide a role.', 400));
  }

  const roleId = validRoles.indexOf(role) + 1;

  const users = await usersModel.findByRole(roleId);

  res.status(200).json({
    status: 'success',
    data: users,
  });
});

exports.createUser = handleFactory.createOne(usersModel);
exports.getUser = handleFactory.getOne(usersModel);
exports.updateUser = handleFactory.updateOne(usersModel);
exports.deleteUser = handleFactory.deleteOne(usersModel);
