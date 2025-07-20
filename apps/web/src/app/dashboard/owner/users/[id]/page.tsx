'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardWrapper from '../../../DashboardWrapper';

interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  role: 'owner' | 'admin' | 'teacher' | 'student';
  is_active: boolean;
  created_at: string;
  last_password_change?: string;
  created_by_name?: string;
  // Additional role-specific data
  student_count?: number;
  assigned_admins?: string[];
  student_profile?: {
    age?: number;
    teacher_name?: string;
    reading_level?: number;
    comprehension_level?: number;
    notes?: string;
  };
  managed_teachers?: number;
}

interface ProgressData {
  student_id: number;
  overall_progress: number;
  total_scenes: number;
  completed_scenes: number;
  activities: Activity[];
}

interface Activity {
  id: number;
  name: string;
  slug: string;
  order: number;
  totalScenes: number;
  completedScenes: number;
  overallProgress: number;
  scenes: Scene[];
}

interface Scene {
  id: number;
  name: string;
  slug: string;
  order: number;
  progress: {
    status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
    attempts: number;
    completion_percentage: number;
    started_at?: string;
    completed_at?: string;
    last_accessed_at?: string;
    game_data: Record<string, unknown>;
  };
}

function ViewUserDetails() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar el usuario');
      }
      
      const data = await response.json();
      setUser(data.user);
      setNotesText(data.user.student_profile?.notes || '');
      
      // Fetch progress data if user is a student and has a student profile
      if (data.user.role === 'student' && data.user.student_profile) {
        try {
          const progressResponse = await fetch(`/api/admin/users/${userId}/progress`);
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            setProgressData(progressData);
          }
        } catch (progressErr) {
          console.error('Error fetching progress:', progressErr);
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el usuario');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      owner: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Propietario' },
      admin: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Administrador' },
      teacher: { bg: 'bg-green-100', text: 'text-green-800', label: 'Profesor' },
      student: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Estudiante' }
    };
    const config = roleConfig[role as keyof typeof roleConfig] || { bg: 'bg-gray-100', text: 'text-gray-800', label: role };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const saveNotes = async () => {
    if (!user) return;
    
    try {
      setIsSavingNotes(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: notesText }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar las notas');
      }

      // Update user data with new notes
      setUser(prev => prev ? {
        ...prev,
        student_profile: {
          ...prev.student_profile,
          notes: notesText
        }
      } : null);
      
      setIsEditingNotes(false);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar las notas');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const updateProgress = async (activityId: number, sceneId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_id: activityId,
          scene_id: sceneId,
          status: status,
          completion_percentage: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el progreso');
      }

      // Refresh progress data
      if (progressData) {
        const progressResponse = await fetch(`/api/admin/users/${userId}/progress`);
        if (progressResponse.ok) {
          const newProgressData = await progressResponse.json();
          setProgressData(newProgressData);
        }
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el progreso');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En progreso';
      case 'skipped': return 'Omitido';
      default: return 'No iniciado';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error || 'Usuario no encontrado'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper>
      <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
            <h1 className="text-2xl font-bold">Detalles del Usuario</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/dashboard/owner/users/${userId}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar Usuario
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <p className="mt-1 text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            {user.role === 'student' && user.username && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                <p className="mt-1 text-gray-900 font-mono">{user.username}</p>
                <p className="text-xs text-gray-500 mt-1">Usado para iniciar sesión</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <div className="mt-1">{getRoleBadge(user.role)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <div className="mt-1">{getStatusBadge(user.is_active)}</div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Información de la Cuenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
              <p className="mt-1 text-gray-900">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Último Cambio de Contraseña</label>
              <p className="mt-1 text-gray-900">{formatDate(user.last_password_change)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Creado Por</label>
              <p className="mt-1 text-gray-900">{user.created_by_name || 'Sistema'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID del Usuario</label>
              <p className="mt-1 text-gray-900 font-mono">#{user.id}</p>
            </div>
          </div>
        </div>

        {/* Role-specific Information */}
        {user.role === 'teacher' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Información del Profesor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Estudiantes Asignados</label>
                <p className="mt-1 text-2xl font-bold text-green-600">{user.student_count || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Administradores Asignados</label>
                <div className="mt-1">
                  {user.assigned_admins && user.assigned_admins.length > 0 ? (
                    <ul className="text-gray-900">
                      {user.assigned_admins.map((admin, index) => (
                        <li key={index} className="text-sm">• {admin}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">Sin administradores asignados</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Información del Administrador</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Profesores Gestionados</label>
                <p className="mt-1 text-2xl font-bold text-blue-600">{user.managed_teachers || 0}</p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'student' && !user.student_profile && (
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4 text-yellow-800">Perfil de Estudiante Faltante</h2>
            <p className="text-yellow-700 mb-4">
              Este usuario tiene rol de estudiante pero no tiene un perfil de estudiante completo. 
              Se necesita crear un perfil de estudiante para habilitar el seguimiento de progreso y notas.
            </p>
            <button
              onClick={() => router.push(`/dashboard/owner/users/${userId}/edit`)}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Crear Perfil de Estudiante
            </button>
          </div>
        )}

        {user.role === 'student' && user.student_profile && (
          <>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4">Perfil del Estudiante</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Edad</label>
                  <p className="mt-1 text-gray-900">{user.student_profile.age || 'No especificada'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profesor Asignado</label>
                  <p className="mt-1 text-gray-900">{user.student_profile.teacher_name || 'Sin asignar'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nivel de Lectura</label>
                  <p className="mt-1 text-gray-900">{user.student_profile.reading_level}/5</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nivel de Comprensión</label>
                  <p className="mt-1 text-gray-900">{user.student_profile.comprehension_level}/5</p>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Notas del Estudiante</h2>
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Editar Notas
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveNotes}
                      disabled={isSavingNotes}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isSavingNotes ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingNotes(false);
                        setNotesText(user.student_profile?.notes || '');
                      }}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
              
              {isEditingNotes ? (
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px]"
                  placeholder="Añadir notas sobre el estudiante..."
                />
              ) : (
                <div className="min-h-[80px] p-3 bg-gray-50 rounded-lg">
                  {user.student_profile.notes ? (
                    <p className="text-gray-900 whitespace-pre-wrap">{user.student_profile.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">Sin notas registradas</p>
                  )}
                </div>
              )}
            </div>

            {/* Progress Section */}
            {progressData && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                <h2 className="text-lg font-semibold mb-4">Progreso Académico</h2>
                
                {/* Overall Progress */}
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-yellow-800">Progreso General</span>
                    <span className="text-sm font-bold text-yellow-900">{progressData.overall_progress}%</span>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressData.overall_progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-yellow-700 mt-1">
                    {progressData.completed_scenes} de {progressData.total_scenes} escenas completadas
                  </div>
                </div>

                {/* Activities Progress */}
                <div className="space-y-4">
                  {progressData.activities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">{activity.name}</h3>
                        <span className="text-sm text-gray-600">{activity.overallProgress}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${activity.overallProgress}%` }}
                        ></div>
                      </div>

                      {/* Scenes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {activity.scenes.map((scene) => (
                          <div key={scene.id} className="border border-gray-100 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-800">{scene.name}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(scene.progress.status)}`}>
                                {getStatusText(scene.progress.status)}
                              </span>
                            </div>
                            
                            {scene.progress.completion_percentage > 0 && (
                              <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                                <div 
                                  className="bg-green-500 h-1 rounded-full"
                                  style={{ width: `${scene.progress.completion_percentage}%` }}
                                ></div>
                              </div>
                            )}
                            
                            <div className="flex gap-1 mt-2">
                              <button
                                onClick={() => updateProgress(activity.id, scene.id, 'not_started')}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                title="Marcar como no iniciado"
                              >
                                No iniciado
                              </button>
                              <button
                                onClick={() => updateProgress(activity.id, scene.id, 'in_progress')}
                                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                                title="Marcar en progreso"
                              >
                                En progreso
                              </button>
                              <button
                                onClick={() => updateProgress(activity.id, scene.id, 'completed')}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                title="Marcar como completado"
                              >
                                Completado
                              </button>
                            </div>
                            
                            {scene.progress.attempts > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Intentos: {scene.progress.attempts}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Última actualización: {formatDate(new Date().toISOString())}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard/owner/users')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Ver Todos los Usuarios
              </button>
              <button
                onClick={() => router.push(`/dashboard/owner/users/${userId}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Editar Usuario
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardWrapper>
  );
}

export default function ViewUserPage() {
  return (
    <Suspense fallback={<div className="p-6"><div className="text-center">Cargando...</div></div>}>
      <ViewUserDetails />
    </Suspense>
  );
}