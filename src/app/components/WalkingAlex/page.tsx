'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface WalkingAlexProps {
  shouldStartWalking: boolean;
  onComplete?: () => void;
}

const WalkingAlex: React.FC<WalkingAlexProps> = ({ shouldStartWalking, onComplete }) => {
  const [isWalkingDone, setIsWalkingDone] = useState(false);
  const [currentState, setCurrentState] = useState('initial');
  const [currentImage, setCurrentImage] = useState('/svg/alex-smiling.svg');
  const [hasStartedWalking, setHasStartedWalking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const walkingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const talkingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Audio files with their durations in milliseconds
  const audioSequence = [
    { file: '/audio/alex/intro/1-alex.mp3', duration: 1000 },
    { file: '/audio/alex/intro/2-alex.mp3', duration: 2000 },
    { file: '/audio/alex/intro/3-alex.mp3', duration: 4000 },
    { file: '/audio/alex/intro/4-alex.mp3', duration: 1000 },
    { file: '/audio/alex/intro/5-alex.mp3', duration: 2000 },
    { file: '/audio/alex/intro/6-alex.mp3', duration: 3000 },
    { file: '/audio/alex/intro/7-alex.mp3', duration: 1000 },
    { file: '/audio/alex/intro/8-alex.mp3', duration: 2000 }
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
      setIsTalking(false);
      if (talkingIntervalRef.current) {
        clearInterval(talkingIntervalRef.current);
      }
      
      walkingIntervalRef.current = setInterval(() => {
        setCurrentImage(prev => 
          prev === '/svg/alex-smiling.svg' 
            ? '/svg/alex-default.svg' 
            : '/svg/alex-smiling.svg'
        );
      }, 300);

      return () => {
        if (walkingIntervalRef.current) clearInterval(walkingIntervalRef.current);
      };
    }
  }, [currentState, isWalkingDone]);

  const startHolaSequence = () => {
    const audio = new Audio(audioSequence[0].file);
    setCurrentImage('/svg/alex-smiling.svg');

    // Play audio and start mouth movements immediately
    audio.play().catch(console.error);
    let count = 0;
    talkingIntervalRef.current = setInterval(() => {
      count++;
      // Use modulo 3 to cycle through three states
      switch (count % 3) {
        case 0:
          setCurrentImage('/svg/alex-smiling.svg');  // Closed mouth
          break;
        case 1:
          setCurrentImage('/svg/alex-boca-aberta.svg');  // Open mouth
          break;
        case 2:
          setCurrentImage('/svg/alex-smiling.svg');  // Smiling expression
          break;
      }
    }, 200);

    // After audio finishes, wait a bit then start walking
    setTimeout(() => {
      if (talkingIntervalRef.current) {
        clearInterval(talkingIntervalRef.current);
      }
      setCurrentImage('/svg/alex-smiling.svg');
      setTimeout(() => {
        setCurrentState('walking');
      }, 500); // Small pause before walking
    }, audioSequence[0].duration);
  };

  const startTalkingSequence = async () => {
    let totalDelay = 0;

    const playDialogue = (index: number) => {
      setTimeout(() => {
        const audio = new Audio(audioSequence[index].file);
        audio.play().catch(console.error);
        const duration = audioSequence[index].duration + (index === 1 ? 1000 : 0);
        
        // Start mouth animation with three states
        let count = 0;
        talkingIntervalRef.current = setInterval(() => {
          count++;
          // Use modulo 3 to cycle through three states
          switch (count % 3) {
            case 0:
              setCurrentImage('/svg/alex-boca-aberta.svg');  // Open mouth
              break;
            case 1:
              setCurrentImage('/svg/alex-boca-cerrada-brazo-down-ojos-cerrado.svg');  // Closed eyes
              break;
            case 2:
              setCurrentImage('/svg/alex-smiling.svg');  // Smiling expression
              break;
          }
        }, 200);

        setTimeout(() => {
          if (talkingIntervalRef.current) {
            clearInterval(talkingIntervalRef.current);
          }
          setCurrentImage('/svg/alex-smiling.svg');
          
          if (index === audioSequence.length - 1) {
            if (onComplete) {
              onComplete();
            }
          }
        }, duration);
      }, totalDelay);

      totalDelay += audioSequence[index].duration + 1000 + (index === 1 ? 1000 : 0);
    };

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
        left: '40%',
        width: '9%',
        top: 10,
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        className="absolute left-0 w-full"
        initial={{
          top: '45%',
          scale: 2,
          opacity: shouldStartWalking ? 1 : 0
        }}
        animate={{
          top: '200%',
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
                alt="Alex"
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

export default WalkingAlex;