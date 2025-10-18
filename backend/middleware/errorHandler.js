const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  logger.error(err);

  // Error de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error = { message: message, statusCode: 400 };
  }

  // Error de Sequelize - Clave duplicada
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Recurso duplicado';
    error = { message: message, statusCode: 400 };
  }

  // Error de Sequelize - Recurso no encontrado
  if (err.name === 'SequelizeEmptyResultError') {
    const message = 'Recurso no encontrado';
    error = { message: message, statusCode: 404 };
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = { message: message, statusCode: 401 };
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = { message: message, statusCode: 401 };
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message: message, statusCode: 400 };
  }

  // Error de archivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Archivo demasiado grande';
    error = { message: message, statusCode: 400 };
  }

  // Error de tipo de archivo
  if (err.code === 'INVALID_FILE_TYPE') {
    const message = 'Tipo de archivo no permitido';
    error = { message: message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
