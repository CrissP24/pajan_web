const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RendicionCuenta = sequelize.define('RendicionCuenta', {
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
  fase: {
    type: DataTypes.ENUM(
      'FASE 1: PLANIFICACIÓN Y FACILITACIÓN DEL PROCESO POR LA CIUDADANÍA',
      'FASE 2: EVALUACIÓN DE LA GESTIÓN INSTITUCIONAL Y ELABORACIÓN DEL INFORME DE RENDICIÓN DE CUENTAS',
      'FASE 3: DELIBERACIÓN PÚBLICA Y EVALUACIÓN CIUDADANA DEL INFORME DE RENDICIÓN DE CUENTAS',
      'FASE 4: INCORPORACIÓN DE LA OPINIÓN CIUDADANA, RETROALIMENTACIÓN Y SEGUIMIENTO'
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
  tableName: 'rendicion_cuentas',
  indexes: [
    {
      fields: ['year']
    },
    {
      fields: ['fase']
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
    },
    {
      fields: ['year', 'fase']
    }
  ]
});

// Métodos de instancia
RendicionCuenta.prototype.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

RendicionCuenta.prototype.unpublish = function() {
  this.status = 'draft';
  this.publishedAt = null;
  return this.save();
};

RendicionCuenta.prototype.archive = function() {
  this.status = 'archived';
  return this.save();
};

RendicionCuenta.prototype.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

RendicionCuenta.prototype.incrementDownload = function() {
  this.downloadCount += 1;
  return this.save();
};

// Métodos estáticos
RendicionCuenta.findByYear = function(year) {
  return this.findAll({
    where: { year },
    order: [['fase', 'ASC'], ['orden', 'ASC']]
  });
};

RendicionCuenta.findByFase = function(fase) {
  return this.findAll({
    where: { fase },
    order: [['year', 'DESC'], ['orden', 'ASC']]
  });
};

RendicionCuenta.findByYearAndFase = function(year, fase) {
  return this.findAll({
    where: { year, fase },
    order: [['orden', 'ASC']]
  });
};

RendicionCuenta.findPublished = function() {
  return this.findAll({
    where: {
      status: 'published',
      isPublic: true
    },
    order: [['year', 'DESC'], ['fase', 'ASC'], ['orden', 'ASC']]
  });
};

RendicionCuenta.findByYearPublished = function(year) {
  return this.findAll({
    where: {
      year,
      status: 'published',
      isPublic: true
    },
    order: [['fase', 'ASC'], ['orden', 'ASC']]
  });
};

RendicionCuenta.getYears = function() {
  return this.findAll({
    attributes: ['year'],
    group: ['year'],
    order: [['year', 'DESC']]
  });
};

RendicionCuenta.getFases = function() {
  return this.findAll({
    attributes: ['fase'],
    group: ['fase'],
    order: [['fase', 'ASC']]
  });
};

RendicionCuenta.getStatistics = function() {
  return this.findAll({
    attributes: [
      'year',
      'fase',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['year', 'fase'],
    order: [['year', 'DESC'], ['fase', 'ASC']]
  });
};

RendicionCuenta.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { titulo: { [sequelize.Op.iLike]: `%${query}%` } },
        { descripcion: { [sequelize.Op.iLike]: `%${query}%` } }
      ],
      status: 'published',
      isPublic: true
    },
    order: [['year', 'DESC'], ['fase', 'ASC'], ['orden', 'ASC']]
  });
};

module.exports = RendicionCuenta;
