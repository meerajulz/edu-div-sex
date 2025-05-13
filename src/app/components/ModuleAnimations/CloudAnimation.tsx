'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { playAudio, cleanupAudio } from '../../utils/audioPlayer';

interface CloudAnimationProps {
  onAnimationComplete: () => void;
  enableSound?: boolean;
  soundSrc?: string;
  duration?: number;
  isExiting?: boolean;
  onExitComplete?: () => void;
}

const CloudAnimation: React.FC<CloudAnimationProps> = ({
  onAnimationComplete,
  enableSound = true,
  soundSrc = '/audio/wind-ambient.mp3',
  duration = 20000,
  isExiting = false,
  onExitComplete
}) => {
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  
  // Start animation and sound on component mount
  useEffect(() => {
    const startAnimation = async () => {
      setIsAnimationStarted(true);
      
      // Play ambient sound if enabled and not in exit mode
      if (enableSound && !isExiting) {
        try {
          await playAudio(soundSrc);
        } catch (e) {
          console.warn('Failed to play cloud animation sound:', e);
        }
      }
      
      // If not exiting, set timeout for animation duration before triggering completion
      if (!isExiting) {
        const timer = setTimeout(() => {
          onAnimationComplete();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    };
    
    startAnimation();
    
    // Cleanup sound when component unmounts
    return () => {
      cleanupAudio();
    };
  }, [onAnimationComplete, enableSound, soundSrc, duration, isExiting]);

  // Handle exit animation
  useEffect(() => {
    if (isExiting) {
      // Stop any ambient sounds when exiting
      cleanupAudio();
      
      // Set a timeout for the exit animation duration
      const exitTimer = setTimeout(() => {
        if (onExitComplete) {
          onExitComplete();
        }
      }, 1500); // Exit animation takes 1.5 seconds
      
      return () => clearTimeout(exitTimer);
    }
  }, [isExiting, onExitComplete]);
  
  // Enhanced cloud configurations with bidirectional movement and some stationary clouds
  // Removed cloud_4 from the array
  const clouds = [
    // Left to right clouds (foreground)
    { 
      id: 'cloud0-fg-ltr', 
      src: '/svg/actividad1/cloud_3.svg',
      initialX: '-20vw', 
      finalX: '40vw', // Stops in viewport
      y: '30vh', 
      scale: 2.0, 
      opacity: 0.95, 
      zIndex: 35, 
      duration: duration * 0.4,
      delay: 0
    },
    { 
      id: 'cloud3-fg-ltr', 
      src: '/svg/actividad1/cloud_3.svg',
      initialX: '-30vw', 
      finalX: '25vw', // Stops in viewport
      y: '40vh', 
      scale: 1.8, 
      opacity: 0.9, 
      zIndex: 30, 
      duration: duration * 0.3,
      delay: duration * 0.1
    },
    
    // Right to left clouds (foreground)
    { 
      id: 'cloud2-fg-rtl', 
      src: '/svg/actividad1/cloud_2.svg',
      initialX: '120vw', 
      finalX: '60vw', // Stops in viewport
      y: '55vh', 
      scale: 1.9, 
      opacity: 0.85, 
      zIndex: 28, 
      duration: duration * 0.35,
      delay: duration * 0.05
    },
    
    // Mid-layer clouds (reduced)
    { 
      id: 'cloud1-mid-ltr', 
      src: '/svg/actividad1/cloud_3.svg',
      initialX: '-15vw', 
      finalX: '55vw', 
      y: '25vh', 
      scale: 1.4, 
      opacity: 0.7, 
      zIndex: 20, 
      duration: duration * 1,
      delay: duration * 0.2
    },
    { 
      id: 'cloud2-mid-rtl', 
      src: '/svg/actividad1/cloud_2.svg',
      initialX: '110vw', 
      finalX: '85vw', 
      y: '28vh', 
      scale: 1.5, 
      opacity: 0.6, 
      zIndex: 16, 
      duration: duration * 0.6,
      delay: duration * 0.3
    },
    
    // Background clouds (smaller, fewer, visible at animation start)
    { 
      id: 'cloud0-bg-static1', 
      src: '/svg/actividad1/cloud_0.svg',
      initialX: '5vw', // Already in viewport
      finalX: '8vw', // Slight movement
      y: '18vh', 
      scale: 0.7, 
      opacity: 0.4, 
      zIndex: 10, 
      duration: duration * 0.8,
      delay: 0
    },
    { 
      id: 'cloud2-bg-static3', 
      src: '/svg/actividad1/cloud_1.svg',
      initialX: '65vw', // Already in viewport
      finalX: '68vw', // Slight movement
      y: '12vh', 
      scale: 0.65, 
      opacity: 0.3, 
      zIndex: 6, 
      duration: duration * 1.0,
      delay: duration * 0.1
    }
  ];

  // Sun animation configuration
  const sunAnimation = {
    animate: {
      x: ['0%', '3%', '-3%', '0%'],
      y: ['0%', '-2%', '2%', '0%'],
      rotate: [0, 3, -3, 0],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Exit animation configurations
  const exitVariants = {
    hidden: {},
    visible: {},
    exit: { 
      y: "-150vh", 
      transition: { 
        duration: 1.5, 
        ease: "easeInOut" 
      } 
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 overflow-hidden z-20 pointer-events-none"
      initial="visible"
      animate={isExiting ? "exit" : "visible"}
      variants={exitVariants}
    >
      {/* Sun animation using SVG - moved to left side */}
      <motion.div 
        className="absolute top-12 left-16 z-10"
        animate={!isExiting ? sunAnimation.animate : {}}
        transition={sunAnimation.transition}
      >
        <div className="relative h-48 w-48">
          <Image 
            src="/svg/actividad1/sun.svg" 
            alt="Sun"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </motion.div>
      
      {/* Cloud animations with enhanced arrangement */}
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{ 
            top: cloud.y, 
            zIndex: cloud.zIndex,
            scale: cloud.scale,
          }}
          initial={{ 
            x: cloud.initialX,
            opacity: 0 
          }}
          animate={{ 
            x: cloud.finalX,
            opacity: isAnimationStarted ? cloud.opacity : 0 
          }}
          transition={{
            x: {
              duration: cloud.duration / 1000,
              ease: "easeOut",
              delay: cloud.delay / 1000
            },
            opacity: {
              duration: 1,
              delay: cloud.delay / 1000
            }
          }}
        >
          <div className="h-48 w-64 relative">
            <Image 
              src={cloud.src} 
              alt="Cloud"
              fill
              style={{ 
                objectFit: 'contain',
                filter: `drop-shadow(0px ${Math.floor(cloud.scale * 3)}px ${Math.floor(cloud.scale * 3)}px rgba(0,0,0,${0.05 + cloud.opacity * 0.1}))`
              }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CloudAnimation;