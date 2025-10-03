'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardWrapper from '../../DashboardWrapper';

interface DetailedProgressData {
  student: {
    name: string;
    reading_level: number;
    comprehension_level: number;
    attention_span: number;
    motor_skills: number;
  };
  overall_progress: {
    total_scenes: number;
    completed_scenes: number;
    in_progress_scenes: number;
    not_started_scenes: number;
    completion_percentage: number;
  };
  activities: DetailedActivity[];
}

interface DetailedActivity {
  id: number;
  name: string;
  slug: string;
  order: number;
  scenes: DetailedScene[];
  overall_progress: {
    total_scenes: number;
    completed_scenes: number;
    in_progress_scenes: number;
    not_started_scenes: number;
  };
}

interface DetailedScene {
  id: number;
  name: string;
  slug: string;
  order: number;
  status: string;
  completion_percentage: number;
  attempts: number;
  game_data: Record<string, unknown>;
  started_at?: string;
  completed_at?: string;
  last_accessed_at?: string;
}

interface Student {
  id: number;
  name: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  sex?: 'male' | 'female';
  reading_level: number;
  comprehension_level: number;
  attention_span: number;
  motor_skills: number;
  supervision_level?: number;
  created_at: string;
  teacher_name?: string;
}

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [detailedProgress, setDetailedProgress] = useState<DetailedProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch student details
      const studentResponse = await fetch(`/api/students/${studentId}`);
      if (!studentResponse.ok) {
        throw new Error('Error al cargar datos del estudiante');
      }
      const studentData = await studentResponse.json();
      setStudent(studentData.student);

      // Fetch detailed student progress
      const progressResponse = await fetch(`/api/students/${studentId}/progress`);
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setDetailedProgress(progressData);
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const getAbilityLevelText = (level: number) => {
    const levels = {
      1: 'Básico',
      2: 'Principiante',
      3: 'Intermedio',
      4: 'Avanzado',
      5: 'Experto'
    };
    return levels[level as keyof typeof levels] || 'Desconocido';
  };

  const getAbilityLevelColor = (level: number) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-800',
      5: 'bg-blue-100 text-blue-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };


  const getSceneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getSceneStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En progreso';
      case 'skipped': return 'Omitido';
      default: return 'No iniciado';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando información del estudiante...</div>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  if (error || !student) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error || 'Estudiante no encontrado'}
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <h1 className="text-2xl font-bold">Detalles del Estudiante</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/dashboard/students/${studentId}/edit`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Editar Estudiante
                </button>
                <button
                  onClick={() => router.back()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Volver a la Lista
                </button>
              </div>
            </div>
            {student.teacher_name && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-300 rounded-lg inline-flex">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <div className="text-xs text-green-600 font-medium">Profesor Asignado</div>
                  <div className="text-sm font-bold text-green-900">{student.teacher_name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Student Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <span className="ml-2 font-medium">
                      {student.first_name || student.name} {student.last_name || ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Usuario:</span>
                    <span className="ml-2 font-medium">{student.username || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{student.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Edad:</span>
                    <span className="ml-2 font-medium">{student.age || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sexo:</span>
                    <span className="ml-2 font-medium">
                      {student.sex === 'male' ? 'Masculino' : student.sex === 'female' ? 'Femenino' : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Profesor:</span>
                    <span className="ml-2 font-medium">{student.teacher_name || 'Sin asignar'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Habilidades</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nivel de Lectura:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAbilityLevelColor(student.reading_level)}`}>
                      {getAbilityLevelText(student.reading_level)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Comprensión:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAbilityLevelColor(student.comprehension_level)}`}>
                      {getAbilityLevelText(student.comprehension_level)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Atención:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAbilityLevelColor(student.attention_span)}`}>
                      {getAbilityLevelText(student.attention_span)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Habilidades Motoras:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAbilityLevelColor(student.motor_skills)}`}>
                      {getAbilityLevelText(student.motor_skills)}
                    </span>
                  </div>
                  {student.supervision_level && (
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
                      <span className="text-gray-600 font-semibold">Nivel de Supervisión:</span>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        student.supervision_level === 3 ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                        student.supervision_level === 2 ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                        'bg-red-100 text-red-800 border-2 border-red-300'
                      }`}>
                        Nivel {student.supervision_level}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          {detailedProgress && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Progreso Académico</h2>
              
              {/* Overall Progress */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-800">Progreso General</span>
                  <span className="text-sm font-bold text-blue-900">{detailedProgress.overall_progress.completion_percentage}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${detailedProgress.overall_progress.completion_percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {detailedProgress.overall_progress.completed_scenes} de {detailedProgress.overall_progress.total_scenes} escenas completadas
                </div>
              </div>

              {/* Activities Progress */}
              <div className="space-y-4">
                {detailedProgress.activities.map((activity) => {
                  const activityProgress = activity.overall_progress.total_scenes > 0 
                    ? Math.round((activity.overall_progress.completed_scenes / activity.overall_progress.total_scenes) * 100)
                    : 0;
                    
                  return (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">{activity.name}</h3>
                        <span className="text-sm text-gray-600">{activityProgress}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${activityProgress}%` }}
                        ></div>
                      </div>

                      {/* Scenes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {activity.scenes.map((scene) => (
                          <div key={scene.id} className="border border-gray-100 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-800">{scene.name}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getSceneStatusColor(scene.status)}`}>
                                {getSceneStatusText(scene.status)}
                              </span>
                            </div>
                            
                            {scene.completion_percentage > 0 && (
                              <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                                <div 
                                  className="bg-green-500 h-1 rounded-full"
                                  style={{ width: `${scene.completion_percentage}%` }}
                                ></div>
                              </div>
                            )}
                            
                            {scene.attempts > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Intentos: {scene.attempts}
                              </div>
                            )}
                            
                            {scene.last_accessed_at && (
                              <div className="text-xs text-gray-500 mt-1">
                                Último acceso: {formatDate(scene.last_accessed_at)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardWrapper>
  );
}