const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Transparencia, User, AuditLog } = require('../models');
const { authenticateToken, authorize, checkPermission, optionalAuth } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/transparencia
// @desc    Obtener todos los documentos de transparencia
// @access  Public
router.get('/', optionalAuth, [
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Año inválido'),
  query('mes').optional().isString().withMessage('Mes debe ser texto'),
  query('literal').optional().isString().withMessage('Literal debe ser texto'),
  query('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Estado inválido'),
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
      year,
      mes,
      literal,
      status = 'published',
      page = 1,
      limit = 10,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (year) where.year = year;
    if (mes) where.mes = mes;
    if (literal) where.literal = literal;
    if (status) where.status = status;

    // Solo mostrar documentos públicos si no está autenticado
    if (!req.user) {
      where.isPublic = true;
    }

    if (search) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Transparencia.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ],
      order: [['year', 'DESC'], ['mes', 'ASC'], ['literal', 'ASC'], ['orden', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        transparencia: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo documentos de transparencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/transparencia/:id
// @desc    Obtener documento de transparencia por ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const transparencia = await Transparencia.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ]
    });

    if (!transparencia) {
      return res.status(404).json({
        success: false,
        message: 'Documento de transparencia no encontrado'
      });
    }

    // Verificar si es público
    if (!transparencia.isPublic && !req.user) {
      return res.status(403).json({
        success: false,
        message: 'Documento no disponible'
      });
    }

    // Incrementar contador de vistas
    await transparencia.incrementView();

    res.json({
      success: true,
      data: transparencia
    });

  } catch (error) {
    logger.error('Error obteniendo documento de transparencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/transparencia
// @desc    Crear nuevo documento de transparencia
// @access  Private
router.post('/', authenticateToken, checkPermission('manage_transparency'), [
  body('year').isInt({ min: 2020, max: 2030 }).withMessage('Año debe ser entre 2020 y 2030'),
  body('mes').notEmpty().withMessage('Mes es requerido'),
  body('literal').notEmpty().withMessage('Literal es requerido'),
  body('titulo').isLength({ min: 1, max: 255 }).withMessage('Título es requerido y debe tener máximo 255 caracteres'),
  body('archivo_url').notEmpty().withMessage('URL del archivo es requerida'),
  body('orden').optional().isInt({ min: 1 }).withMessage('Orden debe ser un número positivo')
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

    const transparenciaData = {
      ...req.body,
      user_id: req.user.id
    };

    const transparencia = await Transparencia.create(transparenciaData);

    // Log de auditoría
    await AuditLog.log({
      action: 'CREATE',
      entity: 'Transparencia',
      entityId: transparencia.id,
      newValues: transparencia.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} creó documento de transparencia: ${transparencia.titulo}`,
      user_id: req.user.id
    });

    logger.info(`Documento de transparencia "${transparencia.titulo}" creado por ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Documento de transparencia creado exitosamente',
      data: transparencia
    });

  } catch (error) {
    logger.error('Error creando documento de transparencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/transparencia/:id
// @desc    Actualizar documento de transparencia
// @access  Private
router.put('/:id', authenticateToken, checkPermission('manage_transparency'), [
  body('titulo').optional().isLength({ min: 1, max: 255 }).withMessage('Título debe tener máximo 255 caracteres'),
  body('descripcion').optional().isString().withMessage('Descripción debe ser texto'),
  body('archivo_url').optional().notEmpty().withMessage('URL del archivo no puede estar vacía'),
  body('orden').optional().isInt({ min: 1 }).withMessage('Orden debe ser un número positivo'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Estado inválido')
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

    const transparencia = await Transparencia.findByPk(req.params.id);
    if (!transparencia) {
      return res.status(404).json({
        success: false,
        message: 'Documento de transparencia no encontrado'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (transparencia.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este documento'
      });
    }

    const oldValues = transparencia.toJSON();
    await transparencia.update(req.body);

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'Transparencia',
      entityId: transparencia.id,
      oldValues,
      newValues: transparencia.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} actualizó documento de transparencia: ${transparencia.titulo}`,
      user_id: req.user.id
    });

    logger.info(`Documento de transparencia "${transparencia.titulo}" actualizado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento de transparencia actualizado exitosamente',
      data: transparencia
    });

  } catch (error) {
    logger.error('Error actualizando documento de transparencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/transparencia/:id
// @desc    Eliminar documento de transparencia
// @access  Private
router.delete('/:id', authenticateToken, checkPermission('manage_transparency'), async (req, res) => {
  try {
    const transparencia = await Transparencia.findByPk(req.params.id);
    if (!transparencia) {
      return res.status(404).json({
        success: false,
        message: 'Documento de transparencia no encontrado'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (transparencia.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este documento'
      });
    }

    const oldValues = transparencia.toJSON();
    await transparencia.destroy();

    // Log de auditoría
    await AuditLog.log({
      action: 'DELETE',
      entity: 'Transparencia',
      entityId: transparencia.id,
      oldValues,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} eliminó documento de transparencia: ${transparencia.titulo}`,
      user_id: req.user.id
    });

    logger.info(`Documento de transparencia "${transparencia.titulo}" eliminado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento de transparencia eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error eliminando documento de transparencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/transparencia/:id/publish
// @desc    Publicar documento de transparencia
// @access  Private
router.post('/:id/publish', authenticateToken, checkPermission('manage_transparency'), async (req, res) => {
  try {
    const transparencia = await Transparencia.findByPk(req.params.id);
    if (!transparencia) {
      return res.status(404).json({
        success: false,
        message: 'Documento de transparencia no encontrado'
      });
    }

    // Verificar permisos
    if (transparencia.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para publicar este documento'
      });
    }

    await transparencia.publish();

    // Log de auditoría
    await AuditLog.log({
      action: 'PUBLISH',
      entity: 'Transparencia',
      entityId: transparencia.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} publicó documento de transparencia: ${transparencia.titulo}`,
      user_id: req.user.id
    });

    logger.info(`Documento de transparencia "${transparencia.titulo}" publicado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento de transparencia publicado exitosamente',
      data: transparencia
    });

  } catch (error) {
    logger.error('Error publicando documento de transparencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/transparencia/years/list
// @desc    Obtener lista de años
// @access  Public
router.get('/years/list', optionalAuth, async (req, res) => {
  try {
    const years = await Transparencia.getYears();

    res.json({
      success: true,
      data: years.map(y => y.year)
    });

  } catch (error) {
    logger.error('Error obteniendo años:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/transparencia/meses/list
// @desc    Obtener lista de meses
// @access  Public
router.get('/meses/list', optionalAuth, async (req, res) => {
  try {
    const meses = await Transparencia.getMeses();

    res.json({
      success: true,
      data: meses.map(m => m.mes)
    });

  } catch (error) {
    logger.error('Error obteniendo meses:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/transparencia/literales/list
// @desc    Obtener lista de literales
// @access  Public
router.get('/literales/list', optionalAuth, async (req, res) => {
  try {
    const literales = await Transparencia.getLiterales();

    res.json({
      success: true,
      data: literales.map(l => l.literal)
    });

  } catch (error) {
    logger.error('Error obteniendo literales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/transparencia/statistics
// @desc    Obtener estadísticas de transparencia
// @access  Public
router.get('/statistics', optionalAuth, async (req, res) => {
  try {
    const statistics = await Transparencia.getStatistics();

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
