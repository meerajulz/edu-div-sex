'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import FullAlex from '../FullAlex/page';
import WalkingCris from '../WalkingCris/page';
import WalkingDani from '../WalkingDani/page';
import WalkingNoa from '../WalkingNoa/page';
import KidsDisappearAnimation from '../KidsDisappearAnimation/page';

const AnimatedDoor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCris, setShowCris] = useState(false);
  const [showDani, setShowDani] = useState(false);
  const [showNoa, setShowNoa] = useState(false);
  const [showKidsDisappear, setShowKidsDisappear] = useState(false);
  
  // Disappear animation states
  const [crisMoveOut, setCrisMoveOut] = useState(false);
  const [daniMoveOut, setDaniMoveOut] = useState(false);
  const [noaMoveOut, setNoaMoveOut] = useState(false);
  
  // Track if kids are completely gone
  const [isCrisGone, setIsCrisGone] = useState(false);
  const [isDaniGone, setIsDaniGone] = useState(false);
  const [isNoaGone, setIsNoaGone] = useState(false);
  
  // States for Alex's animations
  const [alexContinues, setAlexContinues] = useState(false);
  const [alexShouldDisappear, setAlexShouldDisappear] = useState(false);
  const [isAlexGone, setIsAlexGone] = useState(false);
  
  const [audio] = useState(
    typeof window !== 'undefined' ? new Audio('/ui-sound/cabinet-door-open.mp3') : null
  );
  
  // Add door close audio
  const [doorCloseAudio] = useState(
    typeof window !== 'undefined' ? new Audio('/ui-sound/cabinet-door-open.mp3') : null
  );

  // Flag for tracking if kids disappear animation has started
  const [kidsDisappearStarted, setKidsDisappearStarted] = useState(false);

  const handleDoorClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      audio?.play().catch(console.error);
    }
  };

  // Function to close the door
  const closeDoor = () => {
    doorCloseAudio?.play().catch(console.error);
    setIsOpen(false);
  };

  // Start Cris when Alex is done with initial sequence
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

  // Start Noa when Dani is done
  const handleDaniComplete = () => {
    setTimeout(() => {
      setShowNoa(true);
    }, 2000); // 2 second delay after Dani's last sentence
  };

  // When Noa is complete, close the door first, then start disappear animation
  const handleNoaComplete = () => {
    // Close the door first
    setTimeout(() => {
      closeDoor();
    }, 500); // Close door 0.5 seconds after Noa completes
    
    // Then start the disappear animations after a longer delay
    setTimeout(() => {
      setShowKidsDisappear(true);
      // Signal that kids disappear animation has started - this will trigger Alex's arm-up talking
      setKidsDisappearStarted(true);
    }, 2000); // 2 second delay after Noa's last sentence
  };

  // Individual handlers for kid disappearances
  const handleCrisDisappear = () => {
    setCrisMoveOut(true);
  };
  
  const handleDaniDisappear = () => {
    setDaniMoveOut(true);
  };
  
  const handleNoaDisappear = () => {
    setNoaMoveOut(true);
  };

  // Handle animation completion for each kid
  const handleCrisAnimationComplete = () => {
    setIsCrisGone(true);
  };
  
  const handleDaniAnimationComplete = () => {
    setIsDaniGone(true);
  };
  
  const handleNoaAnimationComplete = () => {
    setIsNoaGone(true);
  };

  // Handle when all kids have disappeared
  const handleDisappearComplete = () => {
    // Trigger Alex to continue talking
    setAlexContinues(true);
    
    // Set a timer to make Alex disappear after he finishes talking
    setTimeout(() => {
      setAlexShouldDisappear(true);
    }, 11000); // 11 seconds after kids disappear (gives time for all 3 audio clips)
  };
  
  // Handle when Alex has completely disappeared
  const handleAlexDisappearComplete = () => {
    setIsAlexGone(true);
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
     
      {/* Alex sequence with added props for disappearing */}
      <FullAlex 
        shouldStartWalking={isOpen} 
        onComplete={handleAlexComplete} 
        shouldContinueTalking={kidsDisappearStarted}
        shouldDisappear={alexShouldDisappear}
        onDisappearComplete={handleAlexDisappearComplete}
      /> 
      
      {/* Cris with move animation when disappearing - NO FADE */}
      <AnimatePresence>
        {showCris && !isCrisGone && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={
              crisMoveOut 
                ? { 
                    x: '100vw', // Move completely off-screen to the right
                  }
                : {}
            }
            transition={
              crisMoveOut 
                ? { 
                    duration: 1.2,
                    ease: "easeInOut" 
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (crisMoveOut) handleCrisAnimationComplete();
            }}
          >
            <WalkingCris 
              shouldStartWalking={showCris} 
              onComplete={handleCrisComplete} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dani with move animation when disappearing - NO FADE */}
      <AnimatePresence>
        {showDani && !isDaniGone && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={
              daniMoveOut 
                ? { 
                    x: '100vw', // Move completely off-screen to the right
                  }
                : {}
            }
            transition={
              daniMoveOut 
                ? { 
                    duration: 1.2,
                    ease: "easeInOut" 
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (daniMoveOut) handleDaniAnimationComplete();
            }}
          >
            <WalkingDani 
              shouldStartWalking={showDani} 
              onComplete={handleDaniComplete} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Noa with move animation when disappearing - NO FADE */}
      <AnimatePresence>
        {showNoa && !isNoaGone && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={
              noaMoveOut 
                ? { 
                    x: '-100vw', // Move completely off-screen to the left
                  }
                : {}
            }
            transition={
              noaMoveOut 
                ? { 
                    duration: 1.2,
                    ease: "easeInOut" 
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (noaMoveOut) handleNoaAnimationComplete();
            }}
          >
            <WalkingNoa 
              shouldStartWalking={showNoa} 
              onComplete={handleNoaComplete} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Disappear animation with callbacks for each kid */}
      <KidsDisappearAnimation 
        shouldStartAnimation={showKidsDisappear} 
        onComplete={handleDisappearComplete}
        onCrisDisappear={handleCrisDisappear}
        onDaniDisappear={handleDaniDisappear}
        onNoaDisappear={handleNoaDisappear}
      />
    </>
  );
};

export default AnimatedDoor;