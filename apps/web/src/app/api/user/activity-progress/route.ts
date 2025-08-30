import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Fetching activity progress for user:', session.user.id);

    // First, get the student ID for this user
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [session.user.id]
    );

    if (studentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const studentId = studentResult.rows[0].id;
    console.log('🎓 Found student ID:', studentId);

    // Get user's progress data from the student_progress table
    const result = await query(
      `SELECT 
        a.id as activity_id,
        a.name as activity_name,
        a.slug as activity_slug,
        s.name as scene_name,
        s.slug as scene_slug,
        sp.status,
        sp.completion_percentage,
        sp.completed_at,
        sp.last_accessed_at
       FROM activities a
       JOIN scenes s ON s.activity_id = a.id
       LEFT JOIN student_progress sp ON sp.activity_id = a.id 
         AND sp.scene_id = s.id 
         AND sp.student_id = $1
       WHERE a.is_active = true AND s.is_active = true
       ORDER BY a.order_number, s.order_number`,
      [studentId]
    );

    const progress = result.rows;
    
    console.log('📊 User progress data:', progress);

    // Group progress by activity to determine completion status
    const activityCompletion: Record<number, {
      scenes: Record<string, { status: string; progress: number; completedAt?: string }>;
      isCompleted: boolean;
      lastUpdated?: string;
      totalScenes: number;
      completedScenes: number;
    }> = {};
    
    interface ProgressRow {
      activity_id: number;
      activity_slug: string;
      scene_name: string;
      scene_slug: string;
      status?: string;
      completion_percentage?: number;
      completed_at?: string;
      last_accessed_at?: string;
    }

    progress.forEach((row: ProgressRow) => {
      const activityId = row.activity_id;
      
      if (!activityCompletion[activityId]) {
        activityCompletion[activityId] = {
          scenes: {},
          isCompleted: false,
          lastUpdated: undefined,
          totalScenes: 0,
          completedScenes: 0
        };
      }
      
      const activity = activityCompletion[activityId];
      activity.totalScenes++;
      
      // Track scene completion
      const sceneStatus = row.status || 'not_started';
      const sceneProgress = row.completion_percentage || 0;
      
      activity.scenes[row.scene_slug] = {
        status: sceneStatus,
        progress: sceneProgress,
        completedAt: row.completed_at
      };
      
      // Count completed scenes
      if (sceneStatus === 'completed' && sceneProgress >= 100) {
        activity.completedScenes++;
      }
      
      // Update activity completion timestamp if this is newer
      if (row.last_accessed_at && (!activity.lastUpdated || row.last_accessed_at > activity.lastUpdated)) {
        activity.lastUpdated = row.last_accessed_at;
      }
    });

    // Determine which activities are completed based on their scenes
    Object.keys(activityCompletion).forEach(activityIdStr => {
      const activityId = parseInt(activityIdStr);
      const activity = activityCompletion[activityId];
      
      // Activity is completed if at least one scene is completed with 100% progress
      // You can adjust this logic if you need ALL scenes to be completed
      activity.isCompleted = activity.completedScenes > 0 && 
        Object.values(activity.scenes).some(scene => scene.status === 'completed' && scene.progress >= 100);
    });

    console.log('🎯 Activity completion status:', activityCompletion);

    return NextResponse.json({
      success: true,
      progress: progress,
      activityCompletion: activityCompletion,
      userId: session.user.id
    });

  } catch (error) {
    console.error('❌ Error fetching user activity progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress data' }, 
      { status: 500 }
    );
  }
}