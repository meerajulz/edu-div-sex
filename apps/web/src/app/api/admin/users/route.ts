import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { getUserRole, checkPermission } from '@/lib/permissions';

// GET /api/admin/users - Get all users (admins and owners only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.id);
    
    // Only owners and admins can view user lists
    if (userRole !== 'owner' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');

    let usersQuery = '';
    let queryParams: unknown[] = [];

    if (userRole === 'owner') {
      // Owner can see all users
      usersQuery = `
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
        ${roleFilter ? 'WHERE u.role = $1' : ''}
        ORDER BY u.created_at DESC
      `;
      if (roleFilter) queryParams = [roleFilter];
    } else if (userRole === 'admin') {
      // Admin can see teachers they manage and their students
      usersQuery = `
        SELECT DISTINCT
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
        WHERE (
          -- Teachers assigned to this admin
          (u.role = 'teacher' AND EXISTS (
            SELECT 1 FROM teacher_admin_assignments 
            WHERE teacher_id = u.id AND admin_id = $1
          ))
          OR
          -- Students of teachers assigned to this admin
          (u.role = 'student' AND EXISTS (
            SELECT 1 FROM students s 
            JOIN teacher_admin_assignments taa ON s.teacher_id = taa.teacher_id
            WHERE s.user_id = u.id AND taa.admin_id = $1
          ))
          OR
          -- The admin themselves
          u.id = $1
        )
        ${roleFilter ? `AND u.role = $${queryParams.length + 2}` : ''}
        ORDER BY u.created_at DESC
      `;
      queryParams = [session.user.id];
      if (roleFilter) queryParams.push(roleFilter);
    }

    const users = await query(usersQuery, queryParams);

    return NextResponse.json({
      users: users.rows,
      total: users.rows.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/users - Create a new user (owners and admins only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.id);
    
    if (!userRole || !await checkPermission(session.user.id, 'canManageUsers')) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({ 
        error: 'email, password, name, and role are required' 
      }, { status: 400 });
    }

    // Validate role permissions
    const validRoles = ['admin', 'teacher', 'student'];
    if (userRole === 'admin') {
      // Admins can only create teachers and students
      if (!['teacher', 'student'].includes(role)) {
        return NextResponse.json({ 
          error: 'Admins can only create teacher and student accounts' 
        }, { status: 403 });
      }
    } else if (userRole === 'owner') {
      // Owners can create any role
      validRoles.push('owner');
    }

    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      }, { status: 400 });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      // Create user
      const result = await query(`
        INSERT INTO users (email, password_hash, name, role, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, name, role, created_at
      `, [email, hashedPassword, name, role, session.user.id]);

      const newUser = result.rows[0];

      // If creating a teacher and current user is admin, assign the relationship
      if (role === 'teacher' && userRole === 'admin') {
        await query(`
          INSERT INTO teacher_admin_assignments (teacher_id, admin_id)
          VALUES ($1, $2)
        `, [newUser.id, session.user.id]);
      }

      return NextResponse.json({
        message: 'User created successfully',
        user: newUser
      }, { status: 201 });

    } catch (userError: unknown) {
      if ((userError as { code?: string }).code === '23505') {
        return NextResponse.json({ 
          error: 'Email already exists' 
        }, { status: 400 });
      }
      throw userError;
    }

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}