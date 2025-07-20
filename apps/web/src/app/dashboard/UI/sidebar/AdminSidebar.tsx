import React from 'react';
import Link from 'next/link';
import ActivityTree from './ActivityTree';

const AdminSidebar: React.FC = () => {
  return (
    <div className='h-full w-64 bg-white shadow-lg p-6'>
      <div className='mb-8'>
        <h2 className='text-sm font-medium mb-4'>Saludiversex - Admin</h2>
      </div>

      <nav className='space-y-6'>
        <div>
          <div className='text-pink-600 font-medium text-sm uppercase block mb-2'>
            Panel de Control
          </div>
          <Link href='/dashboard' className='text-gray-600 text-sm block mb-2'>
            Vista General
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Gestión de Profesores
          </div>
          <Link href='/dashboard/admin/teachers' className='text-gray-600 text-sm block mb-2'>
            Ver Profesores Asignados
          </Link>
          <Link href='/dashboard/admin/users/create?role=teacher' className='text-gray-600 text-sm block mb-2'>
            Crear Profesor
          </Link>
          <Link href='/dashboard/admin/teacher-assignments' className='text-gray-600 text-sm block mb-2'>
            Asignar Profesores
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Estudiantes
          </div>
          <Link href='/dashboard/admin/students' className='text-gray-600 text-sm block mb-2'>
            Ver Todos los Estudiantes
          </Link>
          <Link href='/dashboard/admin/users/create?role=student' className='text-gray-600 text-sm block mb-2'>
            Crear Estudiante
          </Link>
          <Link href='/dashboard/admin/reports' className='text-gray-600 text-sm block mb-2'>
            Reportes y Estadísticas
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Herramientas
          </div>
          <Link href='/dashboard/admin/password-reset' className='text-gray-600 text-sm block mb-2'>
            Restablecer Contraseñas
          </Link>

          {/* Activity Tree */}
          <ActivityTree />
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;