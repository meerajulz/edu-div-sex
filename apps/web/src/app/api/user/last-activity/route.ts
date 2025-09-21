import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

// GET /api/user/last-activity - Get user's last visited activity URL with smart logic
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student info
    const studentResult = await query(`
      SELECT id FROM students WHERE user_id = $1
    `, [session.user.id]);

    if (studentResult.rows.length === 0) {
      return NextResponse.json({ lastUrl: null, showButton: false });
    }

    const studentId = studentResult.rows[0].id;

    // Check overall progress to determine if we should show the button
    const progressAnalysis = await query(`
      SELECT
        a.slug as activity_slug,
        s.slug as scene_slug,
        a.order_number as activity_order,
        s.order_number as scene_order,
        sp.status,
        sp.last_accessed_at
      FROM activities a
      JOIN scenes s ON s.activity_id = a.id
      LEFT JOIN student_progress sp ON sp.activity_id = a.id
        AND sp.scene_id = s.id
        AND sp.student_id = $1
      WHERE a.is_active = true AND s.is_active = true
      ORDER BY a.order_number, s.order_number
    `, [studentId]);

    let hasAnyProgress = false;
    let allCompleted = true;
    let lastActiveUrl = null;
    let lastAccessTime = null;

    // Analyze progress
    for (const row of progressAnalysis.rows) {
      if (row.status) {
        hasAnyProgress = true;

        if (row.status !== 'completed') {
          allCompleted = false;
        }

        // Find the most recently accessed incomplete scene
        if (row.status === 'in_progress' && row.last_accessed_at) {
          if (!lastAccessTime || new Date(row.last_accessed_at) > new Date(lastAccessTime)) {
            lastActiveUrl = `/${row.activity_slug}/${row.scene_slug}`;
            lastAccessTime = row.last_accessed_at;
          }
        }
      } else {
        // Found first scene without progress - this is where they should continue
        if (hasAnyProgress && !lastActiveUrl) {
          lastActiveUrl = `/${row.activity_slug}/${row.scene_slug}`;
        }
        allCompleted = false;
      }
    }

    // Decide whether to show button and what URL to use
    let showButton = false;
    let continueUrl = null;

    if (hasAnyProgress && !allCompleted) {
      // User has progress but hasn't completed everything
      showButton = true;

      // Use saved URL from users table if recent, otherwise use calculated URL
      const userResult = await query(`
        SELECT last_activity_url, updated_at
        FROM users
        WHERE id = $1
      `, [session.user.id]);

      const savedUrl = userResult.rows[0]?.last_activity_url;
      const savedTime = userResult.rows[0]?.updated_at;

      // Use saved URL if it's recent (within last 24 hours) and valid
      if (savedUrl && savedTime) {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (new Date(savedTime) > dayAgo) {
          continueUrl = savedUrl;
        }
      }

      // Fallback to calculated URL
      if (!continueUrl) {
        continueUrl = lastActiveUrl;
      }
    }

    return NextResponse.json({
      lastUrl: continueUrl,
      showButton,
      hasProgress: hasAnyProgress,
      allCompleted
    });

  } catch (error) {
    console.error('Error fetching last activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/last-activity - Save user's current activity URL
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Update the user's last activity URL
    await query(`
      UPDATE users
      SET
        last_activity_url = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [url, session.user.id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error saving last activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/user/last-activity - Hide continue button (clear saved URL)
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear the user's last activity URL to hide the continue button
    await query(`
      UPDATE users
      SET
        last_activity_url = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [session.user.id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error hiding continue button:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}