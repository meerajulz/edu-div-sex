import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { getUserRole, checkPermission } from '@/lib/permissions';
import { generateSimplePassword, generateUsername } from '@/lib/passwordGenerator';

// GET /api/students - Get all students for a teacher
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions based on role
    const userRole = await getUserRole(session.user.id);
    if (!userRole) {
      return NextResponse.json({ error: 'Invalid user role.' }, { status: 403 });
    }

    let studentsQuery = '';
    let queryParams: unknown[] = [];

    if (userRole === 'student') {
      // Students can only see their own student record
      studentsQuery = `
        SELECT 
          s.*,
          u.email as login_email,
          teacher.name as teacher_name,
          COUNT(sp.id) as total_progress_entries,
          COUNT(CASE WHEN sp.status = 'completed' THEN 1 END) as completed_scenes
        FROM students s
        LEFT JOIN users u ON s.user_id = u.id
        LEFT JOIN users teacher ON s.teacher_id = teacher.id
        LEFT JOIN student_progress sp ON s.id = sp.student_id
        WHERE s.user_id = $1 AND s.is_active = true
        GROUP BY s.id, u.email, teacher.name
        ORDER BY s.created_at DESC
      `;
      queryParams = [session.user.id];
    } else if (!await checkPermission(session.user.id, 'canManageStudents')) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    } else if (userRole === 'owner') {
      // Owner can see all students
      studentsQuery = `
        SELECT 
          s.*,
          u.email as login_email,
          teacher.name as teacher_name,
          COUNT(sp.id) as total_progress_entries,
          COUNT(CASE WHEN sp.status = 'completed' THEN 1 END) as completed_scenes
        FROM students s
        LEFT JOIN users u ON s.user_id = u.id
        LEFT JOIN users teacher ON s.teacher_id = teacher.id
        LEFT JOIN student_progress sp ON s.id = sp.student_id
        WHERE s.is_active = true
        GROUP BY s.id, u.email, teacher.name
        ORDER BY s.created_at DESC
      `;
    } else if (userRole === 'admin') {
      // Admin can see students from their assigned teachers
      studentsQuery = `
        SELECT 
          s.*,
          u.email as login_email,
          teacher.name as teacher_name,
          COUNT(sp.id) as total_progress_entries,
          COUNT(CASE WHEN sp.status = 'completed' THEN 1 END) as completed_scenes
        FROM students s
        LEFT JOIN users u ON s.user_id = u.id
        LEFT JOIN users teacher ON s.teacher_id = teacher.id
        LEFT JOIN student_progress sp ON s.id = sp.student_id
        JOIN teacher_admin_assignments taa ON s.teacher_id = taa.teacher_id
        WHERE s.is_active = true AND taa.admin_id = $1
        GROUP BY s.id, u.email, teacher.name
        ORDER BY s.created_at DESC
      `;
      queryParams = [session.user.id];
    } else if (userRole === 'teacher') {
      // Teacher can only see their own students
      studentsQuery = `
        SELECT 
          s.*,
          u.email as login_email,
          COUNT(sp.id) as total_progress_entries,
          COUNT(CASE WHEN sp.status = 'completed' THEN 1 END) as completed_scenes
        FROM students s
        LEFT JOIN users u ON s.user_id = u.id
        LEFT JOIN student_progress sp ON s.id = sp.student_id
        WHERE s.teacher_id = $1 AND s.is_active = true
        GROUP BY s.id, u.email
        ORDER BY s.created_at DESC
      `;
      queryParams = [session.user.id];
    } else {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const students = await query(studentsQuery, queryParams);

    return NextResponse.json({
      students: students.rows,
      total: students.rows.length
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions - only teachers, admins, and owners can create students
    const userRole = await getUserRole(session.user.id);
    if (!userRole || !await checkPermission(session.user.id, 'canManageStudents')) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      // Student profile fields
      first_name,
      last_name,
      age,
      sex,
      reading_level = 1,
      comprehension_level = 1,
      attention_span = 1,
      motor_skills = 1,
      additional_abilities = {},
      notes = '',
      
      // Login creation fields
      create_login = false,
      email,
      username: custom_username, // Optional: custom username instead of auto-generated
      use_generated_password = true,
      custom_password, // Optional: teacher can set custom simple password
      
      // Admin/owner can specify teacher
      teacher_id
    } = body;

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    if (sex && !['male', 'female'].includes(sex)) {
      return NextResponse.json({ error: 'Sex must be either "male" or "female"' }, { status: 400 });
    }

    // Generate full name for student profile
    const name = `${first_name} ${last_name}`;

    // Validate ability levels (1-5)
    const abilities = { reading_level, comprehension_level, attention_span, motor_skills };
    for (const [key, value] of Object.entries(abilities)) {
      if (value < 1 || value > 5) {
        return NextResponse.json({ 
          error: `${key} must be between 1 and 5` 
        }, { status: 400 });
      }
    }

    // Determine the appropriate teacher_id based on user role
    let assignedTeacherId = null;
    
    if (userRole === 'teacher') {
      // Teachers can only assign students to themselves
      assignedTeacherId = parseInt(session.user.id);
    } else if (userRole === 'admin' || userRole === 'owner') {
      // Admins and owners can specify teacher_id
      if (!teacher_id) {
        return NextResponse.json({ error: 'teacher_id is required for admin/owner roles' }, { status: 400 });
      }
      
      // Validate that the admin can manage this teacher (if admin)
      if (userRole === 'admin') {
        const canManage = await query(`
          SELECT 1 FROM teacher_admin_assignments 
          WHERE teacher_id = $1 AND admin_id = $2
        `, [teacher_id, session.user.id]);
        
        if (canManage.rows.length === 0) {
          return NextResponse.json({ error: 'Cannot assign student to this teacher' }, { status: 403 });
        }
      }
      
      assignedTeacherId = teacher_id;
    }

    let user_id = null;
    let generatedPassword = null;
    let username = null;

    // If creating login credentials for student
    if (create_login) {
      if (custom_username) {
        // Use provided custom username
        username = custom_username;
        
        // Check if username already exists
        const existingUsername = await query('SELECT id FROM users WHERE username = $1', [custom_username]);
        if (existingUsername.rows.length > 0) {
          return NextResponse.json({ 
            error: 'El nombre de usuario ya existe' 
          }, { status: 400 });
        }
      } else {
        // Generate username from first and last name
        const existingUsernames = await query('SELECT username FROM users WHERE username IS NOT NULL');
        const usernameList = existingUsernames.rows.map(row => row.username);
        username = generateUsername(first_name, last_name, usernameList);
      }

      // Handle password
      let passwordToUse = custom_password;
      if (use_generated_password || !custom_password) {
        const generated = generateSimplePassword();
        generatedPassword = generated;
        passwordToUse = generated.password;
      }

      // Custom passwords are accepted as-is, no validation required

      // Generate email if not provided
      const emailToUse = email || `${username}@student.local`;

      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(passwordToUse, 12);
      
      try {
        const userResult = await query(`
          INSERT INTO users (email, password_hash, name, role, created_by, username, first_name, last_name, sex)
          VALUES ($1, $2, $3, 'student', $4, $5, $6, $7, $8)
          RETURNING id
        `, [emailToUse, hashedPassword, name, session.user.id, username, first_name, last_name, sex]);
        
        user_id = userResult.rows[0].id;
      } catch (userError: unknown) {
        if ((userError as { code?: string }).code === '23505') { // Unique constraint violation
          return NextResponse.json({ 
            error: 'Email or username already exists' 
          }, { status: 400 });
        }
        throw userError;
      }
    }

    // Create student record
    const result = await query(`
      INSERT INTO students (
        name, age, reading_level, comprehension_level, 
        attention_span, motor_skills, additional_abilities, 
        notes, teacher_id, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      name, age, reading_level, comprehension_level,
      attention_span, motor_skills, JSON.stringify(additional_abilities),
      notes, assignedTeacherId, user_id
    ]);

    const newStudent = result.rows[0];

    interface StudentCreationResponse {
      message: string;
      student: typeof newStudent & { has_login: boolean };
      login_credentials?: {
        username: string | null;
        email: string;
        generated_password?: string;
        password_words?: string[];
        password_strength?: string;
      };
    }

    const response: StudentCreationResponse = {
      message: 'Student created successfully',
      student: {
        ...newStudent,
        has_login: !!user_id
      }
    };

    // Include login credentials if created
    if (user_id) {
      response.login_credentials = {
        username,
        email: email || `${username}@student.local`,
        ...(generatedPassword && {
          generated_password: generatedPassword.password,
          password_words: generatedPassword.words,
          password_strength: generatedPassword.strength
        })
      };
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}