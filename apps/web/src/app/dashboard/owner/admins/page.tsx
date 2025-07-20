'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWrapper from '../../DashboardWrapper';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  is_active: boolean;
  created_at: string;
  last_password_change?: string;
  created_by_name?: string;
}

export default function OwnerAdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users?role=admin');
      
      if (!response.ok) {
        throw new Error('Error al cargar los administradores');
      }
      
      const data = await response.json();
      setAdmins(data.users || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los administradores');
    } finally {
      setIsLoading(false);
    }
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

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getAdminCounts = () => {
    return {
      total: admins.length,
      active: admins.filter(a => a.is_active).length,
      inactive: admins.filter(a => !a.is_active).length,
    };
  };

  const counts = getAdminCounts();

  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Gestionar Administradores</h1>
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Cargando administradores...</div>
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
            <h1 className="text-2xl font-bold mb-6">Gestionar Administradores</h1>
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
          <h1 className="text-2xl font-bold">Gestionar Administradores</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/owner/users/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Crear Administrador
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{counts.total}</div>
            <div className="text-sm text-blue-700">Total Administradores</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-900">{counts.active}</div>
            <div className="text-sm text-green-700">Activos</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-900">{counts.inactive}</div>
            <div className="text-sm text-red-700">Inactivos</div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar administrador
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre o email..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {filteredAdmins.length} de {admins.length} administradores
              </div>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        {filteredAdmins.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
            <p className="text-lg mb-4">
              {searchTerm 
                ? 'No se encontraron administradores que coincidan con la búsqueda'
                : 'No hay administradores registrados'
              }
            </p>
            <button
              onClick={() => router.push('/dashboard/owner/users/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Crear Primer Administrador
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b border-blue-200">
                  <tr>
                    <th className="text-left p-3 font-medium text-blue-900">Administrador</th>
                    <th className="text-left p-3 font-medium text-blue-900">Email</th>
                    <th className="text-left p-3 font-medium text-blue-900">Estado</th>
                    <th className="text-left p-3 font-medium text-blue-900">Fecha de Registro</th>
                    <th className="text-left p-3 font-medium text-blue-900">Último Cambio de Contraseña</th>
                    <th className="text-left p-3 font-medium text-blue-900">Creado por</th>
                    <th className="text-left p-3 font-medium text-blue-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b border-gray-100 hover:bg-blue-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-900 flex items-center">
                          <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold mr-3">
                            {admin.name.charAt(0).toUpperCase()}
                          </span>
                          {admin.name}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {admin.email}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(admin.is_active)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(admin.created_at)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(admin.last_password_change)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {admin.created_by_name || 'Sistema'}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/owner/users/${admin.id}`)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/owner/users/${admin.id}/edit`)}
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
            <div className="bg-blue-50 px-4 py-3 border-t border-blue-200">
              <div className="flex justify-between items-center text-sm">
                <div className="text-blue-700">
                  Mostrando {filteredAdmins.length} de {admins.length} administradores
                </div>
                <div className="text-blue-700">
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