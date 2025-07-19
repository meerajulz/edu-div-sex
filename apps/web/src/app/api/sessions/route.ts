import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { canManageStudent } from '@/lib/permissions';

// POST /api/sessions - Start or end a student session
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { student_id, action } = body; // action: 'start' or 'end'

    if (!student_id || !action) {
      return NextResponse.json({ 
        error: 'student_id and action are required' 
      }, { status: 400 });
    }

    if (!['start', 'end'].includes(action)) {
      return NextResponse.json({ 
        error: 'Action must be "start" or "end"' 
      }, { status: 400 });
    }

    // Check if user can manage this student's sessions
    const canManage = await canManageStudent(session.user.id, student_id);
    if (!canManage) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (action === 'start') {
      // Start a new session
      const result = await query(`
        INSERT INTO student_sessions (student_id, session_start)
        VALUES ($1, NOW())
        RETURNING *
      `, [student_id]);

      return NextResponse.json({
        message: 'Session started',
        session: result.rows[0]
      });

    } else if (action === 'end') {
      // End the most recent active session
      const activeSessionResult = await query(`
        SELECT id, session_start
        FROM student_sessions 
        WHERE student_id = $1 AND session_end IS NULL
        ORDER BY session_start DESC
        LIMIT 1
      `, [student_id]);

      if (activeSessionResult.rows.length === 0) {
        return NextResponse.json({ 
          error: 'No active session found' 
        }, { status: 404 });
      }

      const activeSession = activeSessionResult.rows[0];
      const sessionStart = new Date(activeSession.session_start);
      const sessionEnd = new Date();
      const totalTimeMinutes = Math.round((sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60));

      // Count activities accessed during this session
      const activitiesAccessedResult = await query(`
        SELECT COUNT(DISTINCT activity_id) as count
        FROM student_progress 
        WHERE student_id = $1 
          AND last_accessed_at >= $2
      `, [student_id, activeSession.session_start]);

      const activitiesAccessed = activitiesAccessedResult.rows[0]?.count || 0;

      // Update session with end time and stats
      const result = await query(`
        UPDATE student_sessions 
        SET 
          session_end = $1,
          total_time_minutes = $2,
          activities_accessed = $3
        WHERE id = $4
        RETURNING *
      `, [sessionEnd.toISOString(), totalTimeMinutes, activitiesAccessed, activeSession.id]);

      return NextResponse.json({
        message: 'Session ended',
        session: result.rows[0]
      });
    }

  } catch (error) {
    console.error('Error managing session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/sessions - Get session history for a student
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!studentId) {
      return NextResponse.json({ 
        error: 'student_id parameter is required' 
      }, { status: 400 });
    }

    // Check if user can view this student's sessions
    const canView = await canManageStudent(session.user.id, parseInt(studentId));
    if (!canView) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get session history
    const sessionsResult = await query(`
      SELECT 
        id,
        session_start,
        session_end,
        total_time_minutes,
        activities_accessed,
        created_at
      FROM student_sessions 
      WHERE student_id = $1
      ORDER BY session_start DESC
      LIMIT $2
    `, [studentId, limit]);

    // Calculate summary stats
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(total_time_minutes) as total_minutes,
        AVG(total_time_minutes) as avg_session_minutes,
        SUM(activities_accessed) as total_activities_accessed,
        MAX(session_start) as last_session
      FROM student_sessions 
      WHERE student_id = $1 AND session_end IS NOT NULL
    `, [studentId]);

    const stats = statsResult.rows[0];

    return NextResponse.json({
      sessions: sessionsResult.rows,
      summary: {
        total_sessions: parseInt(stats.total_sessions || 0),
        total_time_minutes: parseInt(stats.total_minutes || 0),
        average_session_minutes: Math.round(parseFloat(stats.avg_session_minutes || 0)),
        total_activities_accessed: parseInt(stats.total_activities_accessed || 0),
        last_session: stats.last_session
      }
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}