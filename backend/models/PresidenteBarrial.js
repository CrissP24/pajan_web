const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PresidenteBarrial = sequelize.define('PresidenteBarrial', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
      notEmpty: true
    }
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
      notEmpty: true
    }
  },
  cedula: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  barrio: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  genero: {
    type: DataTypes.ENUM('M', 'F', 'Otro'),
    allowNull: true
  },
  estadoCivil: {
    type: DataTypes.ENUM('Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre'),
    allowNull: true
  },
  nivelEducacion: {
    type: DataTypes.ENUM(
      'Primaria',
      'Secundaria',
      'Técnico',
      'Universitario',
      'Postgrado'
    ),
    allowNull: true
  },
  profesion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ocupacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo', 'Suspendido'),
    allowNull: false,
    defaultValue: 'Activo'
  },
  motivoInactividad: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  foto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Información de contacto adicional
  telefonoAlternativo: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  contactoEmergencia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefonoEmergencia: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  // Metadatos
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'presidentes_barriales',
  indexes: [
    {
      unique: true,
      fields: ['cedula']
    },
    {
      fields: ['barrio']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['fechaInicio']
    },
    {
      fields: ['fechaFin']
    }
  ]
});

// Métodos de instancia
PresidenteBarrial.prototype.getFullName = function() {
  return `${this.nombre} ${this.apellido}`;
};

PresidenteBarrial.prototype.isActive = function() {
  return this.estado === 'Activo';
};

PresidenteBarrial.prototype.isCurrent = function() {
  const now = new Date();
  const startDate = new Date(this.fechaInicio);
  const endDate = this.fechaFin ? new Date(this.fechaFin) : null;
  
  return startDate <= now && (!endDate || endDate >= now);
};

PresidenteBarrial.prototype.deactivate = function(motivo) {
  this.estado = 'Inactivo';
  this.motivoInactividad = motivo;
  this.fechaFin = new Date();
  return this.save();
};

PresidenteBarrial.prototype.suspend = function(motivo) {
  this.estado = 'Suspendido';
  this.motivoInactividad = motivo;
  return this.save();
};

PresidenteBarrial.prototype.reactivate = function() {
  this.estado = 'Activo';
  this.motivoInactividad = null;
  this.fechaFin = null;
  return this.save();
};

// Métodos estáticos
PresidenteBarrial.findActive = function() {
  return this.findAll({
    where: { estado: 'Activo' },
    order: [['barrio', 'ASC'], ['nombre', 'ASC']]
  });
};

PresidenteBarrial.findByBarrio = function(barrio) {
  return this.findAll({
    where: { barrio },
    order: [['nombre', 'ASC']]
  });
};

PresidenteBarrial.findCurrent = function() {
  const now = new Date();
  return this.findAll({
    where: {
      estado: 'Activo',
      fechaInicio: {
        [sequelize.Op.lte]: now
      },
      [sequelize.Op.or]: [
        { fechaFin: null },
        { fechaFin: { [sequelize.Op.gte]: now } }
      ]
    },
    order: [['barrio', 'ASC'], ['nombre', 'ASC']]
  });
};

PresidenteBarrial.findByCedula = function(cedula) {
  return this.findOne({ where: { cedula } });
};

PresidenteBarrial.findByEstado = function(estado) {
  return this.findAll({
    where: { estado },
    order: [['barrio', 'ASC'], ['nombre', 'ASC']]
  });
};

PresidenteBarrial.getBarrios = function() {
  return this.findAll({
    attributes: ['barrio'],
    group: ['barrio'],
    order: [['barrio', 'ASC']]
  });
};

PresidenteBarrial.getStatistics = function() {
  return this.findAll({
    attributes: [
      'estado',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['estado']
  });
};

PresidenteBarrial.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { nombre: { [sequelize.Op.iLike]: `%${query}%` } },
        { apellido: { [sequelize.Op.iLike]: `%${query}%` } },
        { cedula: { [sequelize.Op.iLike]: `%${query}%` } },
        { barrio: { [sequelize.Op.iLike]: `%${query}%` } }
      ]
    },
    order: [['barrio', 'ASC'], ['nombre', 'ASC']]
  });
};

module.exports = PresidenteBarrial;
