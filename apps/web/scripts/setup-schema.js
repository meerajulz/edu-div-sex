const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupSchema() {
  try {
    console.log('🚀 Setting up database schema...');
    
    // Read and execute schema
    const schemaScript = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    
    console.log('📝 Creating tables and indexes...');
    await pool.query(schemaScript);
    
    // Insert sample data with new role hierarchy
    console.log('👥 Setting up sample data with role hierarchy...');
    const sampleDataScript = fs.readFileSync(
      path.join(__dirname, 'sample-data.sql'),
      'utf8'
    );
    
    await pool.query(sampleDataScript);
    
    console.log('✅ Database schema setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Updated users table with new role hierarchy (owner, admin, teacher, student)');
    console.log('- Created teacher-admin assignment system');
    console.log('- Created students table for ability tracking');
    console.log('- Created activities and scenes tables');
    console.log('- Created progress tracking system');
    console.log('- Added comprehensive sample data');
    console.log('\n🔑 Login credentials (all passwords: testpass123):');
    console.log('- Owner: owner@example.com');
    console.log('- Admin: admin@example.com');
    console.log('- Teacher 1: teacher1@example.com');
    console.log('- Teacher 2: teacher2@example.com');
    console.log('- Student: student@example.com');
    
  } catch (error) {
    console.error('❌ Database schema setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupSchema();