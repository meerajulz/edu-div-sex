'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardWrapper from '../../../../DashboardWrapper';

interface UserFormData {
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'teacher' | 'student' | '';
  is_active: boolean;
}

function EditUserForm() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: '',
    is_active: true
  });

  const [originalData, setOriginalData] = useState<UserFormData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoadingUser(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar el usuario');
      }
      
      const data = await response.json();
      const userData = {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        is_active: data.user.is_active
      };
      
      setFormData(userData);
      setOriginalData(userData);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el usuario');
    } finally {
      setIsLoadingUser(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.role) {
      setError('Todos los campos son requeridos.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el usuario');
      }

      setSuccess('¡Usuario actualizado exitosamente!');
      setOriginalData(formData);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/owner/users');
      }, 2000);

    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const getRoleTitle = () => {
    switch (formData.role) {
      case 'owner':
        return 'Propietario';
      case 'admin':
        return 'Administrador';
      case 'teacher':
        return 'Profesor';
      case 'student':
        return 'Estudiante';
      default:
        return 'Usuario';
    }
  };

  const getRoleDescription = () => {
    switch (formData.role) {
      case 'owner':
        return 'Los propietarios tienen acceso completo al sistema y pueden gestionar todos los usuarios y configuraciones.';
      case 'admin':
        return 'Los administradores pueden gestionar profesores asignados y sus estudiantes.';
      case 'teacher':
        return 'Los profesores pueden crear y gestionar estudiantes bajo su supervisión.';
      case 'student':
        return 'Los estudiantes tienen acceso a las actividades educativas del sistema.';
      default:
        return '';
    }
  };

  if (isLoadingUser) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper>
      <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold">Editar {getRoleTitle()}</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
            {success}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Rol *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as 'owner' | 'admin' | 'teacher' | 'student' | ''})}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              >
                <option value="">Seleccionar rol...</option>
                <option value="owner">Propietario</option>
                <option value="admin">Administrador</option>
                <option value="teacher">Profesor</option>
                <option value="student">Estudiante</option>
              </select>
              {formData.role && (
                <p className="text-sm text-gray-600 mt-1">
                  {getRoleDescription()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Estado de la Cuenta
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active === true}
                    onChange={() => setFormData({...formData, is_active: true})}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-gray-700">Activo</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active === false}
                    onChange={() => setFormData({...formData, is_active: false})}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-gray-700">Inactivo</span>
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Los usuarios inactivos no podrán iniciar sesión en el sistema.
              </p>
            </div>

            {/* Role-specific warnings */}
            {formData.role === 'owner' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Advertencia</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>Este usuario tiene permisos de propietario con acceso completo al sistema incluyendo la capacidad de modificar y eliminar todos los datos.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasChanges() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-700 text-sm">
                  ℹ️ Hay cambios sin guardar. Haga clic en &quot;Actualizar Usuario&quot; para guardar los cambios.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !hasChanges()}
                className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                  isLoading || !hasChanges()
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-pink-600 hover:bg-pink-700'
                } text-white font-medium`}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </DashboardWrapper>
  );
}

export default function EditUserPage() {
  return (
    <Suspense fallback={<div className="p-6"><div className="text-center">Cargando...</div></div>}>
      <EditUserForm />
    </Suspense>
  );
}