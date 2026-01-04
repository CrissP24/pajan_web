(async ()=>{
  const models = require('../models');
  const { sequelize } = models;
  const missing = ['RendicionCuenta','Transparencia'];
  for (const name of missing) {
    if (models[name]) {
      try {
        console.log('Syncing model', name);
        await models[name].sync({ alter: true });
        console.log('Synced', name);
      } catch (err) {
        console.error('Error syncing', name, err);
      }
    } else {
      console.log('Model not found:', name);
    }
  }
  await sequelize.close();
})();
