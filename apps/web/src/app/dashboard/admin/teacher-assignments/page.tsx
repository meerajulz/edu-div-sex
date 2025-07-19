'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: string;
  teacher_id: string;
  admin_id: string;
  teacher_name: string;
  teacher_email: string;
  admin_name: string;
  admin_email: string;
  student_count: number;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeacherAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<User[]>([]);
  const [availableAdmins, setAvailableAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    teacher_id: '',
    admin_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch assignments
      const assignmentsResponse = await fetch('/api/admin/teacher-assignments');
      if (!assignmentsResponse.ok) {
        throw new Error('Error al cargar las asignaciones');
      }
      const assignmentsData = await assignmentsResponse.json();
      setAssignments(assignmentsData.assignments || []);

      // Fetch available teachers (not yet assigned)
      const teachersResponse = await fetch('/api/admin/users?role=teacher');
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        const assignedTeacherIds = new Set(assignmentsData.assignments.map((a: Assignment) => a.teacher_id));
        const unassignedTeachers = teachersData.users.filter((t: User) => !assignedTeacherIds.has(t.id));
        setAvailableTeachers(unassignedTeachers);
      }

      // Fetch available admins (owners can assign to any admin, admins only see themselves)
      const adminsResponse = await fetch('/api/admin/users?role=admin');
      if (adminsResponse.ok) {
        const adminsData = await adminsResponse.json();
        setAvailableAdmins(adminsData.users || []);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAssignment.teacher_id || !newAssignment.admin_id) {
      setError('Debe seleccionar un profesor y un administrador');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/admin/teacher-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssignment),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la asignación');
      }

      // Reset form and refresh data
      setNewAssignment({ teacher_id: '', admin_id: '' });
      setShowCreateForm(false);
      await fetchData();

    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err instanceof Error ? err.message : 'Error al crear la asignación');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta asignación?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/teacher-assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la asignación');
      }

      await fetchData();
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar la asignación');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Asignaciones Profesor-Administrador</h1>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando asignaciones...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Asignaciones Profesor-Administrador</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Nueva Asignación
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Create Assignment Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Crear Nueva Asignación</h2>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Profesor
                  </label>
                  <select
                    value={newAssignment.teacher_id}
                    onChange={(e) => setNewAssignment({...newAssignment, teacher_id: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  >
                    <option value="">Seleccionar profesor...</option>
                    {availableTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.email})
                      </option>
                    ))}
                  </select>
                  {availableTeachers.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No hay profesores disponibles para asignar
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Administrador
                  </label>
                  <select
                    value={newAssignment.admin_id}
                    onChange={(e) => setNewAssignment({...newAssignment, admin_id: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  >
                    <option value="">Seleccionar administrador...</option>
                    {availableAdmins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} ({admin.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isCreating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-pink-600 hover:bg-pink-700'
                  } text-white`}
                >
                  {isCreating ? 'Creando...' : 'Crear Asignación'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assignments Table */}
        {assignments.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
            <p className="text-lg mb-4">No hay asignaciones registradas</p>
            <p className="text-sm">
              Cree asignaciones para que los administradores puedan gestionar profesores específicos.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Profesor</th>
                    <th className="text-left p-4 font-medium text-gray-700">Email del Profesor</th>
                    <th className="text-left p-4 font-medium text-gray-700">Administrador</th>
                    <th className="text-left p-4 font-medium text-gray-700">Email del Admin</th>
                    <th className="text-left p-4 font-medium text-gray-700">Estudiantes</th>
                    <th className="text-left p-4 font-medium text-gray-700">Fecha de Asignación</th>
                    <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {assignment.teacher_name}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {assignment.teacher_email}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {assignment.admin_name}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {assignment.admin_email}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {assignment.student_count} estudiantes
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatDate(assignment.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/admin/users/${assignment.teacher_id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Ver Profesor
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
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
                  Total: {assignments.length} asignación{assignments.length !== 1 ? 'es' : ''}
                </div>
                <div className="text-sm text-gray-600">
                  Profesores disponibles: {availableTeachers.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}