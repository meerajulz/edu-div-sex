const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Starting aventura-5 migration...');

    const sql = fs.readFileSync(path.join(__dirname, 'add-aventura-5.sql'), 'utf8');
    await client.query(sql);

    console.log('Migration completed.');

    const verification = await client.query(`
      SELECT a.name as activity_name, s.name as scene_name, s.slug, s.order_number
      FROM activities a
      JOIN scenes s ON s.activity_id = a.id
      WHERE a.id = 15
      ORDER BY s.order_number
    `);

    console.log('Aventura-5 scenes in DB:');
    verification.rows.forEach(row => {
      console.log(`  ${row.order_number}. ${row.scene_name} (${row.slug})`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
