const { sequelize } = require('../config/database');

// Importar todos los modelos
const User = require('./User');
const Content = require('./Content');
const Document = require('./Document');
const Attachment = require('./Attachment');
const News = require('./News');
const PresidenteBarrial = require('./PresidenteBarrial');
const RendicionCuenta = require('./RendicionCuenta');
const Transparencia = require('./Transparencia');
const AuditLog = require('./AuditLog');

// Definir asociaciones
const defineAssociations = () => {
  // Usuario tiene muchos documentos
  User.hasMany(Document, { foreignKey: 'user_id', as: 'documents' });
  Document.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Usuario tiene muchos contenidos
  User.hasMany(Content, { foreignKey: 'user_id', as: 'contents' });
  Content.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Usuario tiene muchas noticias
  User.hasMany(News, { foreignKey: 'user_id', as: 'news' });
  News.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Usuario tiene muchos logs de auditoría
  User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
  AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Documento tiene muchos attachments
  Document.hasMany(Attachment, { foreignKey: 'document_id', as: 'attachments' });
  Attachment.belongsTo(Document, { foreignKey: 'document_id', as: 'document' });

  // Usuario tiene muchos rendiciones de cuenta
  User.hasMany(RendicionCuenta, { foreignKey: 'user_id', as: 'rendiciones' });
  RendicionCuenta.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Usuario tiene muchos documentos de transparencia
  User.hasMany(Transparencia, { foreignKey: 'user_id', as: 'transparencias' });
  Transparencia.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
};

// Inicializar asociaciones
defineAssociations();

module.exports = {
  sequelize,
  User,
  Content,
  Document,
  Attachment,
  News,
  PresidenteBarrial,
  RendicionCuenta,
  Transparencia,
  AuditLog
};
