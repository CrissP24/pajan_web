const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const slugify = require('slugify');

const News = sequelize.define('News', {
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
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('noticia', 'comunicado', 'evento', 'anuncio'),
    allowNull: false,
    defaultValue: 'noticia'
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
  isBreaking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  featuredImage: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gallery: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  viewCount: {
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
  // Campos para eventos
  eventDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  eventLocation: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Campos para comunicados
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'medium'
  },
  expiresAt: {
    type: DataTypes.DATE,
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
  tableName: 'news',
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
      fields: ['isPublic']
    },
    {
      fields: ['publishedAt']
    },
    {
      fields: ['isFeatured']
    },
    {
      fields: ['isBreaking']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['eventDate']
    },
    {
      fields: ['user_id']
    }
  ],
  hooks: {
    beforeCreate: (news) => {
      if (!news.slug) {
        news.slug = slugify(news.title, { lower: true, strict: true });
      }
    },
    beforeUpdate: (news) => {
      if (news.changed('title') && !news.changed('slug')) {
        news.slug = slugify(news.title, { lower: true, strict: true });
      }
    },
    beforeSave: (news) => {
      if (news.status === 'published' && !news.publishedAt) {
        news.publishedAt = new Date();
      }
    }
  }
});

// Métodos de instancia
News.prototype.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

News.prototype.unpublish = function() {
  this.status = 'draft';
  this.publishedAt = null;
  return this.save();
};

News.prototype.archive = function() {
  this.status = 'archived';
  return this.save();
};

News.prototype.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

News.prototype.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > new Date(this.expiresAt);
};

News.prototype.isEvent = function() {
  return this.type === 'evento';
};

News.prototype.isCommunication = function() {
  return this.type === 'comunicado';
};

// Métodos estáticos
News.findPublished = function() {
  return this.findAll({
    where: {
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

News.findByType = function(type) {
  return this.findAll({
    where: { type },
    order: [['publishedAt', 'DESC']]
  });
};

News.findBySlug = function(slug) {
  return this.findOne({ where: { slug } });
};

News.findFeatured = function() {
  return this.findAll({
    where: {
      isFeatured: true,
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

News.findBreaking = function() {
  return this.findAll({
    where: {
      isBreaking: true,
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

News.findByPriority = function(priority) {
  return this.findAll({
    where: { priority },
    order: [['publishedAt', 'DESC']]
  });
};

News.findUpcomingEvents = function() {
  return this.findAll({
    where: {
      type: 'evento',
      status: 'published',
      isPublic: true,
      eventDate: {
        [sequelize.Op.gte]: new Date()
      }
    },
    order: [['eventDate', 'ASC']]
  });
};

News.findExpired = function() {
  return this.findAll({
    where: {
      expiresAt: {
        [sequelize.Op.lt]: new Date()
      }
    }
  });
};

News.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { title: { [sequelize.Op.iLike]: `%${query}%` } },
        { content: { [sequelize.Op.iLike]: `%${query}%` } },
        { excerpt: { [sequelize.Op.iLike]: `%${query}%` } }
      ],
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

module.exports = News;
