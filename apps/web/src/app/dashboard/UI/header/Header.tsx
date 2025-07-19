import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface HeaderProps {
  userName: string;
  userEmail?: string;
  userRole?: string;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userName, userEmail, userRole, isLoading = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div className='bg-pink-600 text-white p-4 flex justify-between items-center'>
      <div className='flex items-center space-x-4'>
        <span className='text-lg font-medium uppercase'>Dashboard</span>
        {userRole && (
          <span className='text-sm bg-white/20 px-3 py-1 rounded-full'>
            {userRole}
          </span>
        )}
      </div>
      <div className='flex items-center space-x-4'>
        {/* User Info */}
        <div className='text-right'>
          {isLoading ? (
            <div className='text-sm text-white/80'>Cargando...</div>
          ) : (
            <>
              <div className='text-sm font-medium'>{userName}</div>
              {userEmail && (
                <div className='text-xs text-white/80'>{userEmail}</div>
              )}
            </>
          )}
        </div>
        
        {/* User Menu */}
        <div className='relative'>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='flex items-center space-x-2 hover:bg-white/10 p-2 rounded transition-colors'
          >
            <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
              <span className='text-sm font-medium'>
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'>
              <div className='px-4 py-2 border-b border-gray-100'>
                <p className='text-sm font-medium text-gray-900'>{userName}</p>
                {userEmail && <p className='text-xs text-gray-600'>{userEmail}</p>}
              </div>
              <Link
                href='/dashboard/profile'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                onClick={() => setShowDropdown(false)}
              >
                Mi Perfil
              </Link>
              <Link
                href='/dashboard/profile/change-password'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                onClick={() => setShowDropdown(false)}
              >
                Cambiar Contraseña
              </Link>
              <div className='border-t border-gray-100 mt-1'>
                <button
                  onClick={handleSignOut}
                  className='w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50'
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
