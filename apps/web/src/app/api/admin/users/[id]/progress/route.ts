import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { canManageUser } from '@/lib/permissions';

// GET /api/admin/users/[id]/progress - Get student progress data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Check if current user can manage this user
    const canManage = await canManageUser(session.user.id, userId);
    if (!canManage) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get student profile to check if user is a student
    const studentResult = await query(`
      SELECT id FROM students WHERE user_id = $1
    `, [userId]);

    if (studentResult.rows.length === 0) {
      return NextResponse.json({ error: 'User is not a student' }, { status: 400 });
    }

    const studentId = studentResult.rows[0].id;

    // Get all activities and scenes
    const activitiesResult = await query(`
      SELECT 
        a.id as activity_id,
        a.name as activity_name,
        a.slug as activity_slug,
        a.order_number as activity_order,
        s.id as scene_id,
        s.name as scene_name,
        s.slug as scene_slug,
        s.order_number as scene_order
      FROM activities a
      LEFT JOIN scenes s ON a.id = s.activity_id
      WHERE a.is_active = true AND (s.is_active = true OR s.id IS NULL)
      ORDER BY a.order_number, s.order_number
    `);

    // Get student progress for all activities and scenes
    const progressResult = await query(`
      SELECT 
        activity_id,
        scene_id,
        status,
        attempts,
        completion_percentage,
        started_at,
        completed_at,
        last_accessed_at,
        game_data
      FROM student_progress 
      WHERE student_id = $1
    `, [studentId]);

    // Create progress map for easy lookup
    const progressMap = new Map();
    progressResult.rows.forEach(row => {
      const key = `${row.activity_id}-${row.scene_id}`;
      progressMap.set(key, row);
    });

    // Structure the data by activities and scenes
    const activitiesData: Array<{
      id: number;
      name: string;
      slug: string;
      order: number;
      scenes: Array<{
        id: number;
        name: string;
        slug: string;
        order: number;
        progress: Record<string, unknown>;
      }>;
      totalScenes: number;
      completedScenes: number;
      overallProgress: number;
    }> = [];
    let currentActivity: {
      id: number;
      name: string;
      slug: string;
      order: number;
      scenes: Array<{
        id: number;
        name: string;
        slug: string;
        order: number;
        progress: Record<string, unknown>;
      }>;
      totalScenes: number;
      completedScenes: number;
      overallProgress: number;
    } | null = null;

    activitiesResult.rows.forEach(row => {
      if (!currentActivity || currentActivity.id !== row.activity_id) {
        // New activity
        currentActivity = {
          id: row.activity_id,
          name: row.activity_name,
          slug: row.activity_slug,
          order: row.activity_order,
          scenes: [],
          totalScenes: 0,
          completedScenes: 0,
          overallProgress: 0
        };
        activitiesData.push(currentActivity);
      }

      if (row.scene_id) {
        const progressKey = `${row.activity_id}-${row.scene_id}`;
        const sceneProgress = progressMap.get(progressKey) || {
          status: 'not_started',
          attempts: 0,
          completion_percentage: 0,
          started_at: null,
          completed_at: null,
          last_accessed_at: null,
          game_data: {}
        };

        const scene = {
          id: row.scene_id,
          name: row.scene_name,
          slug: row.scene_slug,
          order: row.scene_order,
          progress: sceneProgress
        };

        currentActivity.scenes.push(scene);
        currentActivity.totalScenes++;
        
        if (sceneProgress.status === 'completed') {
          currentActivity.completedScenes++;
        }
      }
    });

    // Calculate overall progress for each activity
    activitiesData.forEach(activity => {
      if (activity.totalScenes > 0) {
        activity.overallProgress = Math.round((activity.completedScenes / activity.totalScenes) * 100);
      }
    });

    // Calculate overall student progress
    const totalScenes = activitiesData.reduce((sum, activity) => sum + activity.totalScenes, 0);
    const totalCompleted = activitiesData.reduce((sum, activity) => sum + activity.completedScenes, 0);
    const overallProgress = totalScenes > 0 ? Math.round((totalCompleted / totalScenes) * 100) : 0;

    return NextResponse.json({
      student_id: studentId,
      overall_progress: overallProgress,
      total_scenes: totalScenes,
      completed_scenes: totalCompleted,
      activities: activitiesData
    });

  } catch (error) {
    console.error('Error fetching student progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id]/progress - Update progress for a specific scene
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Check if current user can manage this user
    const canManage = await canManageUser(session.user.id, userId);
    if (!canManage) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { activity_id, scene_id, status, completion_percentage } = body;

    if (!activity_id || !scene_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get student ID
    const studentResult = await query(`
      SELECT id FROM students WHERE user_id = $1
    `, [userId]);

    if (studentResult.rows.length === 0) {
      return NextResponse.json({ error: 'User is not a student' }, { status: 400 });
    }

    const studentId = studentResult.rows[0].id;

    // Update or insert progress record
    const now = new Date().toISOString();
    const updateQuery = `
      INSERT INTO student_progress (
        student_id, activity_id, scene_id, status, completion_percentage, 
        last_accessed_at, started_at, completed_at, attempts
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1)
      ON CONFLICT (student_id, activity_id, scene_id)
      DO UPDATE SET
        status = EXCLUDED.status,
        completion_percentage = EXCLUDED.completion_percentage,
        last_accessed_at = EXCLUDED.last_accessed_at,
        started_at = CASE 
          WHEN student_progress.started_at IS NULL THEN EXCLUDED.started_at
          ELSE student_progress.started_at
        END,
        completed_at = CASE 
          WHEN EXCLUDED.status = 'completed' THEN EXCLUDED.completed_at
          ELSE NULL
        END,
        attempts = student_progress.attempts + 1
      RETURNING *
    `;

    const values = [
      studentId,
      activity_id,
      scene_id,
      status,
      completion_percentage || 0,
      now,
      status !== 'not_started' ? now : null,
      status === 'completed' ? now : null
    ];

    const result = await query(updateQuery, values);

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating student progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}