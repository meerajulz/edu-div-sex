'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWrapper from '../../DashboardWrapper';

interface Teacher {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  created_by_name?: string;
  student_count?: number;
}

export default function AdminTeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profesores Asignados</h1>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando profesores...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profesores Asignados</h1>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profesores Asignados</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/admin/teacher-assignments')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Asignar Profesores
            </button>
            <button
              onClick={() => router.push('/dashboard/admin/users/create?role=teacher')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Crear Profesor
            </button>
          </div>
        </div>

        {teachers.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
            <p className="text-lg mb-4">No hay profesores asignados</p>
            <button
              onClick={() => router.push('/dashboard/admin/users/create?role=teacher')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Crear primer profesor
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Nombre</th>
                    <th className="text-left p-4 font-medium text-gray-700">Email</th>
                    <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left p-4 font-medium text-gray-700">Estudiantes</th>
                    <th className="text-left p-4 font-medium text-gray-700">Fecha de Creación</th>
                    <th className="text-left p-4 font-medium text-gray-700">Creado por</th>
                    <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {teacher.first_name && teacher.last_name 
                            ? `${teacher.first_name} ${teacher.last_name}`
                            : teacher.name
                          }
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {teacher.email}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(teacher.is_active)}
                      </td>
                      <td className="p-4 text-gray-600">
                        {teacher.student_count || 0} estudiantes
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatDate(teacher.created_at)}
                      </td>
                      <td className="p-4 text-gray-600">
                        {teacher.created_by_name || 'Sistema'}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/admin/users/${teacher.id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Ver Detalles
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/admin/users/${teacher.id}/edit`)}
                            className="text-gray-600 hover:text-gray-800 text-sm"
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
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Total: {teachers.length} profesor{teachers.length !== 1 ? 'es' : ''}
                </div>
                <div className="text-sm text-gray-600">
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