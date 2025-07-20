'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardWrapper from '../../../DashboardWrapper';

interface UserFormData {
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'teacher' | 'student' | '';
  username: string;
  password: string;
  confirmPassword: string;
}

function OwnerCreateUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'owner' | 'admin' | 'teacher' | 'student') || '';

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: defaultRole,
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [useGeneratedPassword, setUseGeneratedPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createdUser, setCreatedUser] = useState<{name: string, email: string, username?: string, password: string} | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: '' });
  const [usernameTimeout, setUsernameTimeout] = useState<NodeJS.Timeout | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: '' });
  const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null);

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

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }

    setUsernameStatus({ checking: true, available: null, message: 'Verificando...' });

    try {
      const response = await fetch(`/api/admin/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      setUsernameStatus({
        checking: false,
        available: data.available,
        message: data.message
      });
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameStatus({
        checking: false,
        available: null,
        message: 'Error al verificar el nombre de usuario'
      });
    }
  };

  const handleUsernameChange = (value: string) => {
    setFormData({...formData, username: value});
    
    // Clear previous timeout
    if (usernameTimeout) {
      clearTimeout(usernameTimeout);
    }
    
    // Set new timeout for debounced check
    const timeout = setTimeout(() => {
      checkUsername(value);
    }, 500); // 500ms delay
    
    setUsernameTimeout(timeout);
  };

  const checkEmail = async (email: string) => {
    if (!email || email.length < 3) {
      setEmailStatus({ checking: false, available: null, message: '' });
      return;
    }

    setEmailStatus({ checking: true, available: null, message: 'Verificando...' });

    try {
      const response = await fetch(`/api/admin/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      setEmailStatus({
        checking: false,
        available: data.available,
        message: data.message
      });
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailStatus({
        checking: false,
        available: null,
        message: 'Error al verificar el email'
      });
    }
  };

  const handleEmailChange = (value: string) => {
    setFormData({...formData, email: value});
    
    // Clear previous timeout
    if (emailTimeout) {
      clearTimeout(emailTimeout);
    }
    
    // Set new timeout for debounced check
    const timeout = setTimeout(() => {
      checkEmail(value);
    }, 500); // 500ms delay
    
    setEmailTimeout(timeout);
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

    if (formData.role === 'student' && !formData.username) {
      setError('El nombre de usuario es requerido para estudiantes.');
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
          username: formData.role === 'student' ? formData.username : undefined,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el usuario');
      }

      setSuccess(`¡Usuario ${getRoleButtonText()} creado exitosamente!`);
      
      // Store created user credentials for display
      setCreatedUser({
        name: formData.name,
        email: formData.email,
        username: formData.role === 'student' ? formData.username : undefined,
        password: formData.password
      });
      
      // Don't auto-redirect - let user copy credentials first

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

  const getRoleButtonText = () => {
    switch (formData.role) {
      case 'owner':
        return 'Propietario';
      case 'admin':
        return 'Administrador';
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

        {createdUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              📧 Credenciales del Usuario Creado
            </h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium">Nombre:</label>
                  <p className="text-blue-900 bg-white p-2 rounded border">{createdUser.name}</p>
                </div>
                <div>
                  <label className="block text-blue-700 font-medium">Email:</label>
                  <p className="text-blue-900 bg-white p-2 rounded border">{createdUser.email}</p>
                </div>
                {createdUser.username && (
                  <div>
                    <label className="block text-blue-700 font-medium">Nombre de Usuario:</label>
                    <p className="text-blue-900 bg-white p-2 rounded border font-mono">{createdUser.username}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-blue-700 font-medium">Contraseña:</label>
                <p className="text-blue-900 bg-white p-2 rounded border font-mono">&quot;{createdUser.password}&quot;</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
              <p className="text-amber-700 text-sm">
                <strong>⚠️ Importante:</strong> Copie estas credenciales y envíelas al nuevo usuario de forma segura. 
                Esta información no se mostrará nuevamente.
              </p>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(`Email: ${createdUser.email}\nContraseña: "${createdUser.password}"`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                📋 Copiar Credenciales
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/owner/users')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Ver Todos los Usuarios
              </button>
            </div>
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
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 pr-10 ${
                    emailStatus.available === true ? 'border-green-500 focus:ring-green-400' :
                    emailStatus.available === false ? 'border-red-500 focus:ring-red-400' :
                    'border-gray-300 focus:ring-pink-400'
                  }`}
                  required
                />
                {emailStatus.checking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                  </div>
                )}
                {!emailStatus.checking && emailStatus.available === true && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
                {!emailStatus.checking && emailStatus.available === false && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✕</span>
                    </div>
                  </div>
                )}
              </div>
              {emailStatus.message && (
                <p className={`text-sm mt-1 ${
                  emailStatus.available === true ? 'text-green-600' :
                  emailStatus.available === false ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {emailStatus.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Rol *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as 'owner' | 'admin' | 'teacher' | 'student' | ''})}
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

            {/* Username field - only for students */}
            {formData.role === 'student' && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nombre de Usuario *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 pr-10 ${
                      usernameStatus.available === true ? 'border-green-500 focus:ring-green-400' :
                      usernameStatus.available === false ? 'border-red-500 focus:ring-red-400' :
                      'border-gray-300 focus:ring-pink-400'
                    }`}
                    placeholder="Ej: juanperez123"
                    required
                  />
                  {usernameStatus.checking && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                    </div>
                  )}
                  {!usernameStatus.checking && usernameStatus.available === true && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                  {!usernameStatus.checking && usernameStatus.available === false && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✕</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-1">
                  {usernameStatus.message && (
                    <p className={`text-sm ${
                      usernameStatus.available === true ? 'text-green-600' :
                      usernameStatus.available === false ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {usernameStatus.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    El estudiante usará este nombre de usuario para iniciar sesión en lugar del email.
                  </p>
                </div>
              </div>
            )}

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
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="Contraseña (mínimo 8 caracteres)"
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                          minLength={8}
                          required={!useGeneratedPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.066 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          placeholder="Confirmar contraseña"
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                          required={!useGeneratedPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.066 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
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

export default function OwnerCreateUserPage() {
  return (
    <Suspense fallback={<div className="p-6"><div className="text-center">Cargando...</div></div>}>
      <OwnerCreateUserForm />
    </Suspense>
  );
}