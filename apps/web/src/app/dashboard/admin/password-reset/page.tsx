'use client'

import React, { useState, useEffect } from 'react';
import DashboardWrapper from '../../DashboardWrapper';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  is_active: boolean;
  username?: string;
}

export default function AdminPasswordResetPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [resetLoading, setResetLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('Error al cargar los usuarios');
      }
      
      const data = await response.json();
      // Filter to only show teachers and students (admin can only reset their passwords)
      const filteredUsers = data.users.filter((user: User) => 
        user.role === 'teacher' || user.role === 'student'
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de que deseas restablecer la contraseña de ${userName}?`)) {
      return;
    }

    try {
      setResetLoading(userId);
      setError('');
      
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Error al restablecer la contraseña');
      }
      
      const data = await response.json();
      setSuccessMessage(`Contraseña restablecida para ${userName}. Nueva contraseña: ${data.newPassword}`);
      
      // Clear success message after 10 seconds
      setTimeout(() => setSuccessMessage(''), 10000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña');
    } finally {
      setResetLoading(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      teacher: { bg: 'bg-green-100', text: 'text-green-800', label: 'Profesor' },
      student: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Estudiante' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactivo
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = !filterRole || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Restablecer Contraseñas</h1>
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Cargando usuarios...</div>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Restablecer Contraseñas</h1>
            <p className="text-gray-600 mt-2">
              Gestiona y restablece las contraseñas de profesores y estudiantes asignados
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Por favor, comunica la nueva contraseña al usuario de forma segura.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Warning Banner */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-800">
                  Importante: El restablecimiento de contraseña generará una nueva contraseña temporal.
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Los usuarios deberán cambiar su contraseña en el próximo inicio de sesión.
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar usuario
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre, email o usuario..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por rol
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Todos los roles</option>
                  <option value="teacher">Profesores</option>
                  <option value="student">Estudiantes</option>
                </select>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  {filteredUsers.length} de {users.length} usuarios
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {filteredUsers.length === 0 ? (
            <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
              <p className="text-lg mb-4">
                {searchTerm || filterRole 
                  ? 'No se encontraron usuarios que coincidan con los filtros'
                  : 'No hay usuarios disponibles para restablecer contraseñas'
                }
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50 border-b border-orange-200">
                    <tr>
                      <th className="text-left p-3 font-medium text-orange-900">Usuario</th>
                      <th className="text-left p-3 font-medium text-orange-900">Email/Usuario</th>
                      <th className="text-left p-3 font-medium text-orange-900">Rol</th>
                      <th className="text-left p-3 font-medium text-orange-900">Estado</th>
                      <th className="text-left p-3 font-medium text-orange-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-orange-50">
                        <td className="p-3">
                          <div className="font-medium text-gray-900 flex items-center">
                            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold mr-3">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                            {user.name}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-gray-600">
                            <div>{user.email}</div>
                            {user.username && (
                              <div className="text-xs text-gray-500">@{user.username}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="p-3">
                          {getStatusBadge(user.is_active)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => resetPassword(user.id, user.name)}
                            disabled={resetLoading === user.id || !user.is_active}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              resetLoading === user.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : !user.is_active
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-orange-600 hover:bg-orange-700 text-white'
                            }`}
                          >
                            {resetLoading === user.id ? 'Restableciendo...' : 'Restablecer Contraseña'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className="bg-orange-50 px-4 py-3 border-t border-orange-200">
                <div className="flex justify-between items-center text-sm">
                  <div className="text-orange-700">
                    Mostrando {filteredUsers.length} de {users.length} usuarios
                  </div>
                  <div className="text-orange-700">
                    Solo puedes restablecer contraseñas de usuarios activos
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}