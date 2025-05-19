const createError = require('http-errors');

module.exports.notFoundHandler = (req, res, next) => {
  next(createError(404, 'Not found'));
};

module.exports.errorHandler = (err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // Send error response
  res.status(err.status || 500);
  res.json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};