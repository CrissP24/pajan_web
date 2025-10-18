const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { News, User, AuditLog } = require('../models');
const { authenticateToken, authorize, checkPermission } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/news
// @desc    Obtener todas las noticias
// @access  Public
router.get('/', [
  query('type').optional().isIn(['noticia', 'comunicado', 'evento', 'anuncio']).withMessage('Tipo inválido'),
  query('category').optional().isString().withMessage('Categoría debe ser texto'),
  query('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Estado inválido'),
  query('featured').optional().isBoolean().withMessage('Destacado debe ser booleano'),
  query('breaking').optional().isBoolean().withMessage('Urgente debe ser booleano'),
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
      featured,
      breaking,
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
    if (featured !== undefined) where.isFeatured = featured === 'true';
    if (breaking !== undefined) where.isBreaking = breaking === 'true';

    // Solo mostrar noticias públicas si no está autenticado
    if (!req.user) {
      where.isPublic = true;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await News.findAndCountAll({
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
        news: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo noticias:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/news/:id
// @desc    Obtener noticia por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ]
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Verificar si es pública
    if (!news.isPublic && !req.user) {
      return res.status(403).json({
        success: false,
        message: 'Noticia no disponible'
      });
    }

    // Incrementar contador de vistas
    await news.incrementView();

    res.json({
      success: true,
      data: news
    });

  } catch (error) {
    logger.error('Error obteniendo noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/news/slug/:slug
// @desc    Obtener noticia por slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const news = await News.findBySlug(req.params.slug, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ]
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Verificar si es pública
    if (!news.isPublic && !req.user) {
      return res.status(403).json({
        success: false,
        message: 'Noticia no disponible'
      });
    }

    // Incrementar contador de vistas
    await news.incrementView();

    res.json({
      success: true,
      data: news
    });

  } catch (error) {
    logger.error('Error obteniendo noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/news
// @desc    Crear nueva noticia
// @access  Private
router.post('/', authenticateToken, checkPermission('manage_news'), [
  body('title').isLength({ min: 1, max: 255 }).withMessage('Título es requerido y debe tener máximo 255 caracteres'),
  body('content').notEmpty().withMessage('Contenido es requerido'),
  body('type').isIn(['noticia', 'comunicado', 'evento', 'anuncio']).withMessage('Tipo inválido'),
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

    const newsData = {
      ...req.body,
      user_id: req.user.id
    };

    const news = await News.create(newsData);

    // Log de auditoría
    await AuditLog.log({
      action: 'CREATE',
      entity: 'News',
      entityId: news.id,
      newValues: news.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} creó noticia: ${news.title}`,
      user_id: req.user.id
    });

    logger.info(`Noticia "${news.title}" creada por ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Noticia creada exitosamente',
      data: news
    });

  } catch (error) {
    logger.error('Error creando noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/news/:id
// @desc    Actualizar noticia
// @access  Private
router.put('/:id', authenticateToken, checkPermission('manage_news'), [
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

    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (news.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar esta noticia'
      });
    }

    const oldValues = news.toJSON();
    await news.update(req.body);

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'News',
      entityId: news.id,
      oldValues,
      newValues: news.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} actualizó noticia: ${news.title}`,
      user_id: req.user.id
    });

    logger.info(`Noticia "${news.title}" actualizada por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Noticia actualizada exitosamente',
      data: news
    });

  } catch (error) {
    logger.error('Error actualizando noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/news/:id
// @desc    Eliminar noticia
// @access  Private
router.delete('/:id', authenticateToken, checkPermission('manage_news'), async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Verificar permisos (solo el autor o superadministrador)
    if (news.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta noticia'
      });
    }

    const oldValues = news.toJSON();
    await news.destroy();

    // Log de auditoría
    await AuditLog.log({
      action: 'DELETE',
      entity: 'News',
      entityId: news.id,
      oldValues,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} eliminó noticia: ${news.title}`,
      user_id: req.user.id
    });

    logger.info(`Noticia "${news.title}" eliminada por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    });

  } catch (error) {
    logger.error('Error eliminando noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/news/:id/publish
// @desc    Publicar noticia
// @access  Private
router.post('/:id/publish', authenticateToken, checkPermission('manage_news'), async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    // Verificar permisos
    if (news.user_id !== req.user.id && !req.user.hasRole('Superadministrador')) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para publicar esta noticia'
      });
    }

    await news.publish();

    // Log de auditoría
    await AuditLog.log({
      action: 'PUBLISH',
      entity: 'News',
      entityId: news.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} publicó noticia: ${news.title}`,
      user_id: req.user.id
    });

    logger.info(`Noticia "${news.title}" publicada por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Noticia publicada exitosamente',
      data: news
    });

  } catch (error) {
    logger.error('Error publicando noticia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/news/featured/list
// @desc    Obtener noticias destacadas
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const news = await News.findFeatured();

    res.json({
      success: true,
      data: news
    });

  } catch (error) {
    logger.error('Error obteniendo noticias destacadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/news/breaking/list
// @desc    Obtener noticias urgentes
// @access  Public
router.get('/breaking/list', async (req, res) => {
  try {
    const news = await News.findBreaking();

    res.json({
      success: true,
      data: news
    });

  } catch (error) {
    logger.error('Error obteniendo noticias urgentes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/news/events/upcoming
// @desc    Obtener eventos próximos
// @access  Public
router.get('/events/upcoming', async (req, res) => {
  try {
    const events = await News.findUpcomingEvents();

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    logger.error('Error obteniendo eventos próximos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
