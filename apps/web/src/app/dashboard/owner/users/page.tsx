'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWrapper from '../../DashboardWrapper';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'teacher' | 'student';
  is_active: boolean;
  created_at: string;
  last_password_change?: string;
  created_by_name?: string;
}

export default function OwnerUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

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
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      owner: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Propietario' },
      admin: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Administrador' },
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getUserCounts = () => {
    return {
      total: users.length,
      owner: users.filter(u => u.role === 'owner').length,
      admin: users.filter(u => u.role === 'admin').length,
      teacher: users.filter(u => u.role === 'teacher').length,
      student: users.filter(u => u.role === 'student').length,
      active: users.filter(u => u.is_active).length,
      inactive: users.filter(u => !u.is_active).length,
    };
  };

  const counts = getUserCounts();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios del Sistema</h1>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando usuarios...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios del Sistema</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper>
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Usuarios del Sistema</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/owner/users/create')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Crear Usuario
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{counts.total}</div>
            <div className="text-sm text-gray-600">Total Usuarios</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">{counts.owner}</div>
            <div className="text-sm text-purple-700">Propietarios</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{counts.admin}</div>
            <div className="text-sm text-blue-700">Administradores</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-900">{counts.teacher}</div>
            <div className="text-sm text-green-700">Profesores</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-900">{counts.student}</div>
            <div className="text-sm text-yellow-700">Estudiantes</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{counts.active}</div>
            <div className="text-sm text-gray-600">Activos</div>
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
                placeholder="Nombre o email..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por rol
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="">Todos los roles</option>
                <option value="owner">Propietarios</option>
                <option value="admin">Administradores</option>
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
                : 'No hay usuarios registrados'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">Usuario</th>
                    <th className="text-left p-3 font-medium text-gray-700">Email</th>
                    <th className="text-left p-3 font-medium text-gray-700">Rol</th>
                    <th className="text-left p-3 font-medium text-gray-700">Estado</th>
                    <th className="text-left p-3 font-medium text-gray-700">Fecha de Registro</th>
                    <th className="text-left p-3 font-medium text-gray-700">Último Cambio de Contraseña</th>
                    <th className="text-left p-3 font-medium text-gray-700">Creado por</th>
                    <th className="text-left p-3 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {user.email}
                      </td>
                      <td className="p-3">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(user.is_active)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(user.last_password_change)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {user.created_by_name || 'Sistema'}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/owner/users/${user.id}`)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/owner/users/${user.id}/edit`)}
                            className="text-gray-600 hover:text-gray-800 text-xs"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <div className="text-gray-600">
                  Mostrando {filteredUsers.length} de {users.length} usuarios
                </div>
                <div className="text-gray-600">
                  Última actualización: {formatDate(new Date().toISOString())}
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