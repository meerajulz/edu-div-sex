const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    console.log('Connecting to database...');

    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'add-scene1-1-actividad3.sql'),
      'utf8'
    );

    console.log('Running scene1-1 migration script...');
    await pool.query(sqlScript);

    console.log('✅ Scene1-1 migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();