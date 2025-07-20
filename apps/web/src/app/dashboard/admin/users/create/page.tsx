'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardWrapper from '../../../DashboardWrapper';

interface UserFormData {
  name: string;
  email: string;
  role: 'teacher' | 'student' | '';
  password: string;
  confirmPassword: string;
}

function CreateUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'teacher' | 'student') || '';

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

      setSuccess(`¡Usuario ${getRoleButtonText()} creado exitosamente!`);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        if (formData.role === 'teacher') {
          router.push('/dashboard/admin/teachers');
        } else {
          router.push('/dashboard/admin/students');
        }
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
      case 'teacher':
        return 'Crear Profesor';
      case 'student':
        return 'Crear Estudiante';
      default:
        return 'Crear Usuario';
    }
  };

  const getRoleButtonText = () => {
    switch (formData.role) {
      case 'teacher':
        return 'Profesor';
      case 'student':
        return 'Estudiante';
      default:
        return 'Usuario';
    }
  };

  return (
    <DashboardWrapper>
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
                onChange={(e) => setFormData({...formData, role: e.target.value as 'teacher' | 'student' | ''})}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              >
                <option value="">Seleccionar rol...</option>
                <option value="teacher">Profesor</option>
                <option value="student">Estudiante</option>
              </select>
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
                      <p className="font-mono text-lg text-blue-900">&quot;{generatedPassword}&quot;</p>
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
                {isLoading ? 'Creando...' : `Crear ${getRoleButtonText()}`}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </DashboardWrapper>
  );
}

export default function CreateUserPage() {
  return (
    <Suspense fallback={<div className="p-6"><div className="text-center">Cargando...</div></div>}>
      <CreateUserForm />
    </Suspense>
  );
}