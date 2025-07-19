import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { canManageStudent } from '@/lib/permissions';

// GET /api/students/[id]/accessible-content - Get activities and scenes accessible to a student based on their abilities
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

    // Get student abilities
    const studentResult = await query(`
      SELECT 
        name, 
        reading_level, 
        comprehension_level, 
        attention_span, 
        motor_skills,
        additional_abilities
      FROM students 
      WHERE id = $1 AND is_active = true
    `, [studentId]);

    if (studentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = studentResult.rows[0];

    // Get activities that match student's ability levels
    const activitiesResult = await query(`
      SELECT 
        a.id,
        a.name,
        a.slug,
        a.description,
        a.order_number,
        a.required_reading_level,
        a.required_comprehension_level,
        a.required_attention_span,
        a.required_motor_skills
      FROM activities a
      WHERE a.is_active = true
        AND a.required_reading_level <= $1
        AND a.required_comprehension_level <= $2
        AND a.required_attention_span <= $3
        AND a.required_motor_skills <= $4
      ORDER BY a.order_number
    `, [
      student.reading_level,
      student.comprehension_level,
      student.attention_span,
      student.motor_skills
    ]);

    // For each accessible activity, get its scenes with progress
    const accessibleActivities = [];

    for (const activity of activitiesResult.rows) {
      // Get all scenes for this activity
      const scenesResult = await query(`
        SELECT 
          s.id,
          s.name,
          s.slug,
          s.description,
          s.order_number,
          sp.status,
          sp.completion_percentage,
          sp.last_accessed_at
        FROM scenes s
        LEFT JOIN student_progress sp ON sp.activity_id = s.activity_id 
          AND sp.scene_id = s.id 
          AND sp.student_id = $1
        WHERE s.activity_id = $2 AND s.is_active = true
        ORDER BY s.order_number
      `, [studentId, activity.id]);

      const scenes = scenesResult.rows.map(scene => ({
        id: scene.id,
        name: scene.name,
        slug: scene.slug,
        description: scene.description,
        order: scene.order_number,
        status: scene.status || 'not_started',
        completion_percentage: scene.completion_percentage || 0,
        last_accessed_at: scene.last_accessed_at,
        is_unlocked: true // For now, all scenes in accessible activities are unlocked
      }));

      // Calculate activity progress
      const totalScenes = scenes.length;
      const completedScenes = scenes.filter(s => s.status === 'completed').length;
      const inProgressScenes = scenes.filter(s => s.status === 'in_progress').length;

      accessibleActivities.push({
        id: activity.id,
        name: activity.name,
        slug: activity.slug,
        description: activity.description,
        order: activity.order_number,
        requirements: {
          reading_level: activity.required_reading_level,
          comprehension_level: activity.required_comprehension_level,
          attention_span: activity.required_attention_span,
          motor_skills: activity.required_motor_skills
        },
        progress: {
          total_scenes: totalScenes,
          completed_scenes: completedScenes,
          in_progress_scenes: inProgressScenes,
          completion_percentage: totalScenes > 0 ? Math.round((completedScenes / totalScenes) * 100) : 0
        },
        scenes
      });
    }

    // Find recommended next activity/scene
    let nextRecommendation = null;

    for (const activity of accessibleActivities) {
      // Find first incomplete scene in this activity
      const nextScene = activity.scenes.find(s => s.status !== 'completed');
      if (nextScene) {
        nextRecommendation = {
          activity_slug: activity.slug,
          scene_slug: nextScene.slug,
          activity_name: activity.name,
          scene_name: nextScene.name
        };
        break;
      }
    }

    // If all accessible content is completed, recommend first activity
    if (!nextRecommendation && accessibleActivities.length > 0) {
      const firstActivity = accessibleActivities[0];
      const firstScene = firstActivity.scenes[0];
      if (firstScene) {
        nextRecommendation = {
          activity_slug: firstActivity.slug,
          scene_slug: firstScene.slug,
          activity_name: firstActivity.name,
          scene_name: firstScene.name
        };
      }
    }

    return NextResponse.json({
      student: {
        name: student.name,
        abilities: {
          reading_level: student.reading_level,
          comprehension_level: student.comprehension_level,
          attention_span: student.attention_span,
          motor_skills: student.motor_skills,
          additional_abilities: student.additional_abilities
        }
      },
      accessible_activities: accessibleActivities,
      next_recommendation: nextRecommendation,
      total_accessible: accessibleActivities.length
    });

  } catch (error) {
    console.error('Error fetching accessible content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}