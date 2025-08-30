#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('🚀 Running database migration to add last_activity_url column...\n');
  
  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'add-last-activity-url.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 Executing migration SQL...');
    const result = await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Result:', result);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();