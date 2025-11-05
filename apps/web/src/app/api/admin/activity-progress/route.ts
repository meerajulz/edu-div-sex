import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

// GET /api/admin/activity-progress - Get aggregated activity progress for all students
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const userRole = session.user.role;

    // Determine which students to include based on user role
    let studentIdsQuery: string;
    let studentIdsParams: number[];

    if (userRole === 'owner') {
      // Owner can see all students
      studentIdsQuery = `SELECT id FROM students WHERE is_active = true`;
      studentIdsParams = [];
    } else if (userRole === 'admin') {
      // Admin can see students from their assigned teachers
      studentIdsQuery = `
        SELECT DISTINCT s.id
        FROM students s
        INNER JOIN users teacher ON s.teacher_id = teacher.id
        INNER JOIN teacher_admin_assignments taa ON teacher.id = taa.teacher_id
        WHERE taa.admin_id = $1 AND s.is_active = true
      `;
      studentIdsParams = [userId];
    } else if (userRole === 'teacher') {
      // Teacher can see their own students
      studentIdsQuery = `
        SELECT id FROM students
        WHERE teacher_id = (SELECT id FROM users WHERE id = $1)
        AND is_active = true
      `;
      studentIdsParams = [userId];
    } else {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all student IDs that this user can manage
    const studentIdsResult = await query(studentIdsQuery, studentIdsParams);
    const studentIds = studentIdsResult.rows.map(row => row.id);

    if (studentIds.length === 0) {
      return NextResponse.json({
        activityProgress: [],
        totalStudents: 0
      });
    }

    // Get all activities
    const activitiesResult = await query(`
      SELECT id, name, slug, order_number
      FROM activities
      WHERE is_active = true
      ORDER BY order_number
    `);

    // For each activity, calculate how many students have completed it
    const activityProgress = await Promise.all(
      activitiesResult.rows.map(async (activity) => {
        // Get all scenes for this activity
        const scenesResult = await query(`
          SELECT id FROM scenes
          WHERE activity_id = $1 AND is_active = true
        `, [activity.id]);

        const sceneIds = scenesResult.rows.map(row => row.id);

        if (sceneIds.length === 0) {
          return {
            activityId: activity.id,
            activityName: activity.name,
            activitySlug: activity.slug,
            totalStudents: studentIds.length,
            completedStudents: 0,
            progressPercentage: 0
          };
        }

        // Count students who have completed ALL scenes in this activity
        const completedStudentsResult = await query(`
          SELECT COUNT(DISTINCT student_id) as completed_count
          FROM (
            SELECT student_id, COUNT(*) as completed_scenes
            FROM student_progress
            WHERE student_id = ANY($1::int[])
              AND activity_id = $2
              AND scene_id = ANY($3::int[])
              AND status = 'completed'
            GROUP BY student_id
            HAVING COUNT(*) = $4
          ) as completed_students
        `, [studentIds, activity.id, sceneIds, sceneIds.length]);

        const completedCount = parseInt(completedStudentsResult.rows[0]?.completed_count || '0');
        const progressPercentage = studentIds.length > 0
          ? Math.round((completedCount / studentIds.length) * 100)
          : 0;

        return {
          activityId: activity.id,
          activityName: activity.name,
          activitySlug: activity.slug,
          totalStudents: studentIds.length,
          completedStudents: completedCount,
          progressPercentage
        };
      })
    );

    return NextResponse.json({
      activityProgress,
      totalStudents: studentIds.length
    });

  } catch (error) {
    console.error('Error fetching activity progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
