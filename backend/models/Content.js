const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const slugify = require('slugify');

const Content = sequelize.define('Content', {
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
  section: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('page', 'section', 'component'),
    allowNull: false,
    defaultValue: 'page'
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
  metaTitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featuredImage: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  customFields: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
  tableName: 'contents',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['section']
    },
    {
      fields: ['type']
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
      fields: ['user_id']
    }
  ],
  hooks: {
    beforeCreate: (content) => {
      if (!content.slug) {
        content.slug = slugify(content.title, { lower: true, strict: true });
      }
    },
    beforeUpdate: (content) => {
      if (content.changed('title') && !content.changed('slug')) {
        content.slug = slugify(content.title, { lower: true, strict: true });
      }
    },
    beforeSave: (content) => {
      if (content.status === 'published' && !content.publishedAt) {
        content.publishedAt = new Date();
      }
    }
  }
});

// Métodos de instancia
Content.prototype.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

Content.prototype.unpublish = function() {
  this.status = 'draft';
  this.publishedAt = null;
  return this.save();
};

Content.prototype.archive = function() {
  this.status = 'archived';
  return this.save();
};

Content.prototype.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

// Métodos estáticos
Content.findPublished = function() {
  return this.findAll({
    where: {
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

Content.findBySection = function(section) {
  return this.findAll({
    where: { section },
    order: [['order', 'ASC'], ['createdAt', 'DESC']]
  });
};

Content.findBySlug = function(slug) {
  return this.findOne({ where: { slug } });
};

Content.findByType = function(type) {
  return this.findAll({
    where: { type },
    order: [['order', 'ASC'], ['createdAt', 'DESC']]
  });
};

Content.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { title: { [sequelize.Op.iLike]: `%${query}%` } },
        { content: { [sequelize.Op.iLike]: `%${query}%` } }
      ],
      status: 'published',
      isPublic: true
    },
    order: [['publishedAt', 'DESC']]
  });
};

module.exports = Content;
