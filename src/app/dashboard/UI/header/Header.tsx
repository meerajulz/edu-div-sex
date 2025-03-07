import React from 'react';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <div className='bg-pink-600 text-white p-4 flex justify-between items-center'>
      <div className='flex items-center space-x-4'>
        <span className='text-lg font-medium uppercase'>Dashboard</span>
      </div>
      <div className='flex items-center space-x-4'>
        <input
          type='search'
          placeholder='Search here...'
          className='px-4 py-1 rounded-md bg-white/10 text-white placeholder-white/70'
        />
        <img
          src='/api/placeholder/32/32'
          alt='Profile'
          className='w-8 h-8 rounded-full'
        />
      </div>
    </div>
  );
};

export default Header;
