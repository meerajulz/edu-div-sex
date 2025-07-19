import React from 'react';
import Link from 'next/link';

const TeacherSidebar: React.FC = () => {
  return (
    <div className='h-full w-64 bg-white shadow-lg p-6'>
      <div className='mb-8'>
        <h2 className='text-sm font-medium mb-4'>Saludiversex - Profesor</h2>
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
            Perfil del Profesor
          </div>
          <Link href='/dashboard/teacher/profile' className='text-gray-600 text-sm block mb-2'>
            Mi Perfil
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Gestión de Alumnos
          </div>
          <Link
            href='/dashboard/add-user'
            className='text-gray-600 text-sm block mb-2'>
            Crear Perfil de Alumno
          </Link>
          <Link href='/dashboard/students' className='text-gray-600 text-sm block mb-2'>
            Ver Lista de Alumnos
          </Link>
          
          <div className='text-pink-600 font-medium text-sm uppercase block mb-2 mt-4'>
            Herramientas
          </div>
          <Link href='/dashboard/evaluation-form' className='text-gray-600 text-sm block mb-2'>
            Formulario de Evaluación
          </Link>
        </div>

        {/* <div>
                    <h3 className="text-gray-400 text-xs uppercase font-medium mb-2">Documentation</h3>
                    <Link 
                        href="/styles" 
                        className="text-gray-600 text-sm block mb-2"
                    >
                        Styles
                    </Link>
                    <Link 
                        href="/components" 
                        className="text-gray-600 text-sm block mb-2"
                    >
                        Components
                    </Link>
                </div> */}
      </nav>
    </div>
  );
};

export default TeacherSidebar;

