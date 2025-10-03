'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWrapper from '../DashboardWrapper';

interface Student {
  id: string;
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  age?: number;
  sex: 'male' | 'female';
  reading_level: number;
  comprehension_level: number;
  attention_span: number;
  motor_skills: number;
  supervision_level?: number;
  created_at: string;
  additional_abilities?: {
    evaluation_responses?: unknown[];
    evaluation_date?: string;
  };
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/students');

      if (!response.ok) {
        throw new Error('Error al cargar los estudiantes');
      }

      const data = await response.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los estudiantes');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Lista de Estudiantes</h1>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando estudiantes...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Lista de Estudiantes</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Estudiantes</h1>
          <button
            onClick={() => router.push('/dashboard/admin/users/create?role=student')}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Agregar Estudiante
          </button>
        </div>

        {students.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
            <p className="text-lg mb-4">No hay estudiantes registrados</p>
            <button
              onClick={() => router.push('/dashboard/admin/users/create?role=student')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Crear primer estudiante
            </button>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Nombre Completo</th>
                      <th className="text-left p-4 font-medium text-gray-700">Email</th>
                      <th className="text-left p-4 font-medium text-gray-700">Nivel de Supervisión</th>
                      <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {student.email}
                        </td>
                        <td className="p-4">
                          {student.supervision_level ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              student.supervision_level === 3 ? 'bg-green-100 text-green-800 border border-green-300' :
                              student.supervision_level === 2 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                              'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                              Nivel {student.supervision_level}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">N/A</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/dashboard/students/${student.id}`)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Ver Detalles
                            </button>
                            <button
                              onClick={() => router.push(`/dashboard/owner/users/${student.user_id}/edit`)}
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
                <div className="flex justify-between items-center text-xs">
                  <div className="text-gray-600">
                    Total: {students.length} estudiante{students.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-gray-600">
                    Última actualización: {formatDate(new Date().toISOString())}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
}