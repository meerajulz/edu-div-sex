import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { getUserRole } from '@/lib/permissions';

// GET /api/admin/teacher-assignments - Get teacher-admin assignments
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.id);
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');

    // Teachers can only query their own assignments
    if (userRole === 'teacher') {
      if (teacherId && teacherId !== session.user.id) {
        return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
      }

      // Return admins assigned to this teacher
      const adminsQuery = `
        SELECT
          admin.id,
          admin.name,
          admin.email
        FROM teacher_admin_assignments taa
        JOIN users admin ON taa.admin_id = admin.id
        WHERE taa.teacher_id = $1 AND admin.is_active = true
        ORDER BY admin.name
      `;
      const admins = await query(adminsQuery, [session.user.id]);

      return NextResponse.json({
        admins: admins.rows,
        total: admins.rows.length
      });
    }

    // Only owners and admins can view full assignments
    if (userRole !== 'owner' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    let assignmentsQuery = '';
    let queryParams: unknown[] = [];

    if (userRole === 'owner') {
      // Owner can see all assignments
      assignmentsQuery = `
        SELECT 
          taa.id,
          taa.teacher_id,
          taa.admin_id,
          taa.created_at,
          teacher.name as teacher_name,
          teacher.email as teacher_email,
          admin.name as admin_name,
          admin.email as admin_email,
          (SELECT COUNT(*) FROM students WHERE teacher_id = taa.teacher_id AND is_active = true) as student_count
        FROM teacher_admin_assignments taa
        JOIN users teacher ON taa.teacher_id = teacher.id
        JOIN users admin ON taa.admin_id = admin.id
        WHERE teacher.is_active = true AND admin.is_active = true
        ORDER BY admin.name, teacher.name
      `;
    } else if (userRole === 'admin') {
      // Admin can only see their own assignments
      assignmentsQuery = `
        SELECT 
          taa.id,
          taa.teacher_id,
          taa.admin_id,
          taa.created_at,
          teacher.name as teacher_name,
          teacher.email as teacher_email,
          admin.name as admin_name,
          admin.email as admin_email,
          (SELECT COUNT(*) FROM students WHERE teacher_id = taa.teacher_id AND is_active = true) as student_count
        FROM teacher_admin_assignments taa
        JOIN users teacher ON taa.teacher_id = teacher.id
        JOIN users admin ON taa.admin_id = admin.id
        WHERE taa.admin_id = $1 AND teacher.is_active = true AND admin.is_active = true
        ORDER BY teacher.name
      `;
      queryParams = [session.user.id];
    }

    const assignments = await query(assignmentsQuery, queryParams);

    return NextResponse.json({
      assignments: assignments.rows,
      total: assignments.rows.length
    });

  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/teacher-assignments - Assign teacher to admin
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.id);
    
    // Only owners and admins can create assignments
    if (userRole !== 'owner' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const body = await request.json();
    const { teacher_id, admin_id } = body;

    if (!teacher_id || !admin_id) {
      return NextResponse.json({ 
        error: 'teacher_id and admin_id are required' 
      }, { status: 400 });
    }

    // Validate that teacher and admin exist and have correct roles
    const userValidation = await query(`
      SELECT 
        teacher.id as teacher_id,
        teacher.role as teacher_role,
        admin.id as admin_id,
        admin.role as admin_role
      FROM users teacher
      CROSS JOIN users admin
      WHERE teacher.id = $1 AND admin.id = $2
    `, [teacher_id, admin_id]);

    if (userValidation.rows.length === 0) {
      return NextResponse.json({ error: 'Teacher or admin not found' }, { status: 404 });
    }

    const validation = userValidation.rows[0];
    if (validation.teacher_role !== 'teacher') {
      return NextResponse.json({ error: 'User is not a teacher' }, { status: 400 });
    }
    if (validation.admin_role !== 'admin') {
      return NextResponse.json({ error: 'User is not an admin' }, { status: 400 });
    }

    // If current user is admin, they can only assign teachers to themselves
    if (userRole === 'admin' && parseInt(admin_id) !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Admins can only assign teachers to themselves' }, { status: 403 });
    }

    try {
      // Create assignment
      const result = await query(`
        INSERT INTO teacher_admin_assignments (teacher_id, admin_id)
        VALUES ($1, $2)
        RETURNING *
      `, [teacher_id, admin_id]);

      // Get detailed assignment info
      const assignmentInfo = await query(`
        SELECT 
          taa.id,
          taa.teacher_id,
          taa.admin_id,
          taa.created_at,
          teacher.name as teacher_name,
          teacher.email as teacher_email,
          admin.name as admin_name,
          admin.email as admin_email
        FROM teacher_admin_assignments taa
        JOIN users teacher ON taa.teacher_id = teacher.id
        JOIN users admin ON taa.admin_id = admin.id
        WHERE taa.id = $1
      `, [result.rows[0].id]);

      return NextResponse.json({
        message: 'Teacher assigned successfully',
        assignment: assignmentInfo.rows[0]
      }, { status: 201 });

    } catch (assignmentError: unknown) {
      if ((assignmentError as { code?: string }).code === '23505') {
        return NextResponse.json({ 
          error: 'Teacher is already assigned to this admin' 
        }, { status: 400 });
      }
      throw assignmentError;
    }

  } catch (error) {
    console.error('Error creating teacher assignment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}