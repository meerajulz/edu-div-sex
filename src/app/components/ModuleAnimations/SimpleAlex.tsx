// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { playAudio } from '../../utils/audioPlayer';

// interface SimpleAlexProps {
//   isVisible: boolean;
//   onAnimationComplete?: () => void;
// }

// const SimpleAlex: React.FC<SimpleAlexProps> = ({ 
//   isVisible, 
//   onAnimationComplete 
// }) => {
//   // States
//   const [isMouthOpen, setIsMouthOpen] = useState(false);
//   const [isComplete, setIsComplete] = useState(false);
  
//   // Refs for intervals/timeouts and tracking if audio has been played
//   const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const hasPlayedAudioRef = useRef(false);
//   const hasStartedAnimationRef = useRef(false);
//   const hasCalledCompletionCallbackRef = useRef(false);
  
//   // Start animation when Alex becomes visible
//   useEffect(() => {
//     // Guard against duplicate effects
//     if (!isVisible || isComplete || hasStartedAnimationRef.current) {
//       return;
//     }
    
//     // Mark that we've started the animation
//     hasStartedAnimationRef.current = true;
    
//     console.log("Starting Alex animation sequence");
    
//     // Start mouth animation
//     mouthIntervalRef.current = setInterval(() => {
//       setIsMouthOpen(prev => !prev);
//     }, 150);
    
//     // Play the "Hola" audio only once
//     if (!hasPlayedAudioRef.current) {
//       hasPlayedAudioRef.current = true;
//       console.log("Playing Alex hola audio (first time)");
      
//       playAudio('/audio/alex/intro/1-alex.mp3')
//         .then(() => console.log("Alex audio played successfully"))
//         .catch(err => console.error("Failed to play Alex audio:", err));
//     }
    
//     // After animation duration, stop the animation
//     animationTimerRef.current = setTimeout(() => {
//       // Clear mouth animation
//       if (mouthIntervalRef.current) {
//         clearInterval(mouthIntervalRef.current);
//         mouthIntervalRef.current = null;
//       }
      
//       // Set to completed state with mouth closed
//       setIsComplete(true);
//       setIsMouthOpen(false);
//       console.log("Alex animation complete");
      
//       // Call completion callback - but only once
//       if (onAnimationComplete && !hasCalledCompletionCallbackRef.current) {
//         console.log("Calling Alex animation completion callback");
//         hasCalledCompletionCallbackRef.current = true;
//         onAnimationComplete();
//       }
//     }, 2500); // Animation lasts 2.5 seconds
    
//     // Cleanup
//     return () => {
//       if (mouthIntervalRef.current) {
//         clearInterval(mouthIntervalRef.current);
//         mouthIntervalRef.current = null;
//       }
//       if (animationTimerRef.current) {
//         clearTimeout(animationTimerRef.current);
//         animationTimerRef.current = null;
//       }
//     };
//   }, [isVisible, isComplete, onAnimationComplete]);
  
//   // Reset if visibility changes to false
//   useEffect(() => {
//     if (!isVisible) {
//       // Reset everything when Alex becomes invisible
//       hasStartedAnimationRef.current = false;
//       hasCalledCompletionCallbackRef.current = false;
      
//       // Don't reset hasPlayedAudioRef to avoid playing audio again if component re-appears
      
//       // Clear any active timers
//       if (mouthIntervalRef.current) {
//         clearInterval(mouthIntervalRef.current);
//         mouthIntervalRef.current = null;
//       }
//       if (animationTimerRef.current) {
//         clearTimeout(animationTimerRef.current);
//         animationTimerRef.current = null;
//       }
      
//       // Reset states
//       setIsMouthOpen(false);
//       setIsComplete(false);
//     }
//   }, [isVisible]);
  
//   // Don't render if not visible
//   if (!isVisible) {
//     return null;
//   }
  
