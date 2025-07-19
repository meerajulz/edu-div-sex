const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'setup-database.sql'),
      'utf8'
    );
    
    console.log('Running database setup script...');
    await pool.query(sqlScript);
    
    console.log('✅ Database setup completed successfully!');
    console.log('Test user created: test@example.com / testpass123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();