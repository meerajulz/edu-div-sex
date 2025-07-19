import React from 'react';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  userName: string;
  userEmail?: string;
  userRole?: string;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userName, userEmail, userRole, isLoading = false }) => {
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
        
        {/* User Avatar */}
        <div className='relative'>
          <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
            <span className='text-sm font-medium'>
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className='text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors'
          title='Cerrar sesión'
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default Header;
