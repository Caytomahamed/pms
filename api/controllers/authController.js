const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const usersModel = require('../models/userModel'); // Assume this handles dynamic table access
const jwt = require('jsonwebtoken');

const createTokenandSent = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREIN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIREIN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  delete user.password; // Hide password in response

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
    isLogin: true,
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { username, password, role, ...otherDetails } = req.body;

  console.log('body', req.body);

  if (!username || !password || !role) {
    return next(
      new AppError('Username, password, and roleId are required.', 400)
    );
  }

  // Check if role is valid
  const validRoles = ['admin', 'farmer', 'salesman', 'customer'];
  if (!validRoles.includes(role)) {
    return next(
      new AppError(
        `Invalid role: ${role}. Allowed roles are ${validRoles.join(', ')}.`,
        400
      )
    );
  }

  if (role === 'admin') {
    return next(new AppError('Cannot create an admin user.', 400));
  }

  // Check if user already exists
  const existingUser = await usersModel.findUserByUsername(username.trim());

  if (existingUser) {
    return next(
      new AppError('User already exists.Please use another username', 400)
    );
  }

  // delete field that not allowed
  const allowedFields = [
    'username',
    'password',
    'fullName',
    'phone',
    'address',
  ];

  Object.keys(otherDetails).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete otherDetails[field];
    }
  });

  // Get roleId
  const roleId = validRoles.indexOf(role) + 1;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Prepare user data
  const userData = {
    username,
    password: hashedPassword,
    roleId,
    ...otherDetails,
  };

  // Dynamically insert into the correct table
  const [newUser] = await usersModel.create(userData);

  createTokenandSent(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Username and password are required.', 400));
  }

  // Find user by role
  const user = await usersModel.findUserByUsername(username);

  if (user.roleId === 4) {
    return next(new AppError('You are not allowed to login.', 401));
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect username or password.', 401));
  }

  createTokenandSent(user, 200, res);
});

// Update Me (User)
// exports.updateMe = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   const { username, password, fullName, phone, address } = req.body;

//   if (!phone && ! && !username) {
//     return next(new AppError('Please provide phone, email, or username.', 400));
//   }

//   const me = await usersModel.findOne({
//     condition: 'u.id',
//     field: user.id,
//   });

//   const updatedUser = await usersModel.findByIdandUpdate(user.id, {
//     phone,
//     email,
//     username,
//   });

//   res.status(200).json({
//     status: 'success',
//     data: updatedUser,
//   });
// });

exports.proctect = catchAsync(async (req, res, next) => {
  // 1) check if token access
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in.Please login!', 401));
  }

  // 2). verification token or expired
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3). check if still user exist
  const [freshUser] = await usersModel.findById(decode.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging this token does no longer exist!', 401)
    );
  }
  // 4). check if user change after the token was issued
  if (usersModel.changePasswordAfter(freshUser.updateAt, decode.iat)) {
    return next(
      new AppError('User recently changed password!. Please log in again!', 401)
    );
  }

  // GRANT access TO PROCTECT ROUTE
  req.user = freshUser;
  next();
});

// Logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
