'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWrapper from '../../DashboardWrapper';

interface Teacher {
  id: string;
  email: string;
  name: string;
  role: 'teacher';
  is_active: boolean;
  created_at: string;
  last_password_change?: string;
  created_by_name?: string;
}

export default function OwnerTeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users?role=teacher');
      
      if (!response.ok) {
        throw new Error('Error al cargar los profesores');
      }
      
      const data = await response.json();
      setTeachers(data.users || []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los profesores');
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

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getTeacherCounts = () => {
    return {
      total: teachers.length,
      active: teachers.filter(t => t.is_active).length,
      inactive: teachers.filter(t => !t.is_active).length,
    };
  };

  const counts = getTeacherCounts();

  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Gestionar Profesores</h1>
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Cargando profesores...</div>
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
            <h1 className="text-2xl font-bold mb-6">Gestionar Profesores</h1>
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
          <h1 className="text-2xl font-bold">Gestionar Profesores</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/owner/users/create')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Crear Profesor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-900">{counts.total}</div>
            <div className="text-sm text-green-700">Total Profesores</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-900">{counts.active}</div>
            <div className="text-sm text-emerald-700">Activos</div>
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
                Buscar profesor
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre o email..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {filteredTeachers.length} de {teachers.length} profesores
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
            <p className="text-lg mb-4">
              {searchTerm 
                ? 'No se encontraron profesores que coincidan con la búsqueda'
                : 'No hay profesores registrados'
              }
            </p>
            <button
              onClick={() => router.push('/dashboard/owner/users/create')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Crear Primer Profesor
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-green-50 border-b border-green-200">
                  <tr>
                    <th className="text-left p-3 font-medium text-green-900">Profesor</th>
                    <th className="text-left p-3 font-medium text-green-900">Email</th>
                    <th className="text-left p-3 font-medium text-green-900">Estado</th>
                    <th className="text-left p-3 font-medium text-green-900">Fecha de Registro</th>
                    <th className="text-left p-3 font-medium text-green-900">Último Cambio de Contraseña</th>
                    <th className="text-left p-3 font-medium text-green-900">Creado por</th>
                    <th className="text-left p-3 font-medium text-green-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-gray-100 hover:bg-green-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-900 flex items-center">
                          <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold mr-3">
                            {teacher.name.charAt(0).toUpperCase()}
                          </span>
                          {teacher.name}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {teacher.email}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(teacher.is_active)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(teacher.created_at)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(teacher.last_password_change)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {teacher.created_by_name || 'Sistema'}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/owner/users/${teacher.id}`)}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/owner/users/${teacher.id}/edit`)}
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
            <div className="bg-green-50 px-4 py-3 border-t border-green-200">
              <div className="flex justify-between items-center text-sm">
                <div className="text-green-700">
                  Mostrando {filteredTeachers.length} de {teachers.length} profesores
                </div>
                <div className="text-green-700">
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