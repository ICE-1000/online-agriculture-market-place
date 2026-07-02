const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const swaggerSpec = require('./config/swagger');
const { config } = require('./config/config');
const { isDatabaseReady } = require('./config/database');
const requestLogger = require('./middleware/requestLogger');
const { databaseRequired } = require('./middleware/databaseRequired');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());

const corsOrigin = config.allowedOrigins === '*'
  ? true
  : config.allowedOrigins;

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    ok: isDatabaseReady(),
    status: isDatabaseReady() ? 'ok' : 'degraded',
    database: isDatabaseReady() ? 'supabase' : 'unavailable',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: config.env,
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    },
  });
});

// Routes (validation middleware runs before database guard)
app.use('/api', apiLimiter, databaseRequired, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
