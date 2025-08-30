import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

// GET /api/user/last-activity - Get user's last visited activity URL
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First try to get the last visited URL from users table
    const userResult = await query(`
      SELECT last_activity_url 
      FROM users 
      WHERE id = $1
    `, [session.user.id]);

    if (userResult.rows[0]?.last_activity_url) {
      return NextResponse.json({ 
        lastUrl: userResult.rows[0].last_activity_url 
      });
    }

    // If no last URL, check student progress for the last accessed scene
    const progressResult = await query(`
      SELECT 
        a.slug as activity_slug,
        s.slug as scene_slug,
        sp.last_accessed_at
      FROM student_progress sp
      JOIN students st ON st.id = sp.student_id
      JOIN scenes s ON s.id = sp.scene_id
      JOIN activities a ON a.id = s.activity_id
      WHERE st.user_id = $1
      ORDER BY sp.last_accessed_at DESC
      LIMIT 1
    `, [session.user.id]);

    if (progressResult.rows.length > 0) {
      const { activity_slug, scene_slug } = progressResult.rows[0];
      const lastUrl = `/${activity_slug}/${scene_slug}`;
      
      // Save this URL for quick access next time
      await query(`
        UPDATE users 
        SET last_activity_url = $1 
        WHERE id = $2
      `, [lastUrl, session.user.id]);
      
      return NextResponse.json({ lastUrl });
    }

    // No progress found, return null
    return NextResponse.json({ lastUrl: null });

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