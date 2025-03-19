'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface WalkingCrisProps {
  shouldStartWalking: boolean;
  onComplete?: () => void;
}

const WalkingCris: React.FC<WalkingCrisProps> = ({ shouldStartWalking, onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'hola' | 'walking' | 'talking' | 'finalWalking' | 'done'>('initial');
  const [hasStartedSequence, setHasStartedSequence] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCurrentAudioPlaying, setIsCurrentAudioPlaying] = useState(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eyeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const legIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // SVG images for different talking expressions
  const talkingExpressions = {
    eyeOpenMouthClose: '/svg/cris/cris-talk/cris-eyes-open-mouth-close.svg',
    eyeOpenMouthOpen: '/svg/cris/cris-talk/cris-eyes-open-mouth-open.svg',
    eyeCloseMouthOpen: '/svg/cris/cris-talk/cris-eyes-close-mouth-open.svg',
    eyeCloseMouthClose: '/svg/cris/cris-talk/cris-eyes-close-mouth-close.svg',
  };

  // SVG images for walking expressions
  const walkingExpressions = {
    eyeOpenLegLeft: '/svg/cris/cris-walk/eyes_open-mouth_close_left_leg.svg',
    eyeOpenLegRight: '/svg/cris/cris-walk/eyes_open-mouth_close_right_leg.svg',
    eyeOpenStanding: '/svg/cris/cris-walk/eyes_open-mouth_close_right_leg_crossing_done.svg',
    eyeCloseStanding: '/svg/cris/cris-walk/eyes_close-mouth_close_right_leg_crossing_done.svg',
  };
  
  // Current image state
  const [currentImage, setCurrentImage] = useState(walkingExpressions.eyeOpenStanding);
  
  // Audio files with their correct durations in milliseconds
  const audioSequence = [
    { file: '/audio/cris/intro/1-cris.mp3', duration: 1000 }, // Initial Hola
    { file: '/audio/cris/intro/2-cris.mp3', duration: 1000 }, // Me encantan los animales
    { file: '/audio/cris/intro/3-cris.mp3', duration: 4000 }, // Longer animals talk
  ];

  // Clean up all animations and audio
  const cleanupAnimations = () => {
    if (mouthIntervalRef.current) {
      clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
    }
    
    if (eyeIntervalRef.current) {
      clearInterval(eyeIntervalRef.current);
      eyeIntervalRef.current = null;
    }
    
    if (legIntervalRef.current) {
      clearInterval(legIntervalRef.current);
      legIntervalRef.current = null;
    }
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    if (blinkTimeoutRef.current) {
      clearTimeout(blinkTimeoutRef.current);
      blinkTimeoutRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAnimations();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Start sequence when shouldStartWalking becomes true
  useEffect(() => {
    if (shouldStartWalking && !hasStartedSequence) {
      setTimeout(() => {
        setHasStartedSequence(true);
        startHolaSequence();
      }, 500); // Quick start
    }
  }, [shouldStartWalking]);

  // Handle talking animation
  const startTalkingAnimation = (duration: number) => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set current state to playing
    setIsCurrentAudioPlaying(true);
    
    // Mouth animation (faster - 150ms is about 6-7 times per second)
    mouthIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using the talking expressions
        if (!prevImage.includes('cris-talk')) {
          return talkingExpressions.eyeOpenMouthOpen;
        }
        
        // Determine current eye state
        const hasOpenEyes = prevImage.includes('eyes-open');
        
        // Toggle mouth state
        const hasMouthOpen = prevImage.includes('mouth-open');
        
        if (hasMouthOpen) {
          return hasOpenEyes ? talkingExpressions.eyeOpenMouthClose : talkingExpressions.eyeCloseMouthClose;
        } else {
          return hasOpenEyes ? talkingExpressions.eyeOpenMouthOpen : talkingExpressions.eyeCloseMouthOpen;
        }
      });
    }, 150);
    
    // Eye animation (slower - 400ms with 15% chance of blinking)
    eyeIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using the talking expressions
        if (!prevImage.includes('cris-talk')) {
          return talkingExpressions.eyeOpenMouthOpen;
        }
        
        // Determine current mouth state
        const hasMouthOpen = prevImage.includes('mouth-open');
        
        // Toggle eye state with higher probability of open eyes
        const hasOpenEyes = prevImage.includes('eyes-open');
        
        // Random blink - 15% chance of changing eye state
        if (Math.random() < 0.15) {
          if (hasOpenEyes) {
            return hasMouthOpen ? talkingExpressions.eyeCloseMouthOpen : talkingExpressions.eyeCloseMouthClose;
          } else {
            return hasMouthOpen ? talkingExpressions.eyeOpenMouthOpen : talkingExpressions.eyeOpenMouthClose;
          }
        }
        
        // If no blink occurs, keep the current eye state
        return prevImage;
      });
    }, 400);
    
    // Set timeout to end animation exactly when audio ends
    animationTimeoutRef.current = setTimeout(() => {
      stopTalkingAnimation();
    }, duration);
  };
  
  const stopTalkingAnimation = () => {
    // Clear animations
    if (mouthIntervalRef.current) {
      clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
    }
    
    if (eyeIntervalRef.current) {
      clearInterval(eyeIntervalRef.current);
      eyeIntervalRef.current = null;
    }
    
    setIsCurrentAudioPlaying(false);
    
    // Reset to default state - eyes open, mouth closed
    setCurrentImage(talkingExpressions.eyeOpenMouthClose);
  };
  
  // Walking animation
  const startWalkingAnimation = () => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set initial walking image
    setCurrentImage(walkingExpressions.eyeOpenLegLeft);
    
    // Leg animation - Faster leg movement (250ms instead of 400ms)
    legIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using walking expressions
        if (!prevImage.includes('_leg') && !prevImage.includes('crossing_done')) {
          return walkingExpressions.eyeOpenLegLeft;
        }
        
        // Only alternate between the two leg positions during walking
        if (prevImage.includes('_left_leg')) {
          return walkingExpressions.eyeOpenLegRight;
        } else if (prevImage.includes('_right_leg') && !prevImage.includes('crossing_done')) {
          return walkingExpressions.eyeOpenLegLeft;
        }
        
        return prevImage;
      });
    }, 250); // Faster walking speed (decreased from 400ms to 250ms)
    
    // Eye animation (blinking occasionally)
    eyeIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Random blink - 10% chance of blinking
        if (Math.random() < 0.1) {
          if (prevImage.includes('eyes_open')) {
            if (prevImage.includes('crossing_done')) {
              return walkingExpressions.eyeCloseStanding;
            }
          } else {
            if (prevImage.includes('crossing_done')) {
              return walkingExpressions.eyeOpenStanding;
            }
          }
        }
        
        // If no blink occurs, keep the current eye state
        return prevImage;
      });
    }, 500); // 500ms for eye blinks
  };

  // Natural blinking animation for final position
  const startBlinkingAnimation = () => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set initial image to eyes open
    setCurrentImage(walkingExpressions.eyeOpenStanding);
    
    // Function to handle a single blink cycle
    const doBlink = () => {
      // Close eyes
      setCurrentImage(walkingExpressions.eyeCloseStanding);
      
      // Open eyes after a short delay (typical blink is 100-400ms)
      blinkTimeoutRef.current = setTimeout(() => {
        setCurrentImage(walkingExpressions.eyeOpenStanding);
        
        // Schedule next blink after random interval (3-7 seconds)
        const nextBlinkTime = 3000 + Math.random() * 4000;
        blinkTimeoutRef.current = setTimeout(doBlink, nextBlinkTime);
      }, 200);
    };
    
    // Start the first blink after a random delay
    const initialDelay = 1000 + Math.random() * 2000;
    blinkTimeoutRef.current = setTimeout(doBlink, initialDelay);
  };

  // Initial "Hola" sequence
  const startHolaSequence = () => {
    setStage('hola');
    
    // Initial talking animation for "Hola"
    setCurrentImage(talkingExpressions.eyeOpenMouthOpen);
    
    // Play "Hola" audio
    const audio = new Audio(audioSequence[0].file);
    
    // Start talking animation for the exact duration of "Hola"
    startTalkingAnimation(audioSequence[0].duration);
    
    audio.onended = () => {
      // After "Hola", start walking
      stopTalkingAnimation();
      
      setTimeout(() => {
        setStage('walking');
        startWalkingAnimation();
      }, 500); // Small pause before walking
    };
    
    audio.play().catch(console.error);
  };

  // Handle walking complete
  const handleWalkingComplete = () => {
    // Stop walking animations
    cleanupAnimations();
    
    // Set to standing position
    setCurrentImage(walkingExpressions.eyeOpenStanding);
    
    // Start talking sequence
    setTimeout(() => {
      setStage('talking');
      setCurrentAudioIndex(1); // Start from the second audio (index 1)
    }, 1000);
  };
  
  // Handle final walking complete
  const handleFinalWalkingComplete = () => {
    // Stop walking animations
    cleanupAnimations();
    
    // Set to standing position
    setCurrentImage(walkingExpressions.eyeOpenStanding);
    
    // Change to done stage
    setStage('done');
    
    // Start blinking animation
    startBlinkingAnimation();
    
    // Call onComplete callback
    if (onComplete) {
      onComplete();
    }
  };

  // Play the current audio file
  const playCurrentAudio = () => {
    if (currentAudioIndex >= audioSequence.length) {
      // Start the final walking sequence
      setStage('finalWalking');
      startWalkingAnimation();
      return;
    }
    
    const audioData = audioSequence[currentAudioIndex];
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Create and play audio
    audioRef.current = new Audio(audioData.file);
    
    // Start talking animation for the exact duration of the audio
    startTalkingAnimation(audioData.duration);
    
    // Handle when audio ends
    audioRef.current.onended = () => {
      // Move to next audio after a pause
      setTimeout(() => {
        if (currentAudioIndex < audioSequence.length - 1) {
          setCurrentAudioIndex(prev => prev + 1);
        } else {
          // After the last audio, move to final walking
          setStage('finalWalking');
          startWalkingAnimation();
        }
      }, 1000); // 1 second pause between audio clips
    };
    
    audioRef.current.play().catch(console.error);
  };

  // Handle audio playback when in talking stage
  useEffect(() => {
    if (stage === 'talking' && currentAudioIndex >= 1 && currentAudioIndex < audioSequence.length) {
      playCurrentAudio();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stage, currentAudioIndex]);

  // Effect to start blinking animation when in 'done' stage
  useEffect(() => {
    if (stage === 'done') {
      startBlinkingAnimation();
    }
    
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
        blinkTimeoutRef.current = null;
      }
    };
  }, [stage]);

  // Define position values for different stages
  const midPosition = {
    top: '80%', // 7% higher position (from 130% to 120%) to appear more in the back
    scale: 7.5   // Keeping the same scale during talks
  };
  
  const finalPosition = {
    top: '200%', // Lower position for final close-up
    scale: 10.6   // 20% bigger than before (increased from 8 to 9.6)
  };

  // Don't render anything until sequence begins
  if (!hasStartedSequence) return null;

  // Shadow component for Cris with diagonal movement support
  const createCartoonShadow = (extraStyles = {}) => {
    return (
      <div 
        className="absolute rounded-full"
        style={{ 
          width: '14px',
          height: '8px',
          bottom: '3px',
          left: '62%', // More to the right for diagonal movement
          transform: 'translateX(-50%)',
          opacity: 0.5, 
          filter: 'blur(1.5px)',
          backgroundColor: '#956d39', // Brown color like Alex
          ...extraStyles
        }}
      />
    );
  };

  return (
    <div 
      className="absolute w-full h-full"
      style={{
        position: 'absolute',
        left: '40%',  // Start at the same position as Alex 
        width: '9%', 
        top: 10,      
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50 
      }}
    >
      {/* If in done stage, render Cris at the final position */}
      {stage === 'done' && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: finalPosition.top,
            transform: `translateX(40vw) scale(${finalPosition.scale})`,
          }}
        >
          <div className="relative">
            {/* Shadow under Cris */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 bg-black/500 rounded-full blur-sm"
              style={{ 
                width: '10%', 
                height: '20%', 
                bottom: '1%',
                opacity:4
              }}
            />
            
            <div className="relative">
              {/* The talking Cris with exact positioning */}
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Cris"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If in talking stage, render Cris at the middle position */}
      {stage === 'talking' && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: midPosition.top,
            transform: `translateX(40vw) scale(${midPosition.scale})`,
          }}
        >
          <div className="relative">
            {/* Shadow positioned to the right for diagonal appearance */}
            {createCartoonShadow({ left: '64%' })}
            
            <div className="relative">
              {/* The talking Cris with exact positioning */}
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Cris"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only show the stationary hola animation */}
      {stage === 'hola' && (
        <div
          className="absolute left-0 w-full"
          style={{
            top: '40%',    // Initial starting position (from top)
            transform: `scale(3.4)`,  // Initial scale
          }}
        >
          <div className="relative">
            {/* Shadow under Cris positioned to the right */}
            {createCartoonShadow({ width: '12px', height: '7px', left: '50%', bottom: '3px' })}
            
            <div className="relative">
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Cris"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Only show the walking animation if in walking stage */}
      {stage === 'walking' && (
        <motion.div
          className="absolute left-0 w-full"
          initial={{
            top: '40%',    // Initial starting position
            scale: 3.4,    // Initial scale
            x: 0           // Start position
          }}
          animate={{
            top: midPosition.top,
            scale: midPosition.scale,
            x: '40vw'      // Move diagonally to the right
          }}
          transition={{
            duration: 3.5, // Walking duration
            ease: "easeInOut",
          }}
          onAnimationComplete={handleWalkingComplete}
        >
          <div className="relative">
            {/* Diagonal shadow that moves right as Cris walks */}
            <motion.div
              className="absolute rounded-full blur-sm"
              style={{ 
                backgroundColor: '#956d39', // Brown color like Alex's shadow
                opacity: 0.5,
                filter: 'blur(1.5px)',
                left: '50%', // Center the shadow horizontally
                transform: 'translateX(-50%)' // Ensure proper centering
              }}
              initial={{
                width: '14px',
                height: '8px',
                bottom: '0px',
              //  left: '40%'
              }}
              animate={{
                width: ['14px'],
                height: ['8px'],
                //left: ['35%', '40%'], // Shadow shifts right as Cris walks diagonally
                opacity: [0.5, 0.6, 0.5]
              }}
              transition={{ 
                duration: 3.5,  // Match the walking duration
                times: [0, 1],
                ease: "easeInOut"
              }}
            />
            
            {/* The bouncing shadow during walking */}
            <motion.div
              className="absolute rounded-full"
              style={{ 
                backgroundColor: '#956d39',
                opacity: 0.5,
                filter: 'blur(1.5px)',
                width: '14px',
                height: '8px',
                bottom: '3px',
                left: '50%', // Center the shadow horizontally
                transform: 'translateX(-50%)' // Ensure proper centering
              }}
              animate={{
                scaleX: [1, 0.9, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.4,
                ease: "linear"
              }}
            />
            
            <motion.div
              animate={{
                y: ['-2%', '2%'],
                rotate: [-2, 2],
                transition: {
                  repeat: Infinity,
                  duration: 0.5,
                  ease: "linear"
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
      )}
      
      {/* Final walking animation after talking */}
      {stage === 'finalWalking' && (
        <motion.div
          className="absolute left-0 w-full"
          initial={{
            top: midPosition.top,
            scale: midPosition.scale,
            x: '40vw'      // Start from middle position
          }}
          animate={{
            top: finalPosition.top,
            scale: finalPosition.scale,
            x: '40vw'      // Keep same horizontal position
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
          }}
          onAnimationComplete={handleFinalWalkingComplete}
        >
          <div className="relative">
            {/* Shadow positioned to the right for final walking */}
            <motion.div
              className="absolute rounded-full"
              style={{ 
                backgroundColor: '#956d39',
                opacity: 0.7,
                filter: 'blur(1.5px)',
                width: '14px',
                height: '8px',
                bottom: '3px',
                left: '50%', // Center the shadow horizontally
                transform: 'translateX(-50%)' // Ensure proper centering
              }}
              animate={{
                scaleX: [1, 0.9, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.4,
                ease: "linear"
              }}
            />
            
            <motion.div
              animate={{
                y: ['-2%', '2%'],
                rotate: [-2, 2],
                transition: {
                  repeat: Infinity,
                  duration: 0.5,
                  ease: "linear"
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
      )}
    </div>
  );
};

export default WalkingCris;