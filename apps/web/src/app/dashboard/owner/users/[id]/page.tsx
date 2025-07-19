'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardWrapper from '../../../DashboardWrapper';

interface User {
  id: string;
  email: string;
  name: string;
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
  };
  managed_teachers?: number;
}

function ViewUserDetails() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar el usuario');
      }
      
      const data = await response.json();
      setUser(data.user);
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

        {user.role === 'student' && user.student_profile && (
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