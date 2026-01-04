(async ()=>{
  const { sequelize } = require('../config/database');
  try {
    const [results] = await sequelize.query("SELECT schemaname, tablename FROM pg_tables ORDER BY schemaname, tablename");
    results.forEach(r => console.log(r.schemaname, r.tablename));
  } catch (err) {
    console.error('Error listing tables:', err);
  } finally {
    await sequelize.close();
  }
})();
