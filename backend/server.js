const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contentRoutes = require('./routes/content');
const documentRoutes = require('./routes/documents');
const newsRoutes = require('./routes/news');
const attachmentRoutes = require('./routes/attachments');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboards');
const presidentesRoutes = require('./routes/presidentes');
const rendicionRoutes = require('./routes/rendicion');
const transparenciaRoutes = require('./routes/transparencia');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compresión
app.use(compression());

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/presidentes', presidentesRoutes);
app.use('/api/rendicion', rendicionRoutes);
app.use('/api/transparencia', transparenciaRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API del GAD Municipal de Paján',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      content: '/api/content',
      documents: '/api/documents',
      news: '/api/news',
      admin: '/api/admin',
      dashboards: '/api/dashboards'
    }
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Modelos sincronizados con la base de datos.');
    }
  } catch (error) {
    logger.error('Error conectando a la base de datos:', error);
    process.exit(1);
  }
}

// Inicializar servidor
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Servidor ejecutándose en puerto ${PORT}`);
      logger.info(`Entorno: ${process.env.NODE_ENV}`);
      logger.info(`CORS habilitado para: ${process.env.CORS_ORIGIN}`);
    });
  } catch (error) {
    logger.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recibido, cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recibido, cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

startServer();

module.exports = app;
