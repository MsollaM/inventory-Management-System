const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const sequelize = require('./src/config/database');
require('./src/models/index');

const authRoutes = require('./src/routes/authRoutes');
const assetRoutes = require('./src/routes/assetRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
const stockRoutes = require('./src/routes/stockRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const requestLogger = require('./src/middleware/requestLogger');

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: clientOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '25kb' }));
app.use(requestLogger);

if (!isProd) {
  app.use(morgan('dev'));
}

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: 'Too many write requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(['/api/assets', '/api/transactions', '/api/maintenance', '/api/stock'], writeLimiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Inventory Management System API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/reports', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found`, requestId: req.id });
});

app.use(errorHandler);

sequelize.authenticate()
  .then(async () => {
    console.log('Database connected successfully');

    if (!isProd && process.env.SYNC_DB === 'true') {
      await sequelize.sync({ alter: true });
      console.log('Database synced for development');
    }

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Allowed client origin: ${clientOrigin}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
