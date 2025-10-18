const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Document, User, Attachment, AuditLog } = require('../models');
const { authenticateToken, authorize, checkPermission } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/documents
// @desc    Obtener todos los documentos
// @access  Public
router.get('/', [
  query('type').optional().isString().withMessage('Tipo debe ser texto'),
  query('category').optional().isString().withMessage('Categoría debe ser texto'),
  query('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Estado inválido'),
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Año inválido'),
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
      type,
      category,
      status = 'published',
      year,
      page = 1,
      limit = 10,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (type) where.type = type;
    if (category) where.category = category;
    if (status) where.status = status;
    if (year) where.year = year;

    // Solo mostrar documentos públicos si no está autenticado
    if (!req.user) {
      where.isPublic = true;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Document.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        },
        {
          model: Attachment,
          as: 'attachments',
          where: { isPublic: true },
          required: false
        }
      ],
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        documents: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo documentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/documents/public
// @desc    Obtener documentos públicos
// @access  Public
router.get('/public', [
  query('type').optional().isString().withMessage('Tipo debe ser texto'),
  query('category').optional().isString().withMessage('Categoría debe ser texto'),
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Año inválido'),
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
      type,
      category,
      year,
      page = 1,
      limit = 10,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {
      status: 'published',
      isPublic: true
    };

    // Filtros
    if (type) where.type = type;
    if (category) where.category = category;
    if (year) where.year = year;

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Document.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        },
        {
          model: Attachment,
          as: 'attachments',
          where: { isPublic: true },
          required: false
        }
      ],
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        documents: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo documentos públicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/documents/:id
// @desc    Obtener documento por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        },
        {
          model: Attachment,
          as: 'attachments',
          where: { isPublic: true },
          required: false
        }
      ]
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar si es público
    if (!document.isPublic && !req.user) {
      return res.status(403).json({
        success: false,
        message: 'Documento no disponible'
      });
    }

    // Incrementar contador de vistas
    await document.incrementView();

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    logger.error('Error obteniendo documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/documents/public/slug/:slug
// @desc    Obtener documento público por slug
// @access  Public
router.get('/public/slug/:slug', async (req, res) => {
  try {
    const document = await Document.findBySlug(req.params.slug, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        },
        {
          model: Attachment,
          as: 'attachments',
          where: { isPublic: true },
          required: false
        }
      ]
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar si es público
    if (!document.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Documento no disponible'
      });
    }

    // Incrementar contador de vistas
    await document.incrementView();

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    logger.error('Error obteniendo documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/documents
// @desc    Crear nuevo documento
// @access  Private
router.post('/', authenticateToken, checkPermission('manage_documents'), [
  body('title').isLength({ min: 1, max: 255 }).withMessage('Título es requerido y debe tener máximo 255 caracteres'),
  body('type').isIn([
    'rendicion_cuenta',
    'transparencia',
    'noticia',
    'comunicado',
    'actividad',
    'documento_general',
    'reglamento',
    'informe',
    'presupuesto',
    'auditoria'
  ]).withMessage('Tipo de documento inválido'),
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

    const documentData = {
      ...req.body,
      user_id: req.user.id
    };

    const document = await Document.create(documentData);

    // Log de auditoría
    await AuditLog.log({
      action: 'CREATE',
      entity: 'Document',
      entityId: document.id,
      newValues: document.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} creó documento: ${document.title}`,
      user_id: req.user.id
    });

    logger.info(`Documento "${document.title}" creado por ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Documento creado exitosamente',
      data: document
    });

  } catch (error) {
    logger.error('Error creando documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/documents/:id
// @desc    Actualizar documento
// @access  Private
router.put('/:id', authenticateToken, checkPermission('manage_documents'), [
  body('title').optional().isLength({ min: 1, max: 255 }).withMessage('Título debe tener máximo 255 caracteres'),
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

    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (document.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este documento'
      });
    }

    const oldValues = document.toJSON();
    await document.update(req.body);

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'Document',
      entityId: document.id,
      oldValues,
      newValues: document.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} actualizó documento: ${document.title}`,
      user_id: req.user.id
    });

    logger.info(`Documento "${document.title}" actualizado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento actualizado exitosamente',
      data: document
    });

  } catch (error) {
    logger.error('Error actualizando documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Eliminar documento
// @access  Private
router.delete('/:id', authenticateToken, checkPermission('manage_documents'), async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (document.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este documento'
      });
    }

    const oldValues = document.toJSON();
    await document.destroy();

    // Log de auditoría
    await AuditLog.log({
      action: 'DELETE',
      entity: 'Document',
      entityId: document.id,
      oldValues,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} eliminó documento: ${document.title}`,
      user_id: req.user.id
    });

    logger.info(`Documento "${document.title}" eliminado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error eliminando documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/documents/:id/publish
// @desc    Publicar documento
// @access  Private
router.post('/:id/publish', authenticateToken, checkPermission('manage_documents'), async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar permisos
    if (document.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para publicar este documento'
      });
    }

    await document.publish();

    // Log de auditoría
    await AuditLog.log({
      action: 'PUBLISH',
      entity: 'Document',
      entityId: document.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} publicó documento: ${document.title}`,
      user_id: req.user.id
    });

    logger.info(`Documento "${document.title}" publicado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Documento publicado exitosamente',
      data: document
    });

  } catch (error) {
    logger.error('Error publicando documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/documents/type/:type
// @desc    Obtener documentos por tipo
// @access  Public
router.get('/type/:type', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser entre 1 y 100')
], async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { type };
    if (!req.user) {
      where.status = 'published';
      where.isPublic = true;
    }

    const { count, rows } = await Document.findAndCountAll({
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
        documents: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo documentos por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/documents/categories/list
// @desc    Obtener lista de categorías
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Document.findAll({
      attributes: ['category'],
      where: {
        category: { [Op.ne]: null }
      },
      group: ['category'],
      order: [['category', 'ASC']]
    });

    res.json({
      success: true,
      data: categories.map(c => c.category)
    });

  } catch (error) {
    logger.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
