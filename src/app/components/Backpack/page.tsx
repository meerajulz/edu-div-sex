'use client';

import React from 'react';
import Image from 'next/image';

interface BackpackProps {
  scale?: number;
}

const Backpack: React.FC<BackpackProps> = ({ scale = 1 }) => {
  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        width: `${12 * scale}%`,
        height: `${16 * scale}%`,
        bottom: '2%',
        left: '67%',
        right: '8%',
        //zIndex: 2, // Make sure it's above the background but below other interactive elements
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src="/svg/mochila.svg"
          alt="Backpack"
          fill
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Backpack;