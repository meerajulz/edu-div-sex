'use client'

import React, { useState, useEffect } from 'react';
import DashboardWrapper from '../../DashboardWrapper';
import { ChevronDown, ChevronRight, Users, GraduationCap, School, TrendingUp } from 'lucide-react';
import { getActivityTitle } from '@/app/utils/activityMapping';

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

interface TeacherWithStudents {
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

interface CenterReport {
  adminId: number;
  adminName: string;
  adminEmail: string;
  isActive: boolean;
  teachers: TeacherWithStudents[];
  totalTeachers: number;
  activeTeachers: number;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  supervisionLevelDistribution: {
    nivel1: number;
    nivel2: number;
    nivel3: number;
  };
}

interface OverallStats {
  totalCenters: number;
  activeCenters: number;
  totalTeachers: number;
  activeTeachers: number;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  supervisionLevelDistribution: {
    nivel1: number;
    nivel2: number;
    nivel3: number;
  };
}

export default function OwnerReportsByCenterPage() {
  const [centers, setCenters] = useState<CenterReport[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCenters, setExpandedCenters] = useState<Set<number>>(new Set());
  const [expandedTeachers, setExpandedTeachers] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/owner/reports-by-center');

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setCenters(data.centers || []);
      setOverallStats(data.overallStats || null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Error al cargar los reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCenter = (centerId: number) => {
    const newExpanded = new Set(expandedCenters);
    if (newExpanded.has(centerId)) {
      newExpanded.delete(centerId);
    } else {
      newExpanded.add(centerId);
    }
    setExpandedCenters(newExpanded);
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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Reportes por Centro</h1>
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
            <h1 className="text-2xl font-bold mb-6">Reportes por Centro</h1>
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
            <h1 className="text-2xl font-bold">Reportes por Centro</h1>
            <button
              onClick={fetchReports}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualizar
            </button>
          </div>

          {/* Overall Statistics */}
          {overallStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <School className="w-5 h-5 text-blue-600" />
                  <div className="text-sm text-blue-700 font-medium">Centros</div>
                </div>
                <div className="text-2xl font-bold text-blue-900">{overallStats.activeCenters}/{overallStats.totalCenters}</div>
                <div className="text-xs text-blue-600">Activos/Total</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  <div className="text-sm text-green-700 font-medium">Profesores</div>
                </div>
                <div className="text-2xl font-bold text-green-900">{overallStats.activeTeachers}/{overallStats.totalTeachers}</div>
                <div className="text-xs text-green-600">Activos/Total</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div className="text-sm text-purple-700 font-medium">Estudiantes</div>
                </div>
                <div className="text-2xl font-bold text-purple-900">{overallStats.activeStudents}/{overallStats.totalStudents}</div>
                <div className="text-xs text-purple-600">Activos/Total</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <div className="text-sm text-yellow-700 font-medium">Progreso Promedio</div>
                </div>
                <div className="text-2xl font-bold text-yellow-900">{overallStats.averageProgress}%</div>
                <div className="text-xs text-yellow-600">Global</div>
              </div>
            </div>
          )}

          {/* Supervision Level Distribution */}
          {overallStats && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Niveles de Supervisión (Global)</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-900">{overallStats.supervisionLevelDistribution.nivel1}</div>
                  <div className="text-sm text-red-700">Nivel 1 - 100% Supervisión</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-900">{overallStats.supervisionLevelDistribution.nivel2}</div>
                  <div className="text-sm text-yellow-700">Nivel 2 - 50% Supervisión</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-900">{overallStats.supervisionLevelDistribution.nivel3}</div>
                  <div className="text-sm text-green-700">Nivel 3 - Independiente</div>
                </div>
              </div>
            </div>
          )}

          {/* Centers List */}
          <div className="space-y-4">
            {centers.map((center) => (
              <div key={center.adminId} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Center Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCenter(center.adminId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedCenters.has(center.adminId) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                      <School className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{center.adminName}</h3>
                        <p className="text-sm text-gray-600">{center.adminEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Profesores</div>
                        <div className="text-lg font-semibold text-gray-900">{center.activeTeachers}/{center.totalTeachers}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Estudiantes</div>
                        <div className="text-lg font-semibold text-gray-900">{center.activeStudents}/{center.totalStudents}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Progreso</div>
                        <div className="text-lg font-semibold text-gray-900">{center.averageProgress}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Details (Expanded) */}
                {expandedCenters.has(center.adminId) && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    {/* Teachers List */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Profesores del Centro</h4>
                      {center.teachers.map((teacher) => (
                        <div key={teacher.id} className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                          {/* Teacher Header */}
                          <div
                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleTeacher(teacher.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {expandedTeachers.has(teacher.id) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                                <GraduationCap className="w-5 h-5 text-green-600" />
                                <div>
                                  <div className="font-medium text-gray-900">{teacher.name}</div>
                                  <div className="text-sm text-gray-600">{teacher.email}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-sm">
                                  <span className="text-gray-500">Estudiantes: </span>
                                  <span className="font-medium">{teacher.activeStudents}/{teacher.totalStudents}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Progreso: </span>
                                  <span className="font-medium">{teacher.averageProgress}%</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Teacher Details (Expanded) */}
                          {expandedTeachers.has(teacher.id) && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
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
                                                  className={`h-full ${getProgressColor(student.progressPercentage)}`}
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
                                                        <div className="font-medium text-gray-700">{getActivityTitle(activity.activitySlug)}</div>
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
                      {center.teachers.length === 0 && (
                        <div className="text-center text-gray-500 py-4 bg-white rounded-lg border border-gray-300">
                          No hay profesores asignados a este centro
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {centers.length === 0 && (
              <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
                No hay centros registrados
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Última actualización: {new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
