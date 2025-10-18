const express = require('express');
const { query, validationResult } = require('express-validator');
const { User, Content, Document, News, Attachment, PresidenteBarrial, RendicionCuenta, Transparencia } = require('../models');
const { authenticateToken, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/dashboards/tic
// @desc    Dashboard para rol TIC
// @access  Private (TIC o Superadministrador)
router.get('/tic', authenticateToken, authorize('TIC', 'Superadministrador'), async (req, res) => {
  try {
    // Estadísticas de contenido
    const totalContent = await Content.count();
    const publishedContent = await Content.count({ where: { status: 'published' } });
    const draftContent = await Content.count({ where: { status: 'draft' } });

    // Estadísticas de documentos
    const totalDocuments = await Document.count();
    const publishedDocuments = await Document.count({ where: { status: 'published' } });

    // Contenido por sección
    const contentBySection = await Content.findAll({
      attributes: [
        'section',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['section'],
      order: [['count', 'DESC']]
    });

    // Documentos por tipo
    const documentsByType = await Document.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type'],
      order: [['count', 'DESC']]
    });

    // Contenido más visto
    const mostViewedContent = await Content.findAll({
      where: { status: 'published' },
      order: [['viewCount', 'DESC']],
      limit: 10,
      attributes: ['id', 'title', 'viewCount', 'section']
    });

    // Actividad reciente del usuario
    const recentContent = await Content.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'title', 'status', 'createdAt']
    });

    res.json({
      success: true,
      data: {
        overview: {
          content: {
            total: totalContent,
            published: publishedContent,
            draft: draftContent
          },
          documents: {
            total: totalDocuments,
            published: publishedDocuments
          }
        },
        charts: {
          contentBySection,
          documentsByType
        },
        mostViewedContent,
        recentContent
      }
    });

  } catch (error) {
    logger.error('Error obteniendo dashboard TIC:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/dashboards/comunicacion
// @desc    Dashboard para rol Comunicación
// @access  Private (Comunicación o Superadministrador)
router.get('/comunicacion', authenticateToken, authorize('Comunicación', 'Superadministrador'), async (req, res) => {
  try {
    // Estadísticas de noticias
    const totalNews = await News.count();
    const publishedNews = await News.count({ where: { status: 'published' } });
    const draftNews = await News.count({ where: { status: 'draft' } });
    const featuredNews = await News.count({ where: { isFeatured: true } });
    const breakingNews = await News.count({ where: { isBreaking: true } });

    // Noticias por tipo
    const newsByType = await News.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type'],
      order: [['count', 'DESC']]
    });

    // Noticias por categoría
    const newsByCategory = await News.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        category: { [Op.ne]: null }
      },
      group: ['category'],
      order: [['count', 'DESC']]
    });

    // Noticias más vistas
    const mostViewedNews = await News.findAll({
      where: { status: 'published' },
      order: [['viewCount', 'DESC']],
      limit: 10,
      attributes: ['id', 'title', 'viewCount', 'type']
    });

    // Noticias destacadas
    const featuredNewsList = await News.findAll({
      where: { isFeatured: true, status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'publishedAt', 'viewCount']
    });

    // Noticias urgentes
    const breakingNewsList = await News.findAll({
      where: { isBreaking: true, status: 'published' },
      order: [['publishedAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'publishedAt', 'viewCount']
    });

    // Actividad reciente del usuario
    const recentNews = await News.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'title', 'status', 'type', 'createdAt']
    });

    res.json({
      success: true,
      data: {
        overview: {
          news: {
            total: totalNews,
            published: publishedNews,
            draft: draftNews,
            featured: featuredNews,
            breaking: breakingNews
          }
        },
        charts: {
          newsByType,
          newsByCategory
        },
        mostViewedNews,
        featuredNewsList,
        breakingNewsList,
        recentNews
      }
    });

  } catch (error) {
    logger.error('Error obteniendo dashboard Comunicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/dashboards/participacion
// @desc    Dashboard para rol Participación Ciudadana
// @access  Private (Participación Ciudadana o Superadministrador)
router.get('/participacion', authenticateToken, authorize('Participación Ciudadana', 'Superadministrador'), async (req, res) => {
  try {
    // Estadísticas de presidentes barriales
    const totalPresidentes = await PresidenteBarrial.count();
    const activePresidentes = await PresidenteBarrial.count({ where: { estado: 'Activo' } });
    const inactivePresidentes = await PresidenteBarrial.count({ where: { estado: 'Inactivo' } });

    // Presidentes por barrio
    const presidentesByBarrio = await PresidenteBarrial.findAll({
      attributes: [
        'barrio',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['barrio'],
      order: [['count', 'DESC']]
    });

    // Presidentes por estado
    const presidentesByEstado = await PresidenteBarrial.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['estado'],
      order: [['count', 'DESC']]
    });

    // Lista de barrios
    const barrios = await PresidenteBarrial.findAll({
      attributes: ['barrio'],
      group: ['barrio'],
      order: [['barrio', 'ASC']]
    });

    // Presidentes activos recientes
    const recentActivePresidentes = await PresidenteBarrial.findAll({
      where: { estado: 'Activo' },
      order: [['fechaInicio', 'DESC']],
      limit: 10,
      attributes: ['id', 'nombre', 'apellido', 'barrio', 'telefono', 'fechaInicio']
    });

    res.json({
      success: true,
      data: {
        overview: {
          presidentes: {
            total: totalPresidentes,
            active: activePresidentes,
            inactive: inactivePresidentes
          }
        },
        charts: {
          presidentesByBarrio,
          presidentesByEstado
        },
        barrios: barrios.map(b => b.barrio),
        recentActivePresidentes
      }
    });

  } catch (error) {
    logger.error('Error obteniendo dashboard Participación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/dashboards/transparencia
// @desc    Dashboard para rol Transparencia
// @access  Private (Transparencia o Superadministrador)
router.get('/transparencia', authenticateToken, authorize('Transparencia', 'Superadministrador'), async (req, res) => {
  try {
    // Estadísticas de rendición de cuentas
    const totalRendicion = await RendicionCuenta.count();
    const publishedRendicion = await RendicionCuenta.count({ where: { status: 'published' } });

    // Estadísticas de transparencia
    const totalTransparencia = await Transparencia.count();
    const publishedTransparencia = await Transparencia.count({ where: { status: 'published' } });

    // Rendición por año
    const rendicionByYear = await RendicionCuenta.findAll({
      attributes: [
        'year',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['year'],
      order: [['year', 'DESC']]
    });

    // Rendición por fase
    const rendicionByFase = await RendicionCuenta.findAll({
      attributes: [
        'fase',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['fase'],
      order: [['count', 'DESC']]
    });

    // Transparencia por año
    const transparenciaByYear = await Transparencia.findAll({
      attributes: [
        'year',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['year'],
      order: [['year', 'DESC']]
    });

    // Transparencia por mes
    const transparenciaByMes = await Transparencia.findAll({
      attributes: [
        'mes',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['mes'],
      order: [['count', 'DESC']]
    });

    // Transparencia por literal
    const transparenciaByLiteral = await Transparencia.findAll({
      attributes: [
        'literal',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['literal'],
      order: [['count', 'DESC']]
    });

    // Documentos más descargados
    const mostDownloadedRendicion = await RendicionCuenta.findAll({
      where: { status: 'published' },
      order: [['downloadCount', 'DESC']],
      limit: 10,
      attributes: ['id', 'titulo', 'downloadCount', 'year', 'fase']
    });

    const mostDownloadedTransparencia = await Transparencia.findAll({
      where: { status: 'published' },
      order: [['downloadCount', 'DESC']],
      limit: 10,
      attributes: ['id', 'titulo', 'downloadCount', 'year', 'mes', 'literal']
    });

    res.json({
      success: true,
      data: {
        overview: {
          rendicion: {
            total: totalRendicion,
            published: publishedRendicion
          },
          transparencia: {
            total: totalTransparencia,
            published: publishedTransparencia
          }
        },
        charts: {
          rendicionByYear,
          rendicionByFase,
          transparenciaByYear,
          transparenciaByMes,
          transparenciaByLiteral
        },
        mostDownloadedRendicion,
        mostDownloadedTransparencia
      }
    });

  } catch (error) {
    logger.error('Error obteniendo dashboard Transparencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/dashboards/statistics
// @desc    Obtener estadísticas generales para dashboards
// @access  Private
router.get('/statistics', authenticateToken, [
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

    // Estadísticas según el rol del usuario
    let statistics = {};

    if (req.user.hasRole('TIC') || req.user.hasRole('Superadministrador')) {
      statistics.content = {
        created: await Content.count({
          where: { createdAt: { [Op.gte]: startDate } }
        }),
        published: await Content.count({
          where: { 
            createdAt: { [Op.gte]: startDate },
            status: 'published'
          }
        })
      };
    }

    if (req.user.hasRole('Comunicación') || req.user.hasRole('Superadministrador')) {
      statistics.news = {
        created: await News.count({
          where: { createdAt: { [Op.gte]: startDate } }
        }),
        published: await News.count({
          where: { 
            createdAt: { [Op.gte]: startDate },
            status: 'published'
          }
        })
      };
    }

    if (req.user.hasRole('Participación Ciudadana') || req.user.hasRole('Superadministrador')) {
      statistics.presidentes = {
        created: await PresidenteBarrial.count({
          where: { createdAt: { [Op.gte]: startDate } }
        }),
        active: await PresidenteBarrial.count({
          where: { 
            createdAt: { [Op.gte]: startDate },
            estado: 'Activo'
          }
        })
      };
    }

    if (req.user.hasRole('Transparencia') || req.user.hasRole('Superadministrador')) {
      statistics.rendicion = {
        created: await RendicionCuenta.count({
          where: { createdAt: { [Op.gte]: startDate } }
        }),
        published: await RendicionCuenta.count({
          where: { 
            createdAt: { [Op.gte]: startDate },
            status: 'published'
          }
        })
      };

      statistics.transparencia = {
        created: await Transparencia.count({
          where: { createdAt: { [Op.gte]: startDate } }
        }),
        published: await Transparencia.count({
          where: { 
            createdAt: { [Op.gte]: startDate },
            status: 'published'
          }
        })
      };
    }

    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate: new Date(),
        statistics
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
