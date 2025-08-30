'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProgressData {
  student: {
    name: string;
    reading_level: number;
    comprehension_level: number;
    attention_span: number;
    motor_skills: number;
  };
  current_position: {
    activity: string | null;
    scene: string | null;
    last_accessed: string | null;
  };
  overall_progress: {
    total_scenes: number;
    completed_scenes: number;
    in_progress_scenes: number;
    not_started_scenes: number;
    completion_percentage: number;
  };
  activities: Array<{
    id: number;
    name: string;
    slug: string;
    order: number;
    scenes: Array<{
      id: number;
      name: string;
      slug: string;
      order: number;
      status: 'completed' | 'in_progress' | 'not_started';
      completion_percentage: number;
      attempts: number;
      started_at?: string;
      completed_at?: string;
      last_accessed_at?: string;
    }>;
    overall_progress: {
      total_scenes: number;
      completed_scenes: number;
      in_progress_scenes: number;
      not_started_scenes: number;
    };
  }>;
}

interface StudentProgressCardProps {
  studentId: string;
  studentName: string;
  className?: string;
}

export default function StudentProgressCard({ 
  studentId, 
  studentName, 
  className = '' 
}: StudentProgressCardProps) {
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentProgress();
  }, [studentId]);

  const fetchStudentProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/students/${studentId}/progress`);
      
      if (!response.ok) {
        throw new Error('Error al cargar el progreso del estudiante');
      }
      
      const data = await response.json();
      setProgressData(data);
    } catch (err) {
      console.error('Error fetching student progress:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el progreso');
    } finally {
      setIsLoading(false);
    }
  };



  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-red-600 mb-2">Error al cargar el progreso</p>
          <button 
            onClick={fetchStudentProgress}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{studentName}</h3>
          <button
            onClick={() => router.push(`/dashboard/students/${studentId}`)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver Detalles
          </button>
        </div>
        
        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso General</span>
            <span className="text-sm text-gray-500">
              {progressData.overall_progress.completion_percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressData.overall_progress.completion_percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              {progressData.overall_progress.completed_scenes} de {progressData.overall_progress.total_scenes} completadas
            </span>
            {progressData.current_position.last_accessed && (
              <span>
                Último acceso: {formatDate(progressData.current_position.last_accessed)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Current Position */}
      {progressData.current_position.activity && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-1 bg-blue-100 rounded mr-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Posición Actual</p>
              <p className="text-xs text-blue-700">
                {progressData.current_position.activity}
                {progressData.current_position.scene && ` > ${progressData.current_position.scene}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activities Summary */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Actividades</h4>
        <div className="space-y-3">
          {progressData.activities.slice(0, 3).map((activity) => {
            const completionPercentage = activity.overall_progress.total_scenes > 0 
              ? Math.round((activity.overall_progress.completed_scenes / activity.overall_progress.total_scenes) * 100)
              : 0;
            
            return (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                    <span className="text-xs text-gray-500">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.overall_progress.completed_scenes} de {activity.overall_progress.total_scenes} escenas
                  </p>
                </div>
              </div>
            );
          })}
          
          {progressData.activities.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => router.push(`/dashboard/students/${studentId}`)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Ver todas las actividades ({progressData.activities.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-green-600">
              {progressData.overall_progress.completed_scenes}
            </p>
            <p className="text-xs text-gray-600">Completadas</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-yellow-600">
              {progressData.overall_progress.in_progress_scenes}
            </p>
            <p className="text-xs text-gray-600">En Progreso</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-600">
              {progressData.overall_progress.not_started_scenes}
            </p>
            <p className="text-xs text-gray-600">Pendientes</p>
          </div>
        </div>
      </div>
    </div>
  );
}