//   return (
//     <div className="absolute bottom-0 left-20 z-40" style={{ pointerEvents: 'none' }}>
//       <div
//         className="relative"
//         style={{
//           width: '80vw',  // Width increased for better visibility
//           height: '100vh', // Tall enough to show half of Alex
//           transform: 'translateY(45%)', // Push down to show only upper half
//           transformOrigin: 'bottom left',
//         }}
//       >
//         <Image
//           src={isMouthOpen 
//             ? '/svg/alex-talk/eye-open-mouth-open-arms-down.svg' 
//             : '/svg/alex-talk/eye-open-mouth-close-arms-down.svg'
//           }
//           alt="Alex"
//           fill
//           style={{ 
//             objectFit: 'contain',
//             objectPosition: 'left bottom'
//           }}
//           priority
//         />
//       </div>
//     </div>
//   );
// };

// export default SimpleAlex;

// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { playAudio } from '../../utils/audioPlayer';

// interface SimpleAlexProps {
//   isVisible: boolean;
//   onAnimationComplete?: () => void;
// }

// const SimpleAlex: React.FC<SimpleAlexProps> = ({ 
//   isVisible, 
//   onAnimationComplete 
// }) => {
//   // States
//   const [isMouthOpen, setIsMouthOpen] = useState(false);
//   const [isComplete, setIsComplete] = useState(false);
//   const [isSlideComplete, setIsSlideComplete] = useState(false);
  
//   // Refs for intervals/timeouts and tracking if audio has been played
//   const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const hasPlayedAudioRef = useRef(false);
//   const hasStartedAnimationRef = useRef(false);
//   const hasCalledCompletionCallbackRef = useRef(false);
  
//   // Start slide animation when Alex becomes visible
//   useEffect(() => {
//     if (!isVisible || hasStartedAnimationRef.current) {
//       return;
//     }
    
//     // Mark that we've started the animation
//     hasStartedAnimationRef.current = true;
    
//     console.log("Starting Alex slide animation");
//   }, [isVisible]);
  
//   // Start mouth animation after slide is complete
//   useEffect(() => {
//     // Guard against duplicate effects or running before slide completes
//     if (!isVisible || isComplete || !isSlideComplete) {
//       return;
//     }
    
//     console.log("Starting Alex mouth animation after slide");
    
//     // Start mouth animation
//     mouthIntervalRef.current = setInterval(() => {
//       setIsMouthOpen(prev => !prev);
//     }, 150);
    
//     // Play the "Hola" audio only once
//     if (!hasPlayedAudioRef.current) {
//       hasPlayedAudioRef.current = true;
//       console.log("Playing Alex hola audio (first time)");
      
//       playAudio('/audio/alex/intro/1-alex.mp3', )
//         .then(() => console.log("Alex audio played successfully"))
//         .catch(err => console.error("Failed to play Alex audio:", err));
        
//     }
    
//     // After animation duration, stop the animation
//     animationTimerRef.current = setTimeout(() => {
//       // Clear mouth animation
//       if (mouthIntervalRef.current) {
//         clearInterval(mouthIntervalRef.current);
//         mouthIntervalRef.current = null;
//       }
      
//       // Set to completed state with mouth closed
//       setIsComplete(true);
//       setIsMouthOpen(false);
//       console.log("Alex animation complete");
      
//       // Call completion callback - but only once
//       if (onAnimationComplete && !hasCalledCompletionCallbackRef.current) {
//         console.log("Calling Alex animation completion callback");
//         hasCalledCompletionCallbackRef.current = true;
//         onAnimationComplete();
//       }
//     }, 2500); // Animation lasts 2.5 seconds
    
//     // Cleanup
//     return () => {
//       if (mouthIntervalRef.current) {
//         clearInterval(mouthIntervalRef.current);
//         mouthIntervalRef.current = null;
//       }
//       if (animationTimerRef.current) {
//         clearTimeout(animationTimerRef.current);
//         animationTimerRef.current = null;
//       }
//     };
//   }, [isVisible, isComplete, isSlideComplete, onAnimationComplete]);
  
//   // Reset if visibility changes to false
//   useEffect(() => {
//     if (!isVisible) {
//       // Reset everything when Alex becomes invisible
//       hasStartedAnimationRef.current = false;
//       hasCalledCompletionCallbackRef.current = false;
      
//       // Don't reset hasPlayedAudioRef to avoid playing audio again if component re-appears
      
//       // Clear any active timers
//       if (mouthIntervalRef.current) {
//         clearInterval(mouthIntervalRef.current);
//         mouthIntervalRef.current = null;
//       }
//       if (animationTimerRef.current) {
//         clearTimeout(animationTimerRef.current);
//         animationTimerRef.current = null;
//       }
      
