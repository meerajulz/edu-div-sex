import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { canManageStudent } from '@/lib/permissions';

// GET /api/students/[id] - Get specific student details
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

    // Get student with progress summary
    const result = await query(`
      SELECT 
        s.*,
        u.email,
        u.username,
        u.first_name,
        u.last_name,
        u.sex,
        u.role as user_role,
        teacher.name as teacher_name,
        COUNT(sp.id) as total_scenes_accessed,
        COUNT(CASE WHEN sp.status = 'completed' THEN 1 END) as scenes_completed,
        COUNT(CASE WHEN sp.status = 'in_progress' THEN 1 END) as scenes_in_progress,
        MAX(sp.last_accessed_at) as last_activity
      FROM students s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN users teacher ON s.teacher_id = teacher.id
      LEFT JOIN student_progress sp ON s.id = sp.student_id
      WHERE s.id = $1 AND s.is_active = true
      GROUP BY s.id, u.email, u.username, u.first_name, u.last_name, u.sex, u.role, teacher.name
    `, [studentId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = result.rows[0];

    // Check if current user can manage this student
    const canManage = await canManageStudent(session.user.id, studentId);
    if (!canManage) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ student });

  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/students/[id] - Update student information (teachers only)
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
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Check if current user can manage this student
    const canManage = await canManageStudent(session.user.id, studentId);
    if (!canManage) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      age,
      reading_level,
      comprehension_level,
      attention_span,
      motor_skills,
      additional_abilities,
      notes
    } = body;

    // Validate ability levels if provided
    const abilities = { reading_level, comprehension_level, attention_span, motor_skills };
    for (const [key, value] of Object.entries(abilities)) {
      if (value !== undefined && (value < 1 || value > 5)) {
        return NextResponse.json({
          error: `${key} must be between 1 and 5`
        }, { status: 400 });
      }
    }

    // Calculate supervision_level if any ability fields are being updated
    let supervision_level;
    if (reading_level !== undefined || comprehension_level !== undefined ||
        attention_span !== undefined || motor_skills !== undefined) {

      // Get current student data to fill in missing fields
      const currentStudent = await query('SELECT * FROM students WHERE id = $1', [studentId]);
      if (currentStudent.rows.length === 0) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const current = currentStudent.rows[0];
      const finalReadingLevel = reading_level ?? current.reading_level;
      const finalComprehensionLevel = comprehension_level ?? current.comprehension_level;
      const finalAttentionSpan = attention_span ?? current.attention_span;
      const finalMotorSkills = motor_skills ?? current.motor_skills;

      // Calculate average of all 4 abilities (1-5 scale)
      const avgAbility = (finalReadingLevel + finalComprehensionLevel + finalAttentionSpan + finalMotorSkills) / 4;
      const percentage = (avgAbility - 1) / 4; // Normalize to 0-1 scale

      // Convert to supervision level (1-3 scale)
      // Higher abilities = Higher supervision level (more independent)
      if (percentage >= 0.67) {
        supervision_level = 3; // Independent (abilities 3.68-5)
      } else if (percentage >= 0.34) {
        supervision_level = 2; // Needs 50% supervision (abilities 2.36-3.67)
      } else {
        supervision_level = 1; // Needs 100% supervision (abilities 1-2.35)
      }
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (age !== undefined) {
      updates.push(`age = $${paramCount++}`);
      values.push(age);
    }
    if (reading_level !== undefined) {
      updates.push(`reading_level = $${paramCount++}`);
      values.push(reading_level);
    }
    if (comprehension_level !== undefined) {
      updates.push(`comprehension_level = $${paramCount++}`);
      values.push(comprehension_level);
    }
    if (attention_span !== undefined) {
      updates.push(`attention_span = $${paramCount++}`);
      values.push(attention_span);
    }
    if (motor_skills !== undefined) {
      updates.push(`motor_skills = $${paramCount++}`);
      values.push(motor_skills);
    }
    if (additional_abilities !== undefined) {
      updates.push(`additional_abilities = $${paramCount++}`);
      values.push(JSON.stringify(additional_abilities));
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }
    if (supervision_level !== undefined) {
      updates.push(`supervision_level = $${paramCount++}`);
      values.push(supervision_level);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(studentId);

    const updateQuery = `
      UPDATE students 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    const updatedStudent = result.rows[0];

    return NextResponse.json({
      message: 'Student updated successfully',
      student: updatedStudent
    });

  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/students/[id] - Soft delete student (teachers only)
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
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Check if current user can manage this student
    const canManage = await canManageStudent(session.user.id, studentId);
    if (!canManage) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Soft delete the student
    await query(`
      UPDATE students 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
    `, [studentId]);

    return NextResponse.json({
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}