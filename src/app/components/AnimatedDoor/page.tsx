'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import WalkingAlex from '../WalkingAlex/page';
import WalkingCris from '../WalkingCris/page';

const AnimatedDoor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCris, setShowCris] = useState(false);
  const [audio] = useState(
    typeof Audio !== 'undefined' ? new Audio('/ui-sound/cabinet-door-open.mp3') : null
  );

  const handleDoorClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      audio?.play().catch(console.error);
    }
  };

  // Start Cris when Alex is done
  const handleAlexComplete = () => {
    setTimeout(() => {
      setShowCris(true);
    }, 2000); // 2 second delay after Alex's last sentence
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
      <WalkingAlex shouldStartWalking={isOpen} onComplete={handleAlexComplete} />
      <WalkingCris shouldStartWalking={showCris} />
    </>
  );
};

export default AnimatedDoor;