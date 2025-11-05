'use client'

import React, { useState, useEffect } from 'react';
import DashboardWrapper from '../../DashboardWrapper';
import { ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';

interface ReportData {
  totalStudents: number;
  totalTeachers: number;
  activeStudents: number;
  completedActivities: number;
  averageProgress: number;
  lastWeekActivity: number;
}

interface ActivityProgress {
  activityName: string;
  totalStudents: number;
  completedStudents: number;
  progressPercentage: number;
}

interface ActivityAttempts {
  activityId: number;
  activityName: string;
  activitySlug: string;
  totalAttempts: number;
  completedScenes: number;
  totalScenes: number;
}

interface StudentWithProgress {
  id: number;
  name: string;
  age: number;
  supervision_level: number;
  is_active: boolean;
  user_id: number;
  completedScenes: number;
  totalScenes: number;
  progressPercentage: number;
  lastActivityDate: string | null;
  averageAttempts: number;
  attemptsByActivity: ActivityAttempts[];
}

interface TeacherReport {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  students: StudentWithProgress[];
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  supervisionLevelDistribution: {
    nivel1: number;
    nivel2: number;
    nivel3: number;
  };
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [activityProgress, setActivityProgress] = useState<ActivityProgress[]>([]);
  const [teachers, setTeachers] = useState<TeacherReport[]>([]);
  const [expandedTeachers, setExpandedTeachers] = useState<Set<number>>(new Set());
  const [showActivityProgress, setShowActivityProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [avgStudentsPerTeacher, setAvgStudentsPerTeacher] = useState(0);
  const [activeTeachersCount, setActiveTeachersCount] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);

      // Fetch teachers assigned to this admin
      const teachersResponse = await fetch('/api/admin/users?role=teacher');
      const teachersData = teachersResponse.ok ? await teachersResponse.json() : { users: [] };
      const teachers = teachersData.users || [];

      // Fetch students from assigned teachers
      const studentsResponse = await fetch('/api/admin/users?role=student');
      const studentsData = studentsResponse.ok ? await studentsResponse.json() : { users: [] };
      const students = studentsData.users || [];

      // Calculate statistics
      const activeStudents = students.filter((s: { is_active: boolean }) => s.is_active).length;
      const activeTeachers = teachers.filter((t: { is_active: boolean }) => t.is_active).length;

      // Calculate students per teacher average
      const avgStudents = activeTeachers > 0
        ? Math.round((students.length / activeTeachers) * 10) / 10
        : 0;

      // Calculate recent activity (students created in last week)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentStudents = students.filter((s: { created_at: string }) =>
        new Date(s.created_at) > weekAgo
      ).length;

      setAvgStudentsPerTeacher(avgStudents);
      setActiveTeachersCount(activeTeachers);

      // Fetch activity progress
      const progressResponse = await fetch('/api/admin/activity-progress');
      const progressData = progressResponse.ok ? await progressResponse.json() : { activityProgress: [] };

      // Calculate total completed activities and average progress
      const activityProgressList = progressData.activityProgress || [];
      const totalCompletedActivities = activityProgressList.reduce(
        (sum: number, activity: { completedStudents: number }) => sum + activity.completedStudents,
        0
      );
      const averageProgress = activityProgressList.length > 0
        ? Math.round(
            activityProgressList.reduce(
              (sum: number, activity: { progressPercentage: number }) => sum + activity.progressPercentage,
              0
            ) / activityProgressList.length
          )
        : 0;

      setReportData({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        activeStudents: activeStudents,
        completedActivities: totalCompletedActivities,
        averageProgress: averageProgress,
        lastWeekActivity: recentStudents
      });

      // Set activity progress from API
      setActivityProgress(
        activityProgressList.map((activity: {
          activityName: string;
          totalStudents: number;
          completedStudents: number;
          progressPercentage: number
        }) => ({
          activityName: activity.activityName,
          totalStudents: activity.totalStudents,
          completedStudents: activity.completedStudents,
          progressPercentage: activity.progressPercentage
        }))
      );

      // Fetch detailed teacher and student reports
      const teacherReportsResponse = await fetch('/api/admin/reports-by-teacher');
      const teacherReportsData = teacherReportsResponse.ok ? await teacherReportsResponse.json() : { teachers: [] };
      setTeachers(teacherReportsData.teachers || []);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Error al cargar los datos del reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTeacher = (teacherId: number) => {
    const newExpanded = new Set(expandedTeachers);
    if (newExpanded.has(teacherId)) {
      newExpanded.delete(teacherId);
    } else {
      newExpanded.add(teacherId);
    }
    setExpandedTeachers(newExpanded);
  };

  const getSupervisionLevelBadge = (level: number) => {
    switch (level) {
      case 3:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Nivel 3 - Independiente</span>;
      case 2:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Nivel 2 - 50% Supervisión</span>;
      case 1:
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Nivel 1 - 100% Supervisión</span>;
    }
  };

  const formatPercentage = (value: number) => `${value}%`;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Reportes y Estadísticas</h1>
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Cargando reportes...</div>
            </div>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  if (error) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Reportes y Estadísticas</h1>
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Reportes y Estadísticas</h1>
            <div className="flex gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último año</option>
              </select>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{reportData?.totalStudents}</div>
              <div className="text-sm text-blue-700">Total Estudiantes</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{reportData?.totalTeachers}</div>
              <div className="text-sm text-green-700">Profesores Asignados</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-900">{reportData?.activeStudents}</div>
              <div className="text-sm text-emerald-700">Estudiantes Activos</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">{reportData?.completedActivities}</div>
              <div className="text-sm text-purple-700">Actividades Completadas</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-900">{formatPercentage(reportData?.averageProgress || 0)}</div>
              <div className="text-sm text-yellow-700">Progreso Promedio</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-900">{reportData?.lastWeekActivity}</div>
              <div className="text-sm text-indigo-700">Actividad Semanal</div>
            </div>
          </div>

          {/* Activity Progress Chart - Collapsible */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8 overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowActivityProgress(!showActivityProgress)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showActivityProgress ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Progreso por Actividad</h2>
                    <p className="text-sm text-gray-600">Porcentaje de estudiantes que han completado cada actividad</p>
                  </div>
                </div>
              </div>
            </div>
            {showActivityProgress && (
              <div className="border-t border-gray-200 p-6">
                <div className="space-y-6">
                  {activityProgress.map((activity, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-900">{activity.activityName}</div>
                        <div className="text-sm text-gray-600">
                          {activity.completedStudents} de {activity.totalStudents} estudiantes
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                          style={{ width: `${activity.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className={`px-2 py-1 rounded-full font-medium ${getProgressColor(activity.progressPercentage)}`}>
                          {formatPercentage(activity.progressPercentage)}
                        </span>
                        <span className="text-gray-500">
                          {activity.totalStudents - activity.completedStudents} pendientes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Activity */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Actividad de Estudiantes</h3>
                <p className="text-sm text-gray-600">Resumen de actividad reciente</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Estudiantes activos</div>
                      <div className="text-sm text-green-700">Total de estudiantes activos</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{reportData?.activeStudents || 0}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">Nuevos registros</div>
                      <div className="text-sm text-blue-700">Última semana</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{reportData?.lastWeekActivity || 0}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Total estudiantes</div>
                      <div className="text-sm text-purple-700">Todos los estudiantes</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{reportData?.totalStudents || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Activity */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Actividad de Profesores</h3>
                <p className="text-sm text-gray-600">Gestión y supervisión</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <div>
                      <div className="font-medium text-emerald-900">Profesores activos</div>
                      <div className="text-sm text-emerald-700">Asignados a este admin</div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{activeTeachersCount}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium text-orange-900">Total profesores</div>
                      <div className="text-sm text-orange-700">Todos los profesores</div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{reportData?.totalTeachers || 0}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                    <div>
                      <div className="font-medium text-teal-900">Estudiantes por profesor</div>
                      <div className="text-sm text-teal-700">Promedio actual</div>
                    </div>
                    <div className="text-2xl font-bold text-teal-600">{avgStudentsPerTeacher}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Student Reports by Teacher */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Detalle de Estudiantes por Profesor</h2>
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  {/* Teacher Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleTeacher(teacher.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedTeachers.has(teacher.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <GraduationCap className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                          <p className="text-sm text-gray-600">{teacher.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Estudiantes</div>
                          <div className="text-lg font-semibold text-gray-900">{teacher.activeStudents}/{teacher.totalStudents}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Progreso Promedio</div>
                          <div className="text-lg font-semibold text-gray-900">{teacher.averageProgress}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Details (Expanded) */}
                  {expandedTeachers.has(teacher.id) && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      {teacher.students.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          No hay estudiantes asignados a este profesor
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium text-gray-700">Nombre</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-700">Edad</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-700">Nivel Supervisión</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-700">Progreso</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-700">Última Actividad</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-700">Intentos Prom.</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-700">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {teacher.students.map((student) => (
                                <tr key={student.id} className="border-t border-gray-200">
                                  <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                                  <td className="px-4 py-3 text-gray-700">{student.age || 'N/A'}</td>
                                  <td className="px-4 py-3">{getSupervisionLevelBadge(student.supervision_level)}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full ${
                                            student.progressPercentage >= 80 ? 'bg-green-500' :
                                            student.progressPercentage >= 60 ? 'bg-yellow-500' :
                                            student.progressPercentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                          }`}
                                          style={{ width: `${student.progressPercentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium">{student.progressPercentage}%</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {student.completedScenes}/{student.totalScenes} escenas
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    {student.lastActivityDate ? (
                                      <div className="text-xs">
                                        <div className="font-medium text-gray-900">
                                          {new Date(student.lastActivityDate).toLocaleDateString('es-ES')}
                                        </div>
                                        <div className="text-gray-500">
                                          {new Date(student.lastActivityDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-400">Sin actividad</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm font-medium text-gray-900">
                                      {student.averageAttempts.toFixed(1)}
                                    </div>
                                    {student.attemptsByActivity.length > 0 && (
                                      <details className="mt-1">
                                        <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                                          Por actividad
                                        </summary>
                                        <div className="mt-2 space-y-1 bg-gray-50 p-2 rounded text-xs">
                                          {student.attemptsByActivity.map((activity) => (
                                            <div key={activity.activityId} className="flex justify-between items-start">
                                              <div className="flex-1 pr-2">
                                                <div className="font-medium text-gray-700">{activity.activityName}</div>
                                                <div className="text-gray-500">
                                                  {activity.completedScenes}/{activity.totalScenes} escenas
                                                </div>
                                              </div>
                                              <div className="font-medium text-gray-900">{activity.totalAttempts}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </details>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {student.is_active ? (
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        Activo
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                        Inactivo
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {teachers.length === 0 && (
                <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
                  No hay profesores asignados a este centro
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Última actualización: {new Date().toLocaleString('es-ES')}</p>
            <p>Los datos se actualizan cada 15 minutos</p>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}