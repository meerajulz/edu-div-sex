import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

// GET /api/user/supervision-level - Get the supervision level of the logged-in student
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ supervision_level: 1 });
    }

    // Non-student roles always see básico content (all activities)
    const userRole = (session.user as { role?: string })?.role;
    if (userRole !== 'student') {
      return NextResponse.json({ supervision_level: 1 });
    }

    const result = await query(
      'SELECT supervision_level FROM students WHERE user_id = $1 AND is_active = true',
      [session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ supervision_level: 1 });
    }

    return NextResponse.json({
      supervision_level: result.rows[0].supervision_level || 1
    });

  } catch (error) {
    console.error('Error fetching supervision level:', error);
    return NextResponse.json({ supervision_level: 1 });
  }
}
