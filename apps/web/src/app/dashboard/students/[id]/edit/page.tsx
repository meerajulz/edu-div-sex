'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardWrapper from '../../../DashboardWrapper';

interface Student {
  id: number;
  name: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  sex?: 'male' | 'female';
  reading_level: number;
  comprehension_level: number;
  attention_span: number;
  motor_skills: number;
  notes?: string;
  created_at: string;
}

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    reading_level: 1,
    comprehension_level: 1,
    attention_span: 1,
    motor_skills: 1,
    notes: ''
  });

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/students/${studentId}`);
      if (!response.ok) {
        throw new Error('Error al cargar datos del estudiante');
      }
      const data = await response.json();
      const studentData = data.student;
      setStudent(studentData);

      // Set form data
      setFormData({
        name: studentData.name || '',
        age: studentData.age?.toString() || '',
        reading_level: studentData.reading_level || 1,
        comprehension_level: studentData.comprehension_level || 1,
        attention_span: studentData.attention_span || 1,
        motor_skills: studentData.motor_skills || 1,
        notes: studentData.notes || ''
      });
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        reading_level: formData.reading_level,
        comprehension_level: formData.comprehension_level,
        attention_span: formData.attention_span,
        motor_skills: formData.motor_skills,
        notes: formData.notes
      };

      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el estudiante');
      }

      setSuccess('Estudiante actualizado exitosamente');
      setTimeout(() => {
        router.push(`/dashboard/students/${studentId}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el estudiante');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('level') || name === 'attention_span' || name === 'motor_skills' 
        ? parseInt(value) 
        : value
    }));
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

  if (isLoading) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando información del estudiante...</div>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  if (error && !student) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2"
            >
              ← Volver
            </button>
            <h1 className="text-2xl font-bold">Editar Estudiante</h1>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 text-green-500 p-4 rounded-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Edit Form */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Edad
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="0"
                      max="18"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Habilidades</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de Lectura
                    </label>
                    <select
                      name="reading_level"
                      value={formData.reading_level}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>
                          {level} - {getAbilityLevelText(level)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de Comprensión
                    </label>
                    <select
                      name="comprehension_level"
                      value={formData.comprehension_level}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>
                          {level} - {getAbilityLevelText(level)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de Atención
                    </label>
                    <select
                      name="attention_span"
                      value={formData.attention_span}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>
                          {level} - {getAbilityLevelText(level)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Habilidades Motoras
                    </label>
                    <select
                      name="motor_skills"
                      value={formData.motor_skills}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>
                          {level} - {getAbilityLevelText(level)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Notas adicionales sobre el estudiante..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/students/${studentId}`)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}