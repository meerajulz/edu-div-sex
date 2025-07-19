import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { getUserRole, checkPermission } from '@/lib/permissions';

// GET /api/activities - Get all activities with their scenes
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions - owners, admins, and teachers can view activities
    const userRole = await getUserRole(session.user.id);
    if (!userRole || !await checkPermission(session.user.id, 'canManageStudents')) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    // Get all activities with scene counts
    const activitiesResult = await query(`
      SELECT 
        a.id,
        a.name,
        a.slug,
        a.description,
        a.required_reading_level,
        a.required_comprehension_level,
        a.required_attention_span,
        a.required_motor_skills,
        a.order_number,
        a.is_active,
        a.created_at,
        COUNT(s.id) as total_scenes,
        COUNT(CASE WHEN s.is_active = true THEN 1 END) as active_scenes
      FROM activities a
      LEFT JOIN scenes s ON s.activity_id = a.id
      WHERE a.is_active = true
      GROUP BY a.id
      ORDER BY a.order_number
    `);

    const activities = [];

    // For each activity, get detailed scene information
    for (const activity of activitiesResult.rows) {
      const scenesResult = await query(`
        SELECT 
          id,
          name,
          slug,
          description,
          order_number,
          is_active,
          created_at
        FROM scenes 
        WHERE activity_id = $1 
        ORDER BY order_number
      `, [activity.id]);

      activities.push({
        id: activity.id,
        name: activity.name,
        slug: activity.slug,
        description: activity.description,
        requirements: {
          reading_level: activity.required_reading_level,
          comprehension_level: activity.required_comprehension_level,
          attention_span: activity.required_attention_span,
          motor_skills: activity.required_motor_skills
        },
        order: activity.order_number,
        is_active: activity.is_active,
        created_at: activity.created_at,
        scenes: scenesResult.rows.map(scene => ({
          id: scene.id,
          name: scene.name,
          slug: scene.slug,
          description: scene.description,
          order: scene.order_number,
          is_active: scene.is_active,
          created_at: scene.created_at
        })),
        stats: {
          total_scenes: parseInt(activity.total_scenes),
          active_scenes: parseInt(activity.active_scenes)
        }
      });
    }

    return NextResponse.json({
      activities,
      total: activities.length
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}