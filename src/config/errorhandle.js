const ApiError = require('./apiError');

exports.errorHandler = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.code).json({
      error: { statusCode: error.code, message: error.msg },
    });
  } else {
    return res.status(500).json({
      error: { statusCode: 500, message: 'oops! something went wrong' },
    });
  }
};

exports.responseHandler = (status, msg, res, data) => {
  if (data) {
    return res.status(status).json({
      data: { statusCode: status, message: msg, data },
    });
  }
  return res.status(status).json({
    data: { statusCode: status, message: msg },
  });
};