const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, AuditLog } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Generar tokens
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    roles: user.roles
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

  return { accessToken, refreshToken };
};

// @route   POST /api/auth/login
// @desc    Autenticar usuario
// @access  Public
router.post('/login', [
  body('username').notEmpty().withMessage('Usuario es requerido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({
      where: {
        [sequelize.Op.or]: [
          { username: username },
          { email: username }
        ],
        active: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Actualizar último login
    await user.update({ lastLogin: new Date() });

    // Log de auditoría
    await AuditLog.log({
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${user.username} inició sesión`,
      user_id: user.id
    });

    logger.info(`Usuario ${user.username} inició sesión desde ${req.ip}`);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Private (Solo Superadministrador)
router.post('/register', authenticateToken, [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Usuario debe tener entre 3 y 50 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  body('nombre').isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener entre 2 y 100 caracteres'),
  body('roles').isArray().withMessage('Roles debe ser un array')
], async (req, res) => {
  try {
    // Verificar permisos
    if (!req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para crear usuarios'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { username, email, password, nombre, apellido, roles, telefono } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [sequelize.Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya existe'
      });
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
      nombre,
      apellido,
      roles: roles || ['user'],
      telefono
    });

    // Log de auditoría
    await AuditLog.log({
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      newValues: user.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} creó el usuario ${user.username}`,
      user_id: req.user.id
    });

    logger.info(`Usuario ${user.username} creado por ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user.toJSON()
    });

  } catch (error) {
    logger.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Renovar token de acceso
// @access  Public
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { refreshToken } = req.body;

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Generar nuevo access token
    const { accessToken } = generateTokens(user);

    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        accessToken
      }
    });

  } catch (error) {
    logger.error('Error renovando token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Cerrar sesión
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log de auditoría
    await AuditLog.log({
      action: 'LOGOUT',
      entity: 'User',
      entityId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} cerró sesión`,
      user_id: req.user.id
    });

    logger.info(`Usuario ${req.user.username} cerró sesión`);

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    logger.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener información del usuario actual
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    logger.error('Error obteniendo usuario actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Cambiar contraseña
// @access  Private
router.post('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Contraseña actual es requerida'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nueva contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Obtener usuario con contraseña
    const user = await User.findByPk(req.user.id);

    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    await user.update({ password: newPassword });

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'User',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${user.username} cambió su contraseña`,
      user_id: user.id
    });

    logger.info(`Usuario ${user.username} cambió su contraseña`);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    logger.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
