import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: join(process.cwd(), '.env') });

import { query } from '../src/lib/db';

async function runSqlFile(filePath: string) {
  try {
    const sqlContent = readFileSync(join(process.cwd(), filePath), 'utf-8');
    
    // Split by semicolons and filter out empty statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Running ${statements.length} SQL statements from ${filePath}...`);

    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
        console.log('✓ Executed statement');
      }
    }

    console.log('All SQL statements executed successfully!');
  } catch (error) {
    console.error('Error running SQL file:', error);
    process.exit(1);
  }
}

// Get file path from command line arguments
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: npx tsx scripts/run-sql.ts <path-to-sql-file>');
  process.exit(1);
}

runSqlFile(filePath);