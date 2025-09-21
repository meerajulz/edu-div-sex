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
    const progressQuery = await query(`
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

    // Find the furthest unlocked activity/scene and check if requested content is accessible
    let maxUnlockedActivity = null;
    let maxUnlockedScene = null;
    let hasAnyProgress = false;

    // First pass: find the maximum unlocked content
    let nextAvailableScene = null;

    for (const row of progressQuery.rows) {
      if (row.status === 'completed') {
        // Mark this activity/scene as accessible for replay
        maxUnlockedActivity = { id: row.activity_id, slug: row.activity_slug, order: row.activity_order };
        maxUnlockedScene = { id: row.scene_id, slug: row.scene_slug, order: row.scene_order };
        hasAnyProgress = true;
        // Continue to find the next available scene
        continue;
      } else if (row.status === 'in_progress') {
        // They can access this scene
        maxUnlockedActivity = { id: row.activity_id, slug: row.activity_slug, order: row.activity_order };
        maxUnlockedScene = { id: row.scene_id, slug: row.scene_slug, order: row.scene_order };
        hasAnyProgress = true;
        break;
      } else if (!row.status || row.status === 'not_started') {
        // This is the next scene they should access
        if (!nextAvailableScene) {
          nextAvailableScene = { id: row.scene_id, slug: row.scene_slug, order: row.scene_order, activity_id: row.activity_id, activity_slug: row.activity_slug, activity_order: row.activity_order };
        }
        // If we haven't found any progress yet, this is where they should start
        if (!hasAnyProgress) {
          maxUnlockedActivity = { id: row.activity_id, slug: row.activity_slug, order: row.activity_order };
          maxUnlockedScene = { id: row.scene_id, slug: row.scene_slug, order: row.scene_order };
        }
        break;
      }
    }

    // If we found completed scenes but no in_progress, unlock the next available scene
    if (hasAnyProgress && nextAvailableScene && !maxUnlockedScene) {
      maxUnlockedActivity = { id: nextAvailableScene.activity_id, slug: nextAvailableScene.activity_slug, order: nextAvailableScene.activity_order };
      maxUnlockedScene = { id: nextAvailableScene.id, slug: nextAvailableScene.slug, order: nextAvailableScene.order };
    } else if (hasAnyProgress && nextAvailableScene && maxUnlockedScene && maxUnlockedActivity &&
               (nextAvailableScene.activity_order > maxUnlockedScene.order ||
                (nextAvailableScene.activity_order === maxUnlockedActivity.order && nextAvailableScene.order > maxUnlockedScene.order))) {
      // Extend access to the next scene after completed ones
      maxUnlockedScene = { id: nextAvailableScene.id, slug: nextAvailableScene.slug, order: nextAvailableScene.order };
    }

    if (!maxUnlockedActivity || !maxUnlockedScene) {
      console.log('📊 No unlocked activities found');
      return { canAccess: false, redirectTo: '/home' };
    }

    console.log(`📊 Max unlocked: ${maxUnlockedActivity.slug}/${maxUnlockedScene.slug}`);
    console.log(`🎯 Requesting: ${activitySlug}${sceneSlug ? `/${sceneSlug}` : ''}`);

    // NEW LOGIC: Allow access to any completed activity for replay, current activity, or activity intro pages
    // Check if the requested activity/scene is accessible:
    // 1. Any activity that's been unlocked (order <= max unlocked)
    // 2. Any scene within an unlocked activity
    // 3. Activity intro pages (no scene) for unlocked activities
    // 4. Next activity intro page if previous activity is completed

    // Check if previous activity is completed to unlock next activity intro
    let nextActivityUnlocked = false;
    if (targetActivity.order_number === maxUnlockedActivity.order + 1) {
      // Check if the max unlocked activity is actually completed
      const prevActivityCompletedQuery = await query(`
        SELECT COUNT(*) as total_scenes,
               COUNT(CASE WHEN sp.status = 'completed' THEN 1 END) as completed_scenes
        FROM scenes s
        LEFT JOIN student_progress sp ON sp.scene_id = s.id
          AND sp.activity_id = s.activity_id
          AND sp.student_id = $1
        WHERE s.activity_id = (
          SELECT id FROM activities WHERE order_number = $2 AND is_active = true
        ) AND s.is_active = true
      `, [studentId, maxUnlockedActivity.order]);

      if (prevActivityCompletedQuery.rows.length > 0) {
        const { total_scenes, completed_scenes } = prevActivityCompletedQuery.rows[0];
        nextActivityUnlocked = total_scenes > 0 && total_scenes === completed_scenes;
        console.log(`📊 Previous activity completion check: ${completed_scenes}/${total_scenes} scenes completed`);
      }
    }

    if (targetActivity.order_number < maxUnlockedActivity.order ||
        (targetActivity.order_number === maxUnlockedActivity.order &&
         (!sceneSlug || (targetScene && targetScene.order_number <= maxUnlockedScene.order + 1))) ||
        nextActivityUnlocked) {
      console.log('✅ Access granted - within unlocked range, next scene after completed, or newly unlocked activity');
      return { canAccess: true };
    }

    // Special case: Allow access to activity intro pages for any unlocked activity
    if (!sceneSlug && targetActivity.order_number <= maxUnlockedActivity.order) {
      console.log('✅ Access granted - activity intro page for unlocked activity');
      return { canAccess: true };
    }

    // Deny access and redirect to the furthest allowed content
    const redirectTo = maxUnlockedScene ?
      `/${maxUnlockedActivity.slug}/${maxUnlockedScene.slug}` :
      `/${maxUnlockedActivity.slug}`;
    console.log('❌ Access denied - redirecting to current allowed:', redirectTo);
    return { canAccess: false, redirectTo };

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

    // Find next accessible activity/scene or return home if all completed
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

    // All completed - return home (user can access any activity from orbital menu)
    return '/home';
  } catch (error) {
    console.error('Error getting next allowed activity:', error);
    return '/home';
  }
}