import { query } from './db';

/**
 * Check if a user can access a specific activity and scene
 * @param userId - The user ID
 * @param activitySlug - The activity slug (e.g., 'actividad-1')
 * @param sceneSlug - The scene slug (e.g., 'scene1')
 * @returns Promise<{ canAccess: boolean; redirectTo?: string }> - Access result and redirect URL if denied
 */
export async function canUserAccessActivity(
  userId: string, 
  activitySlug: string, 
  sceneSlug?: string
): Promise<{ canAccess: boolean; redirectTo?: string }> {
  try {
    console.log(`🔒 Checking access for user ${userId} to ${activitySlug}${sceneSlug ? `/${sceneSlug}` : ''}`);
    console.log('🔍 Starting student lookup...');
    
    // First, get the student record
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    console.log('📋 Student query result:', studentResult.rows);

    if (studentResult.rows.length === 0) {
      console.log('📋 No student record found - redirecting to home');
      return { canAccess: false, redirectTo: '/home' };
    }

    const studentId = studentResult.rows[0].id;
    console.log('📋 Student ID found:', studentId);

    // Get the target activity and scene IDs
    console.log('🔍 Looking up activity:', activitySlug);
    
    // Test basic query first
    const testQuery = await query('SELECT COUNT(*) as count FROM activities');
    console.log('🧪 Test - Total activities count:', testQuery.rows[0]?.count);
    
    const activityQuery = await query(
      'SELECT id, order_number FROM activities WHERE slug = $1 AND is_active = true',
      [activitySlug]
    );

    console.log('📋 Activity query result:', activityQuery.rows);

    if (activityQuery.rows.length === 0) {
      console.log('❌ Activity not found:', activitySlug);
      return { canAccess: false, redirectTo: '/home' };
    }

    const targetActivity = activityQuery.rows[0];
    console.log('📋 Target activity:', targetActivity);
    let targetScene = null;

    if (sceneSlug) {
      const sceneQuery = await query(
        'SELECT id, order_number FROM scenes WHERE activity_id = $1 AND slug = $2 AND is_active = true',
        [targetActivity.id, sceneSlug]
      );

      if (sceneQuery.rows.length === 0) {
        console.log('❌ Scene not found:', sceneSlug);
        return { canAccess: false, redirectTo: '/home' };
      }

      targetScene = sceneQuery.rows[0];
    }

    // Check if student has any progress - if not, only allow first activity/scene
    const progressResult = await query(
      'SELECT id FROM student_progress WHERE student_id = $1 LIMIT 1',
      [studentId]
    );

    if (progressResult.rows.length === 0) {
      console.log('📊 No progress found - allowing access to first activity and first scene');
      
      // Get the first activity
      const firstActivityQuery = await query(
        'SELECT id, slug FROM activities WHERE is_active = true ORDER BY order_number ASC LIMIT 1'
      );
      
      if (firstActivityQuery.rows.length === 0) {
        return { canAccess: false, redirectTo: '/home' };
      }

      const firstActivity = firstActivityQuery.rows[0];
      
      // For new students, allow access to:
      // 1. First activity intro page (no scene)
      // 2. First scene of first activity
      if (firstActivity.id === targetActivity.id) {
        if (!sceneSlug) {
          // Accessing activity intro page - always allow for first activity
          console.log('✅ Access granted - first activity intro page');
          return { canAccess: true };
        } else {
          // Check if this is the first scene
          const firstSceneQuery = await query(
            'SELECT slug FROM scenes WHERE activity_id = $1 AND is_active = true ORDER BY order_number ASC LIMIT 1',
            [firstActivity.id]
          );
          
          if (firstSceneQuery.rows.length > 0 && firstSceneQuery.rows[0].slug === sceneSlug) {
            console.log('✅ Access granted - first scene of first activity');
            return { canAccess: true };
          } else {
            const redirectTo = `/${firstActivity.slug}/${firstSceneQuery.rows[0]?.slug || 'scene1'}`;
            console.log('❌ Access denied - redirecting to first scene:', redirectTo);
            return { canAccess: false, redirectTo };
          }
        }
      } else {
        const redirectTo = `/${firstActivity.slug}`;
        console.log('❌ Access denied - redirecting to first activity:', redirectTo);
        return { canAccess: false, redirectTo };
      }
    }

    // Student has progress - check what they can access based on completion status
    const maxAllowedQuery = await query(`
      SELECT 
        a.id as activity_id,
        a.slug as activity_slug,
        a.order_number as activity_order,
        s.id as scene_id,
        s.slug as scene_slug,
        s.order_number as scene_order,
        sp.status
      FROM activities a
      JOIN scenes s ON s.activity_id = a.id
      LEFT JOIN student_progress sp ON sp.activity_id = a.id 
        AND sp.scene_id = s.id 
        AND sp.student_id = $1
      WHERE a.is_active = true AND s.is_active = true
      ORDER BY a.order_number, s.order_number
    `, [studentId]);

    // Find the furthest scene the student can access
    let maxAllowedActivity = null;
    let maxAllowedScene = null;

    for (const row of maxAllowedQuery.rows) {
      if (!row.status || row.status === 'not_started') {
        // This is the next scene they should access
        maxAllowedActivity = { id: row.activity_id, slug: row.activity_slug, order: row.activity_order };
        maxAllowedScene = { id: row.scene_id, slug: row.scene_slug, order: row.scene_order };
        break;
      } else if (row.status === 'completed') {
        // They can access beyond this scene
        continue;
      } else if (row.status === 'in_progress') {
        // They can access this scene
        maxAllowedActivity = { id: row.activity_id, slug: row.activity_slug, order: row.activity_order };
        maxAllowedScene = { id: row.scene_id, slug: row.scene_slug, order: row.scene_order };
        break;
      }
    }

    if (!maxAllowedActivity || !maxAllowedScene) {
      console.log('📊 All activities completed or no valid next activity found');
      return { canAccess: false, redirectTo: '/home' };
    }

    console.log(`📊 Max allowed: ${maxAllowedActivity.slug}/${maxAllowedScene ? `/${maxAllowedScene.slug}` : ''}`);
    console.log(`🎯 Requesting: ${activitySlug}${sceneSlug ? `/${sceneSlug}` : ''}`);

    // Check if the requested activity/scene is within allowed range
    // Allow access to:
    // 1. Any completed or current activity/scene
    // 2. Activity intro pages (no scene) for activities up to current level
    if (targetActivity.order_number < maxAllowedActivity.order ||
        (targetActivity.order_number === maxAllowedActivity.order && 
         (!sceneSlug || (targetScene && targetScene.order_number <= maxAllowedScene.order)))) {
      console.log('✅ Access granted - within allowed range');
      return { canAccess: true };
    } else {
      const redirectTo = maxAllowedScene ? 
        `/${maxAllowedActivity.slug}/${maxAllowedScene.slug}` :
        `/${maxAllowedActivity.slug}`;
      console.log('❌ Access denied - redirecting to current allowed:', redirectTo);
      return { canAccess: false, redirectTo };
    }

  } catch (error) {
    console.error('Error checking activity access:', error);
    return { canAccess: false, redirectTo: '/home' };
  }
}

