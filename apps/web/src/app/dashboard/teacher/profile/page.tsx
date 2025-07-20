'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import DashboardWrapper from '../../DashboardWrapper';

interface TeacherStats {
  totalStudents: number;
  activeStudents: number;
  pendingEvaluations: number;
  completedActivities: number;
}

export default function TeacherProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchTeacherStats();
  }, []);

  const fetchTeacherStats = async () => {
    try {
      setIsLoadingStats(true);
      // Mock data for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        totalStudents: 12,
        activeStudents: 10,
        pendingEvaluations: 3,
        completedActivities: 28
      });
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const userFirstName = (session?.user as { first_name?: string })?.first_name;
  const userLastName = (session?.user as { last_name?: string })?.last_name;
  const userUsername = (session?.user as { username?: string })?.username;

  const displayName = userFirstName && userLastName 
    ? `${userFirstName} ${userLastName}`
    : session?.user?.name;

  return (
    <DashboardWrapper>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
            <h1 className="text-2xl font-bold">Mi Perfil de Profesor</h1>
          </div>

          {/* Profile Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold mr-3">
                {(session?.user?.name?.charAt(0) || 'P').toUpperCase()}
              </span>
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <p className="mt-1 text-gray-900">{displayName || 'Cargando...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{session?.user?.email || 'Cargando...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <div className="mt-1">
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    Profesor
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID de Usuario</label>
                <p className="mt-1 text-gray-900 font-mono">#{session?.user?.id || 'Cargando...'}</p>
              </div>
              {userUsername && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                  <p className="mt-1 text-gray-900">@{userUsername}</p>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Statistics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Resumen de Actividad
            </h2>
            {isLoadingStats ? (
              <div className="text-center py-8 text-gray-500">
                Cargando estadísticas...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-900">{stats?.totalStudents}</div>
                  <div className="text-sm text-green-700">Estudiantes Asignados</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-900">{stats?.activeStudents}</div>
                  <div className="text-sm text-emerald-700">Estudiantes Activos</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-900">{stats?.pendingEvaluations}</div>
                  <div className="text-sm text-orange-700">Evaluaciones Pendientes</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-900">{stats?.completedActivities}</div>
                  <div className="text-sm text-blue-700">Actividades Completadas</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/dashboard/students"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ver Mis Estudiantes</p>
                  <p className="text-sm text-gray-600">Gestionar lista de estudiantes</p>
                </div>
              </Link>

              <Link
                href="/dashboard/add-user"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Crear Estudiante</p>
                  <p className="text-sm text-gray-600">Agregar nuevo estudiante</p>
                </div>
              </Link>

              <Link
                href="/dashboard/evaluation-form"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Evaluaciones</p>
                  <p className="text-sm text-gray-600">Formulario de evaluación</p>
                </div>
              </Link>

              <Link
                href="/dashboard/profile/change-password"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-pink-50 hover:border-pink-200 transition-colors"
              >
                <div className="p-2 bg-pink-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m-2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0H7m8 0a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cambiar Contraseña</p>
                  <p className="text-sm text-gray-600">Actualizar contraseña</p>
                </div>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ir al Dashboard</p>
                  <p className="text-sm text-gray-600">Panel principal</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Seguridad de la Cuenta</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Cuenta Activa</p>
                    <p className="text-sm text-green-700">Tu cuenta está activa y funcional</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Contraseña Segura</p>
                    <p className="text-sm text-blue-700">Mantén tu cuenta protegida</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/profile/change-password"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Cambiar →
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-900">Rol de Profesor</p>
                    <p className="text-sm text-yellow-700">Tienes permisos para gestionar estudiantes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}