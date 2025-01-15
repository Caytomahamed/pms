const AppError = require('../utils/appError');

const handleMissingRequireField = (err) => {
  return new AppError('missing same required fields ', 422);
};

const handleInvalidTypeEntity = () => {
  return new AppError('Unexpected json error.check your json', 422);
};

const handleJWTError = (erro) =>
  new AppError('Invalid token. Please log in again!', 401);

const sentErrorDev = (err, res) => {
  '🤚', err;
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleJWTExpired = (err) =>
  new AppError('Your token is expired!. Please log in again!', 401);

const sentErrorProd = (err, res) => {
  // errors we trusted
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programing(databases) or unknow erro
  } else {
    // log error
    ('ERROR 🔥');

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sentErrorDev(err, res);
  } else if (process.env.NODE_ENV != 'production') {
    let error = { ...err };
    if (error.code === 'SQLITE_CONSTRAINT')
      error = handleMissingRequireField(err);
    if (error.type) error = handleInvalidTypeEntity(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
    if (error.name === 'TokenExpiredError') error = handleJWTExpired(err);

    sentErrorProd(error, res);
  }
};
