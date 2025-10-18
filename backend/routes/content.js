const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Content, User, AuditLog } = require('../models');
const { authenticateToken, authorize, checkPermission } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/content
// @desc    Obtener todo el contenido
// @access  Public
router.get('/', [
  query('section').optional().isString().withMessage('Sección debe ser texto'),
  query('type').optional().isIn(['page', 'section', 'component']).withMessage('Tipo inválido'),
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
      section,
      type,
      status = 'published',
      page = 1,
      limit = 10,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (section) where.section = section;
    if (type) where.type = type;
    if (status) where.status = status;

    // Solo mostrar contenido público si no está autenticado
    if (!req.user) {
      where.isPublic = true;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Content.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ],
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        contents: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/content/:id
// @desc    Obtener contenido por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ]
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Verificar si es público
    if (!content.isPublic && !req.user) {
      return res.status(403).json({
        success: false,
        message: 'Contenido no disponible'
      });
    }

    // Incrementar contador de vistas
    await content.incrementView();

    res.json({
      success: true,
      data: content
    });

  } catch (error) {
    logger.error('Error obteniendo contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/content/slug/:slug
// @desc    Obtener contenido por slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const content = await Content.findBySlug(req.params.slug, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ]
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Verificar si es público
    if (!content.isPublic && !req.user) {
      return res.status(403).json({
        success: false,
        message: 'Contenido no disponible'
      });
    }

    // Incrementar contador de vistas
    await content.incrementView();

    res.json({
      success: true,
      data: content
    });

  } catch (error) {
    logger.error('Error obteniendo contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/content
// @desc    Crear nuevo contenido
// @access  Private
router.post('/', authenticateToken, checkPermission('manage_content'), [
  body('title').isLength({ min: 1, max: 255 }).withMessage('Título es requerido y debe tener máximo 255 caracteres'),
  body('content').notEmpty().withMessage('Contenido es requerido'),
  body('section').notEmpty().withMessage('Sección es requerida'),
  body('type').optional().isIn(['page', 'section', 'component']).withMessage('Tipo inválido'),
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

    const contentData = {
      ...req.body,
      user_id: req.user.id
    };

    const content = await Content.create(contentData);

    // Log de auditoría
    await AuditLog.log({
      action: 'CREATE',
      entity: 'Content',
      entityId: content.id,
      newValues: content.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} creó contenido: ${content.title}`,
      user_id: req.user.id
    });

    logger.info(`Contenido "${content.title}" creado por ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Contenido creado exitosamente',
      data: content
    });

  } catch (error) {
    logger.error('Error creando contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/content/:id
// @desc    Actualizar contenido
// @access  Private
router.put('/:id', authenticateToken, checkPermission('manage_content'), [
  body('title').optional().isLength({ min: 1, max: 255 }).withMessage('Título debe tener máximo 255 caracteres'),
  body('content').optional().notEmpty().withMessage('Contenido no puede estar vacío'),
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

    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (content.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este contenido'
      });
    }

    const oldValues = content.toJSON();
    await content.update(req.body);

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'Content',
      entityId: content.id,
      oldValues,
      newValues: content.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} actualizó contenido: ${content.title}`,
      user_id: req.user.id
    });

    logger.info(`Contenido "${content.title}" actualizado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Contenido actualizado exitosamente',
      data: content
    });

  } catch (error) {
    logger.error('Error actualizando contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/content/:id
// @desc    Eliminar contenido
// @access  Private
router.delete('/:id', authenticateToken, checkPermission('manage_content'), async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (content.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este contenido'
      });
    }

    const oldValues = content.toJSON();
    await content.destroy();

    // Log de auditoría
    await AuditLog.log({
      action: 'DELETE',
      entity: 'Content',
      entityId: content.id,
      oldValues,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} eliminó contenido: ${content.title}`,
      user_id: req.user.id
    });

    logger.info(`Contenido "${content.title}" eliminado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Contenido eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error eliminando contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/content/:id/publish
// @desc    Publicar contenido
// @access  Private
router.post('/:id/publish', authenticateToken, checkPermission('manage_content'), async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Verificar permisos
    if (content.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para publicar este contenido'
      });
    }

    await content.publish();

    // Log de auditoría
    await AuditLog.log({
      action: 'PUBLISH',
      entity: 'Content',
      entityId: content.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} publicó contenido: ${content.title}`,
      user_id: req.user.id
    });

    logger.info(`Contenido "${content.title}" publicado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Contenido publicado exitosamente',
      data: content
    });

  } catch (error) {
    logger.error('Error publicando contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/content/:id/unpublish
// @desc    Despublicar contenido
// @access  Private
router.post('/:id/unpublish', authenticateToken, checkPermission('manage_content'), async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenido no encontrado'
      });
    }

    // Verificar permisos
    if (content.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para despublicar este contenido'
      });
    }

    await content.unpublish();

    // Log de auditoría
    await AuditLog.log({
      action: 'UNPUBLISH',
      entity: 'Content',
      entityId: content.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} despublicó contenido: ${content.title}`,
      user_id: req.user.id
    });

    logger.info(`Contenido "${content.title}" despublicado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Contenido despublicado exitosamente',
      data: content
    });

  } catch (error) {
    logger.error('Error despublicando contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/content/sections/list
// @desc    Obtener lista de secciones
// @access  Public
router.get('/sections/list', async (req, res) => {
  try {
    const sections = await Content.findAll({
      attributes: ['section'],
      group: ['section'],
      order: [['section', 'ASC']]
    });

    res.json({
      success: true,
      data: sections.map(s => s.section)
    });

  } catch (error) {
    logger.error('Error obteniendo secciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
