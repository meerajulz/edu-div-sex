import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Debug: Starting database check...');
    
    const activitiesResult = await query('SELECT COUNT(*) as count FROM activities');
    const activitiesCount = activitiesResult.rows[0]?.count || 0;
    
    const scenesResult = await query('SELECT COUNT(*) as count FROM scenes');  
    const scenesCount = scenesResult.rows[0]?.count || 0;
    
    const actividad1Result = await query('SELECT * FROM activities WHERE slug = $1', ['actividad-1']);
    const actividad1 = actividad1Result.rows;
    
    // Test the exact same query used in activity access function
    const exactQueryResult = await query(
      'SELECT id, order_number FROM activities WHERE slug = $1 AND is_active = true',
      ['actividad-1']
    );
    const exactQuery = exactQueryResult.rows;
    
    const studentsResult = await query('SELECT COUNT(*) as count FROM students WHERE user_id = 42');
    const studentCount = studentsResult.rows[0]?.count || 0;
    
    // Check scenes for actividad-1
    const scenesForActivity1 = await query('SELECT slug, order_number FROM scenes WHERE activity_id = 1 ORDER BY order_number');
    
    // Check progress for user 42
    const progressResult = await query(`
      SELECT sp.*, a.slug as activity_slug, s.slug as scene_slug 
      FROM student_progress sp
      JOIN activities a ON sp.activity_id = a.id
      JOIN scenes s ON sp.scene_id = s.id
      JOIN students st ON sp.student_id = st.id
      WHERE st.user_id = 42
      ORDER BY sp.last_accessed_at DESC
    `);

    const result = {
      activities_count: activitiesCount,
      scenes_count: scenesCount,
      actividad1_exists: actividad1.length > 0,
      actividad1_data: actividad1[0] || null,
      exact_query_result: exactQuery,
      exact_query_count: exactQuery.length,
      student_42_exists: studentCount > 0,
      scenes_for_actividad1: scenesForActivity1.rows,
      user_progress: progressResult.rows
    };
    
    console.log('🔍 Debug: Database state:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: 'Database error', details: error }, { status: 500 });
  }
}