'use client';

import React from 'react';
import Image from 'next/image';

const SunGif: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      <Image
        src="/image/SUN_full.gif"
        alt="Animated Sun"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

export default SunGif;