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
    
    // Update existing test user to be a teacher
    console.log('👩‍🏫 Setting up default teacher account...');
    await pool.query(`
      UPDATE users 
      SET role = 'teacher' 
      WHERE email = 'test@example.com'
    `);
    
    // Insert initial activities based on your current structure
    console.log('📚 Setting up activities and scenes...');
    
    const activities = [
      { name: 'Descubriendo mi cuerpo', slug: 'actividad-1', order: 1 },
      { name: 'Intimidad', slug: 'actividad-2', order: 2 },
      { name: 'Placer sexual', slug: 'actividad-3', order: 3 }
    ];
    
    for (const activity of activities) {
      const result = await pool.query(`
        INSERT INTO activities (name, slug, order_number)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          order_number = EXCLUDED.order_number
        RETURNING id
      `, [activity.name, activity.slug, activity.order]);
      
      const activityId = result.rows[0].id;
      
      // Add scenes for each activity (based on your current structure)
      const sceneCount = activity.slug === 'actividad-1' ? 7 : 
                        activity.slug === 'actividad-2' ? 4 : 2;
      
      for (let i = 1; i <= sceneCount; i++) {
        await pool.query(`
          INSERT INTO scenes (activity_id, name, slug, order_number)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (activity_id, slug) DO UPDATE SET
            name = EXCLUDED.name,
            order_number = EXCLUDED.order_number
        `, [activityId, `Escena ${i}`, `scene${i}`, i]);
      }
    }
    
    // Create a sample student for testing
    console.log('👶 Creating sample student...');
    const teacherId = await pool.query(`
      SELECT id FROM users WHERE email = 'test@example.com'
    `);
    
    if (teacherId.rows.length > 0) {
      await pool.query(`
        INSERT INTO students (name, age, reading_level, comprehension_level, attention_span, motor_skills, teacher_id, notes)
        VALUES ('Alex Martinez', 12, 3, 2, 3, 4, $1, 'Sample student for testing. Good motor skills, moderate attention span.')
        ON CONFLICT DO NOTHING
      `, [teacherId.rows[0].id]);
    }
    
    console.log('✅ Database schema setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Updated users table with roles');
    console.log('- Created students table for ability tracking');
    console.log('- Created activities and scenes tables');
    console.log('- Created progress tracking system');
    console.log('- Added sample data for testing');
    console.log('\n🔑 Login credentials:');
    console.log('- Teacher: test@example.com / testpass123');
    
  } catch (error) {
    console.error('❌ Database schema setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupSchema();