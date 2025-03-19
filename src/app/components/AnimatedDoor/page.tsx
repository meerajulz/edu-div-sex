'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { playAudio } from '../../utils/audioHandler'; // ✅ Import audio utility
import FullAlex from '../FullAlex/FullAlex';
import WalkingCris from '../WalkingCris/WalkingCris';
import WalkingDani from '../WalkingDani/WalkingDani';
import WalkingNoa from '../WalkingNoa/WalkingNoa';
import KidsDisappearAnimation from '../KidsDisappearAnimation/KidsDisappearAnimation';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alexContinues, setAlexContinues] = useState(false);

  // ✅ Flag for tracking if kids disappear animation has started
  const [kidsDisappearStarted, setKidsDisappearStarted] = useState(false);

  const handleDoorClick = async () => {
    if (!isOpen) {
      setIsOpen(true);
      await playAudio('/ui-sound/cabinet-door-open.mp3'); // ✅ Use safe playback
    }
  };

  // ✅ Function to close the door with safe audio playback
  const closeDoor = async () => {
    await playAudio('/ui-sound/cabinet-door-close.mp3'); // ✅ Use safe playback
    setIsOpen(false);
  };

  // Start Cris when Alex is done with the initial sequence
  const handleAlexComplete = () => {
    setTimeout(() => {
      setShowCris(true);
    }, 2000);
  };

  // Start Dani when Cris is done
  const handleCrisComplete = () => {
    setTimeout(() => {
      setShowDani(true);
    }, 2000);
  };

  // Start Noa when Dani is done
  const handleDaniComplete = () => {
    setTimeout(() => {
      setShowNoa(true);
    }, 2000);
  };

  // ✅ When Noa is complete, close the door first, then start disappear animation
  const handleNoaComplete = async () => {
    setTimeout(() => {
      closeDoor(); // ✅ Play door close sound safely
    }, 500); 

    setTimeout(() => {
      setShowKidsDisappear(true);
      setKidsDisappearStarted(true); // ✅ Signal Alex to continue talking
    }, 2000);
  };

  // Individual handlers for kid disappearances
  const handleCrisDisappear = () => setCrisMoveOut(true);
  const handleDaniDisappear = () => setDaniMoveOut(true);
  const handleNoaDisappear = () => setNoaMoveOut(true);
  
  // Handle animation completion for each kid
  const handleCrisAnimationComplete = () => setIsCrisGone(true);
  const handleDaniAnimationComplete = () => setIsDaniGone(true);
  const handleNoaAnimationComplete = () => setIsNoaGone(true);
  const handleAlexAnimationComplete = () => setIsAlexGone(true);

  const handleAlexDisappear = () => setAlexMoveOut(true);

  // When disappear animation is complete, let Alex continue talking
  const handleDisappearComplete = () => {
    setAlexContinues(true);
  };

  return (
    <>
      {/* ✅ Door Image */}
      <div className="relative w-full h-full cursor-pointer" onClick={handleDoorClick}>
        <Image
          src={isOpen ? '/svg/Asset2-2.svg' : '/svg/Asset1-1.svg'}
          alt="Door"
          fill
          priority
          className="transition-opacity duration-500 ease-in-out object-fill"
        />
      </div>

      {/* ✅ Alex */}
      <AnimatePresence>
        {!isAlexGone && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={alexMoveOut ? { y: 600, opacity: 1 } : {}}
            transition={alexMoveOut ? { duration: 1.2, ease: "easeIn" } : {}}
            onAnimationComplete={alexMoveOut ? handleAlexAnimationComplete : undefined}
          >
            <FullAlex 
              shouldStartWalking={isOpen} 
              onComplete={handleAlexComplete} 
              shouldContinueTalking={kidsDisappearStarted}
            /> 
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Cris */}
      <AnimatePresence>
        {showCris && !isCrisGone && (
          <motion.div 
            style={{ zIndex: 50 }} 
            animate={crisMoveOut ? { x: '100vw' } : {}}
            transition={crisMoveOut ? { duration: 1.2, ease: "easeInOut" } : {}}
            onAnimationComplete={crisMoveOut ? handleCrisAnimationComplete : undefined}
          >
            <WalkingCris shouldStartWalking={showCris} onComplete={handleCrisComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ✅ Dani */}
      <AnimatePresence>
        {showDani && !isDaniGone && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={daniMoveOut ? { x: '100vw' } : {}}
            transition={daniMoveOut ? { duration: 1.2, ease: "easeInOut" } : {}}
            onAnimationComplete={daniMoveOut ? handleDaniAnimationComplete : undefined}
          >
            <WalkingDani shouldStartWalking={showDani} onComplete={handleDaniComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ✅ Noa */}
      <AnimatePresence>
        {showNoa && !isNoaGone && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={noaMoveOut ? { x: '-100vw' } : {}}
            transition={noaMoveOut ? { duration: 1.2, ease: "easeInOut" } : {}}
            onAnimationComplete={noaMoveOut ? handleNoaAnimationComplete : undefined}
          >
            <WalkingNoa shouldStartWalking={showNoa} onComplete={handleNoaComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ✅ Disappear animation for kids */}
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
