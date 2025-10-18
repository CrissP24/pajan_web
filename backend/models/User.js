const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255],
      notEmpty: true
    }
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
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  roles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: ['user'],
    validate: {
      isValidRoles(value) {
        const validRoles = [
          'Superadministrador',
          'TIC',
          'Comunicación',
          'Participación Ciudadana',
          'Transparencia',
          'user'
        ];
        
        if (!Array.isArray(value)) {
          throw new Error('Roles debe ser un array');
        }
        
        const invalidRoles = value.filter(role => !validRoles.includes(role));
        if (invalidRoles.length > 0) {
          throw new Error(`Roles inválidos: ${invalidRoles.join(', ')}`);
        }
      }
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['active']
    },
    {
      fields: ['roles']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
        user.passwordChangedAt = new Date();
      }
    }
  }
});

// Métodos de instancia
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

User.prototype.hasRole = function(role) {
  return this.roles.includes(role);
};

User.prototype.hasAnyRole = function(roles) {
  return roles.some(role => this.roles.includes(role));
};

User.prototype.hasAllRoles = function(roles) {
  return roles.every(role => this.roles.includes(role));
};

// Métodos estáticos
User.findByEmail = function(email) {
  return this.findOne({ where: { email } });
};

User.findByUsername = function(username) {
  return this.findOne({ where: { username } });
};

User.findActive = function() {
  return this.findAll({ where: { active: true } });
};

User.findByRole = function(role) {
  return this.findAll({
    where: {
      active: true,
      roles: {
        [sequelize.Op.contains]: [role]
      }
    }
  });
};

module.exports = User;
