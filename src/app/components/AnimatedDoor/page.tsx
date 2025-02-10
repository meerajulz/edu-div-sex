'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import WalkingAlex from '../WalkingAlex/page';

const AnimatedDoor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audio] = useState(
    typeof Audio !== 'undefined' ? new Audio('/ui-sound/cabinet-door-open.mp3') : null
  );

  const handleDoorClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      audio?.play().catch(console.error);
    }
  };

  return (
    <>
      <div 
        className="relative w-full h-full cursor-pointer" 
        onClick={handleDoorClick}
      >
        <Image
          src={isOpen ? '/svg/Asset2.svg' : '/svg/Asset1.svg'}
          alt="Door"
          fill
          priority
          className="transition-opacity duration-500 ease-in-out object-fill"
        />
      </div>
      <WalkingAlex shouldStartWalking={isOpen} />
    </>
  );
};

export default AnimatedDoor;