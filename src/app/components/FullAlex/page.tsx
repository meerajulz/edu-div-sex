'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  AlexStage,
  talkingExpressions,
  walkingExpressions,
  staticExpressions,
  armUpTalkingExpressions,
  audioSequence,
  continueAudioSequence,
  armUpAudioSequence,
  midPosition,
  finalPosition,
  sidePosition,
  hasOpenEyes,
  hasMouthOpen,
  hasLeftLeg,
  isFromExpressionSet
} from './alexAnimationsUtils';

interface FullAlexProps {
  shouldStartWalking: boolean;
  onComplete?: () => void;
  shouldContinueTalking?: boolean; // For continuing after kids disappear
  shouldDisappear?: boolean; // New prop to trigger disappear animation
  onDisappearComplete?: () => void; // Callback when Alex has disappeared
}

const FullAlex: React.FC<FullAlexProps> = ({ 
  shouldStartWalking, 
  onComplete, 
  shouldContinueTalking,
  shouldDisappear,
  onDisappearComplete 
}) => {
  const [stage, setStage] = useState<AlexStage>('initial');
  const [hasStartedSequence, setHasStartedSequence] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isCurrentAudioPlaying, setIsCurrentAudioPlaying] = useState(false);
  const [alexOpacity, setAlexOpacity] = useState(1); // Track opacity for fade out

  // Add sound effect for Alex disappearing
  const [disappearSound] = useState(
    typeof window !== 'undefined' ? new Audio('/ui-sound/whoosh.mp3') : null
  );
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eyeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const legIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const staticAnimationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Current image state
  const [currentImage, setCurrentImage] = useState(talkingExpressions.eyeOpenMouthClose);
  
  // Position state for side movement
  const [position, setPosition] = useState({ left: '40%', top: '175%', scale: 8 });
  
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
      // Reduced initial delay from 2000ms to 1000ms
      setTimeout(() => {
        setHasStartedSequence(true);
        startHolaSequence();
      }, 1000);
    }
  }, [shouldStartWalking]);

  // Handle continue talking after kids disappear
  useEffect(() => {
    if (shouldContinueTalking && (stage === 'static' || stage === 'continueTalking')) {
      setStage('armUpTalking');
      setCurrentAudioIndex(0); // Reset audio index for arm-up sequence
    }
  }, [shouldContinueTalking, stage]);

  // Modified disappear effect to ensure it triggers
  useEffect(() => {
    if (shouldDisappear) {
      console.log('Disappear triggered, current stage:', stage);
      
      // Ensure we're in a final stage before disappearing
      if (stage === 'finalStatic' || stage === 'static') {
        setTimeout(() => {
          // Play disappear sound
          disappearSound?.play().catch(console.error);
          
          // Start disappear animation
          setStage('disappearing');
          
          // Notify when animation is complete after the animation duration
          setTimeout(() => {
            console.log('Disappear animation complete');
            if (onDisappearComplete) {
              onDisappearComplete();
            }
          }, 1500); // Match this with the animation duration
        }, 500);
      }
    }
  }, [shouldDisappear, stage, onDisappearComplete, disappearSound]);


  // Handle talking animation - with support for arm-up talking
  const startTalkingAnimation = (duration: number, useArmUpImages: boolean = false) => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set current state to playing
    setIsCurrentAudioPlaying(true);
    
    // Choose the appropriate expression set
    const expressionSet = useArmUpImages ? armUpTalkingExpressions : talkingExpressions;
    
    // Mouth animation (faster - 150ms is about 6-7 times per second)
    mouthIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using the correct expressions
        if ((useArmUpImages && !isFromExpressionSet(prevImage, 'armUp')) || 
            (!useArmUpImages && !isFromExpressionSet(prevImage, 'talking'))) {
          return expressionSet.eyeOpenMouthOpen;
        }
        
        // Determine current eye state
        const eyesOpen = hasOpenEyes(prevImage);
        
        // Toggle mouth state
        const mouthOpen = hasMouthOpen(prevImage);
        
        if (mouthOpen) {
          return eyesOpen ? expressionSet.eyeOpenMouthClose : expressionSet.eyeCloseMouthClose;
        } else {
          return eyesOpen ? expressionSet.eyeOpenMouthOpen : expressionSet.eyeCloseMouthOpen;
        }
      });
    }, 150);
    
    // Eye animation (slower - 400ms with natural blinking)
    eyeIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using the correct expressions
        if ((useArmUpImages && !isFromExpressionSet(prevImage, 'armUp')) || 
            (!useArmUpImages && !isFromExpressionSet(prevImage, 'talking'))) {
          return expressionSet.eyeOpenMouthOpen;
        }
        
        // Determine current mouth state
        const mouthOpen = hasMouthOpen(prevImage);
        
        // Toggle eye state with higher probability of open eyes
        const eyesOpen = hasOpenEyes(prevImage);
        
        // Natural blinking pattern: 15% chance of changing eye state
        if (Math.random() < 0.15) {
          if (eyesOpen) {
            return mouthOpen ? expressionSet.eyeCloseMouthOpen : expressionSet.eyeCloseMouthClose;
          } else {
            return mouthOpen ? expressionSet.eyeOpenMouthOpen : expressionSet.eyeOpenMouthClose;
          }
        }
        
        // If no blink occurs, keep the current eye state
        return prevImage;
      });
    }, 400);
    
    // Set timeout to end animation exactly when audio ends
    animationTimeoutRef.current = setTimeout(() => {
      stopTalkingAnimation();
    }, duration + 300); // Add 150ms to ensure animation stops after audio ends
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
    
    // Reset to default state based on current stage
    if (stage === 'armUpTalking') {
      setCurrentImage(armUpTalkingExpressions.eyeOpenMouthClose);
    } else {
      setCurrentImage(talkingExpressions.eyeOpenMouthClose);
    }
  };
  
  // Walking animation
  const startWalkingAnimation = () => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set initial walking image
    setCurrentImage(walkingExpressions.eyeOpenLegLeft);
    
    // Leg animation - FASTER: changed from 200ms to 150ms
    legIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using walking expressions
        if (!isFromExpressionSet(prevImage, 'walking')) {
          return walkingExpressions.eyeOpenLegLeft;
        }
        
        // Determine current eye state
        const eyesOpen = hasOpenEyes(prevImage);
        
        // Toggle leg position
        const leftLeg = hasLeftLeg(prevImage);
        
        if (leftLeg) {
          return eyesOpen ? walkingExpressions.eyeOpenLegRight : walkingExpressions.eyeCloseLegRight;
        } else {
          return eyesOpen ? walkingExpressions.eyeOpenLegLeft : walkingExpressions.eyeCloseLegLeft;
        }
      });
    }, 150); // Faster leg movement (was 200ms)
    
    // Eye animation (blinking occasionally)
    eyeIntervalRef.current = setInterval(() => {
      setCurrentImage(prevImage => {
        // Make sure we're using walking expressions
        if (!isFromExpressionSet(prevImage, 'walking')) {
          return walkingExpressions.eyeOpenLegLeft;
        }
        
        // Determine current leg state
        const leftLeg = hasLeftLeg(prevImage);
        
        // Random blink - 10% chance of changing eye state
        if (Math.random() < 0.1) {
          const eyesOpen = hasOpenEyes(prevImage);
          if (eyesOpen) {
            return leftLeg ? walkingExpressions.eyeCloseLegLeft : walkingExpressions.eyeCloseLegRight;
          } else {
            return leftLeg ? walkingExpressions.eyeOpenLegLeft : walkingExpressions.eyeOpenLegRight;
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

  // Final static pose (after arm-up talking is done)
  const startFinalStaticPose = () => {
    // Clear any existing animations
    cleanupAnimations();
    
    // Set to final static image with arm down
    setCurrentImage(armUpTalkingExpressions.finalPose);
  };

// Play the current audio file
const playCurrentAudio = () => {
  let audioData;
  let useArmUpImages = false;
  
  // Determine which audio sequence to use based on the stage
  if (stage === 'continueTalking') {
    audioData = continueAudioSequence[currentAudioIndex];
  } 
  else if (stage === 'armUpTalking') {
    audioData = armUpAudioSequence[currentAudioIndex];
    useArmUpImages = true;
  } 
  else {
    audioData = audioSequence[currentAudioIndex];
  }
  
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current = null;
  }
  
  // Create new audio object
  audioRef.current = new Audio(audioData.file);
  
  // Special handling for the final arm-up audio (11-alex.mp3)
  const isLastArmUpAudio = stage === 'armUpTalking' && 
                          currentAudioIndex === armUpAudioSequence.length - 1;
  
  // If it's the 11-alex audio, use lower mouth animation frequency
  // to match the longer, more measured speech pattern in this file
  if (isLastArmUpAudio) {
    // Start arm up talking animation with slower mouth movement for the longer audio
    startSlowerTalkingAnimation(audioData.duration, useArmUpImages);
  } else {
    // Start talking animation BEFORE playing the audio
    startTalkingAnimation(audioData.duration, useArmUpImages);
  }
  
  // Add a small delay before starting audio to ensure animation is running
  setTimeout(() => {
    if (audioRef.current) {
      // Handle when audio ends
      audioRef.current.onended = () => {
        // Different handling based on which audio sequence we're in
        if (stage === 'continueTalking') {
          // For continueTalking stage - NO DELAY between audio clips
          if (currentAudioIndex < continueAudioSequence.length - 1) {
            setCurrentAudioIndex(prev => prev + 1);
          } else {
            // After continuing talking, go back to static
            setStage('static');
            startStaticAnimation();
          }
        } else if (stage === 'armUpTalking') {
          // For arm-up talking stage
          if (currentAudioIndex < armUpAudioSequence.length - 1) {
            setCurrentAudioIndex(prev => prev + 1);
          } else {
            // After arm-up talking, go to final static pose
            setStage('finalStatic');
            startFinalStaticPose();
          }
        } else {
          // Original audio sequence - keep the existing 500ms delay
          setTimeout(() => {
            if (currentAudioIndex < audioSequence.length - 1) {
              setCurrentAudioIndex(prev => prev + 1);
            } else {
              // This is the last audio - move to final walking
              setStage('finalWalking');
              startWalkingAnimation();
            }
          }, 500); // Maintained pause between audio clips for the first talking sequence
        }
      };
      
      audioRef.current.play().catch(console.error);
    }
  }, 50); // Small delay to ensure mouth is already moving when audio starts
};

// Slower talking animation specifically for the longer final audio (11-alex.mp3)
const startSlowerTalkingAnimation = (duration: number, useArmUpImages: boolean = false) => {
  // Clear any existing animations
  cleanupAnimations();
  
  // Set current state to playing
  setIsCurrentAudioPlaying(true);
  
  // Choose the appropriate expression set
  const expressionSet = useArmUpImages ? armUpTalkingExpressions : talkingExpressions;
  
  // Mouth animation (slower - 250ms for more deliberate speech pattern)
  mouthIntervalRef.current = setInterval(() => {
    setCurrentImage(prevImage => {
      // Make sure we're using the correct expressions
      if ((useArmUpImages && !isFromExpressionSet(prevImage, 'armUp')) || 
          (!useArmUpImages && !isFromExpressionSet(prevImage, 'talking'))) {
        return expressionSet.eyeOpenMouthOpen;
      }
      
      // Determine current eye state
      const eyesOpen = hasOpenEyes(prevImage);
      
      // Toggle mouth state
      const mouthOpen = hasMouthOpen(prevImage);
      
      if (mouthOpen) {
        return eyesOpen ? expressionSet.eyeOpenMouthClose : expressionSet.eyeCloseMouthClose;
      } else {
        return eyesOpen ? expressionSet.eyeOpenMouthOpen : expressionSet.eyeCloseMouthOpen;
      }
    });
  }, 250); // Slower mouth movement for a more measured, deliberate speech pattern
  
  // Eye animation (slower - 400ms with natural blinking - same as regular talking)
  eyeIntervalRef.current = setInterval(() => {
    setCurrentImage(prevImage => {
      // Make sure we're using the correct expressions
      if ((useArmUpImages && !isFromExpressionSet(prevImage, 'armUp')) || 
          (!useArmUpImages && !isFromExpressionSet(prevImage, 'talking'))) {
        return expressionSet.eyeOpenMouthOpen;
      }
      
      // Determine current mouth state
      const mouthOpen = hasMouthOpen(prevImage);
      
      // Toggle eye state with higher probability of open eyes
      const eyesOpen = hasOpenEyes(prevImage);
      
      // Natural blinking pattern: 15% chance of changing eye state
      if (Math.random() < 0.15) {
        if (eyesOpen) {
          return mouthOpen ? expressionSet.eyeCloseMouthOpen : expressionSet.eyeCloseMouthClose;
        } else {
          return mouthOpen ? expressionSet.eyeOpenMouthOpen : expressionSet.eyeOpenMouthClose;
        }
      }
      
      // If no blink occurs, keep the current eye state
      return prevImage;
    });
  }, 400);
  
  // Set timeout to end animation exactly when audio ends plus buffer
  animationTimeoutRef.current = setTimeout(() => {
    stopTalkingAnimation();
  }, duration + 300); // Adding buffer time to ensure animation covers full audio
};

  // Initial "Hola" sequence
  const startHolaSequence = () => {
    setStage('hola');
    
    // Initial talking animation for "Hola"
    setCurrentImage(talkingExpressions.eyeOpenMouthOpen);
    
    // Start talking animation BEFORE playing the audio
    startTalkingAnimation(audioSequence[0].duration);
    
    // Create "Hola" audio
    const audio = new Audio(audioSequence[0].file);
    
    // Add a small delay before starting audio to ensure animation is running
    setTimeout(() => {
      audio.onended = () => {
        // After "Hola", start walking
        stopTalkingAnimation();
        
        // Reduced pause before walking (from 500ms to 200ms)
        setTimeout(() => {
          setStage('walking');
          startWalkingAnimation();
        }, 200);
      };
      
      audio.play().catch(console.error);
    }, 50); // Small delay to ensure mouth is already moving when audio starts
  };
  
  // Handle walking complete
  const handleWalkingComplete = () => {
    // Stop walking animations
    cleanupAnimations();
    
    // Start talking sequence
    setStage('talking');
    setCurrentAudioIndex(1); // Start from the second audio (index 1)
  };
  
  // Handle final walking complete
  const handleFinalWalkingComplete = () => {
    // Stop walking animations
    cleanupAnimations();
    
    // Set to side moving stage
    setStage('sideMoving');
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
    } else if (stage === 'continueTalking' && currentAudioIndex < continueAudioSequence.length) {
      playCurrentAudio();
    } else if (stage === 'armUpTalking' && currentAudioIndex < armUpAudioSequence.length) {
      playCurrentAudio();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stage, currentAudioIndex]);

  // Don't render anything until sequence begins
  if (!hasStartedSequence) return null;

  // Render component based on current stage
  return (
    <div 
      className="absolute w-full h-full"
      style={{
        position: 'absolute',
        left: '45%',  // Moved further right (from 40% to 45%)
        width: '9%',       // Width of Alex container
        top: 10,           // Top offset of Alex container
        height: '100%',    // Height of Alex container
        pointerEvents: 'none',
        zIndex: 50,        // High z-index to ensure Alex is in front
      }}
    >
      {/* Static position or Arm-Up Talking or Final Static after all animations */}
      {(stage === 'static' || stage === 'continueTalking' || stage === 'armUpTalking' || stage === 'finalStatic') && (
        <div
          className="absolute w-full static-alex"
          style={{
            left: 0, 
            top: sidePosition.top,
            // Initial values that will be overwritten with exact final transform
            transform: `translateX(-15vw) scale(${sidePosition.scale})`,
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
            x: 0, // Start at current position (45%)
            top: finalPosition.top,
            scale: finalPosition.scale,
          }}
          animate={{
            x: '-15vw', // Move leftward by 15% of viewport width
            top: sidePosition.top,
            scale: sidePosition.scale,
          }}
          transition={{
            duration: 2, // Faster side movement (was 2.5s)
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

      {/* Final walking animation after talking */}
      {stage === 'finalWalking' && (
        <motion.div
          className="absolute left-0 w-full"
          initial={{
            top: midPosition.top,
            scale: midPosition.scale,
            x: 0      // Start from middle position
          }}
          animate={{
            // Animate to the final position
            top: finalPosition.top,
            scale: finalPosition.scale,
            x: 0      // Keep same horizontal position
          }}
          transition={{
            duration: 2, // Faster transition (was 3s)
            ease: "easeInOut",
          }}
          onAnimationComplete={handleFinalWalkingComplete}
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
            
            <motion.div
              animate={{
                y: ['-2%', '2%'],
                rotate: [-2, 2],
                transition: {
                  repeat: Infinity,
                  duration: 0.4,
                  ease: "linear"
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

      {/* If in talking stage, render Alex at the middle position */}
      {stage === 'talking' && (
        <div 
          className="absolute left-0 w-full"
          style={{
            top: midPosition.top,
            transform: `scale(${midPosition.scale})`,
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

      {/* Add the new disappearing animation */}
     {/* Updated disappearing animation with added logging */}
     {stage === 'disappearing' && (
        <motion.div
          className="absolute w-full"
          style={{
            left: 0, 
            top: sidePosition.top,
            transform: `translateX(-15vw) scale(${sidePosition.scale})`,
          }}
          animate={{
            y: '100vh', // Move down off-screen
            opacity: 0,
            scale: sidePosition.scale * 1.2, // Slightly increase scale while going down
          }}
          transition={{
            duration: 1.5,
            ease: "easeIn",
          }}
          onAnimationComplete={() => {
            console.log('Disappear motion complete');
            if (onDisappearComplete) {
              onDisappearComplete();
            }
          }}
        >
          <div className="relative">
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
              initial={{ 
                width: '150%', 
                height: '25%', 
                bottom: '-12.5%',
                opacity: 0.3
              }}
              animate={{
                width: '200%', // Widen shadow
                height: '20%', // Slightly reduce shadow height
                bottom: '-12.5%',
                opacity: 0, // Fade out shadow
              }}
              transition={{
                duration: 1.5,
                ease: "easeIn",
              }}
            />
            
            <div className="relative">
              <div className="relative w-[700%] aspect-square" style={{ left: '-300%' }}>
                <Image
                  src={armUpTalkingExpressions.finalPose}
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
 


     {/* Only show the stationary hola animation */}
     {stage === 'hola' && (
       <div
         className="absolute left-0 w-full"
         style={{
           top: '40%',    // Initial starting position (from top)
           transform: `scale(3.2)`,  // 8% bigger initial scale (up from 2.2)
         }}
       >
         <div className="relative">
           {/* Shadow under Alex */}
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
     
     {/* Only show the walking animation if in walking stage */}
     {stage === 'walking' && (
       <motion.div
         className="absolute left-0 w-full"
         initial={{
           top: '40%',    // Initial starting position (from top)
           scale: 3.2,    // Bigger initial scale (matching hola)
           x: 0           // Start at container position
         }}
         animate={{
           // Animate to the middle position for talking
           top: midPosition.top,
           scale: midPosition.scale,
           x: 0
         }}
         transition={{
           duration: 2.5, // Much faster walking (was 4s)
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
               duration: 2.5, // Match the walking speed
               ease: "easeInOut"
             }}
           />
           
           <motion.div
             animate={{
               y: ['-2%', '2%'],
               rotate: [-2, 2],
               transition: {
                 repeat: Infinity,
                 duration: 0.3, // Faster bounce animation (was 0.4s)
                 ease: "linear"
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