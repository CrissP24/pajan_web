const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { User, AuditLog } = require('../models');
const { authenticateToken, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/users
// @desc    Obtener todos los usuarios
// @access  Private (Solo Superadministrador)
router.get('/', authenticateToken, authorize('Superadministrador'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser entre 1 y 100'),
  query('search').optional().isString().withMessage('Búsqueda debe ser texto'),
  query('role').optional().isString().withMessage('Rol debe ser texto'),
  query('active').optional().isBoolean().withMessage('Activo debe ser booleano')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros inválidos',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      search,
      role,
      active
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { apellido: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      where.roles = { [Op.contains]: [role] };
    }

    if (active !== undefined) {
      where.active = active === 'true';
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        users: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Obtener usuario por ID
// @access  Private (Solo Superadministrador)
router.get('/:id', authenticateToken, authorize('Superadministrador'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Actualizar usuario
// @access  Private (Solo Superadministrador)
router.put('/:id', authenticateToken, authorize('Superadministrador'), [
  body('username').optional().isLength({ min: 3, max: 50 }).withMessage('Usuario debe tener entre 3 y 50 caracteres'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('nombre').optional().isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener entre 2 y 100 caracteres'),
  body('roles').optional().isArray().withMessage('Roles debe ser un array'),
  body('active').optional().isBoolean().withMessage('Activo debe ser booleano')
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

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const oldValues = user.toJSON();
    const updateData = {};

    // Solo actualizar campos proporcionados
    if (req.body.username !== undefined) updateData.username = req.body.username;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.nombre !== undefined) updateData.nombre = req.body.nombre;
    if (req.body.apellido !== undefined) updateData.apellido = req.body.apellido;
    if (req.body.telefono !== undefined) updateData.telefono = req.body.telefono;
    if (req.body.roles !== undefined) updateData.roles = req.body.roles;
    if (req.body.active !== undefined) updateData.active = req.body.active;

    await user.update(updateData);

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'User',
      entityId: user.id,
      oldValues,
      newValues: user.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} actualizó el usuario ${user.username}`,
      user_id: req.user.id
    });

    logger.info(`Usuario ${user.username} actualizado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user.toJSON()
    });

  } catch (error) {
    logger.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Eliminar usuario (soft delete)
// @access  Private (Solo Superadministrador)
router.delete('/:id', authenticateToken, authorize('Superadministrador'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir eliminar el propio usuario
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propio usuario'
      });
    }

    const oldValues = user.toJSON();
    await user.destroy();

    // Log de auditoría
    await AuditLog.log({
      action: 'DELETE',
      entity: 'User',
      entityId: user.id,
      oldValues,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} eliminó el usuario ${user.username}`,
      user_id: req.user.id
    });

    logger.info(`Usuario ${user.username} eliminado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/users/:id/activate
// @desc    Activar usuario
// @access  Private (Solo Superadministrador)
router.post('/:id/activate', authenticateToken, authorize('Superadministrador'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.update({ active: true });

    // Log de auditoría
    await AuditLog.log({
      action: 'ACTIVATE',
      entity: 'User',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} activó el usuario ${user.username}`,
      user_id: req.user.id
    });

    logger.info(`Usuario ${user.username} activado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Usuario activado exitosamente',
      data: user.toJSON()
    });

  } catch (error) {
    logger.error('Error activando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/users/:id/deactivate
// @desc    Desactivar usuario
// @access  Private (Solo Superadministrador)
router.post('/:id/deactivate', authenticateToken, authorize('Superadministrador'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir desactivar el propio usuario
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivar tu propio usuario'
      });
    }

    await user.update({ active: false });

    // Log de auditoría
    await AuditLog.log({
      action: 'DEACTIVATE',
      entity: 'User',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} desactivó el usuario ${user.username}`,
      user_id: req.user.id
    });

    logger.info(`Usuario ${user.username} desactivado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente',
      data: user.toJSON()
    });

  } catch (error) {
    logger.error('Error desactivando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/users/roles/available
// @desc    Obtener roles disponibles
// @access  Private
router.get('/roles/available', authenticateToken, async (req, res) => {
  try {
    const roles = [
      'Superadministrador',
      'TIC',
      'Comunicación',
      'Participación Ciudadana',
      'Transparencia',
      'user'
    ];

    res.json({
      success: true,
      data: roles
    });

  } catch (error) {
    logger.error('Error obteniendo roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/users/statistics
// @desc    Obtener estadísticas de usuarios
// @access  Private (Solo Superadministrador)
router.get('/statistics', authenticateToken, authorize('Superadministrador'), async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { active: true } });
    const inactiveUsers = await User.count({ where: { active: false } });

    // Estadísticas por rol
    const roleStats = await User.findAll({
      attributes: [
        'roles',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['roles']
    });

    res.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        roleStats
      }
    });

  } catch (error) {
    logger.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
