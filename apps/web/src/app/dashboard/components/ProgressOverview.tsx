'use client';

import React, { useState, useEffect } from 'react';
import StudentProgressCard from './StudentProgressCard';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  username?: string;
  created_at: string;
}

interface ProgressStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completedActivities: number;
  studentsWithProgress: Student[];
}

export default function ProgressOverview() {
  const [stats, setStats] = useState<ProgressStats>({
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    completedActivities: 0,
    studentsWithProgress: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgressStats();
  }, []);

  const fetchProgressStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch students list
      const studentsResponse = await fetch('/api/students');
      if (!studentsResponse.ok) {
        throw new Error('Error al cargar estudiantes');
      }
      
      const studentsData = await studentsResponse.json();
      const students = studentsData.students || [];
      
      // For now, we'll show all students and calculate basic stats
      // In a real implementation, you'd fetch actual progress data for calculations
      setStats({
        totalStudents: students.length,
        activeStudents: Math.floor(students.length * 0.8), // Mock: 80% active
        averageProgress: 65, // Mock: 65% average progress
        completedActivities: Math.floor(students.length * 2.3), // Mock: avg 2.3 activities per student
        studentsWithProgress: students.slice(0, 6) // Show first 6 for the grid
      });
      
    } catch (err) {
      console.error('Error fetching progress stats:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-96 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-medium mb-2">Error al cargar el progreso</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchProgressStats}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Progreso de Estudiantes</h2>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actividades Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedActivities}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Progress Cards */}
      {stats.studentsWithProgress.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso Detallado</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {stats.studentsWithProgress.map((student) => (
              <StudentProgressCard
                key={student.id}
                studentId={student.id}
                studentName={`${student.first_name} ${student.last_name}`}
              />
            ))}
          </div>
          
          {stats.totalStudents > stats.studentsWithProgress.length && (
            <div className="text-center mt-6">
              <p className="text-gray-500 mb-4">
                Mostrando {stats.studentsWithProgress.length} de {stats.totalStudents} estudiantes
              </p>
              <button 
                onClick={() => window.location.href = '/dashboard/students'}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ver Todos los Estudiantes
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay estudiantes registrados</h3>
          <p className="text-gray-500 mb-4">Crea tu primer estudiante para comenzar a ver el progreso.</p>
          <button 
            onClick={() => window.location.href = '/dashboard/admin/users/create?role=student'}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Crear Estudiante
          </button>
        </div>
      )}
    </div>
  );
}