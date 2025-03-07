'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface WalkingDaniProps {
  shouldStartWalking: boolean;
  onComplete?: () => void;
}

const WalkingDani: React.FC<WalkingDaniProps> = ({ shouldStartWalking, onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'hola' | 'walking' | 'talking' | 'finalWalking' | 'done'>('initial');
  const [hasStartedSequence, setHasStartedSequence] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
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
    eyeOpenMouthClose: '/svg/dani/dani_talk/dani-eyes-open-mouth-close.svg',
    eyeCloseMouthOpen: '/svg/dani/dani_talk/dani-eyes-close-mouth-open.svg',
  };

  // SVG images for walking expressions
  const walkingExpressions = {
    leftLeg1: '/svg/dani/dani_walk/dani-eyes-open-mouth-close-left-leg-1.svg',
    leftLeg2: '/svg/dani/dani_walk/dani-eyes-open-mouth-close-left-leg-2.svg',
    standing: '/svg/dani/dani_walk/dani-eyes-open-mouth-close-right-leg-1.svg',
  };
  
  // Current image state
  const [currentImage, setCurrentImage] = useState(talkingExpressions.eyeOpenMouthClose);
  
  // Audio files with their correct durations in milliseconds
  const audioSequence = [
    { file: '/audio/dani/hola.mp3', duration: 3000 },    // Initial Hola (3 seconds)
    { file: '/audio/dani/dani-2.mp3', duration: 4000 },  // Second audio (4 seconds)
    { file: '/audio/dani/dani-3.mp3', duration: 4000 },  // Third audio (4 seconds)
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
    
    // Toggle between open and closed mouth
    mouthIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        return prevImage === talkingExpressions.eyeOpenMouthClose 
          ? talkingExpressions.eyeCloseMouthOpen 
          : talkingExpressions.eyeOpenMouthClose;
      });
    }, 150);
    
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
    setCurrentImage(walkingExpressions.leftLeg1);
    
    // Leg animation - alternate between leg positions
    legIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        if (prevImage === walkingExpressions.leftLeg1) {
          return walkingExpressions.leftLeg2;
        } else {
          return walkingExpressions.leftLeg1;
        }
      });
    }, 250); // Faster walking speed (reduced from 400ms to 250ms)
  };

  // Natural blinking animation for final position
  const startBlinkingAnimation = () => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set image to standing position - no blinking, just use the standing image
    setCurrentImage(walkingExpressions.standing);
  };

  // Initial "Hola" sequence
  const startHolaSequence = () => {
    setStage('hola');
    
    // Initial talking animation for "Hola"
    setCurrentImage(talkingExpressions.eyeCloseMouthOpen);
    
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
    setCurrentImage(walkingExpressions.standing);
    
    // Start talking sequence with additional audios immediately
    setStage('talking');
    setCurrentAudioIndex(1); // Start from the second audio (index 1)
  };

  // Handle final walking complete
  const handleFinalWalkingComplete = () => {
    // Stop walking animations
    cleanupAnimations();
    
    // Set to standing position
    setCurrentImage(walkingExpressions.standing);
    
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
      // Move to next audio immediately without pause
      if (currentAudioIndex < audioSequence.length - 1) {
        setCurrentAudioIndex(prev => prev + 1);
      } else {
        // After the last audio, move to final walking
        setStage('finalWalking');
        startWalkingAnimation();
      }
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
    top: '100%', // Higher position to show more legs and appear more distant
    scale: 6     // Smaller scale to make him appear further back
  };
  
  const finalPosition = {
    top: '135%', // Even higher position (more in the back)
    scale: 7.2   // Slightly bigger than before (from 6.7 to 7.2)
  };

  // Don't render anything until sequence begins
  if (!hasStartedSequence) return null;

  return (
    <div 
      className="absolute w-full h-full"
      style={{
        position: 'absolute',
        left: '40%',  // Start at the same position as Alex/Cris
        width: '9%', 
        top: 10,      
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* If in done stage, render Dani at the final position */}
      {stage === 'done' && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: finalPosition.top,
            transform: `translateX(20vw) scale(${finalPosition.scale})`,
          }}
        >
          <div className="relative">
            {/* Shadow under Dani */}
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
              {/* Dani with exact positioning */}
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Dani"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If in talking stage, render Dani at the middle position */}
      {stage === 'talking' && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: midPosition.top,
            transform: `translateX(20vw) scale(${midPosition.scale})`,
          }}
        >
          <div className="relative">
            {/* Shadow under Dani */}
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
              {/* Dani with exact positioning */}
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Dani"
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
            transform: `scale(3.2)`,  // Slightly bigger initial scale (10% bigger)
          }}
        >
          <div className="relative">
            {/* Shadow under Dani */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
              style={{ 
                width: '100%', 
                height: '25%', 
                bottom: '-12.5%',
                opacity: 0.3
              }}
            />
            
            <div className="relative">
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Dani"
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
            scale: 3.2,    // Initial scale (matching hola)
            x: 0           // Start at container position (40% left)
          }}
          animate={{
            // Animate to the middle position for talking
            top: midPosition.top,
            scale: midPosition.scale,
            x: '20vw'      // Move to the right
          }}
          transition={{
            duration: 3.5, // Faster walking (reduced from 5 to 3.5)
            ease: "easeInOut",
          }}
          onAnimationComplete={handleWalkingComplete}
        >
          <div className="relative">
            {/* Shadow under Dani */}
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
                duration: 3, // Adjusted duration (reduced from 4 to 3)
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
                  alt="Dani"
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
            x: '20vw'      // Start from middle position
          }}
          animate={{
            // Animate to final position
            top: finalPosition.top,
            scale: finalPosition.scale,
            x: '20vw'      // Keep same horizontal position
          }}
          transition={{
            duration: 1.5, // Even quicker transition (reduced from 2s to 1.5s)
            ease: "easeInOut",
          }}
          onAnimationComplete={handleFinalWalkingComplete}
        >
          <div className="relative">
            {/* Shadow under Dani */}
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
                  alt="Dani"
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

export default WalkingDani;