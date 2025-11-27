import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Debug: Starting database check...');

    const session = await auth();
    const userId = session?.user?.id;

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

    // Check scenes for actividad-1
    const scenesForActivity1 = await query('SELECT slug, order_number, name FROM scenes WHERE activity_id = 1 ORDER BY order_number');

    // Get current user's student record
    let studentInfo = null;
    let progressResult = null;
    if (userId) {
      const studentResult = await query('SELECT * FROM students WHERE user_id = $1', [userId]);
      studentInfo = studentResult.rows[0] || null;

      if (studentInfo) {
        // Check progress for current user
        progressResult = await query(`
          SELECT sp.*, a.slug as activity_slug, a.name as activity_name,
                 s.slug as scene_slug, s.name as scene_name, s.order_number as scene_order
          FROM student_progress sp
          JOIN activities a ON sp.activity_id = a.id
          JOIN scenes s ON sp.scene_id = s.id
          WHERE sp.student_id = $1
          ORDER BY a.order_number, s.order_number
        `, [studentInfo.id]);
      }
    }

    const result = {
      current_user_id: userId || 'Not logged in',
      current_student: studentInfo,
      activities_count: activitiesCount,
      scenes_count: scenesCount,
      actividad1_exists: actividad1.length > 0,
      actividad1_data: actividad1[0] || null,
      exact_query_result: exactQuery,
      exact_query_count: exactQuery.length,
      scenes_for_actividad1: scenesForActivity1.rows,
      user_progress: progressResult?.rows || []
    };

    console.log('🔍 Debug: Database state:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: 'Database error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}