const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  entity: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  entityId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  oldValues: {
    type: DataTypes.JSON,
    allowNull: true
  },
  newValues: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'audit_logs',
  indexes: [
    {
      fields: ['action']
    },
    {
      fields: ['entity']
    },
    {
      fields: ['entityId']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['ipAddress']
    }
  ]
});

// Métodos estáticos
AuditLog.log = async function(data) {
  try {
    return await this.create({
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      oldValues: data.oldValues,
      newValues: data.newValues,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      description: data.description,
      metadata: data.metadata,
      user_id: data.user_id
    });
  } catch (error) {
    console.error('Error logging audit:', error);
    return null;
  }
};

AuditLog.findByUser = function(userId, limit = 100) {
  return this.findAll({
    where: { user_id: userId },
    order: [['createdAt', 'DESC']],
    limit
  });
};

AuditLog.findByAction = function(action, limit = 100) {
  return this.findAll({
    where: { action },
    order: [['createdAt', 'DESC']],
    limit
  });
};

AuditLog.findByEntity = function(entity, limit = 100) {
  return this.findAll({
    where: { entity },
    order: [['createdAt', 'DESC']],
    limit
  });
};

AuditLog.findByDateRange = function(startDate, endDate, limit = 100) {
  return this.findAll({
    where: {
      createdAt: {
        [sequelize.Op.between]: [startDate, endDate]
      }
    },
    order: [['createdAt', 'DESC']],
    limit
  });
};

AuditLog.getStatistics = function() {
  return this.findAll({
    attributes: [
      'action',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['action'],
    order: [['count', 'DESC']]
  });
};

AuditLog.getEntityStatistics = function() {
  return this.findAll({
    attributes: [
      'entity',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['entity'],
    order: [['count', 'DESC']]
  });
};

AuditLog.cleanup = async function(daysToKeep = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  return await this.destroy({
    where: {
      createdAt: {
        [sequelize.Op.lt]: cutoffDate
      }
    }
  });
};

module.exports = AuditLog;
