'use client'

import React, { useState, useEffect } from 'react';
import DashboardWrapper from '../../DashboardWrapper';

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

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [activityProgress, setActivityProgress] = useState<ActivityProgress[]>([]);
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
      const teachersData = await teachersResponse.ok ? await teachersResponse.json() : { users: [] };
      const teachers = teachersData.users || [];

      // Fetch students from assigned teachers
      const studentsResponse = await fetch('/api/admin/users?role=student');
      const studentsData = await studentsResponse.ok ? await studentsResponse.json() : { users: [] };
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

      setReportData({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        activeStudents: activeStudents,
        completedActivities: 0, // Not tracking this yet
        averageProgress: 0, // Not tracking this yet
        lastWeekActivity: recentStudents
      });

      // Activity progress - placeholder for now
      setActivityProgress([
        { activityName: 'Actividad 1: Conocer mi cuerpo', totalStudents: students.length, completedStudents: 0, progressPercentage: 0 },
        { activityName: 'Actividad 2: Emociones y sentimientos', totalStudents: students.length, completedStudents: 0, progressPercentage: 0 },
        { activityName: 'Actividad 3: Relaciones saludables', totalStudents: students.length, completedStudents: 0, progressPercentage: 0 }
      ]);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Error al cargar los datos del reporte');
    } finally {
      setIsLoading(false);
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

          {/* Activity Progress Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Progreso por Actividad</h2>
              <p className="text-sm text-gray-600">Porcentaje de estudiantes que han completado cada actividad</p>
            </div>
            <div className="p-6">
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