//       // Reset states
//       setIsMouthOpen(false);
//       setIsComplete(false);
//       setIsSlideComplete(false);
//     }
//   }, [isVisible]);
  
//   // Handle slide animation complete
//   const handleSlideComplete = () => {
//     console.log("Alex slide animation complete");
//     setIsSlideComplete(true);
//   };
  
//   // Animation variants for slide
//   const slideVariants = {
//     hidden: { 
//       x: "-100%",
//       opacity: 0 
//     },
//     visible: { 
//       x: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         damping: 20,
//         stiffness: 100,
//         duration: 0.8
//       }
//     },
//     exit: { 
//       x: "-100%",
//       opacity: 0,
//       transition: { 
//         duration: 0.3 
//       }
//     }
//   };
  
//   // Don't render if not visible
//   if (!isVisible) {
//     return null;
//   }
  
//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div 
//           className="absolute bottom-0 left-20 z-40" 
//           style={{ pointerEvents: 'none' }}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           variants={slideVariants}
//           onAnimationComplete={handleSlideComplete}
//         >
//           <div
//             className="relative"
//             style={{
//               width: '80vw',  // Width increased for better visibility
//               height: '100vh', // Tall enough to show half of Alex
//               transform: 'translateY(45%)', // Push down to show only upper half
//               transformOrigin: 'bottom left',
//             }}
//           >
//             <Image
//               src={isMouthOpen 
//                 ? '/svg/alex-talk/eye-open-mouth-open-arms-down.svg' 
//                 : '/svg/alex-talk/eye-open-mouth-close-arms-down.svg'
//               }
//               alt="Alex"
//               fill
//               style={{ 
//                 objectFit: 'contain',
//                 objectPosition: 'left bottom'
//               }}
//               priority
//             />
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default SimpleAlex;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { playAudio, cleanupAudio } from '../../utils/audioPlayer';

interface SimpleAlexProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

