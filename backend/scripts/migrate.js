const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

async function migrate() {
  try {
    logger.info('Iniciando migración de base de datos...');
    
    // Autenticar conexión
    await sequelize.authenticate();
    logger.info('Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos
    await sequelize.sync({ force: false, alter: true });
    logger.info('Modelos sincronizados con la base de datos.');

    logger.info('Migración completada exitosamente.');
    process.exit(0);
  } catch (error) {
    logger.error('Error durante la migración:', error);
    process.exit(1);
  }
}

migrate();
