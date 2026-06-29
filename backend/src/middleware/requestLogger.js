const { randomUUID } = require('crypto');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-Id', req.id);

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      userId: req.user?.id || null,
      ip: req.ip,
    };

    const line = JSON.stringify(log);
    if (res.statusCode >= 500) console.error(line);
    else if (res.statusCode >= 400) console.warn(line);
    else console.log(line);
  });

  next();
};

module.exports = requestLogger;
