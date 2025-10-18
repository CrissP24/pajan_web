const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Attachment = sequelize.define('Attachment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  path: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  type: {
    type: DataTypes.ENUM('image', 'document', 'video', 'audio', 'other'),
    allowNull: false,
    defaultValue: 'document'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  document_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'documents',
      key: 'id'
    }
  }
}, {
  tableName: 'attachments',
  indexes: [
    {
      unique: true,
      fields: ['filename']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['isPublic']
    },
    {
      fields: ['document_id']
    }
  ]
});

// Métodos de instancia
Attachment.prototype.incrementDownload = function() {
  this.downloadCount += 1;
  return this.save();
};

Attachment.prototype.getSizeFormatted = function() {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

Attachment.prototype.isImage = function() {
  return this.type === 'image';
};

Attachment.prototype.isDocument = function() {
  return this.type === 'document';
};

Attachment.prototype.isVideo = function() {
  return this.type === 'video';
};

Attachment.prototype.isAudio = function() {
  return this.type === 'audio';
};

// Métodos estáticos
Attachment.findByType = function(type) {
  return this.findAll({
    where: { type },
    order: [['createdAt', 'DESC']]
  });
};

Attachment.findByCategory = function(category) {
  return this.findAll({
    where: { category },
    order: [['createdAt', 'DESC']]
  });
};

Attachment.findPublic = function() {
  return this.findAll({
    where: { isPublic: true },
    order: [['createdAt', 'DESC']]
  });
};

Attachment.findByDocument = function(documentId) {
  return this.findAll({
    where: { document_id: documentId },
    order: [['createdAt', 'ASC']]
  });
};

Attachment.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { originalName: { [sequelize.Op.iLike]: `%${query}%` } },
        { description: { [sequelize.Op.iLike]: `%${query}%` } }
      ],
      isPublic: true
    },
    order: [['createdAt', 'DESC']]
  });
};

module.exports = Attachment;
