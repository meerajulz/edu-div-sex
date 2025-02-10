'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface WalkingAlexProps {
  shouldStartWalking: boolean;
}

const WalkingAlex: React.FC<WalkingAlexProps> = ({ shouldStartWalking }) => {
  const [isWalkingDone, setIsWalkingDone] = useState(false);
  const [currentState, setCurrentState] = useState('initial');
  const [currentImage, setCurrentImage] = useState('/svg/alex-smiling.svg');
  const [hasStartedWalking, setHasStartedWalking] = useState(false);
  const walkingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Audio refs
  const holaAudio = useRef<HTMLAudioElement | null>(null);
  const clickAventuraAudio = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    let mounted = true;
    
    const initAudio = () => {
      holaAudio.current = new Audio('/audio/hola.mp3');
      clickAventuraAudio.current = new Audio('/audio/click-aventura.mp3');

      Promise.all([
        holaAudio.current.load(),
        clickAventuraAudio.current.load()
      ]);
    };

    initAudio();
    return () => {
      mounted = false;
      if (holaAudio.current) {
        holaAudio.current.pause();
        holaAudio.current = null;
      }
      if (clickAventuraAudio.current) {
        clickAventuraAudio.current.pause();
        clickAventuraAudio.current = null;
      }
      if (walkingIntervalRef.current) {
        clearInterval(walkingIntervalRef.current);
      }
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
          prev === '/svg/alex-smiling.svg' 
            ? '/svg/alex-default.svg' 
            : '/svg/alex-smiling.svg'
        );
      }, 300);

      return () => {
        if (walkingIntervalRef.current) {
          clearInterval(walkingIntervalRef.current);
        }
      };
    }
  }, [currentState, isWalkingDone]);

  const startHolaSequence = () => {
    let talkCount = 0;
    if (holaAudio.current) {
      holaAudio.current.currentTime = 0;
      holaAudio.current.play().catch(console.error);
    }

    const talkInterval = setInterval(() => {
      talkCount++;
      setCurrentImage(talkCount % 2 === 0 ? '/svg/alex-smiling.svg' : '/svg/alex-boca-aberta.svg');
      
      if (talkCount >= 6) {
        clearInterval(talkInterval);
        setCurrentState('walking');
        setCurrentImage('/svg/alex-smiling.svg');
      }
    }, 200);
  };

  const handleWalkingComplete = () => {
    setIsWalkingDone(true);
    setCurrentState('final');
    if (walkingIntervalRef.current) {
      clearInterval(walkingIntervalRef.current);
    }
    startFinalSequence();
  };

  const startFinalSequence = () => {
    let sequenceCount = 0;
    if (clickAventuraAudio.current) {
      clickAventuraAudio.current.currentTime = 0;
      clickAventuraAudio.current.play().catch(console.error);
    }

    const blinkInterval = setInterval(() => {
      sequenceCount++;
      if (sequenceCount <= 12) {
        setCurrentImage(
          sequenceCount % 2 === 0 
            ? '/svg/alex-boca-cerrada-brazo-down-ojos-cerrado.svg'
            : '/svg/alex-boca-aberta.svg'
        );
      } else {
        clearInterval(blinkInterval);
        let armUpCount = 0;
        const armUpInterval = setInterval(() => {
          armUpCount++;
          setCurrentImage(
            armUpCount % 2 === 0 
              ? '/svg/alex-boca-aberta-brazo-up.svg'
              : '/svg/alex-boca-cerrada-brazo-up.svg'
          );
          if (armUpCount >= 16) {
            clearInterval(armUpInterval);
            setCurrentImage('/svg/alex-smiling.svg');
          }
        }, 200);
      }
    }, 200);
  };

  if (!hasStartedWalking) return null;

  return (
    <div 
      className="absolute w-full h-full"
      style={{
        position: 'absolute',
        left: '40%', // Aligned with door's left position
        width: '9%',   // Same as door's width
        top: 10,
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        className="absolute left-0 w-full"
        initial={{
          top: '45%',  // Start at door's top position
          scale: 2,
          opacity: shouldStartWalking ? 1 : 0
        }}
        animate={{
          top: '200%',  // Walk to near bottom of screen
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
          {/* Shadow */}
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
          {/* Character */}
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