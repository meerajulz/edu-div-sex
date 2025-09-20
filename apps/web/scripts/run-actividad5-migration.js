const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting actividad-5 database migration...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-actividad5-scenes.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    const result = await client.query(sql);

    console.log('✅ Migration completed successfully!');
    console.log('📊 Results:', result);

    // Verify the data was inserted
    const verification = await client.query(`
      SELECT a.name as activity_name, s.name as scene_name, s.slug as scene_slug, s.order_number
      FROM activities a
      JOIN scenes s ON s.activity_id = a.id
      WHERE a.id = 5
      ORDER BY s.order_number
    `);

    console.log('🔍 Verification - Actividad-5 scenes:');
    verification.rows.forEach(row => {
      console.log(`  ${row.order_number}. ${row.scene_name} (${row.scene_slug})`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();