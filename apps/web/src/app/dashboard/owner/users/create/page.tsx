'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserFormData {
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'teacher' | 'student' | '';
  password: string;
  confirmPassword: string;
}

export default function OwnerCreateUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'owner' | 'admin' | 'teacher' | 'student') || '';

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: defaultRole,
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [useGeneratedPassword, setUseGeneratedPassword] = useState(true);

  useEffect(() => {
    if (useGeneratedPassword) {
      generatePassword();
    }
  }, [useGeneratedPassword]);

  const generatePassword = async () => {
    try {
      const response = await fetch('/api/admin/generate-password');
      if (response.ok) {
        const data = await response.json();
        setGeneratedPassword(data.password);
        setFormData(prev => ({
          ...prev,
          password: data.password,
          confirmPassword: data.password
        }));
      }
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.role) {
      setError('Todos los campos son requeridos.');
      return;
    }

    if (!useGeneratedPassword && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!useGeneratedPassword && formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el usuario');
      }

      setSuccess(`¡Usuario ${formData.role} creado exitosamente!`);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/owner/users');
      }, 2000);

    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleTitle = () => {
    switch (formData.role) {
      case 'owner':
        return 'Crear Propietario';
      case 'admin':
        return 'Crear Administrador';
      case 'teacher':
        return 'Crear Profesor';
      case 'student':
        return 'Crear Estudiante';
      default:
        return 'Crear Usuario';
    }
  };

  const getRoleDescription = () => {
    switch (formData.role) {
      case 'owner':
        return 'Los propietarios tienen acceso completo al sistema y pueden gestionar todos los usuarios y configuraciones.';
      case 'admin':
        return 'Los administradores pueden gestionar profesores asignados y sus estudiantes.';
      case 'teacher':
        return 'Los profesores pueden crear y gestionar estudiantes bajo su supervisión.';
      case 'student':
        return 'Los estudiantes tienen acceso a las actividades educativas del sistema.';
      default:
        return '';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold">{getRoleTitle()}</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
            {success}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Rol *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              >
                <option value="">Seleccionar rol...</option>
                <option value="owner">Propietario</option>
                <option value="admin">Administrador</option>
                <option value="teacher">Profesor</option>
                <option value="student">Estudiante</option>
              </select>
              {formData.role && (
                <p className="text-sm text-gray-600 mt-1">
                  {getRoleDescription()}
                </p>
              )}
            </div>

            {/* Password Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Configuración de Contraseña</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="generated_password"
                      name="password_type"
                      checked={useGeneratedPassword}
                      onChange={() => setUseGeneratedPassword(true)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                    />
                    <label htmlFor="generated_password" className="ml-2 text-gray-700">
                      Generar contraseña automáticamente (recomendado)
                    </label>
                  </div>
                  {useGeneratedPassword && generatedPassword && (
                    <div className="ml-6 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 mb-1">Contraseña generada:</p>
                      <p className="font-mono text-lg text-blue-900">"{generatedPassword}"</p>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                      >
                        Generar nueva contraseña
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="custom_password"
                      name="password_type"
                      checked={!useGeneratedPassword}
                      onChange={() => setUseGeneratedPassword(false)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                    />
                    <label htmlFor="custom_password" className="ml-2 text-gray-700">
                      Contraseña personalizada
                    </label>
                  </div>
                  
                  {!useGeneratedPassword && (
                    <div className="ml-6 space-y-3">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Contraseña (mínimo 8 caracteres)"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        minLength={8}
                        required={!useGeneratedPassword}
                      />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="Confirmar contraseña"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        required={!useGeneratedPassword}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role-specific warnings */}
            {formData.role === 'owner' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Advertencia</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>Está creando un usuario con permisos de propietario. Este usuario tendrá acceso completo al sistema incluyendo la capacidad de modificar y eliminar todos los datos.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-pink-600 hover:bg-pink-700'
                } text-white font-medium`}
              >
                {isLoading ? 'Creando...' : `Crear ${formData.role || 'Usuario'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}