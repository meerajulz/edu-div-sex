import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

interface ActivityAttempts {
  activityId: number;
  activityName: string;
  activitySlug: string;
  totalAttempts: number;
  completedScenes: number;
  totalScenes: number;
}

interface StudentWithProgress {
  id: number;
  name: string;
  age: number;
  supervision_level: number;
  is_active: boolean;
  user_id: number;
  completedScenes: number;
  totalScenes: number;
  progressPercentage: number;
  lastActivityDate: string | null;
  averageAttempts: number;
  attemptsByActivity: ActivityAttempts[];
}

interface TeacherWithStudents {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  students: StudentWithProgress[];
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  supervisionLevelDistribution: {
    nivel1: number;
    nivel2: number;
    nivel3: number;
  };
}

interface CenterReport {
  adminId: number;
  adminName: string;
  adminEmail: string;
  isActive: boolean;
  teachers: TeacherWithStudents[];
  totalTeachers: number;
  activeTeachers: number;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  supervisionLevelDistribution: {
    nivel1: number;
    nivel2: number;
    nivel3: number;
  };
}

// GET /api/owner/reports-by-center - Get comprehensive reports grouped by center (admin)
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is owner
    if (session.user.role !== 'owner') {
      return NextResponse.json({ error: 'Access denied. Owner role required.' }, { status: 403 });
    }

    // Get total number of scenes for progress calculation
    const totalScenesResult = await query(`
      SELECT COUNT(*) as total_scenes
      FROM scenes
      WHERE is_active = true
    `);
    const totalScenes = parseInt(totalScenesResult.rows[0]?.total_scenes || '0');

    // Get all admins (centers)
    const adminsResult = await query(`
      SELECT id, email, first_name, last_name, is_active
      FROM users
      WHERE role = 'admin'
      ORDER BY first_name, last_name, email
    `);

    const centersReports: CenterReport[] = await Promise.all(
      adminsResult.rows.map(async (admin) => {
        const adminName = admin.first_name && admin.last_name
          ? `${admin.first_name} ${admin.last_name}`
          : admin.email;

        // Get teachers assigned to this admin
        const teachersResult = await query(`
          SELECT DISTINCT u.id, u.email, u.first_name, u.last_name, u.is_active
          FROM users u
          INNER JOIN teacher_admin_assignments taa ON u.id = taa.teacher_id
          WHERE taa.admin_id = $1 AND u.role = 'teacher'
          ORDER BY u.first_name, u.last_name, u.email
        `, [admin.id]);

        const teachers: TeacherWithStudents[] = await Promise.all(
          teachersResult.rows.map(async (teacher) => {
            const teacherName = teacher.first_name && teacher.last_name
              ? `${teacher.first_name} ${teacher.last_name}`
              : teacher.email;

            // Get students for this teacher
            const studentsResult = await query(`
              SELECT
                s.id,
                s.name,
                s.age,
                s.supervision_level,
                s.is_active,
                s.user_id
              FROM students s
              WHERE s.teacher_id = $1
              ORDER BY s.name
            `, [teacher.id]);

            // For each student, get their progress
            const students: StudentWithProgress[] = await Promise.all(
              studentsResult.rows.map(async (student) => {
                // Get overall progress statistics
                const progressResult = await query(`
                  SELECT
                    COUNT(*) FILTER (WHERE status = 'completed') as completed_scenes,
                    MAX(last_accessed_at) as last_activity_date,
                    COALESCE(AVG(attempts), 0) as average_attempts
                  FROM student_progress
                  WHERE student_id = $1
                `, [student.id]);

                const completedScenes = parseInt(progressResult.rows[0]?.completed_scenes || '0');
                const lastActivityDate = progressResult.rows[0]?.last_activity_date || null;
                const averageAttempts = parseFloat(progressResult.rows[0]?.average_attempts || '0');

                const progressPercentage = totalScenes > 0
                  ? Math.round((completedScenes / totalScenes) * 100)
                  : 0;

                // Get attempts by activity
                const attemptsByActivityResult = await query(`
                  SELECT
                    a.id as activity_id,
                    a.name as activity_name,
                    a.slug as activity_slug,
                    COALESCE(SUM(sp.attempts), 0) as total_attempts,
                    COUNT(*) FILTER (WHERE sp.status = 'completed') as completed_scenes,
                    COUNT(s.id) as total_scenes
                  FROM activities a
                  LEFT JOIN scenes s ON s.activity_id = a.id AND s.is_active = true
                  LEFT JOIN student_progress sp ON sp.activity_id = a.id AND sp.scene_id = s.id AND sp.student_id = $1
                  WHERE a.is_active = true
                  GROUP BY a.id, a.name, a.slug, a.order_number
                  ORDER BY a.order_number
                `, [student.id]);

                const attemptsByActivity: ActivityAttempts[] = attemptsByActivityResult.rows.map(row => ({
                  activityId: row.activity_id,
                  activityName: row.activity_name,
                  activitySlug: row.activity_slug,
                  totalAttempts: parseInt(row.total_attempts || '0'),
                  completedScenes: parseInt(row.completed_scenes || '0'),
                  totalScenes: parseInt(row.total_scenes || '0')
                }));

                return {
                  id: student.id,
                  name: student.name,
                  age: student.age,
                  supervision_level: student.supervision_level || 1,
                  is_active: student.is_active,
                  user_id: student.user_id,
                  completedScenes,
                  totalScenes,
                  progressPercentage,
                  lastActivityDate,
                  averageAttempts: Math.round(averageAttempts * 10) / 10, // Round to 1 decimal
                  attemptsByActivity
                };
              })
            );

            // Calculate teacher statistics
            const activeStudents = students.filter(s => s.is_active).length;
            const averageProgress = students.length > 0
              ? Math.round(students.reduce((sum, s) => sum + s.progressPercentage, 0) / students.length)
              : 0;

            // Calculate supervision level distribution
            const supervisionLevelDistribution = {
              nivel1: students.filter(s => s.supervision_level === 1).length,
              nivel2: students.filter(s => s.supervision_level === 2).length,
              nivel3: students.filter(s => s.supervision_level === 3).length
            };

            return {
              id: teacher.id,
              name: teacherName,
              email: teacher.email,
              is_active: teacher.is_active,
              students,
              totalStudents: students.length,
              activeStudents,
              averageProgress,
              supervisionLevelDistribution
            };
          })
        );

        // Calculate center statistics
        const totalStudents = teachers.reduce((sum, t) => sum + t.totalStudents, 0);
        const activeStudents = teachers.reduce((sum, t) => sum + t.activeStudents, 0);
        const activeTeachers = teachers.filter(t => t.is_active).length;

        const averageProgress = teachers.length > 0 && totalStudents > 0
          ? Math.round(
              teachers.reduce((sum, t) => sum + (t.averageProgress * t.totalStudents), 0) / totalStudents
            )
          : 0;

        // Aggregate supervision levels across all students in center
        const supervisionLevelDistribution = {
          nivel1: teachers.reduce((sum, t) => sum + t.supervisionLevelDistribution.nivel1, 0),
          nivel2: teachers.reduce((sum, t) => sum + t.supervisionLevelDistribution.nivel2, 0),
          nivel3: teachers.reduce((sum, t) => sum + t.supervisionLevelDistribution.nivel3, 0)
        };

        return {
          adminId: admin.id,
          adminName,
          adminEmail: admin.email,
          isActive: admin.is_active,
          teachers,
          totalTeachers: teachers.length,
          activeTeachers,
          totalStudents,
          activeStudents,
          averageProgress,
          supervisionLevelDistribution
        };
      })
    );

    // Calculate overall statistics
    const overallStats = {
      totalCenters: centersReports.length,
      activeCenters: centersReports.filter(c => c.isActive).length,
      totalTeachers: centersReports.reduce((sum, c) => sum + c.totalTeachers, 0),
      activeTeachers: centersReports.reduce((sum, c) => sum + c.activeTeachers, 0),
      totalStudents: centersReports.reduce((sum, c) => sum + c.totalStudents, 0),
      activeStudents: centersReports.reduce((sum, c) => sum + c.activeStudents, 0),
      averageProgress: centersReports.length > 0
        ? Math.round(centersReports.reduce((sum, c) => sum + c.averageProgress, 0) / centersReports.length)
        : 0,
      supervisionLevelDistribution: {
        nivel1: centersReports.reduce((sum, c) => sum + c.supervisionLevelDistribution.nivel1, 0),
        nivel2: centersReports.reduce((sum, c) => sum + c.supervisionLevelDistribution.nivel2, 0),
        nivel3: centersReports.reduce((sum, c) => sum + c.supervisionLevelDistribution.nivel3, 0)
      }
    };

    return NextResponse.json({
      centers: centersReports,
      overallStats
    });

  } catch (error) {
    console.error('Error fetching owner reports by center:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
