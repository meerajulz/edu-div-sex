'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import DashboardWrapper from '../DashboardWrapper';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      owner: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Propietario' },
      admin: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Administrador' },
      teacher: { bg: 'bg-green-100', text: 'text-green-800', label: 'Profesor' },
      student: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Estudiante' }
    };
    const config = roleConfig[role as keyof typeof roleConfig] || { bg: 'bg-gray-100', text: 'text-gray-800', label: role };
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const userRole = (session?.user as { role?: string })?.role;

  return (
    <DashboardWrapper>
      <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
        </div>

        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <p className="mt-1 text-gray-900">{session?.user?.name || 'Cargando...'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{session?.user?.email || 'Cargando...'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <div className="mt-1">
                {userRole ? getRoleBadge(userRole) : <span className="text-gray-500">Cargando...</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID de Usuario</label>
              <p className="mt-1 text-gray-900 font-mono">#{session?.user?.id || 'Cargando...'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/profile/change-password"
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m-2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0H7m8 0a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Cambiar Contraseña</p>
                <p className="text-sm text-gray-600">Actualizar tu contraseña de acceso</p>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ir al Dashboard</p>
                <p className="text-sm text-gray-600">Volver al panel principal</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Seguridad de la Cuenta</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-900">Cuenta Activa</p>
                  <p className="text-sm text-green-700">Tu cuenta está activa y funcional</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Contraseña Segura</p>
                  <p className="text-sm text-blue-700">Cambia tu contraseña regularmente</p>
                </div>
              </div>
              <Link
                href="/dashboard/profile/change-password"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Cambiar →
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardWrapper>
  );
}