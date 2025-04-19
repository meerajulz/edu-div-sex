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
      
//       // Set to completed state
//       setIsComplete(true);
//       setIsMouthOpen(false);
//       console.log("Alex animation complete");
      
//       // Call completion callback
//       if (onAnimationComplete) {
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { playAudio } from '../../utils/audioPlayer';

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
  
  // Refs for intervals/timeouts and tracking if audio has been played
  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedAudioRef = useRef(false);
  const hasStartedAnimationRef = useRef(false);
  const hasCalledCompletionCallbackRef = useRef(false);
  
  // Start animation when Alex becomes visible
  useEffect(() => {
    // Guard against duplicate effects
    if (!isVisible || isComplete || hasStartedAnimationRef.current) {
      return;
    }
    
    // Mark that we've started the animation
    hasStartedAnimationRef.current = true;
    
    console.log("Starting Alex animation sequence");
    
    // Start mouth animation
    mouthIntervalRef.current = setInterval(() => {
      setIsMouthOpen(prev => !prev);
    }, 150);
    
    // Play the "Hola" audio only once
    if (!hasPlayedAudioRef.current) {
      hasPlayedAudioRef.current = true;
      console.log("Playing Alex hola audio (first time)");
      
      playAudio('/audio/alex/intro/1-alex.mp3')
        .then(() => console.log("Alex audio played successfully"))
        .catch(err => console.error("Failed to play Alex audio:", err));
    }
    
    // After animation duration, stop the animation
    animationTimerRef.current = setTimeout(() => {
      // Clear mouth animation
      if (mouthIntervalRef.current) {
        clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
      
      // Set to completed state
      setIsComplete(true);
      setIsMouthOpen(false);
      console.log("Alex animation complete");
      
      // Call completion callback - but only once
      if (onAnimationComplete && !hasCalledCompletionCallbackRef.current) {
        console.log("Calling Alex animation completion callback");
        hasCalledCompletionCallbackRef.current = true;
        onAnimationComplete();
      }
    }, 2500); // Animation lasts 2.5 seconds
    
    // Cleanup
    return () => {
      if (mouthIntervalRef.current) {
        clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [isVisible, isComplete, onAnimationComplete]);
  
  // Reset if visibility changes to false
  useEffect(() => {
    if (!isVisible) {
      // Reset everything when Alex becomes invisible
      hasStartedAnimationRef.current = false;
      hasCalledCompletionCallbackRef.current = false;
      
      // Don't reset hasPlayedAudioRef to avoid playing audio again if component re-appears
      
      // Clear any active timers
      if (mouthIntervalRef.current) {
        clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      
      // Reset states
      setIsMouthOpen(false);
      setIsComplete(false);
    }
  }, [isVisible]);
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="absolute bottom-0 left-20 z-40" style={{ pointerEvents: 'none' }}>
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
    </div>
  );
};

export default SimpleAlex;

