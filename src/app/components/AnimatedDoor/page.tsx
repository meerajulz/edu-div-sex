'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import FullAlex from '../FullAlex/page';
import WalkingCris from '../WalkingCris/page';
import WalkingDani from '../WalkingDani/page';

const AnimatedDoor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCris, setShowCris] = useState(false);
  const [showDani, setShowDani] = useState(false);
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

  // Start Dani when Cris is done
  const handleCrisComplete = () => {
    setTimeout(() => {
      setShowDani(true);
    }, 2000); // 2 second delay after Cris's last sentence
  };

  // Handle when Dani is complete (for future functionality)
  const handleDaniComplete = () => {
    console.log("Dani animation complete");
    // Add any future actions here
  };

  return (
    <>
      <div 
        className="relative w-full h-full cursor-pointer" 
        onClick={handleDoorClick}
      >
        <Image
          src={isOpen ? '/svg/Asset2-2.svg' : '/svg/Asset1-1.svg'}
          alt="Door"
          fill
          priority
          className="transition-opacity duration-500 ease-in-out object-fill"
        />
      </div>
     
      <FullAlex shouldStartWalking={isOpen} onComplete={handleAlexComplete} /> 
      
      {showCris && <WalkingCris shouldStartWalking={showCris} onComplete={handleCrisComplete} />}
      
      {showDani && <WalkingDani shouldStartWalking={showDani} onComplete={handleDaniComplete} />}
    </>
  );
};

export default AnimatedDoor;