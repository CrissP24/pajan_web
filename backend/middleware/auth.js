const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

// Middleware de autenticación
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario en la base de datos
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Error en autenticación:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware de autorización por roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Superadministrador tiene acceso a todo
    if (req.user.roles.includes('Superadministrador')) {
      return next();
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = roles.some(role => req.user.roles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

// Middleware para verificar permisos específicos
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Superadministrador tiene todos los permisos
    if (req.user.roles.includes('Superadministrador')) {
      return next();
    }

    // Verificar permisos específicos según el rol
    const rolePermissions = {
      'TIC': ['manage_content', 'manage_documents', 'manage_pages'],
      'Comunicación': ['manage_news', 'manage_communications', 'manage_social_media'],
      'Participación Ciudadana': ['manage_activities', 'manage_participation', 'manage_surveys'],
      'Transparencia': ['manage_transparency', 'manage_rendicion', 'manage_documents']
    };

    const userPermissions = req.user.roles.flatMap(role => rolePermissions[role] || []);
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `No tienes permisos para ${permission}`
      });
    }

    next();
  };
};

// Middleware opcional de autenticación (no falla si no hay token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (user && user.active) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // En autenticación opcional, no fallamos si hay error
    next();
  }
};

module.exports = {
  authenticateToken,
  authorize,
  checkPermission,
  optionalAuth
};
