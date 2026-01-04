(async ()=>{
  const { sequelize } = require('../config/database');
  try {
    console.log('Running sequelize.sync({ alter: true })');
    await sequelize.sync({ alter: true });
    console.log('Sync completed');
  } catch (err) {
    console.error('Sync error:', err);
  } finally {
    await sequelize.close();
  }
})();
