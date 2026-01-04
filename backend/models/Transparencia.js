const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transparencia = sequelize.define('Transparencia', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2020,
      max: 2030
    }
  },
  mes: {
    type: DataTypes.ENUM(
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ),
    allowNull: false
  },
  literal: {
    type: DataTypes.ENUM(
      'A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'C', 'D', 'E', 'F1', 'F2',
      'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'S'
    ),
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
      notEmpty: true
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  archivo_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  archivo_nombre: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  archivo_tamaño: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  archivo_tipo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
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
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
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
  tableName: 'transparencia',
  indexes: [
    {
      fields: ['year']
    },
    {
      fields: ['mes']
    },
    {
      fields: ['literal']
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
      fields: ['user_id']
    },
    {
      fields: ['year', 'mes']
    },
    {
      fields: ['literal', 'year']
    }
  ]
});

// Métodos de instancia
Transparencia.prototype.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

Transparencia.prototype.unpublish = function() {
  this.status = 'draft';
  this.publishedAt = null;
  return this.save();
};

Transparencia.prototype.archive = function() {
  this.status = 'archived';
  return this.save();
};

Transparencia.prototype.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

Transparencia.prototype.incrementDownload = function() {
  this.downloadCount += 1;
  return this.save();
};

// Métodos estáticos
Transparencia.findByYear = function(year) {
  return this.findAll({
    where: { year },
    order: [['mes', 'ASC'], ['literal', 'ASC'], ['orden', 'ASC']]
  });
};

Transparencia.findByMes = function(mes) {
  return this.findAll({
    where: { mes },
    order: [['year', 'DESC'], ['literal', 'ASC'], ['orden', 'ASC']]
  });
};

Transparencia.findByLiteral = function(literal) {
  return this.findAll({
    where: { literal },
    order: [['year', 'DESC'], ['mes', 'ASC'], ['orden', 'ASC']]
  });
};

Transparencia.findByYearAndMes = function(year, mes) {
  return this.findAll({
    where: { year, mes },
    order: [['literal', 'ASC'], ['orden', 'ASC']]
  });
};

Transparencia.findByYearAndLiteral = function(year, literal) {
  return this.findAll({
    where: { year, literal },
    order: [['mes', 'ASC'], ['orden', 'ASC']]
  });
};

Transparencia.findPublished = function() {
  return this.findAll({
    where: {
      status: 'published',
      isPublic: true
    },
    order: [['year', 'DESC'], ['mes', 'ASC'], ['literal', 'ASC'], ['orden', 'ASC']]
  });
};

Transparencia.findByYearPublished = function(year) {
  return this.findAll({
    where: {
      year,
      status: 'published',
      isPublic: true
    },
    order: [['mes', 'ASC'], ['literal', 'ASC'], ['orden', 'ASC']]
  });
};

Transparencia.findByMesPublished = function(mes) {
  return this.findAll({
    where: {
      mes,
      status: 'published',
      isPublic: true
    },
    order: [['year', 'DESC'], ['literal', 'ASC'], ['orden', 'ASC']]
  });
};

Transparencia.getYears = function() {
  return this.findAll({
    attributes: ['year'],
    group: ['year'],
    order: [['year', 'DESC']]
  });
};

Transparencia.getMeses = function() {
  return this.findAll({
    attributes: ['mes'],
    group: ['mes'],
    order: [['mes', 'ASC']]
  });
};

Transparencia.getLiterales = function() {
  return this.findAll({
    attributes: ['literal'],
    group: ['literal'],
    order: [['literal', 'ASC']]
  });
};

Transparencia.getStatistics = function() {
  return this.findAll({
    attributes: [
      'year',
      'mes',
      'literal',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['year', 'mes', 'literal'],
    order: [['year', 'DESC'], ['mes', 'ASC'], ['literal', 'ASC']]
  });
};

Transparencia.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { titulo: { [sequelize.Op.iLike]: `%${query}%` } },
        { descripcion: { [sequelize.Op.iLike]: `%${query}%` } }
      ],
      status: 'published',
      isPublic: true
    },
    order: [['year', 'DESC'], ['mes', 'ASC'], ['literal', 'ASC'], ['orden', 'ASC']]
  });
};

module.exports = Transparencia;