const SimpleAlex: React.FC<SimpleAlexProps> = ({ 
  isVisible, 
  onAnimationComplete 
}) => {
  // States
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSlideComplete, setIsSlideComplete] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(0);
  
  // Refs for intervals/timeouts and tracking
  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dialogueTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedAnimationRef = useRef(false);
  const hasCalledCompletionCallbackRef = useRef(false);
  const isPlayingAudioRef = useRef(false);
  
  // Define the dialogue sequence with timing
  const dialogues = [
    {
      audioPath: '/audio/alex/intro/1-alex.mp3',
      duration: 2000 // 1 second for the first dialogue
    },
    {
      audioPath: '/audio/alex/intro/juego/ahora-jugamos.mp3',
      duration: 1000 // 1 second for the second dialogue
    },
    {
      audioPath: '/audio/alex/intro/juego/click-actividad.mp3',
      duration: 1000 // 1 second for the third dialogue
    }
  ];
  
  // Start slide animation when Alex becomes visible
  useEffect(() => {
    if (!isVisible || hasStartedAnimationRef.current) {
      return;
    }
    
    // Mark that we've started the animation
    hasStartedAnimationRef.current = true;
    console.log("Starting Alex slide animation");
    
    // Reset dialogue state
    setCurrentDialogue(0);
    
    return () => {
      // Cleanup any playing audio when component unmounts or visibility changes
      cleanupAudio();
    };
  }, [isVisible]);
  
  // Function to play the next dialogue
  const playNextDialogue = async () => {
    // Clear any existing timers
    if (dialogueTimerRef.current) {
      clearTimeout(dialogueTimerRef.current);
      dialogueTimerRef.current = null;
    }
    
    // Check if we've reached the end
    if (currentDialogue >= dialogues.length) {
      // Finish animation
      finishAnimation();
      return;
    }
    
    // Get current dialogue
    const dialogue = dialogues[currentDialogue];
    console.log(`Playing Alex audio ${currentDialogue + 1}: ${dialogue.audioPath}`);
    
    // Prevent concurrent audio playing
    if (isPlayingAudioRef.current) {
      cleanupAudio();
    }
    
    // Mark as playing
    isPlayingAudioRef.current = true;
    
    try {
      // Play current dialogue audio
      await playAudio(dialogue.audioPath);
      console.log(`Alex audio ${currentDialogue + 1} completed`);
    } catch (err) {
      console.error(`Failed to play Alex audio ${currentDialogue + 1}:`, err);
    }
    
    // Mark as not playing
    isPlayingAudioRef.current = false;
    
    // Schedule next dialogue
    dialogueTimerRef.current = setTimeout(() => {
      setCurrentDialogue(prev => prev + 1);
    }, dialogue.duration);
  };
  
  // Function to finish the animation
  const finishAnimation = () => {
    // Clear mouth animation
    if (mouthIntervalRef.current) {
      clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
    }
    
    // Set to completed state with mouth closed
    setIsComplete(true);
    setIsMouthOpen(false);
    console.log("Alex animation complete");
    
    // Call completion callback - but only once
    if (onAnimationComplete && !hasCalledCompletionCallbackRef.current) {
      console.log("Calling Alex animation completion callback");
      hasCalledCompletionCallbackRef.current = true;
      onAnimationComplete();
    }
  };
  
  // Start mouth animation and trigger the dialogue sequence after slide is complete
  useEffect(() => {
    // Guard against running before slide completes or if already complete
    if (!isVisible || isComplete || !isSlideComplete) {
      return;
    }
    
    // Start mouth animation if not already started
    if (!mouthIntervalRef.current) {
      mouthIntervalRef.current = setInterval(() => {
        setIsMouthOpen(prev => !prev);
      }, 150);
    }
    
    // Play the current dialogue based on state change
    playNextDialogue();
    
    // Cleanup
    return () => {
      if (dialogueTimerRef.current) {
        clearTimeout(dialogueTimerRef.current);
        dialogueTimerRef.current = null;
      }
      cleanupAudio();
    };
    
  }, [isVisible, isComplete, isSlideComplete, currentDialogue]);
  
  // Extra effect to handle completion
  useEffect(() => {
    if (isVisible && isSlideComplete && currentDialogue >= dialogues.length && !isComplete) {
      finishAnimation();
    }
  }, [isVisible, isSlideComplete, currentDialogue, dialogues.length, isComplete]);
  
  // Reset if visibility changes to false
  useEffect(() => {
    if (!isVisible) {
      // Reset everything when Alex becomes invisible
      hasStartedAnimationRef.current = false;
      hasCalledCompletionCallbackRef.current = false;
      isPlayingAudioRef.current = false;
      
      // Clean up audio
      cleanupAudio();
      
      // Clear any active timers
      if (mouthIntervalRef.current) {
        clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
      if (dialogueTimerRef.current) {
        clearTimeout(dialogueTimerRef.current);
        dialogueTimerRef.current = null;
      }
      
      // Reset states
      setIsMouthOpen(false);
      setIsComplete(false);
      setIsSlideComplete(false);
      setCurrentDialogue(0);
    }
  }, [isVisible]);
  
  // Handle slide animation complete
  const handleSlideComplete = () => {
    console.log("Alex slide animation complete");
    setIsSlideComplete(true);
  };
  
  // Animation variants for slide
  const slideVariants = {
    hidden: { 
      x: "-100%",
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.8
      }
    },
    exit: { 
      x: "-100%",
      opacity: 0,
      transition: { 
        duration: 0.3 
      }
    }
  };
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="absolute bottom-0 left-20 z-40" 
          style={{ pointerEvents: 'none' }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          onAnimationComplete={handleSlideComplete}
        >
          <div
            className="relative"
            style={{
              width: '80vw',  // Width increased for better visibility
              height: '100vh', // Tall enough to show half of Alex
              transform: 'translateY(45%)', // Push down to show only upper half
              transformOrigin: 'bottom left',
            }}
          >
            <Image
              src={isMouthOpen 
                ? '/svg/alex-talk/eye-open-mouth-open-arms-down.svg' 
                : '/svg/alex-talk/eye-open-mouth-close-arms-down.svg'
              }
              alt="Alex"
              fill
              style={{ 
                objectFit: 'contain',
                objectPosition: 'left bottom'
              }}
              priority
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimpleAlex;