'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWrapper from '../../DashboardWrapper';

interface SystemAnalytics {
  users: {
    total: number;
    by_role: {
      owner: number;
      admin: number;
      teacher: number;
      student: number;
    };
    active: number;
    inactive: number;
    recent_registrations: number;
  };
  students: {
    total: number;
    by_ability_level: {
      [key: string]: number;
    };
    by_age_group: {
      [key: string]: number;
    };
    by_sex: {
      male: number;
      female: number;
    };
    with_evaluations: number;
  };
  teachers: {
    total: number;
    with_students: number;
    avg_students_per_teacher: number;
    assigned_to_admins: number;
  };
  system: {
    database_size: string;
    last_backup: string;
    total_sessions: number;
    active_sessions: number;
  };
}

export default function OwnerAnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all users
      const usersResponse = await fetch('/api/admin/users');
      const usersData = await usersResponse.ok ? await usersResponse.json() : { users: [] };
      
      // Fetch all students
      const studentsResponse = await fetch('/api/students');
      const studentsData = await studentsResponse.ok ? await studentsResponse.json() : { students: [] };
      
      // Fetch teacher assignments
      const assignmentsResponse = await fetch('/api/admin/teacher-assignments');
      const assignmentsData = await assignmentsResponse.ok ? await assignmentsResponse.json() : { assignments: [] };

      // Process the data
      const users = usersData.users || [];
      const students = studentsData.students || [];
      const assignments = assignmentsData.assignments || [];

      const usersByRole = users.reduce((acc: Record<string, number>, user: { role: string }) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const studentsByAbility = students.reduce((acc: Record<string, number>, student: { reading_level?: number }) => {
        const level = student.reading_level || 1;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      const studentsByAge = students.reduce((acc: Record<string, number>, student: { age?: number }) => {
        if (!student.age) {
          acc['Sin especificar'] = (acc['Sin especificar'] || 0) + 1;
          return acc;
        }
        
        let ageGroup;
        if (student.age < 12) ageGroup = '0-11 años';
        else if (student.age < 16) ageGroup = '12-15 años';
        else if (student.age < 18) ageGroup = '16-17 años';
        else ageGroup = '18+ años';
        
        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
        return acc;
      }, {});

      const studentsBySex = students.reduce((acc: { male: number; female: number }, student: { sex: string }) => {
        if (student.sex === 'male' || student.sex === 'female') {
          acc[student.sex] = (acc[student.sex] || 0) + 1;
        }
        return acc;
      }, { male: 0, female: 0 });

      const teachersWithStudents = new Set(students.map((s: { teacher_id: string }) => s.teacher_id)).size;
      const teacherCount = usersByRole.teacher || 0;
      const avgStudentsPerTeacher = teacherCount > 0 ? students.length / teacherCount : 0;

      const recentRegistrations = users.filter((user: { created_at: string }) => {
        const createdAt = new Date(user.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length;

      const studentsWithEvaluations = students.filter((s: { additional_abilities?: { evaluation_responses?: unknown[] } }) => 
        s.additional_abilities?.evaluation_responses && s.additional_abilities.evaluation_responses.length > 0
      ).length;

      setAnalytics({
        users: {
          total: users.length,
          by_role: {
            owner: usersByRole.owner || 0,
            admin: usersByRole.admin || 0,
            teacher: usersByRole.teacher || 0,
            student: usersByRole.student || 0,
          },
          active: users.filter((u: { is_active: boolean }) => u.is_active).length,
          inactive: users.filter((u: { is_active: boolean }) => !u.is_active).length,
          recent_registrations: recentRegistrations,
        },
        students: {
          total: students.length,
          by_ability_level: studentsByAbility,
          by_age_group: studentsByAge,
          by_sex: studentsBySex,
          with_evaluations: studentsWithEvaluations,
        },
        teachers: {
          total: teacherCount,
          with_students: teachersWithStudents,
          avg_students_per_teacher: Math.round(avgStudentsPerTeacher * 10) / 10,
          assigned_to_admins: assignments.length,
        },
        system: {
          database_size: 'N/A',
          last_backup: 'N/A',
          total_sessions: 0,
          active_sessions: 0,
        },
      });

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const getAbilityLevelName = (level: string) => {
    const levels: { [key: string]: string } = {
      '1': 'Básico',
      '2': 'Principiante',
      '3': 'Intermedio',
      '4': 'Avanzado',
      '5': 'Experto'
    };
    return levels[level] || `Nivel ${level}`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Análisis del Sistema</h1>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando estadísticas...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Análisis del Sistema</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <DashboardWrapper>
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Análisis del Sistema</h1>
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Users Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Usuarios del Sistema</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{analytics.users.total}</div>
              <div className="text-sm text-gray-600">Total Usuarios</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">{analytics.users.by_role.owner}</div>
              <div className="text-sm text-purple-700">Propietarios</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{analytics.users.by_role.admin}</div>
              <div className="text-sm text-blue-700">Administradores</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{analytics.users.by_role.teacher}</div>
              <div className="text-sm text-green-700">Profesores</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-900">{analytics.users.by_role.student}</div>
              <div className="text-sm text-yellow-700">Estudiantes</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{analytics.users.recent_registrations}</div>
              <div className="text-sm text-gray-600">Nuevos (7 días)</div>
            </div>
          </div>
        </div>

        {/* Students Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Análisis de Estudiantes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ability Levels */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-3">Niveles de Habilidad (Lectura)</h3>
              <div className="space-y-2">
                {Object.entries(analytics.students.by_ability_level).map(([level, count]) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{getAbilityLevelName(level)}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Groups */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-3">Grupos de Edad</h3>
              <div className="space-y-2">
                {Object.entries(analytics.students.by_age_group).map(([group, count]) => (
                  <div key={group} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{group}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-3">Distribución por Sexo</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Masculino</span>
                  <span className="font-medium">{analytics.students.by_sex.male}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Femenino</span>
                  <span className="font-medium">{analytics.students.by_sex.female}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Con Evaluaciones</span>
                    <span className="font-medium text-green-600">{analytics.students.with_evaluations}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Análisis de Profesores</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{analytics.teachers.total}</div>
              <div className="text-sm text-gray-600">Total Profesores</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{analytics.teachers.with_students}</div>
              <div className="text-sm text-green-700">Con Estudiantes</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{analytics.teachers.avg_students_per_teacher}</div>
              <div className="text-sm text-blue-700">Estudiantes/Profesor</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">{analytics.teachers.assigned_to_admins}</div>
              <div className="text-sm text-purple-700">Asignados a Admins</div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Estado del Sistema</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Usuarios Activos</div>
                <div className="text-2xl font-bold text-green-600">{analytics.users.active}</div>
                <div className="text-xs text-gray-500">
                  {analytics.users.inactive} inactivos
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Tasa de Evaluación</div>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.students.total > 0 
                    ? Math.round((analytics.students.with_evaluations / analytics.students.total) * 100)
                    : 0
                  }%
                </div>
                <div className="text-xs text-gray-500">
                  Estudiantes evaluados
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Carga de Profesores</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {analytics.teachers.avg_students_per_teacher}
                </div>
                <div className="text-xs text-gray-500">
                  Estudiantes promedio
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Asignaciones</div>
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.teachers.total > 0 
                    ? Math.round((analytics.teachers.assigned_to_admins / analytics.teachers.total) * 100)
                    : 0
                  }%
                </div>
                <div className="text-xs text-gray-500">
                  Profesores asignados
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/dashboard/owner/users')}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900">Gestionar Usuarios</div>
              <div className="text-sm text-gray-600">Ver todos los usuarios del sistema</div>
            </button>
            <button
              onClick={() => router.push('/dashboard/owner/users/create')}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900">Crear Usuario</div>
              <div className="text-sm text-gray-600">Agregar nuevo usuario al sistema</div>
            </button>
            <button
              onClick={() => router.push('/dashboard/students')}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900">Ver Estudiantes</div>
              <div className="text-sm text-gray-600">Revisar todos los estudiantes</div>
            </button>
            <button
              onClick={() => router.push('/dashboard/owner/data-export')}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900">Exportar Datos</div>
              <div className="text-sm text-gray-600">Descargar datos del sistema</div>
            </button>
          </div>
        </div>
      </div>
      </div>
    </DashboardWrapper>
  );
}