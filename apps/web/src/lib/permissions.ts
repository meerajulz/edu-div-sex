import { query } from './db';

export type UserRole = 'owner' | 'admin' | 'teacher' | 'student';

export interface RolePermissions {
  canManageUsers: boolean;
  canManageTeachers: boolean;
  canManageStudents: boolean;
  canResetPasswords: boolean;
  canViewAllData: boolean;
  canModifyActivities: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  owner: {
    canManageUsers: true,
    canManageTeachers: true,
    canManageStudents: true,
    canResetPasswords: true,
    canViewAllData: true,
    canModifyActivities: true,
  },
  admin: {
    canManageUsers: false,
    canManageTeachers: true,
    canManageStudents: true,
    canResetPasswords: true,
    canViewAllData: false,
    canModifyActivities: false,
  },
  teacher: {
    canManageUsers: false,
    canManageTeachers: false,
    canManageStudents: true,
    canResetPasswords: true,
    canViewAllData: false,
    canModifyActivities: false,
  },
  student: {
    canManageUsers: false,
    canManageTeachers: false,
    canManageStudents: false,
    canResetPasswords: false,
    canViewAllData: false,
    canModifyActivities: false,
  },
};

export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const result = await query('SELECT role FROM users WHERE id = $1', [userId]);
    return result.rows[0]?.role || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

export async function checkPermission(
  userId: string,
  permission: keyof RolePermissions
): Promise<boolean> {
  const role = await getUserRole(userId);
  if (!role) return false;
  
  return ROLE_PERMISSIONS[role][permission];
}

export async function canManageStudent(
  userId: string,
  studentId: number
): Promise<boolean> {
  try {
    const userRole = await getUserRole(userId);
    if (!userRole) return false;

    if (userRole === 'owner') return true;

    if (userRole === 'admin') {
      // Admins can manage students whose teachers they supervise
      const result = await query(`
        SELECT 1 FROM students s
        JOIN teacher_admin_assignments taa ON s.teacher_id = taa.teacher_id
        WHERE s.id = $1 AND taa.admin_id = $2
      `, [studentId, userId]);
      return result.rows.length > 0;
    }

    if (userRole === 'teacher') {
      // Teachers can only manage their own students
      const result = await query(`
        SELECT 1 FROM students 
        WHERE id = $1 AND teacher_id = $2
      `, [studentId, userId]);
      return result.rows.length > 0;
    }

    if (userRole === 'student') {
      // Students can only access their own data
      const result = await query(`
        SELECT 1 FROM students 
        WHERE id = $1 AND user_id = $2
      `, [studentId, userId]);
      return result.rows.length > 0;
    }

    return false;
  } catch (error) {
    console.error('Error checking student management permission:', error);
    return false;
  }
}

export async function canManageTeacher(
  userId: string,
  teacherId: number
): Promise<boolean> {
  try {
    const userRole = await getUserRole(userId);
    if (!userRole) return false;

    if (userRole === 'owner') return true;

    if (userRole === 'admin') {
      // Admins can manage teachers assigned to them
      const result = await query(`
        SELECT 1 FROM teacher_admin_assignments 
        WHERE teacher_id = $1 AND admin_id = $2
      `, [teacherId, userId]);
      return result.rows.length > 0;
    }

    return false;
  } catch (error) {
    console.error('Error checking teacher management permission:', error);
    return false;
  }
}

export async function canManageUser(
  userId: string,
  targetUserId: number
): Promise<boolean> {
  try {
    const userRole = await getUserRole(userId);
    if (!userRole) return false;

    // Only owners can manage all users
    if (userRole === 'owner') return true;

    // Admins can manage their assigned teachers and their students
    if (userRole === 'admin') {
      const result = await query(`
        SELECT role FROM users WHERE id = $1
      `, [targetUserId]);
      
      const targetRole = result.rows[0]?.role;
      
      if (targetRole === 'teacher') {
        return await canManageTeacher(userId, targetUserId);
      }
      
      if (targetRole === 'student') {
        // Check if the student belongs to a teacher managed by this admin
        const studentResult = await query(`
          SELECT s.id FROM students s
          JOIN teacher_admin_assignments taa ON s.teacher_id = taa.teacher_id
          WHERE s.user_id = $1 AND taa.admin_id = $2
        `, [targetUserId, userId]);
        return studentResult.rows.length > 0;
      }
    }

    // Teachers can manage their own students
    if (userRole === 'teacher') {
      const result = await query(`
        SELECT role FROM users WHERE id = $1
      `, [targetUserId]);
      
      const targetRole = result.rows[0]?.role;
      
      if (targetRole === 'student') {
        const studentResult = await query(`
          SELECT s.id FROM students s
          WHERE s.user_id = $1 AND s.teacher_id = $2
        `, [targetUserId, userId]);
        return studentResult.rows.length > 0;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking user management permission:', error);
    return false;
  }
}