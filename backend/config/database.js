require('dotenv').config();
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Configuración de la base de datos
let sequelize;

if (process.env.DATABASE_URL) {
  // Usar URL de conexión (útil para Neon u otros proveedores). Activar SSL.
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true // Soft deletes
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'pajan_db',
    process.env.DB_USER || 'pajan_user',
    process.env.DB_PASSWORD || 'pajan_password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: (msg) => logger.debug(msg),
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        paranoid: true // Soft deletes
      }
    }
  );
}

// Función para probar la conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Conexión a PostgreSQL establecida correctamente.');
    return true;
  } catch (error) {
    logger.error('Error conectando a PostgreSQL:', error);
    return false;
  }
}

module.exports = {
  sequelize,
  testConnection
};
