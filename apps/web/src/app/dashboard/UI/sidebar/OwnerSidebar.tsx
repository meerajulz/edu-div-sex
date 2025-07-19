import React from 'react';
import Link from 'next/link';
import ActivityTree from './ActivityTree';

const OwnerSidebar: React.FC = () => {
  return (
    <div className='h-full w-64 bg-white shadow-lg p-6'>
      <div className='mb-8'>
        <h2 className='text-sm font-medium mb-4'>Saludiversex - Owner</h2>
      </div>

      <nav className='space-y-6'>
        <div>
          <div className='text-pink-600 font-medium text-sm uppercase block mb-2'>
            Panel de Control
          </div>
          <Link href='/dashboard' className='text-gray-600 text-sm block mb-2'>
            Vista General del Sistema
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Gestión de Usuarios
          </div>
          <Link href='/dashboard/owner/users' className='text-gray-600 text-sm block mb-2'>
            Todos los Usuarios
          </Link>
          <Link href='/dashboard/owner/users/create' className='text-gray-600 text-sm block mb-2'>
            Crear Nuevo Usuario
          </Link>
          <Link href='/dashboard/owner/admins' className='text-gray-600 text-sm block mb-2'>
            Gestionar Administradores
          </Link>
          <Link href='/dashboard/owner/teachers' className='text-gray-600 text-sm block mb-2'>
            Gestionar Profesores
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Configuración del Sistema
          </div>
          <Link href='/dashboard/owner/settings' className='text-gray-600 text-sm block mb-2'>
            Configuración Global
          </Link>
          <Link href='/dashboard/owner/activities' className='text-gray-600 text-sm block mb-2'>
            Gestionar Actividades
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Estudiantes y Datos
          </div>
          <Link href='/dashboard/owner/students' className='text-gray-600 text-sm block mb-2'>
            Todos los Estudiantes
          </Link>
          <Link href='/dashboard/owner/analytics' className='text-gray-600 text-sm block mb-2'>
            Análisis del Sistema
          </Link>
          <Link href='/dashboard/owner/data-export' className='text-gray-600 text-sm block mb-2'>
            Exportar Datos
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Herramientas de Administración
          </div>
          <Link href='/dashboard/owner/password-tools' className='text-gray-600 text-sm block mb-2'>
            Herramientas de Contraseña
          </Link>
          <Link href='/dashboard/owner/backup' className='text-gray-600 text-sm block mb-2'>
            Respaldo y Restauración
          </Link>

          {/* Activity Tree */}
          <ActivityTree />
        </div>
      </nav>
    </div>
  );
};

export default OwnerSidebar;