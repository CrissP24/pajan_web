const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { User, Content, Document, News, Attachment, AuditLog, PresidenteBarrial, RendicionCuenta, Transparencia } = require('../models');
const { authenticateToken, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Obtener estadísticas del dashboard de administración
// @access  Private (Solo Superadministrador)
router.get('/dashboard', authenticateToken, authorize('Superadministrador'), async (req, res) => {
  try {
    // Estadísticas generales
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { active: true } });
    const totalContent = await Content.count();
    const publishedContent = await Content.count({ where: { status: 'published' } });
    const totalDocuments = await Document.count();
    const publishedDocuments = await Document.count({ where: { status: 'published' } });
    const totalNews = await News.count();
    const publishedNews = await News.count({ where: { status: 'published' } });
    const totalAttachments = await Attachment.count();
    const totalPresidentes = await PresidenteBarrial.count();
    const activePresidentes = await PresidenteBarrial.count({ where: { estado: 'Activo' } });

    // Estadísticas por tipo de documento
    const documentsByType = await Document.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type'],
      order: [['count', 'DESC']]
    });

    // Estadísticas por tipo de noticia
    const newsByType = await News.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type'],
      order: [['count', 'DESC']]
    });

    // Estadísticas por rol de usuario
    const usersByRole = await User.findAll({
      attributes: [
        'roles',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['roles'],
      order: [['count', 'DESC']]
    });

    // Actividad reciente (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await AuditLog.findAll({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      order: [['createdAt', 'DESC']],
      limit: 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ]
    });

    // Contenido más visto
    const mostViewedContent = await Content.findAll({
      where: { status: 'published' },
      order: [['viewCount', 'DESC']],
      limit: 10,
      attributes: ['id', 'title', 'viewCount', 'section']
    });

    // Documentos más descargados
    const mostDownloadedDocuments = await Document.findAll({
      where: { status: 'published' },
      order: [['downloadCount', 'DESC']],
      limit: 10,
      attributes: ['id', 'title', 'downloadCount', 'type']
    });

    res.json({
      success: true,
      data: {
        overview: {
          users: {
            total: totalUsers,
            active: activeUsers,
            inactive: totalUsers - activeUsers
          },
          content: {
            total: totalContent,
            published: publishedContent,
            draft: totalContent - publishedContent
          },
          documents: {
            total: totalDocuments,
            published: publishedDocuments,
            draft: totalDocuments - publishedDocuments
          },
          news: {
            total: totalNews,
            published: publishedNews,
            draft: totalNews - publishedNews
          },
          attachments: {
            total: totalAttachments
          },
          presidentes: {
            total: totalPresidentes,
            active: activePresidentes,
            inactive: totalPresidentes - activePresidentes
          }
        },
        charts: {
          documentsByType,
          newsByType,
          usersByRole
        },
        recentActivity,
        mostViewedContent,
        mostDownloadedDocuments
      }
    });

  } catch (error) {
    logger.error('Error obteniendo estadísticas del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/admin/statistics
// @desc    Obtener estadísticas detalladas
// @access  Private (Solo Superadministrador)
router.get('/statistics', authenticateToken, authorize('Superadministrador'), [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Período inválido')
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

    const { period = '30d' } = req.query;
    
    // Calcular fecha de inicio según el período
    const startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Estadísticas de actividad por día
    const activityByDay = await AuditLog.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // Estadísticas de contenido creado
    const contentCreated = await Content.count({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      }
    });

    const documentsCreated = await Document.count({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      }
    });

    const newsCreated = await News.count({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      }
    });

    // Estadísticas de usuarios activos
    const activeUsers = await User.count({
      where: {
        lastLogin: {
          [Op.gte]: startDate
        }
      }
    });

    // Estadísticas de archivos subidos
    const attachmentsUploaded = await Attachment.count({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      }
    });

    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate: new Date(),
        activityByDay,
        contentCreated,
        documentsCreated,
        newsCreated,
        activeUsers,
        attachmentsUploaded
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

// @route   GET /api/admin/audit-logs
// @desc    Obtener logs de auditoría
// @access  Private (Solo Superadministrador)
router.get('/audit-logs', authenticateToken, authorize('Superadministrador'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser entre 1 y 100'),
  query('action').optional().isString().withMessage('Acción debe ser texto'),
  query('entity').optional().isString().withMessage('Entidad debe ser texto'),
  query('user_id').optional().isUUID().withMessage('ID de usuario inválido'),
  query('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida'),
  query('endDate').optional().isISO8601().withMessage('Fecha de fin inválida')
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
      limit = 50,
      action,
      entity,
      user_id,
      startDate,
      endDate
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (user_id) where.user_id = user_id;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nombre']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        logs: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo logs de auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/admin/system-info
// @desc    Obtener información del sistema
// @access  Private (Solo Superadministrador)
router.get('/system-info', authenticateToken, authorize('Superadministrador'), async (req, res) => {
  try {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: systemInfo
    });

  } catch (error) {
    logger.error('Error obteniendo información del sistema:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/admin/cleanup
// @desc    Limpiar datos antiguos
// @access  Private (Solo Superadministrador)
router.post('/cleanup', authenticateToken, authorize('Superadministrador'), [
  body('daysToKeep').isInt({ min: 30, max: 365 }).withMessage('Días debe ser entre 30 y 365'),
  body('cleanupType').isIn(['audit_logs', 'all']).withMessage('Tipo de limpieza inválido')
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

    const { daysToKeep, cleanupType } = req.body;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    let cleanedCount = 0;

    if (cleanupType === 'audit_logs' || cleanupType === 'all') {
      const deletedLogs = await AuditLog.cleanup(daysToKeep);
      cleanedCount += deletedLogs;
    }

    // Log de auditoría
    await AuditLog.log({
      action: 'CLEANUP',
      entity: 'System',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} ejecutó limpieza del sistema`,
      user_id: req.user.id
    });

    logger.info(`Limpieza del sistema ejecutada por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Limpieza completada exitosamente',
      data: {
        cleanedCount,
        cutoffDate
      }
    });

  } catch (error) {
    logger.error('Error ejecutando limpieza:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
