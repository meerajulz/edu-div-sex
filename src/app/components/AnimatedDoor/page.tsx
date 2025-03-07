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
  const [alexMoveOut, setAlexMoveOut] = useState(false);
  
  // Track if kids are completely gone
  const [isCrisGone, setIsCrisGone] = useState(false);
  const [isDaniGone, setIsDaniGone] = useState(false);
  const [isNoaGone, setIsNoaGone] = useState(false);
  const [isAlexGone, setIsAlexGone] = useState(false);
  
  // States for Alex's animations
  const [alexContinues, setAlexContinues] = useState(false);
  
  const [audio] = useState(
    typeof window !== 'undefined' ? new Audio('/ui-sound/cabinet-door-open.mp3') : null
  );
  
  // Add door close audio
  const [doorCloseAudio] = useState(
    typeof window !== 'undefined' ? new Audio('/ui-sound/cabinet-door-open.mp3') : null
  );

  const [alexDisappearSound] = useState(
    typeof window !== 'undefined' ? new Audio('/ui-sound/whoosh.mp3') : null
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

  // Handle when Alex has completely disappeared
  const handleAlexAnimationComplete = () => {
    console.log("Alex animation complete, setting isAlexGone to true");
    setIsAlexGone(true);
  };

  
  //Alex has completely disappeared
  const handleAlexDisappear = () => {
    setAlexMoveOut(true);
  };

  // Handle when Alex has completely disappeared
  const handleDisappearComplete = () => {
    // Trigger Alex to continue talking only, but don't make him disappear here
    setAlexContinues(true);
    console.log("Kids disappear complete, Alex will continue talking");
    // Alex's disappearance is now handled by KidsDisappearAnimation
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
      <AnimatePresence>
        {!isAlexGone && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={
              alexMoveOut 
                ? { 
                    y: 600, // Move down off-screen
                    opacity: 0,
                  }
                : {}
            }
            transition={
              alexMoveOut 
                ? { 
                    duration: 1.2,
                    ease: "easeIn" 
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (alexMoveOut) handleAlexAnimationComplete();
            }}
          >
            <FullAlex 
              shouldStartWalking={isOpen} 
              onComplete={handleAlexComplete} 
              shouldContinueTalking={kidsDisappearStarted}
            /> 
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direct Alex disappear animation when triggered */}
      {/* {alexShouldDisappear && !isAlexGone && (
        <motion.div
          className="absolute"
          style={{
            position: 'absolute',
            left: '30%', // Position where Alex should be
            top: '220%',
            transform: 'translateX(-15vw) scale(19.2)',
            zIndex: 60, // Higher than the FullAlex component
            width: '9%',
          }}
          animate={{
            y: 400, // Move down
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
            ease: "easeIn",
          }}
          onAnimationComplete={() => {
            console.log("Direct disappear animation completed");
            setIsAlexGone(true);
          }}
        >
          <div className="relative">
            <div 
              className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
              style={{ 
                width: '150%', 
                height: '25%', 
                bottom: '-12.5%',
                opacity: 0.3
              }}
            />
            
            <div className="relative">
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src="/svg/alex-talk/0-alex-eye-open-mouth-close-arm-down.svg"
                  alt="Alex"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>
      )} */}
      
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

      {/* EMERGENCY ALEX - GUARANTEED TO DISAPPEAR */}
      {/* {showEmergencyAlex && !isAlexGone && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
          {forceDisappearAlex ? (
            // Disappearing Alex
            <motion.div
              className="absolute"
              style={{
                position: 'absolute',
                left: '30%',
                top: '70%',
                width: '9%',
              }}
              initial={{
                transform: 'translateX(-15vw) translateY(0) scale(19.2)',
                opacity: 1
              }}
              animate={{
                transform: 'translateX(-15vw) translateY(400px) scale(19.2)',
                opacity: 0
              }}
              transition={{
                duration: 1.5,
                ease: "easeIn"
              }}
            >
              <div className="relative">
                <div 
                  className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
                  style={{ 
                    width: '150%', 
                    height: '25%', 
                    bottom: '-12.5%',
                    opacity: 0.3
                  }}
                />
                
                <div className="relative">
                  <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                    <Image
                      src="/svg/alex-talk/0-alex-eye-open-mouth-close-arm-down.svg"
                      alt="Alex"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Static Alex before disappearing
            <div
              className="absolute"
              style={{
                position: 'absolute',
                left: '30%',
                top: '70%',
                transform: 'translateX(-15vw) scale(19.2)',
                width: '9%',
              }}
            >
              <div className="relative">
                <div 
                  className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
                  style={{ 
                    width: '150%', 
                    height: '25%', 
                    bottom: '-12.5%',
                    opacity: 0.3
                  }}
                />
                
                <div className="relative">
                  <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                    <Image
                      src="/svg/alex-talk/0-alex-eye-open-mouth-close-arm-down.svg"
                      alt="Alex"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )} */}

      
      {/* Disappear animation with callbacks for each kid */}
      <KidsDisappearAnimation 
        shouldStartAnimation={showKidsDisappear} 
        onComplete={handleDisappearComplete}
        onCrisDisappear={handleCrisDisappear}
        onDaniDisappear={handleDaniDisappear}
        onNoaDisappear={handleNoaDisappear}
        onAlexDisappear={handleAlexDisappear}
      />
    </>
  );
};

export default AnimatedDoor;