class appError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // if is erro do not show me all relative path that erro relative just show me a this class and where we
  }
}

module.exports = appError;
