import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { canManageStudent } from '@/lib/permissions';

// GET /api/students/[id]/progress - Get student's progress across all activities
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
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Check if current user can manage this student
    const canAccess = await canManageStudent(session.user.id, studentId);
    if (!canAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get student info with abilities
    const studentInfo = await query(`
      SELECT name, reading_level, comprehension_level, attention_span, motor_skills
      FROM students 
      WHERE id = $1
    `, [studentId]);

    if (studentInfo.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get detailed progress by activity and scene
    const progressData = await query(`
      SELECT 
        a.id as activity_id,
        a.name as activity_name,
        a.slug as activity_slug,
        a.order_number as activity_order,
        s.id as scene_id,
        s.name as scene_name,
        s.slug as scene_slug,
        s.order_number as scene_order,
        sp.status,
        sp.completion_percentage,
        sp.attempts,
        sp.game_data,
        sp.started_at,
        sp.completed_at,
        sp.last_accessed_at
      FROM activities a
      JOIN scenes s ON s.activity_id = a.id
      LEFT JOIN student_progress sp ON sp.activity_id = a.id 
        AND sp.scene_id = s.id 
        AND sp.student_id = $1
      WHERE a.is_active = true AND s.is_active = true
      ORDER BY a.order_number, s.order_number
    `, [studentId]);

    // Group progress by activity
    const activitiesMap = new Map();
    
    for (const row of progressData.rows) {
      if (!activitiesMap.has(row.activity_id)) {
        activitiesMap.set(row.activity_id, {
          id: row.activity_id,
          name: row.activity_name,
          slug: row.activity_slug,
          order: row.activity_order,
          scenes: [],
          overall_progress: {
            total_scenes: 0,
            completed_scenes: 0,
            in_progress_scenes: 0,
            not_started_scenes: 0
          }
        });
      }

      const activity = activitiesMap.get(row.activity_id);
      const sceneProgress = {
        id: row.scene_id,
        name: row.scene_name,
        slug: row.scene_slug,
        order: row.scene_order,
        status: row.status || 'not_started',
        completion_percentage: row.completion_percentage || 0,
        attempts: row.attempts || 0,
        game_data: row.game_data || {},
        started_at: row.started_at,
        completed_at: row.completed_at,
        last_accessed_at: row.last_accessed_at
      };

      activity.scenes.push(sceneProgress);
      activity.overall_progress.total_scenes++;

      // Count progress status
      switch (sceneProgress.status) {
        case 'completed':
          activity.overall_progress.completed_scenes++;
          break;
        case 'in_progress':
          activity.overall_progress.in_progress_scenes++;
          break;
        default:
          activity.overall_progress.not_started_scenes++;
      }
    }

    const activities = Array.from(activitiesMap.values());

    // Calculate overall student progress
    const totalScenes = activities.reduce((sum, act) => sum + act.overall_progress.total_scenes, 0);
    const completedScenes = activities.reduce((sum, act) => sum + act.overall_progress.completed_scenes, 0);
    const inProgressScenes = activities.reduce((sum, act) => sum + act.overall_progress.in_progress_scenes, 0);

    // Find current position (last accessed scene or next available)
    let currentActivity = null;
    let currentScene = null;
    let lastAccessTime = null;

    for (const activity of activities) {
      for (const scene of activity.scenes) {
        if (scene.last_accessed_at && (!lastAccessTime || scene.last_accessed_at > lastAccessTime)) {
          lastAccessTime = scene.last_accessed_at;
          currentActivity = activity.slug;
          currentScene = scene.slug;
        }
      }
    }

    // If no progress yet, start with first activity/scene
    if (!currentActivity) {
      currentActivity = activities[0]?.slug;
      currentScene = activities[0]?.scenes[0]?.slug;
    }

    return NextResponse.json({
      student: studentInfo.rows[0],
      current_position: {
        activity: currentActivity,
        scene: currentScene,
        last_accessed: lastAccessTime
      },
      overall_progress: {
        total_scenes: totalScenes,
        completed_scenes: completedScenes,
        in_progress_scenes: inProgressScenes,
        not_started_scenes: totalScenes - completedScenes - inProgressScenes,
        completion_percentage: totalScenes > 0 ? Math.round((completedScenes / totalScenes) * 100) : 0
      },
      activities
    });

  } catch (error) {
    console.error('Error fetching student progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}