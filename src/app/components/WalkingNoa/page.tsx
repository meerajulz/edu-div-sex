'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface WalkingNoaProps {
  shouldStartWalking: boolean;
  onComplete?: () => void;
  shouldContinueTalking?: boolean; // New prop for continuing after kids disappear
}

const WalkingNoa: React.FC<WalkingNoaProps> = ({ shouldStartWalking, onComplete, shouldContinueTalking }) => {
  const [stage, setStage] = useState<'initial' | 'hola' | 'walking' | 'talking' | 'finalWalking' | 'done' | 'continueTalking'>('initial');
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
  
  // SVG/PNG images for talking expressions
  const talkingExpressions = {
    eyeOpenMouthClose: '/svg/noa/noa-talk/noa-eyes-open-mouth-close-cross-leg.svg',
    eyeOpenMouthOpen: '/svg/noa/noa-talk/noa-eyes-open-mouth-open-cross-leg.svg',
    eyeCloseMouthOpen: '/svg/noa/noa-talk/noa-eyes-close-mouth-open-cross-leg.svg',
    eyeCloseMouthClose: '/svg/noa/noa-talk/noa-eyes-close-mouth-close-cross-leg.svg',
  };

  // SVG/PNG images for walking expressions
  const walkingExpressions = {
    initial: '/svg/noa/noa-walk/noa-eyes-open-mouth-close-cross-leg-2.svg',
    rightLeg: '/svg/noa/noa-walk/noa-eyes-open-mouth-close-right-leg.svg',
    leftLeg: '/svg/noa/noa-walk/noa-eyes-open-mouth-close-left-leg.svg',
    eyeClosedLeftLeg: '/svg/noa/noa-walk/noa-eyes-close-mouth-close-left-leg.svg',
    eyeClosedRightLeg: '/svg/noa/noa-walk/noa-eyes-close-mouth-close-right-leg.svg',
    eyeClosedCrossLeg1: '/svg/noa/noa-walk/noa-eyes-close-mouth-close-cross-leg.svg',
    eyeClosedCrossLeg2: '/svg/noa/noa-walk/noa-eyes-close-mouth-close-cross-leg-2.svg',
  };
  
  // Current image state
  const [currentImage, setCurrentImage] = useState(walkingExpressions.initial);
  
  // Audio files with their correct durations in milliseconds
  const audioSequence = [
    { file: '/audio/noa/hola.mp3', duration: 1000 },     // Initial Hola (1 second)
    { file: '/audio/noa/noa-2.mp3', duration: 7000 },    // Second audio (7 seconds)
    { file: '/audio/noa/noa-3.mp3', duration: 2000 },    // Third audio (2 seconds)
  ];

  // Continue talking audio sequences after kids disappear
  const continueAudioSequence = [
    { file: '/audio/noa/continue/noa-1.mp3', duration: 2000 }, // First audio after kids disappear
    { file: '/audio/noa/continue/noa-2.mp3', duration: 3000 }
    // Add more continue audio files as needed
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

  // Handle continue talking after kids disappear
  useEffect(() => {
    if (shouldContinueTalking && stage === 'done') {
      setStage('continueTalking');
      setCurrentAudioIndex(0); // Reset audio index for continue sequence
    }
  }, [shouldContinueTalking, stage]);

  // Handle talking animation with synchronized mouth and eye movements
  const startTalkingAnimation = (duration: number) => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set current state to playing
    setIsCurrentAudioPlaying(true);
    
    // Mouth and eye synchronization
    mouthIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Determine current state
        const isOpenMouth = prevImage.includes('mouth-open');
        const isOpenEyes = prevImage.includes('eyes-open');
        
        // Create state machine for mouth and eye movements
        if (isOpenMouth) {
          return isOpenEyes 
            ? talkingExpressions.eyeCloseMouthOpen 
            : talkingExpressions.eyeOpenMouthClose;
        } else {
          return isOpenEyes 
            ? talkingExpressions.eyeCloseMouthClose 
            : talkingExpressions.eyeOpenMouthOpen;
        }
      });
    }, 200); // Slightly slower animation
    
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
    
    setIsCurrentAudioPlaying(false);
    
    // Reset to default state - eyes open, mouth closed
    setCurrentImage(talkingExpressions.eyeOpenMouthClose);
  };
  
  // Walking animation
  const startWalkingAnimation = () => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set initial walking image
    setCurrentImage(walkingExpressions.initial);
    
    // Complex leg and eye animation
    legIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Determine current leg and eye state
        const isRightLeg = prevImage.includes('right-leg');
        const isLeftLeg = prevImage.includes('left-leg');
        const isEyeOpen = prevImage.includes('eyes-open');
        const isCrossLeg = prevImage.includes('cross-leg');
        
        // State machine for leg and eye positions
        if (isCrossLeg || !isRightLeg && !isLeftLeg) {
          return isEyeOpen 
            ? walkingExpressions.rightLeg 
            : walkingExpressions.eyeClosedRightLeg;
        } else if (isRightLeg) {
          return isEyeOpen 
            ? walkingExpressions.leftLeg 
            : walkingExpressions.eyeClosedLeftLeg;
        } else if (isLeftLeg) {
          return isEyeOpen 
            ? walkingExpressions.eyeClosedCrossLeg1 
            : walkingExpressions.eyeClosedCrossLeg2;
        }
        
        return walkingExpressions.initial;
      });
    }, 250); // Faster walking speed (reduced from 400ms to 250ms)
  };

  // Initial "Hola" sequence
  const startHolaSequence = () => {
    setStage('hola');
    
    // Initial talking animation for "Hola"
    setCurrentImage(talkingExpressions.eyeOpenMouthOpen);
    
    // Play "Hola" audio
    const audio = new Audio(audioSequence[0].file);
    audioRef.current = audio;
    
    // Start talking animation for the exact duration of "Hola"
    startTalkingAnimation(audioSequence[0].duration);
    
    audio.onended = () => {
      // After "Hola", start walking
      stopTalkingAnimation();
      
      setTimeout(() => {
        setStage('walking');
        startWalkingAnimation();
      }, 200); // Reduced pause before walking (from 500ms to 200ms)
    };
    
    audio.play().catch(console.error);
  };

  // Handle walking complete
  const handleWalkingComplete = () => {
    // Stop walking animations
    cleanupAnimations();
    
    // Set to standing position
    setCurrentImage(talkingExpressions.eyeOpenMouthClose);
    
    // Start talking sequence with additional audios immediately
    setStage('talking');
    setCurrentAudioIndex(1); // Start from the second audio (index 1)
  };

  // Handle final walking complete
  const handleFinalWalkingComplete = () => {
    // Stop walking animations
    cleanupAnimations();
    
    // Set to standing position
    setCurrentImage(talkingExpressions.eyeOpenMouthClose);
    
    // Change to done stage
    setStage('done');
    
    // Call onComplete callback
    if (onComplete) {
      onComplete();
    }
  };

  // Play the current audio file
  const playCurrentAudio = () => {
    // Determine which audio sequence to use based on the stage
    let audioData;
    let isLastAudio = false;
    
    if (stage === 'continueTalking') {
      if (currentAudioIndex >= continueAudioSequence.length) {
        // After continuing talking, go back to done stage
        setStage('done');
        return;
      }
      audioData = continueAudioSequence[currentAudioIndex];
      isLastAudio = currentAudioIndex === continueAudioSequence.length - 1;
    } else {
      if (currentAudioIndex >= audioSequence.length) {
        // Start the final walking sequence
        setStage('finalWalking');
        startWalkingAnimation();
        return;
      }
      audioData = audioSequence[currentAudioIndex];
      isLastAudio = currentAudioIndex === audioSequence.length - 1;
    }
    
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
      if (stage === 'continueTalking') {
        if (!isLastAudio) {
          setCurrentAudioIndex(prev => prev + 1);
        } else {
          // After the last continue audio, go back to done stage
          setStage('done');
        }
      } else {
        // Regular talking sequence
        if (!isLastAudio) {
          setCurrentAudioIndex(prev => prev + 1);
        } else {
          // After the last audio, move to final walking
          setStage('finalWalking');
          startWalkingAnimation();
        }
      }
    };
    
    audioRef.current.play().catch(console.error);
  };

  // Handle audio playback when in talking stage
  useEffect(() => {
    if ((stage === 'talking' && currentAudioIndex >= 1 && currentAudioIndex < audioSequence.length) ||
        (stage === 'continueTalking' && currentAudioIndex < continueAudioSequence.length)) {
      playCurrentAudio();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stage, currentAudioIndex]);

  // Define position values for different stages
  const midPosition = {
    top: '90%', // More in the back (changed from 120%)
    scale: 7     // Larger scale to make her appear taller than Dani
  };
  
  const finalPosition = {
    top: '135%', // Position behind Dani on the left
    scale: 8.2   // Larger scale to make her appear taller than Dani
  };

  // Helper function to create cartoon shadow for consistency with Alex, Cris, and Dani
  const createCartoonShadow = (extraStyles = {}) => {
    return (
      <div 
        className="absolute rounded-full"
        style={{ 
          width: '14px',
          height: '8px',
          bottom: '3px',
          left: '57%', // Default position for Noa's shadow
          transform: 'translateX(-50%)',
          opacity: 0.5, 
          filter: 'blur(1.5px)',
          backgroundColor: '#956d39', // Brown color like other characters
          ...extraStyles
        }}
      />
    );
  };

  // Don't render anything until sequence begins
  if (!hasStartedSequence) return null;

  return (
    <div 
      className="absolute w-full h-full"
      style={{
        position: 'absolute',
        left: '15%',  // More to the left before walking (was 20%)
        width: '9%', 
        top: 10,      
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* If in done stage, render Noa at the final position */}
      {(stage === 'done') && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: finalPosition.top,
            transform: `translateX(0) scale(${finalPosition.scale})`,
          }}
        >
          <div className="relative">
            {/* Shadow under Noa */}
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
              {/* Noa with exact positioning */}
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Noa"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If in continueTalking stage, render Noa at the final position */}
      {stage === 'continueTalking' && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: finalPosition.top,
            transform: `translateX(0) scale(${finalPosition.scale})`,
          }}
        >
          <div className="relative">
            {/* Shadow with style like Alex, Cris, and Dani */}
            {createCartoonShadow({ width: '15px', height: '9px', left: '60%' })}
            
            <div className="relative">
              {/* Noa with exact positioning */}
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Noa"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If in talking stage, render Noa at the middle position */}
      {stage === 'talking' && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: midPosition.top,
            transform: `translateX(5vw) scale(${midPosition.scale})`, // Moved left (was 15vw)
          }}
        >
          <div className="relative">
            {/* Shadow with style like Alex, Cris, and Dani */}
            {createCartoonShadow({ left: '57%' })}
            
            <div className="relative">
              {/* Noa with exact positioning */}
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Noa"
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
            transform: `scale(3.5)`,  // Bigger initial scale
          }}
        >
          <div className="relative">
            {/* Shadow under Noa with style like other characters */}
            {createCartoonShadow({ width: '12px', height: '7px', left: '53%', bottom: '3px' })}
            
            <div className="relative">
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Noa"
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
            top: '40%',    // Initial starting position (from top)
            scale: 3.5,    // Initial scale (matching hola)
            x: 0           // Start at container position (15% left)
          }}
          animate={{
            // Animate to the middle position for talking
            top: midPosition.top,
            scale: midPosition.scale,
            x: '5vw'      // Move to the right but less (was 15vw)
          }}
          transition={{
            duration: 3, // Faster walking (reduced from 4.5 to 3)
            ease: "easeInOut",
          }}
          onAnimationComplete={handleWalkingComplete}
        >
          <div className="relative">
            {/* Shadow under Noa */}
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
                duration: 2.5, // Faster shadow transition (from 4 to 2.5)
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              animate={{
                y: ['-2%', '2%'],
                rotate: [-2, 2],
                transition: {
                  repeat: Infinity,
                  duration: 0.5, // Faster bobbing animation (reduced from 0.7 to 0.5)
                  ease: "linear"
                }
              }}
            >
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Noa"
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
            x: '5vw'      // Start from middle position (was 15vw)
          }}
          animate={{
            // Animate to final position
            top: finalPosition.top,
            scale: finalPosition.scale,
            x: '0'      // Move more to the left
          }}
          transition={{
            duration: 1.5, // Even quicker transition (reduced from 2 to 1.5)
            ease: "easeInOut",
          }}
          onAnimationComplete={handleFinalWalkingComplete}
        >
          <div className="relative">
            {/* Shadow under Noa */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
              style={{ 
                width: '150%', 
                height: '25%', 
                bottom: '-12.5%',
                opacity: 0.3
              }}
            />
            
            <motion.div
              animate={{
                y: ['-2%', '2%'],
                rotate: [-2, 2],
                transition: {
                  repeat: Infinity,
                  duration: 0.5, // Faster bobbing animation (reduced from 0.7 to 0.5)
                  ease: "linear"
                }
              }}
            >
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Noa"
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

export default WalkingNoa;