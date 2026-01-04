(async ()=>{
  const { sequelize } = require('../config/database');
  try {
    const [results] = await sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
    console.log(results.map(r => r.tablename));
  } catch (err) {
    console.error('Error listing tables:', err);
  } finally {
    await sequelize.close();
  }
})();
