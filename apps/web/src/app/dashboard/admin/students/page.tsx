'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWrapper from '../../DashboardWrapper';

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
  teacher_name?: string;
  is_active: boolean;
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      // Admin can see all students under their assigned teachers
      const response = await fetch('/api/admin/users?role=student');
      
      if (!response.ok) {
        throw new Error('Error al cargar los estudiantes');
      }
      
      const data = await response.json();
      setStudents(data.users || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los estudiantes');
    } finally {
      setIsLoading(false);
    }
  };

  const getSexDisplay = (sex: string) => {
    return sex === 'male' ? 'M' : 'F';
  };

  const getAbilityLevelText = (level: number) => {
    const levels = {
      1: 'Básico',
      2: 'Principiante', 
      3: 'Intermedio',
      4: 'Avanzado',
      5: 'Experto'
    };
    return levels[level as keyof typeof levels] || 'N/A';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTeacher = !filterTeacher || student.teacher_name === filterTeacher;
    
    return matchesSearch && matchesTeacher;
  });

  const uniqueTeachers = [...new Set(students.map(s => s.teacher_name).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Todos los Estudiantes</h1>
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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Todos los Estudiantes</h1>
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
          <h1 className="text-2xl font-bold">Todos los Estudiantes</h1>
          <div className="text-sm text-gray-600">
            Mostrando estudiantes de profesores asignados
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar estudiante
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, apellido, email o usuario..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por profesor
              </label>
              <select
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="">Todos los profesores</option>
                {uniqueTeachers.map((teacher) => (
                  <option key={teacher} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {filteredStudents.length} de {students.length} estudiantes
              </div>
            </div>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
            <p className="text-lg mb-4">
              {searchTerm || filterTeacher 
                ? 'No se encontraron estudiantes que coincidan con los filtros'
                : 'No hay estudiantes registrados'
              }
            </p>
            {!searchTerm && !filterTeacher && (
              <p className="text-sm">Los estudiantes aparecerán aquí cuando los profesores asignados los creen.</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">Estudiante</th>
                    <th className="text-left p-3 font-medium text-gray-700">Usuario/Email</th>
                    <th className="text-left p-3 font-medium text-gray-700">Edad/Sexo</th>
                    <th className="text-left p-3 font-medium text-gray-700">Profesor</th>
                    <th className="text-left p-3 font-medium text-gray-700">Lectura</th>
                    <th className="text-left p-3 font-medium text-gray-700">Comprensión</th>
                    <th className="text-left p-3 font-medium text-gray-700">Estado</th>
                    <th className="text-left p-3 font-medium text-gray-700">Registro</th>
                    <th className="text-left p-3 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-900">
                          {student.first_name} {student.last_name}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-gray-900">{student.username}</div>
                        <div className="text-xs text-gray-500">{student.email}</div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {student.age || 'N/A'} • {getSexDisplay(student.sex)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {student.teacher_name || 'Sin asignar'}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getAbilityLevelText(student.reading_level)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {getAbilityLevelText(student.comprehension_level)}
                        </span>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(student.is_active)}
                      </td>
                      <td className="p-3 text-gray-600 text-xs">
                        {formatDate(student.created_at)}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/students/${student.id}`)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Ver
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
                  Mostrando {filteredStudents.length} de {students.length} estudiantes
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