import { query } from './db';

/**
 * Check if a student has started any activities by looking at their progress
 * @param userId - The user ID (should be a student)
 * @returns Promise<boolean> - true if student has activity progress, false if first-time
 */
export async function hasStudentStartedActivities(userId: string): Promise<boolean> {
  try {
    // First, get the student record linked to this user
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      // No student record found - treat as first login
      return false;
    }

    const studentId = studentResult.rows[0].id;

    // Check if student has any progress records
    const progressResult = await query(
      'SELECT id FROM student_progress WHERE student_id = $1 LIMIT 1',
      [studentId]
    );

    return progressResult.rows.length > 0;
  } catch (error) {
    console.error('Error checking student activity progress:', error);
    // On error, default to first login (safer)
    return false;
  }
}

/**
 * Get the most recent activity/scene the student was working on
 * @param userId - The user ID (should be a student) 
 * @returns Promise<string|null> - URL of current activity or null if none
 */
export async function getCurrentStudentActivity(userId: string): Promise<string | null> {
  try {
    // Get the student record
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return null;
    }

    const studentId = studentResult.rows[0].id;

    // Get the most recent activity progress
    const progressResult = await query(`
      SELECT a.slug as activity_slug, s.slug as scene_slug, sp.status, sp.last_accessed_at
      FROM student_progress sp
      JOIN activities a ON sp.activity_id = a.id
      LEFT JOIN scenes s ON sp.scene_id = s.id
      WHERE sp.student_id = $1 
        AND sp.status IN ('in_progress', 'not_started')
      ORDER BY sp.last_accessed_at DESC
      LIMIT 1
    `, [studentId]);

    if (progressResult.rows.length === 0) {
      return null;
    }

    const progress = progressResult.rows[0];
    
    // Build activity URL
    if (progress.scene_slug) {
      return `/${progress.activity_slug}/${progress.scene_slug}`;
    } else {
      return `/${progress.activity_slug}`;
    }
  } catch (error) {
    console.error('Error getting current student activity:', error);
    return null;
  }
}