const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    status,
    userId: req.user?.id || null,
    message: err.message,
    stack: isProd ? undefined : err.stack,
  }));

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation error.',
      requestId: req.id,
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Record already exists.',
      requestId: req.id,
    });
  }

  res.status(status).json({
    message: status >= 500 ? 'Internal server error.' : err.message,
    requestId: req.id,
    ...(!isProd && { stack: err.stack }),
  });
};

module.exports = errorHandler;
