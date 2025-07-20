'use client'

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardWrapper from '../../../DashboardWrapper';

interface UserCredentials {
  id: string;
  name: string;
  email: string;
  username?: string;
  password: string;
  role: string;
}

function AdminUserCreatedPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credentials, setCredentials] = useState<UserCredentials | null>(null);

  useEffect(() => {
    // Get credentials from URL params (Base64 encoded for security)
    const credentialsParam = searchParams.get('credentials');
    if (credentialsParam) {
      try {
        const decoded = JSON.parse(atob(credentialsParam));
        setCredentials(decoded);
      } catch (error) {
        console.error('Error parsing credentials:', error);
        router.push('/dashboard/admin/users');
      }
    } else {
      // If no credentials, redirect back to appropriate list
      router.push('/dashboard/admin/users');
    }
  }, [searchParams, router]);

  const handleCopyCredentials = () => {
    if (!credentials) return;
    
    const credentialsText = credentials.username 
      ? `Nombre: ${credentials.name}\nEmail: ${credentials.email}\nNombre de Usuario: ${credentials.username}\nContraseña: "${credentials.password}"`
      : `Nombre: ${credentials.name}\nEmail: ${credentials.email}\nContraseña: "${credentials.password}"`;
    
    navigator.clipboard.writeText(credentialsText);
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'teacher': return 'Profesor';
      case 'student': return 'Estudiante';
      default: return 'Usuario';
    }
  };

  const getListUrl = () => {
    if (!credentials) return '/dashboard/admin/users';
    return credentials.role === 'teacher' ? '/dashboard/admin/teachers' : '/dashboard/admin/students';
  };


  if (!credentials) {
    return (
      <DashboardWrapper>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡{getRoleText(credentials.role)} Creado Exitosamente!
            </h1>
            <p className="text-gray-600">
              El usuario ha sido creado correctamente. Copie las credenciales y envíelas de forma segura.
            </p>
          </div>

          {/* Credentials Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2H7v-2H5v-2l3.257-3.257A6 6 0 0117 7z"></path>
              </svg>
              Credenciales del Usuario
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-1">Nombre:</label>
                  <p className="text-blue-900 bg-white p-3 rounded border font-medium">{credentials.name}</p>
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-1">Rol:</label>
                  <p className="text-blue-900 bg-white p-3 rounded border font-medium">{getRoleText(credentials.role)}</p>
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-1">Email:</label>
                  <p className="text-blue-900 bg-white p-3 rounded border font-mono text-sm">{credentials.email}</p>
                </div>
                {credentials.username && (
                  <div>
                    <label className="block text-blue-700 font-medium mb-1">Nombre de Usuario:</label>
                    <p className="text-blue-900 bg-white p-3 rounded border font-mono text-sm">{credentials.username}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-blue-700 font-medium mb-1">Contraseña:</label>
                <p className="text-blue-900 bg-white p-3 rounded border font-mono text-lg font-semibold">&quot;{credentials.password}&quot;</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-1">⚠️ Importante</h4>
                <p className="text-sm text-amber-700">
                  Copie estas credenciales y envíelas al nuevo usuario de forma segura. 
                  Esta información no se mostrará nuevamente por razones de seguridad.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyCredentials}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
              📋 Copiar Credenciales
            </button>
            
            <button
              onClick={() => router.push(getListUrl())}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              📋 Ver Lista de {getRoleText(credentials.role)}s
            </button>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default function AdminUserCreatedPage() {
  return (
    <Suspense fallback={
      <DashboardWrapper>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </DashboardWrapper>
    }>
      <AdminUserCreatedPageContent />
    </Suspense>
  );
}