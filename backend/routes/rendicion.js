const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { RendicionCuenta, User, AuditLog } = require('../models');
const { authenticateToken, authorize, checkPermission } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/rendicion
// @desc    Obtener todos los documentos de rendición de cuentas
// @access  Public
router.get('/', [
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Año inválido'),
  query('fase').optional().isString().withMessage('Fase debe ser texto'),
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
      fase,
      status = 'published',
      page = 1,
      limit = 10,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (year) where.year = year;
    if (fase) where.fase = fase;
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

    const { count, rows } = await RendicionCuenta.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ],
      order: [['year', 'DESC'], ['fase', 'ASC'], ['orden', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        rendicion: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo rendición de cuentas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/rendicion/:id
// @desc    Obtener documento de rendición por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const rendicion = await RendicionCuenta.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ]
    });

    if (!rendicion) {
      return res.status(404).json({
        success: false,
        message: 'Documento de rendición no encontrado'
      });
    }

    // Verificar si es público
    if (!rendicion.isPublic && !req.user) {
      return res.status(403).json({
        success: false,
        message: 'Documento no disponible'
      });
    }

    // Incrementar contador de vistas
    await rendicion.incrementView();

    res.json({
      success: true,
      data: rendicion
    });

  } catch (error) {
    logger.error('Error obteniendo documento de rendición:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/rendicion
// @desc    Crear nuevo documento de rendición
// @access  Private
router.post('/', authenticateToken, checkPermission('manage_transparency'), [
  body('year').isInt({ min: 2020, max: 2030 }).withMessage('Año debe ser entre 2020 y 2030'),
  body('fase').notEmpty().withMessage('Fase es requerida'),
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

    const rendicionData = {
      ...req.body,
      user_id: req.user.id
    };

    const rendicion = await RendicionCuenta.create(rendicionData);

    // Log de auditoría
    await AuditLog.log({
      action: 'CREATE',
      entity: 'RendicionCuenta',
      entityId: rendicion.id,
      newValues: rendicion.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} creó documento de rendición: ${rendicion.titulo}`,
      user_id: req.user.id
    });

    logger.info(`Documento de rendición "${rendicion.titulo}" creado por ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Documento de rendición creado exitosamente',
      data: rendicion
    });

  } catch (error) {
    logger.error('Error creando documento de rendición:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/rendicion/:id
// @desc    Actualizar documento de rendición
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

    const rendicion = await RendicionCuenta.findByPk(req.params.id);
    if (!rendicion) {
      return res.status(404).json({
        success: false,
        message: 'Documento de rendición no encontrado'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (rendicion.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este documento'
      });
    }

    const oldValues = rendicion.toJSON();
    await rendicion.update(req.body);

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'RendicionCuenta',
      entityId: rendicion.id,
      oldValues,
      newValues: rendicion.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} actualizó documento de rendición: ${rendicion.titulo}`,
      user_id: req.user.id
    });

    logger.info(`Documento de rendición "${rendicion.titulo}" actualizado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento de rendición actualizado exitosamente',
      data: rendicion
    });

  } catch (error) {
    logger.error('Error actualizando documento de rendición:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/rendicion/:id
// @desc    Eliminar documento de rendición
// @access  Private
router.delete('/:id', authenticateToken, checkPermission('manage_transparency'), async (req, res) => {
  try {
    const rendicion = await RendicionCuenta.findByPk(req.params.id);
    if (!rendicion) {
      return res.status(404).json({
        success: false,
        message: 'Documento de rendición no encontrado'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (rendicion.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este documento'
      });
    }

    const oldValues = rendicion.toJSON();
    await rendicion.destroy();

    // Log de auditoría
    await AuditLog.log({
      action: 'DELETE',
      entity: 'RendicionCuenta',
      entityId: rendicion.id,
      oldValues,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} eliminó documento de rendición: ${rendicion.titulo}`,
      user_id: req.user.id
    });

    logger.info(`Documento de rendición "${rendicion.titulo}" eliminado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento de rendición eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error eliminando documento de rendición:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/rendicion/:id/publish
// @desc    Publicar documento de rendición
// @access  Private
router.post('/:id/publish', authenticateToken, checkPermission('manage_transparency'), async (req, res) => {
  try {
    const rendicion = await RendicionCuenta.findByPk(req.params.id);
    if (!rendicion) {
      return res.status(404).json({
        success: false,
        message: 'Documento de rendición no encontrado'
      });
    }

    // Verificar permisos
    if (rendicion.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para publicar este documento'
      });
    }

    await rendicion.publish();

    // Log de auditoría
    await AuditLog.log({
      action: 'PUBLISH',
      entity: 'RendicionCuenta',
      entityId: rendicion.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} publicó documento de rendición: ${rendicion.titulo}`,
      user_id: req.user.id
    });

    logger.info(`Documento de rendición "${rendicion.titulo}" publicado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento de rendición publicado exitosamente',
      data: rendicion
    });

  } catch (error) {
    logger.error('Error publicando documento de rendición:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/rendicion/years/list
// @desc    Obtener lista de años
// @access  Public
router.get('/years/list', async (req, res) => {
  try {
    const years = await RendicionCuenta.getYears();

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

// @route   GET /api/rendicion/fases/list
// @desc    Obtener lista de fases
// @access  Public
router.get('/fases/list', async (req, res) => {
  try {
    const fases = await RendicionCuenta.getFases();

    res.json({
      success: true,
      data: fases.map(f => f.fase)
    });

  } catch (error) {
    logger.error('Error obteniendo fases:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/rendicion/statistics
// @desc    Obtener estadísticas de rendición de cuentas
// @access  Public
router.get('/statistics', async (req, res) => {
  try {
    const statistics = await RendicionCuenta.getStatistics();

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
