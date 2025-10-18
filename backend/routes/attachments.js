const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { body, validationResult, query } = require('express-validator');
const { Attachment, Document, AuditLog } = require('../models');
const { authenticateToken, authorize, checkPermission } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const subfolder = file.fieldname === 'image' ? 'images' : 'documents';
    const fullPath = path.join(uploadPath, subfolder);
    
    // Crear directorio si no existe
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB por defecto
  }
});

// @route   POST /api/attachments/upload
// @desc    Subir archivo
// @access  Private
router.post('/upload', authenticateToken, checkPermission('manage_documents'), upload.single('file'), [
  body('document_id').optional().isUUID().withMessage('ID de documento inválido'),
  body('category').optional().isString().withMessage('Categoría debe ser texto'),
  body('description').optional().isString().withMessage('Descripción debe ser texto')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Eliminar archivo si hay errores de validación
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { document_id, category, description } = req.body;
    const file = req.file;

    // Determinar tipo de archivo
    let fileType = 'other';
    if (file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      fileType = 'video';
    } else if (file.mimetype.startsWith('audio/')) {
      fileType = 'audio';
    } else if (file.mimetype === 'application/pdf' || 
               file.mimetype.includes('document') || 
               file.mimetype.includes('spreadsheet')) {
      fileType = 'document';
    }

    // Procesar imagen si es necesario
    let processedPath = file.path;
    if (fileType === 'image') {
      try {
        const processedFilename = `processed_${file.filename}`;
        const processedPath = path.join(path.dirname(file.path), processedFilename);
        
        await sharp(file.path)
          .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(processedPath);
        
        // Eliminar archivo original y renombrar procesado
        fs.unlinkSync(file.path);
        fs.renameSync(processedPath, file.path);
      } catch (error) {
        logger.warn('Error procesando imagen:', error);
      }
    }

    // Crear registro en base de datos
    const attachment = await Attachment.create({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/${fileType === 'image' ? 'images' : 'documents'}/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
      type: fileType,
      category,
      description,
      document_id,
      isPublic: true
    });

    // Log de auditoría
    await AuditLog.log({
      action: 'UPLOAD',
      entity: 'Attachment',
      entityId: attachment.id,
      newValues: attachment.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} subió archivo: ${attachment.originalName}`,
      user_id: req.user.id
    });

    logger.info(`Archivo "${attachment.originalName}" subido por ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: attachment
    });

  } catch (error) {
    // Eliminar archivo si hay error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    logger.error('Error subiendo archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/attachments
// @desc    Obtener todos los archivos adjuntos
// @access  Private
router.get('/', authenticateToken, [
  query('type').optional().isIn(['image', 'document', 'video', 'audio', 'other']).withMessage('Tipo inválido'),
  query('category').optional().isString().withMessage('Categoría debe ser texto'),
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
      page = 1,
      limit = 10,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (type) where.type = type;
    if (category) where.category = category;

    if (search) {
      where[Op.or] = [
        { originalName: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Attachment.findAndCountAll({
      where,
      include: [
        {
          model: Document,
          as: 'document',
          attributes: ['id', 'title', 'type']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        attachments: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error obteniendo archivos adjuntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/attachments/:id
// @desc    Obtener archivo adjunto por ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id, {
      include: [
        {
          model: Document,
          as: 'document',
          attributes: ['id', 'title', 'type']
        }
      ]
    });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    res.json({
      success: true,
      data: attachment
    });

  } catch (error) {
    logger.error('Error obteniendo archivo adjunto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/attachments/:id/download
// @desc    Descargar archivo
// @access  Public
router.get('/:id/download', async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Verificar si el archivo existe
    if (!fs.existsSync(attachment.path)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado en el servidor'
      });
    }

    // Incrementar contador de descargas
    await attachment.incrementDownload();

    // Enviar archivo
    res.download(attachment.path, attachment.originalName);

  } catch (error) {
    logger.error('Error descargando archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/attachments/:id
// @desc    Actualizar archivo adjunto
// @access  Private
router.put('/:id', authenticateToken, checkPermission('manage_documents'), [
  body('category').optional().isString().withMessage('Categoría debe ser texto'),
  body('description').optional().isString().withMessage('Descripción debe ser texto'),
  body('isPublic').optional().isBoolean().withMessage('Público debe ser booleano')
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

    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    const oldValues = attachment.toJSON();
    await attachment.update(req.body);

    // Log de auditoría
    await AuditLog.log({
      action: 'UPDATE',
      entity: 'Attachment',
      entityId: attachment.id,
      oldValues,
      newValues: attachment.toJSON(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} actualizó archivo: ${attachment.originalName}`,
      user_id: req.user.id
    });

    logger.info(`Archivo "${attachment.originalName}" actualizado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Archivo actualizado exitosamente',
      data: attachment
    });

  } catch (error) {
    logger.error('Error actualizando archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/attachments/:id
// @desc    Eliminar archivo adjunto
// @access  Private
router.delete('/:id', authenticateToken, checkPermission('manage_documents'), async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    const oldValues = attachment.toJSON();

    // Eliminar archivo físico
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    // Eliminar registro de base de datos
    await attachment.destroy();

    // Log de auditoría
    await AuditLog.log({
      action: 'DELETE',
      entity: 'Attachment',
      entityId: attachment.id,
      oldValues,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      description: `Usuario ${req.user.username} eliminó archivo: ${attachment.originalName}`,
      user_id: req.user.id
    });

    logger.info(`Archivo "${attachment.originalName}" eliminado por ${req.user.username}`);

    res.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });

  } catch (error) {
    logger.error('Error eliminando archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/attachments/categories/list
// @desc    Obtener lista de categorías
// @access  Private
router.get('/categories/list', authenticateToken, async (req, res) => {
  try {
    const categories = await Attachment.findAll({
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
