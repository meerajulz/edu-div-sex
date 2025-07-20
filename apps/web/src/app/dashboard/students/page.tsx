'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWrapper from '../DashboardWrapper';

interface Student {
  id: string;
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

  const getSexDisplay = (sex: string) => {
    return sex === 'male' ? 'Masculino' : 'Femenino';
  };

  const getAbilityLevelText = (level: number) => {
    const levels = {
      1: 'Básico',
      2: 'Principiante',
      3: 'Intermedio',
      4: 'Avanzado',
      5: 'Experto'
    };
    return levels[level as keyof typeof levels] || 'Desconocido';
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
      <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Estudiantes</h1>
          <button
            onClick={() => router.push('/dashboard/add-user')}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Agregar Estudiante
          </button>
        </div>

        {students.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
            <p className="text-lg mb-4">No hay estudiantes registrados</p>
            <button
              onClick={() => router.push('/dashboard/add-user')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Crear primer estudiante
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Nombre Completo</th>
                    <th className="text-left p-4 font-medium text-gray-700">Usuario</th>
                    <th className="text-left p-4 font-medium text-gray-700">Email</th>
                    <th className="text-left p-4 font-medium text-gray-700">Edad</th>
                    <th className="text-left p-4 font-medium text-gray-700">Sexo</th>
                    <th className="text-left p-4 font-medium text-gray-700">Nivel de Lectura</th>
                    <th className="text-left p-4 font-medium text-gray-700">Comprensión</th>
                    <th className="text-left p-4 font-medium text-gray-700">Fecha de Registro</th>
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
                        {student.username}
                      </td>
                      <td className="p-4 text-gray-600">
                        {student.email}
                      </td>
                      <td className="p-4 text-gray-600">
                        {student.age || 'N/A'}
                      </td>
                      <td className="p-4 text-gray-600">
                        {getSexDisplay(student.sex)}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getAbilityLevelText(student.reading_level)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {getAbilityLevelText(student.comprehension_level)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatDate(student.created_at)}
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
                            onClick={() => router.push(`/dashboard/students/${student.id}/edit`)}
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
                  Total: {students.length} estudiante{students.length !== 1 ? 's' : ''}
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