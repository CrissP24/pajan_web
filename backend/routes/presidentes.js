const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { PresidenteBarrial, AuditLog } = require('../models');
const { authenticateToken, authorize, checkPermission } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/presidentes
// @desc    Obtener todos los presidentes barriales
// @access  Private
router.get('/', authenticateToken, [
  query('barrio').optional().isString().withMessage('Barrio debe ser texto'),
  query('estado').optional().isIn(['Activo', 'Inactivo', 'Suspendido']).withMessage('Estado inválido'),
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser entre 1 y 100'),
  query('search').optional().isString().withMessage('Búsqueda debe ser texto')
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
      barrio,
      estado,
      page = 1,
      limit = 10,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (barrio) where.barrio = barrio;
    if (estado) where.estado = estado;

    if (search) {
      where[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { apellido: { [Op.iLike]: `%${search}%` } },
        { cedula: { [Op.iLike]: `%${search}%` } },
        { barrio: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await PresidenteBarrial.findAndCountAll({
      where,
      order: [['barrio', 'ASC'], ['nombre', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        presidentes: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo presidentes barriales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/presidentes/:id
// @desc    Obtener presidente barrial por ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const presidente = await PresidenteBarrial.findByPk(req.params.id);

    if (!presidente) {
      return res.status(404).json({
        success: false,
        message: 'Presidente barrial no encontrado'
      });
    }

    res.json({
      success: true,
      data: presidente
    });

  } catch (error) {
    logger.error('Error obteniendo presidente barrial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/presidentes
// @desc    Crear nuevo presidente barrial
// @access  Private
router.post('/', authenticateToken, checkPermission('manage_participation'), [
  body('nombre').isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener entre 2 y 100 caracteres'),
  body('apellido').isLength({ min: 2, max: 100 }).withMessage('Apellido debe tener entre 2 y 100 caracteres'),
  body('cedula').isLength({ min: 10, max: 20 }).withMessage('Cédula debe tener entre 10 y 20 caracteres'),
  body('barrio').notEmpty().withMessage('Barrio es requerido'),
  body('fechaInicio').isISO8601().withMessage('Fecha de inicio inválida'),
  body('telefono').optional().isString().withMessage('Teléfono debe ser texto'),
  body('email').optional().isEmail().withMessage('Email inválido')
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

    // Verificar si ya existe un presidente con esa cédula
    const existingPresidente = await PresidenteBarrial.findByCedula(req.body.cedula);
    if (existingPresidente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un presidente barrial con esa cédula'
      });
    }

    const presidente = await PresidenteBarrial.create(req.body);

    // Log de auditoría
    await AuditLog.log({
      action: 'CREATE',
      entity: 'PresidenteBarrial',
      entityId: presidente.id,
      newValues: presidente.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} creó presidente barrial: ${presidente.getFullName()}`,
      user_id: req.user.id
    });

    logger.info(`Presidente barrial "${presidente.getFullName()}" creado por ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Presidente barrial creado exitosamente',
      data: presidente
    });

  } catch (error) {
    logger.error('Error creando presidente barrial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/presidentes/:id
// @desc    Actualizar presidente barrial
// @access  Private
router.put('/:id', authenticateToken, checkPermission('manage_participation'), [
  body('nombre').optional().isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener entre 2 y 100 caracteres'),
  body('apellido').optional().isLength({ min: 2, max: 100 }).withMessage('Apellido debe tener entre 2 y 100 caracteres'),
  body('cedula').optional().isLength({ min: 10, max: 20 }).withMessage('Cédula debe tener entre 10 y 20 caracteres'),
  body('telefono').optional().isString().withMessage('Teléfono debe ser texto'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('estado').optional().isIn(['Activo', 'Inactivo', 'Suspendido']).withMessage('Estado inválido')
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

    const presidente = await PresidenteBarrial.findByPk(req.params.id);
    if (!presidente) {
      return res.status(404).json({
        success: false,
        message: 'Presidente barrial no encontrado'
      });
    }

    // Verificar cédula si se está cambiando
    if (req.body.cedula && req.body.cedula !== presidente.cedula) {
      const existingPresidente = await PresidenteBarrial.findByCedula(req.body.cedula);
      if (existingPresidente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un presidente barrial con esa cédula'
        });
      }
    }

    const oldValues = presidente.toJSON();
    await presidente.update(req.body);

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'PresidenteBarrial',
      entityId: presidente.id,
      oldValues,
      newValues: presidente.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} actualizó presidente barrial: ${presidente.getFullName()}`,
      user_id: req.user.id
    });

    logger.info(`Presidente barrial "${presidente.getFullName()}" actualizado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Presidente barrial actualizado exitosamente',
      data: presidente
    });

  } catch (error) {
    logger.error('Error actualizando presidente barrial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/presidentes/:id
// @desc    Eliminar presidente barrial
// @access  Private
router.delete('/:id', authenticateToken, checkPermission('manage_participation'), async (req, res) => {
  try {
    const presidente = await PresidenteBarrial.findByPk(req.params.id);
    if (!presidente) {
      return res.status(404).json({
        success: false,
        message: 'Presidente barrial no encontrado'
      });
    }

    const oldValues = presidente.toJSON();
    await presidente.destroy();

    // Log de auditoría
    await AuditLog.log({
      action: 'DELETE',
      entity: 'PresidenteBarrial',
      entityId: presidente.id,
      oldValues,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} eliminó presidente barrial: ${presidente.getFullName()}`,
      user_id: req.user.id
    });

    logger.info(`Presidente barrial "${presidente.getFullName()}" eliminado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Presidente barrial eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error eliminando presidente barrial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/presidentes/:id/activate
// @desc    Activar presidente barrial
// @access  Private
router.post('/:id/activate', authenticateToken, checkPermission('manage_participation'), async (req, res) => {
  try {
    const presidente = await PresidenteBarrial.findByPk(req.params.id);
    if (!presidente) {
      return res.status(404).json({
        success: false,
        message: 'Presidente barrial no encontrado'
      });
    }

    await presidente.reactivate();

    // Log de auditoría
    await AuditLog.log({
      action: 'ACTIVATE',
      entity: 'PresidenteBarrial',
      entityId: presidente.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} activó presidente barrial: ${presidente.getFullName()}`,
      user_id: req.user.id
    });

    logger.info(`Presidente barrial "${presidente.getFullName()}" activado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Presidente barrial activado exitosamente',
      data: presidente
    });

  } catch (error) {
    logger.error('Error activando presidente barrial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/presidentes/:id/deactivate
// @desc    Desactivar presidente barrial
// @access  Private
router.post('/:id/deactivate', authenticateToken, checkPermission('manage_participation'), [
  body('motivo').notEmpty().withMessage('Motivo es requerido')
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

    const presidente = await PresidenteBarrial.findByPk(req.params.id);
    if (!presidente) {
      return res.status(404).json({
        success: false,
        message: 'Presidente barrial no encontrado'
      });
    }

    await presidente.deactivate(req.body.motivo);

    // Log de auditoría
    await AuditLog.log({
      action: 'DEACTIVATE',
      entity: 'PresidenteBarrial',
      entityId: presidente.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} desactivó presidente barrial: ${presidente.getFullName()}`,
      user_id: req.user.id
    });

    logger.info(`Presidente barrial "${presidente.getFullName()}" desactivado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Presidente barrial desactivado exitosamente',
      data: presidente
    });

  } catch (error) {
    logger.error('Error desactivando presidente barrial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/presidentes/barrios/list
// @desc    Obtener lista de barrios
// @access  Private
router.get('/barrios/list', authenticateToken, async (req, res) => {
  try {
    const barrios = await PresidenteBarrial.getBarrios();

    res.json({
      success: true,
      data: barrios.map(b => b.barrio)
    });

  } catch (error) {
    logger.error('Error obteniendo barrios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/presidentes/statistics
// @desc    Obtener estadísticas de presidentes barriales
// @access  Private
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const statistics = await PresidenteBarrial.getStatistics();

    res.json({
      success: true,
      data: statistics
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
