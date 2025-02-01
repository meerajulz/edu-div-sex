import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className='h-full w-64 bg-white shadow-lg p-6'>
      <div className='mb-8'>
        <h2 className='text-sm font-medium mb-4'>Saludiversex</h2>
      </div>

      <nav className='space-y-6'>
        <div>
          <div className='text-pink-600 font-medium text-sm uppercase block mb-2'>
            Professor Profile
          </div>
          <Link href='' className='text-gray-600 text-sm block mb-2'>
            Create Professor Profile
          </Link>

          <div className='text-pink-600 font-medium text-sm uppercase block mb-2'>
            Alumno Profile
          </div>

          <Link
            href='/dashboard/add-user'
            className='text-gray-600 text-sm block mb-2'>
            Create Alumno Profile
          </Link>
          <Link href='' className='text-gray-600 text-sm block mb-2'>
            Download lista Alumnos
          </Link>
          <Link href='/login' className='text-gray-600 text-sm block mb-2'>
            Salir
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

export default Sidebar;

