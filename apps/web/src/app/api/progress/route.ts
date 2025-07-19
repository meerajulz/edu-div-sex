import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { canManageStudent } from '@/lib/permissions';

// POST /api/progress - Save student progress
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      student_id,
      activity_slug,
      scene_slug,
      status = 'in_progress',
      completion_percentage = 0,
      game_data = {}
    } = body;

    // Validate required fields
    if (!student_id || !activity_slug || !scene_slug) {
      return NextResponse.json({ 
        error: 'student_id, activity_slug, and scene_slug are required' 
      }, { status: 400 });
    }

    // Get activity and scene IDs
    const activityResult = await query(`
      SELECT a.id as activity_id, s.id as scene_id
      FROM activities a
      JOIN scenes s ON s.activity_id = a.id
      WHERE a.slug = $1 AND s.slug = $2 AND a.is_active = true AND s.is_active = true
    `, [activity_slug, scene_slug]);

    if (activityResult.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Activity or scene not found' 
      }, { status: 404 });
    }

    const { activity_id, scene_id } = activityResult.rows[0];

    // Check if user can update this student's progress
    const canUpdate = await canManageStudent(session.user.id, student_id);
    if (!canUpdate) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate status
    const validStatuses = ['not_started', 'in_progress', 'completed', 'skipped'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be: ' + validStatuses.join(', ') 
      }, { status: 400 });
    }

    // Validate completion percentage
    if (completion_percentage < 0 || completion_percentage > 100) {
      return NextResponse.json({ 
        error: 'Completion percentage must be between 0 and 100' 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Upsert progress record
    const result = await query(`
      INSERT INTO student_progress (
        student_id, activity_id, scene_id, status, 
        completion_percentage, game_data, started_at, 
        last_accessed_at, attempts,
        completed_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, 
        COALESCE((SELECT started_at FROM student_progress WHERE student_id = $1 AND activity_id = $2 AND scene_id = $3), $7),
        $7,
        COALESCE((SELECT attempts FROM student_progress WHERE student_id = $1 AND activity_id = $2 AND scene_id = $3), 0) + 1,
        CASE WHEN $4 = 'completed' THEN $7 ELSE NULL END
      )
      ON CONFLICT (student_id, activity_id, scene_id) 
      DO UPDATE SET
        status = EXCLUDED.status,
        completion_percentage = EXCLUDED.completion_percentage,
        game_data = EXCLUDED.game_data,
        last_accessed_at = EXCLUDED.last_accessed_at,
        attempts = student_progress.attempts + 1,
        completed_at = CASE 
          WHEN EXCLUDED.status = 'completed' AND student_progress.completed_at IS NULL 
          THEN EXCLUDED.last_accessed_at 
          ELSE student_progress.completed_at 
        END
      RETURNING *
    `, [
      student_id, activity_id, scene_id, status, 
      completion_percentage, JSON.stringify(game_data), now
    ]);

    const progressRecord = result.rows[0];

    return NextResponse.json({
      message: 'Progress saved successfully',
      progress: {
        ...progressRecord,
        activity_slug,
        scene_slug
      }
    });

  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}