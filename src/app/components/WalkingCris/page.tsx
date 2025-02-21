'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface WalkingCrisProps {
  shouldStartWalking: boolean;
}

const WalkingCris: React.FC<WalkingCrisProps> = ({ shouldStartWalking }) => {
  const [isWalkingDone, setIsWalkingDone] = useState(false);
  const [currentState, setCurrentState] = useState('initial');
  const [currentImage, setCurrentImage] = useState('/svg/cris/cris-smiling.svg');
  const [hasStartedWalking, setHasStartedWalking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const walkingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const talkingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Audio files with their durations in milliseconds
  const audioSequence = [
    { file: '/audio/cris/intro/1-cris.mp3', duration: 1000 }, // Initial Hola
    { file: '/audio/cris/intro/2-cris.mp3', duration: 1000 }, // Me encantan los animales
    { file: '/audio/cris/intro/3-cris.mp3', duration: 4000 }, // Longer animals talk
  ];

  // Initialize audio
  useEffect(() => {
    const audioElements = audioSequence.map(({ file }) => new Audio(file));
    
    return () => {
      if (walkingIntervalRef.current) clearInterval(walkingIntervalRef.current);
      if (talkingIntervalRef.current) clearInterval(talkingIntervalRef.current);
    };
  }, []);

  // Start sequence when door opens
  useEffect(() => {
    if (shouldStartWalking && !hasStartedWalking) {
      setTimeout(() => {
        setHasStartedWalking(true);
        startHolaSequence();
      }, 2000);
    }
  }, [shouldStartWalking]);

  // Handle walking animation
  useEffect(() => {
    if (currentState === 'walking' && !isWalkingDone) {
      walkingIntervalRef.current = setInterval(() => {
        setCurrentImage(prev => 
          prev === '/svg/cris/cris-smiling.svg' 
            ? '/svg/cris/cris-default.svg' 
            : '/svg/cris/cris-smiling.svg'
        );
      }, 300);

      return () => {
        if (walkingIntervalRef.current) clearInterval(walkingIntervalRef.current);
      };
    }
  }, [currentState, isWalkingDone]);

  // Handle mouth animation when talking
  useEffect(() => {
    if (isTalking) {
      talkingIntervalRef.current = setInterval(() => {
        setCurrentImage(prev => 
          prev === '/svg/cris/cris-boca-abierta-ojos-cerrado.svg'
            ? '/svg/cris/cris-boca-cerrada-ojos-abierto.svg'
            : '/svg/cris/cris-boca-abierta-ojos-cerrado.svg'
        );
      }, 200);
    } else {
      if (talkingIntervalRef.current) {
        clearInterval(talkingIntervalRef.current);
        setCurrentImage('/svg/cris/cris-smiling.svg');
      }
    }

    return () => {
      if (talkingIntervalRef.current) clearInterval(talkingIntervalRef.current);
    };
  }, [isTalking]);

  const startHolaSequence = () => {
    const audio = new Audio(audioSequence[0].file);
    audio.play().catch(console.error);
    setIsTalking(true);
    
    setTimeout(() => {
      setIsTalking(false);
      setCurrentState('walking');
    }, audioSequence[0].duration);
  };

  const startTalkingSequence = async () => {
    let totalDelay = 0;

    // Function to play a single dialogue with pause
    const playDialogue = (index: number) => {
      setTimeout(() => {
        const audio = new Audio(audioSequence[index].file);
        audio.play().catch(console.error);
        setIsTalking(true);

        // Stop talking after audio duration
        setTimeout(() => {
          setIsTalking(false);
          
          // If it's the last dialogue, set final image
          if (index === audioSequence.length - 1) {
            setCurrentImage('/svg/cris/cris-smiling.svg');
          }
        }, audioSequence[index].duration);
      }, totalDelay);

      totalDelay += audioSequence[index].duration + 1000; // Add 1 second pause
    };

    // Play all dialogues starting from index 1
    for (let i = 1; i < audioSequence.length; i++) {
      playDialogue(i);
    }
  };

  const handleWalkingComplete = () => {
    setIsWalkingDone(true);
    setCurrentState('final');
    if (walkingIntervalRef.current) {
      clearInterval(walkingIntervalRef.current);
    }
    startTalkingSequence();
  };

  if (!hasStartedWalking) return null;

  return (
    <div 
      className="absolute w-full h-full"
      style={{
        position: 'absolute',
        left: '40%', // Start at same position as Alex
        width: '9%',
        top: 10,
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        className="absolute left-0 w-full"
        initial={{
          top: '45%',  // Start at door position
          left: '0%',
          scale: 2,
          opacity: shouldStartWalking ? 1 : 0
        }}
        animate={{
          top: '200%',    // Move down vertically
          left: '320px',   // Move left to stand beside Alex
          scale: 8,
          opacity: 1,
        }}
        transition={{
          delay: 2,
          duration: 6,
          ease: "easeInOut",
        }}
        onAnimationComplete={handleWalkingComplete}
      >
        <div className="relative">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
            initial={{ width: '100%', height: '25%', bottom: '-12.5%' }}
            animate={{
              width: '150%',
              height: '25%',
              bottom: '-12.5%',
              opacity: 0.3
            }}
            transition={{ 
              duration: 4,
              ease: "easeInOut"
            }}
          />
          <motion.div
            animate={currentState === 'walking' ? {
              y: ['-2%', '2%'],
              rotate: [-2, 2],
              transition: {
                repeat: Infinity,
                duration: 0.4,
                ease: "linear"
              }
            } : {
              y: 0,
              rotate: 0,
              transition: {
                duration: 0.5,
                ease: "easeOut"
              }
            }}
          >
            <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
              <Image
                src={currentImage}
                alt="Cris"
                fill
                className="object-contain transition-opacity duration-75"
                priority
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalkingCris;
