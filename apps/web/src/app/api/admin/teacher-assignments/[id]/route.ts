import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { getUserRole } from '@/lib/permissions';

// DELETE /api/admin/teacher-assignments/[id] - Remove teacher assignment
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
    const assignmentId = parseInt(id);
    if (isNaN(assignmentId)) {
      return NextResponse.json({ error: 'Invalid assignment ID' }, { status: 400 });
    }

    const userRole = await getUserRole(session.user.id);
    
    // Only owners and admins can remove assignments
    if (userRole !== 'owner' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    // Get assignment details to verify permissions
    const assignmentResult = await query(`
      SELECT admin_id, teacher_id
      FROM teacher_admin_assignments
      WHERE id = $1
    `, [assignmentId]);

    if (assignmentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const assignment = assignmentResult.rows[0];

    // If current user is admin, they can only remove their own assignments
    if (userRole === 'admin' && assignment.admin_id !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Remove the assignment
    await query(`
      DELETE FROM teacher_admin_assignments
      WHERE id = $1
    `, [assignmentId]);

    return NextResponse.json({
      message: 'Teacher assignment removed successfully'
    });

  } catch (error) {
    console.error('Error removing teacher assignment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}