const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const slugify = require('slugify');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
      notEmpty: true
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM(
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
    ),
    allowNull: false,
    defaultValue: 'documento_general'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft'
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  // Campos específicos para rendición de cuentas
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  phase: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Campos específicos para transparencia
  month: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  literal: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'documents',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['is_public']
    },
    {
      fields: ['published_at']
    },
    {
      fields: ['year']
    },
    {
      fields: ['month']
    },
    {
      fields: ['literal']
    },
    {
      fields: ['user_id']
    }
  ],
  hooks: {
    beforeCreate: (document) => {
      if (!document.slug) {
        document.slug = slugify(document.title, { lower: true, strict: true });
      }
    },
    beforeUpdate: (document) => {
      if (document.changed('title') && !document.changed('slug')) {
        document.slug = slugify(document.title, { lower: true, strict: true });
      }
    },
    beforeSave: (document) => {
      if (document.status === 'published' && !document.publishedAt) {
        document.publishedAt = new Date();
      }
    }
  }
});

// Métodos de instancia
Document.prototype.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

Document.prototype.unpublish = function() {
  this.status = 'draft';
  this.publishedAt = null;
  return this.save();
};

Document.prototype.archive = function() {
  this.status = 'archived';
  return this.save();
};

Document.prototype.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

Document.prototype.incrementDownload = function() {
  this.downloadCount += 1;
  return this.save();
};

// Métodos estáticos
Document.findPublished = function() {
  return this.findAll({
    where: {
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

Document.findByType = function(type) {
  return this.findAll({
    where: { type },
    order: [['publishedAt', 'DESC']]
  });
};

Document.findBySlug = function(slug) {
  return this.findOne({ where: { slug } });
};

Document.findByCategory = function(category) {
  return this.findAll({
    where: { category },
    order: [['publishedAt', 'DESC']]
  });
};

Document.findByYear = function(year) {
  return this.findAll({
    where: { year },
    order: [['order', 'ASC'], ['createdAt', 'DESC']]
  });
};

Document.findByYearAndMonth = function(year, month) {
  return this.findAll({
    where: { year, month },
    order: [['order', 'ASC'], ['createdAt', 'DESC']]
  });
};

Document.findFeatured = function() {
  return this.findAll({
    where: {
      isFeatured: true,
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

Document.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { title: { [sequelize.Op.iLike]: `%${query}%` } },
        { content: { [sequelize.Op.iLike]: `%${query}%` } },
        { description: { [sequelize.Op.iLike]: `%${query}%` } }
      ],
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

module.exports = Document;
