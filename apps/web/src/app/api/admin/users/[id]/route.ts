import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { canManageUser } from '@/lib/permissions';

// GET /api/admin/users/[id] - Get specific user details
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

    // Get user details
    const result = await query(`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.role,
        u.is_active,
        u.created_at,
        u.last_password_change,
        creator.name as created_by_name
      FROM users u
      LEFT JOIN users creator ON u.created_by = creator.id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Get additional role-specific information
    let additionalInfo = {};

    if (user.role === 'teacher') {
      // Get assigned admins and student count
      const teacherInfo = await query(`
        SELECT 
          (SELECT COUNT(*) FROM students WHERE teacher_id = $1 AND is_active = true) as student_count,
          ARRAY_AGG(admin_user.name) as assigned_admins
        FROM teacher_admin_assignments taa
        LEFT JOIN users admin_user ON taa.admin_id = admin_user.id
        WHERE taa.teacher_id = $1
        GROUP BY taa.teacher_id
      `, [userId]);

      additionalInfo = {
        student_count: parseInt(teacherInfo.rows[0]?.student_count || '0'),
        assigned_admins: teacherInfo.rows[0]?.assigned_admins || []
      };
    } else if (user.role === 'student') {
      // Get student profile if exists
      const studentInfo = await query(`
        SELECT 
          s.*,
          teacher.name as teacher_name
        FROM students s
        LEFT JOIN users teacher ON s.teacher_id = teacher.id
        WHERE s.user_id = $1
      `, [userId]);

      if (studentInfo.rows.length > 0) {
        additionalInfo = {
          student_profile: studentInfo.rows[0]
        };
      }
    } else if (user.role === 'admin') {
      // Get managed teachers count
      const adminInfo = await query(`
        SELECT COUNT(*) as managed_teachers
        FROM teacher_admin_assignments
        WHERE admin_id = $1
      `, [userId]);

      additionalInfo = {
        managed_teachers: parseInt(adminInfo.rows[0]?.managed_teachers || '0')
      };
    }

    return NextResponse.json({
      user: {
        ...user,
        ...additionalInfo
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id] - Update user information
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
    const { name, email, is_active, new_password } = body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }
    if (new_password) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(new_password, 12);
      updates.push(`password_hash = $${paramCount++}`);
      updates.push(`last_password_change = NOW()`);
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, role, is_active, last_password_change
    `;

    const result = await query(updateQuery, values);
    const updatedUser = result.rows[0];

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json({ 
        error: 'Email already exists' 
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Deactivate user
export async function DELETE(
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

    // Prevent self-deletion
    if (userId === parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Soft delete the user
    await query(`
      UPDATE users 
      SET is_active = false
      WHERE id = $1
    `, [userId]);

    // If it's a student, also deactivate their student profile
    await query(`
      UPDATE students 
      SET is_active = false
      WHERE user_id = $1
    `, [userId]);

    return NextResponse.json({
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}