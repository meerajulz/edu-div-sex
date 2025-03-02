'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface FullAlexProps {
  shouldStartWalking: boolean;
  onComplete?: () => void;
}

const FullAlex: React.FC<FullAlexProps> = ({ shouldStartWalking, onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'hola' | 'walking' | 'talking' | 'done' | 'sideMoving' | 'static'>('initial');
  const [hasStartedSequence, setHasStartedSequence] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isCurrentAudioPlaying, setIsCurrentAudioPlaying] = useState(false);
  const [alexOpacity, setAlexOpacity] = useState(1); // Track opacity for fade out
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eyeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const legIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const staticAnimationRef = useRef<NodeJS.Timeout | null>(null);
  
  // SVG images for different facial expressions
  const talkingExpressions = {
    eyeOpenMouthClose: '/svg/alex-talk/eye-open-mouth-close-arms-down.svg',
    eyeOpenMouthOpen: '/svg/alex-talk/eye-open-mouth-open-arms-down.svg',
    eyeCloseMouthOpen: '/svg/alex-talk/eye-close-mouth-open-arms-down.svg',
    eyeCloseMouthClose: '/svg/alex-talk/eye-close-mouth-close-arms-down.svg',
  };

  // SVG images for walking expressions
  const walkingExpressions = {
    eyeOpenLegLeft: '/svg/alex-walk/eye-open-mouth-close-arms-down-leg-left.svg',
    eyeOpenLegRight: '/svg/alex-walk/eye-open-mouth-close-arms-down-leg-right.svg',
    eyeCloseLegLeft: '/svg/alex-walk/eye-close-mouth-close-arms-down-leg-left.svg',
    eyeCloseLegRight: '/svg/alex-walk/eye-close-mouth-close-arms-down-leg-right.svg',
  };

  // SVG images for static expressions (for side position)
  const staticExpressions = {
    eyeOpenMouthCloseArmsMiddle: '/svg/alex-static/eye-open-mouth-close-arms-middle.svg',
    eyeCloseMouthCloseArmsMiddle: '/svg/alex-static/eye-close-mouth-close-arms-middle.svg',
    eyeCloseMouthCloseArmsMiddleHead2: '/svg/alex-static/eye-open-mouth-close-arms-middle-head-2.svg',
  };
  
  // Current image state
  const [currentImage, setCurrentImage] = useState(talkingExpressions.eyeOpenMouthClose);
  
  // Position state for side movement
  const [position, setPosition] = useState({ left: '40%', top: '175%', scale: 8 });
  
  // Audio files with their correct durations in milliseconds
  const audioSequence = [
    { file: '/audio/alex/intro/1-alex.mp3', duration: 2000 }, // Hola!
    { file: '/audio/alex/intro/2-alex.mp3', duration: 1000 },
    { file: '/audio/alex/intro/3-alex.mp3', duration: 4000 },
    { file: '/audio/alex/intro/4-alex.mp3', duration: 2000 },
    { file: '/audio/alex/intro/5-alex.mp3', duration: 2000 },
    { file: '/audio/alex/intro/6-alex.mp3', duration: 4000 },
    { file: '/audio/alex/intro/7-alex.mp3', duration: 2000 },
    { file: '/audio/alex/intro/8-alex.mp3', duration: 2000 }
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

    if (staticAnimationRef.current) {
      clearTimeout(staticAnimationRef.current);
      staticAnimationRef.current = null;
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

  // Start sequence when door opens
  useEffect(() => {
    if (shouldStartWalking && !hasStartedSequence) {
      setTimeout(() => {
        setHasStartedSequence(true);
        startHolaSequence();
      }, 2000);
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
        if (!prevImage.includes('alex-talk')) {
          return talkingExpressions.eyeOpenMouthOpen;
        }
        
        // Determine current eye state
        const hasOpenEyes = !prevImage.includes('eye-close');
        
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
        if (!prevImage.includes('alex-talk')) {
          return talkingExpressions.eyeOpenMouthOpen;
        }
        
        // Determine current mouth state
        const hasMouthOpen = prevImage.includes('mouth-open');
        
        // Toggle eye state with higher probability of open eyes
        const hasOpenEyes = !prevImage.includes('eye-close');
        
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
    
    // Leg animation
    legIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using walking expressions
        if (!prevImage.includes('alex-walk')) {
          return walkingExpressions.eyeOpenLegLeft;
        }
        
        // Determine current eye state
        const hasOpenEyes = prevImage.includes('eye-open');
        
        // Toggle leg position
        const hasLeftLeg = prevImage.includes('leg-left');
        
        if (hasLeftLeg) {
          return hasOpenEyes ? walkingExpressions.eyeOpenLegRight : walkingExpressions.eyeCloseLegRight;
        } else {
          return hasOpenEyes ? walkingExpressions.eyeOpenLegLeft : walkingExpressions.eyeCloseLegLeft;
        }
      });
    }, 200); // 200ms matches original walkSpeed
    
    // Eye animation (blinking occasionally)
    eyeIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using walking expressions
        if (!prevImage.includes('alex-walk')) {
          return walkingExpressions.eyeOpenLegLeft;
        }
        
        // Determine current leg state
        const hasLeftLeg = prevImage.includes('leg-left');
        
        // Random blink - 10% chance of changing eye state
        if (Math.random() < 0.1) {
          const hasOpenEyes = prevImage.includes('eye-open');
          if (hasOpenEyes) {
            return hasLeftLeg ? walkingExpressions.eyeCloseLegLeft : walkingExpressions.eyeCloseLegRight;
          } else {
            return hasLeftLeg ? walkingExpressions.eyeOpenLegLeft : walkingExpressions.eyeOpenLegRight;
          }
        }
        
        // If no blink occurs, keep the current eye state
        return prevImage;
      });
    }, 500); // 500ms for eye blinks
  };

  // Static animation (for side position)
  const startStaticAnimation = () => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set initial static image
    setCurrentImage(staticExpressions.eyeOpenMouthCloseArmsMiddle);
    
    // Create a state machine to cycle through the static images
    let currentState = 0; // 0: eyes open, 1: eyes closed, 2: head tilted
    
    // Start animation cycle
    const runAnimation = () => {
      switch (currentState) {
        case 0: // Eyes open
          setCurrentImage(staticExpressions.eyeOpenMouthCloseArmsMiddle);
          currentState = 1;
          staticAnimationRef.current = setTimeout(runAnimation, 3000); // Blink every 3 seconds
          break;
        case 1: // Eyes closed
          setCurrentImage(staticExpressions.eyeCloseMouthCloseArmsMiddle);
          currentState = 2;
          staticAnimationRef.current = setTimeout(runAnimation, 200); // Brief eye close
          break;
        case 2: // Head tilt
          setCurrentImage(staticExpressions.eyeCloseMouthCloseArmsMiddleHead2);
          currentState = 0;
          staticAnimationRef.current = setTimeout(runAnimation, 5000); // Head tilt for 5 seconds
          break;
      }
    };
    
    // Start the animation cycle
    runAnimation();
  };

  // Play the current audio file
  const playCurrentAudio = () => {
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
          // This is the last audio - move to side instead of fading out
          setStage('sideMoving');
        }
      }, 1000); // 1 second pause between audio clips
    };
    
    audioRef.current.play().catch(console.error);
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
    
    // Start talking sequence
    setStage('talking');
    setCurrentAudioIndex(1); // Start from the second audio (index 1)
  };

  // Handle side movement complete
  const handleSideMoveComplete = () => {
    // Start static animation
    setStage('static');
    
    // Store the final position in a ref so it can be used by the static component
    const finalTransform = document.querySelector('.side-moving-alex')?.style.transform;
    if (finalTransform) {
      // Apply the exact same transform to the static component
      const staticElement = document.querySelector('.static-alex');
      if (staticElement) {
        (staticElement as HTMLElement).style.transform = finalTransform;
      }
    }
    
    startStaticAnimation();
    
    // Call onComplete to trigger Cris's entrance
    if (onComplete) {
      onComplete();
    }
  };

  // Handle audio playback when in talking stage
  useEffect(() => {
    if (stage === 'talking' && currentAudioIndex > 0 && currentAudioIndex < audioSequence.length) {
      playCurrentAudio();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stage, currentAudioIndex]);

  // Define final position values where Alex should end up during talking
  const finalPosition = {
    top: '175%', // Position where talking Alex should be
    scale: 8     // Final scale as before
  };
  
  // Define side position values where Alex should move to after talking
  const sidePosition = {
    top: '220%',  // Much lower on the screen
    scale: 14     // Much bigger size for closeness perception
  };

  // Don't render anything until sequence begins
  if (!hasStartedSequence) return null;

  return (
    <div 
      className="absolute w-full h-full"
      style={{
        position: 'absolute',
        left: '40%',  // Always keep container at 40%, we'll use transform for positioning
        width: '9%',       // Width of Alex container
        top: 10,           // Top offset of Alex container
        height: '100%',    // Height of Alex container
        pointerEvents: 'none',
      }}
    >
      {/* Static position after side movement */}
      {stage === 'static' && (
        <div
          className="absolute w-full static-alex"
          style={{
            left: 0, 
            top: sidePosition.top,
            // Initial values that will be overwritten with exact final transform
            transform: `translateX(-25vw) scale(${sidePosition.scale})`,
          }}
        >
          <div className="relative">
            {/* Shadow under Alex */}
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
                  src={currentImage}
                  alt="Alex"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side moving animation */}
      {stage === 'sideMoving' && (
        <motion.div
          className="absolute w-full side-moving-alex"
          style={{
            // No left style here as we're animating it within the motion component
            left: 0,
          }}
          initial={{
            x: 0, // Start at current position (40%)
            top: finalPosition.top,
            scale: finalPosition.scale,
          }}
          animate={{
            x: '-25vw', // Move leftward by 25% of viewport width (less extreme)
            top: sidePosition.top,
            scale: sidePosition.scale,
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
          }}
          onAnimationComplete={handleSideMoveComplete}
        >
          <div className="relative">
            {/* Shadow under Alex */}
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
                  src={talkingExpressions.eyeOpenMouthClose}
                  alt="Alex"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* If in talking stage, render Alex at the center position */}
      {stage === 'talking' && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: finalPosition.top,
            transform: `scale(${finalPosition.scale})`,
          }}
        >
          <div className="relative">
            {/* Shadow under Alex */}
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
              {/* The talking Alex with exact positioning */}
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={currentImage}
                  alt="Alex"
                  fill
                  className="object-contain transition-opacity duration-75"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only show the animation if in hola or walking stage */}
      {(stage === 'hola' || stage === 'walking') && (
        <motion.div
          className="absolute left-0 w-full"
          initial={{
            top: '45%',    // Initial starting position (from top)
            scale: 2,      // Initial scale
            opacity: shouldStartWalking ? 1 : 0
          }}
          animate={{
            // Animate to the exact same position as where talking Alex will be
            top: finalPosition.top, // Updated to match talking Alex
            scale: finalPosition.scale,
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
            {/* Shadow under Alex */}
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
              animate={stage === 'walking' ? {
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
      )}
    </div>
  );
};

export default FullAlex;