/**
 * Get the next activity/scene a student should access
 * @param userId - The user ID
 * @returns Promise<string | null> - URL of next activity/scene or null
 */
export async function getNextAllowedActivity(userId: string): Promise<string | null> {
  try {
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return '/home';
    }

    const studentId = studentResult.rows[0].id;

    // Check if student has any progress
    const progressResult = await query(
      'SELECT id FROM student_progress WHERE student_id = $1 LIMIT 1',
      [studentId]
    );

    if (progressResult.rows.length === 0) {
      // No progress - return first activity/scene
      const firstQuery = await query(`
        SELECT a.slug as activity_slug, s.slug as scene_slug
        FROM activities a
        JOIN scenes s ON s.activity_id = a.id
        WHERE a.is_active = true AND s.is_active = true
        ORDER BY a.order_number, s.order_number
        LIMIT 1
      `);

      if (firstQuery.rows.length > 0) {
        const first = firstQuery.rows[0];
        return `/${first.activity_slug}/${first.scene_slug}`;
      }
      return '/home';
    }

    // Find next accessible activity/scene
    const nextQuery = await query(`
      SELECT 
        a.slug as activity_slug,
        s.slug as scene_slug,
        sp.status
      FROM activities a
      JOIN scenes s ON s.activity_id = a.id
      LEFT JOIN student_progress sp ON sp.activity_id = a.id 
        AND sp.scene_id = s.id 
        AND sp.student_id = $1
      WHERE a.is_active = true AND s.is_active = true
      ORDER BY a.order_number, s.order_number
    `, [studentId]);

    for (const row of nextQuery.rows) {
      if (!row.status || row.status === 'not_started' || row.status === 'in_progress') {
        return `/${row.activity_slug}/${row.scene_slug}`;
      }
    }

    // All completed
    return '/home';
  } catch (error) {
    console.error('Error getting next allowed activity:', error);
    return '/home';
  }
}