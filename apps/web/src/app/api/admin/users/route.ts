import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { getUserRole } from '@/lib/permissions';

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
      // Owner can see all users (excluding deleted ones)
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
        WHERE u.deleted_at IS NULL
        ${roleFilter ? 'AND u.role = $1' : ''}
        ORDER BY u.created_at DESC
      `;
      if (roleFilter) queryParams = [roleFilter];
    } else if (userRole === 'admin') {
      // Admin can see teachers they manage and their students (excluding deleted ones)
      usersQuery = `
        SELECT DISTINCT
          u.id,
          u.email,
          u.name,
          u.role,
          u.is_active,
          u.created_at,
          u.last_password_change,
          u.first_name,
          u.last_name,
          u.username,
          u.sex,
          creator.name as created_by_name,
          CASE
            WHEN u.role = 'teacher' THEN (
              SELECT COUNT(*) FROM students
              WHERE teacher_id = u.id::integer AND is_active = true
            )
            ELSE 0
          END as student_count,
          CASE
            WHEN u.role = 'student' THEN (
              SELECT t.name FROM students s
              JOIN users t ON s.teacher_id = t.id
              WHERE s.user_id = u.id
              LIMIT 1
            )
            ELSE NULL
          END as teacher_name,
          CASE
            WHEN u.role = 'student' THEN (
              SELECT s.reading_level FROM students s WHERE s.user_id = u.id LIMIT 1
            )
            ELSE NULL
          END as reading_level,
          CASE
            WHEN u.role = 'student' THEN (
              SELECT s.comprehension_level FROM students s WHERE s.user_id = u.id LIMIT 1
            )
            ELSE NULL
          END as comprehension_level,
          CASE
            WHEN u.role = 'student' THEN (
              SELECT s.attention_span FROM students s WHERE s.user_id = u.id LIMIT 1
            )
            ELSE NULL
          END as attention_span,
          CASE
            WHEN u.role = 'student' THEN (
              SELECT s.motor_skills FROM students s WHERE s.user_id = u.id LIMIT 1
            )
            ELSE NULL
          END as motor_skills,
          CASE
            WHEN u.role = 'student' THEN (
              SELECT s.age FROM students s WHERE s.user_id = u.id LIMIT 1
            )
            ELSE NULL
          END as age,
          CASE
            WHEN u.role = 'student' THEN (
              SELECT s.id FROM students s WHERE s.user_id = u.id LIMIT 1
            )
            ELSE NULL
          END as student_profile_id
        FROM users u
        LEFT JOIN users creator ON u.created_by = creator.id
        WHERE u.deleted_at IS NULL AND (
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

    // Only owners and admins can create users
    if (!userRole || (userRole !== 'owner' && userRole !== 'admin')) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role, username, evaluation, sex, age, teacher_id } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({
        error: 'email, password, name, and role are required'
      }, { status: 400 });
    }

    // Validate username for students
    if (role === 'student' && !username) {
      return NextResponse.json({
        error: 'username is required for student accounts'
      }, { status: 400 });
    }

    // Split name for username generation
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName;

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
      // Check if email is already in use by an active (non-deleted) user
      const existingEmail = await query(
        'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
        [email]
      );
      if (existingEmail.rows.length > 0) {
        return NextResponse.json({
          error: 'Email already exists'
        }, { status: 400 });
      }

      // Determine username based on role
      let finalUsername = null;
      if (role === 'student') {
        // For students, use the provided username
        finalUsername = username;

        // Check if username already exists (excluding deleted users)
        const existingUsername = await query(
          'SELECT id FROM users WHERE username = $1 AND deleted_at IS NULL',
          [username]
        );
        if (existingUsername.rows.length > 0) {
          return NextResponse.json({
            error: 'Username already exists'
          }, { status: 400 });
        }
      }

      // Create user
      const result = await query(`
        INSERT INTO users (email, password_hash, name, role, created_by, is_active, username, first_name, last_name, sex)
        VALUES ($1, $2, $3, $4, $5, true, $6, $7, $8, $9)
        RETURNING id, email, name, role, username, created_at
      `, [email, hashedPassword, name, role, session.user.id, finalUsername, firstName, lastName, sex || null]);

      const newUser = result.rows[0];

      // If creating a teacher and current user is admin, assign the relationship
      if (role === 'teacher' && userRole === 'admin') {
        await query(`
          INSERT INTO teacher_admin_assignments (teacher_id, admin_id)
          VALUES ($1, $2)
        `, [newUser.id, session.user.id]);
      }

      // If creating a student, create student profile
      if (role === 'student') {
        let studentParams;
        let studentQuery;

        if (evaluation) {
          // Use evaluation data if provided
          const { reading_level = 1, comprehension_level = 1, attention_span = 1, motor_skills = 1, supervision_level = 1, notes = '', evaluation_responses = [], evaluation_date = new Date().toISOString() } = evaluation;

          studentQuery = `
            INSERT INTO students (name, user_id, reading_level, comprehension_level, attention_span, motor_skills, supervision_level, is_active, notes, additional_abilities, teacher_id, age)
            VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, $9, $10, $11)
          `;
          studentParams = [
            name,
            newUser.id,
            reading_level,
            comprehension_level,
            attention_span,
            motor_skills,
            supervision_level,
            notes,
            JSON.stringify({ evaluation_responses, evaluation_date }),
            teacher_id || null,
            age || null
          ];
        } else {
          // Default values if no evaluation
          studentQuery = `
            INSERT INTO students (name, user_id, reading_level, comprehension_level, attention_span, motor_skills, supervision_level, is_active, teacher_id, age)
            VALUES ($1, $2, 1, 1, 1, 1, 1, true, $3, $4)
          `;
          studentParams = [name, newUser.id, teacher_id || null, age || null];
        }

        await query(studentQuery, studentParams);
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