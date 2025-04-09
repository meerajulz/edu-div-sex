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
  
  // Refs for intervals/timeouts
  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start animation when Alex becomes visible
  useEffect(() => {
    if (isVisible && !isComplete) {
      // Start mouth animation
      mouthIntervalRef.current = setInterval(() => {
        setIsMouthOpen(prev => !prev);
      }, 150);
      
      // Play the "Hola" audio
      console.log("Attempting to play Alex hola audio");
      playAudio('/audio/alex/intro/1-alex.mp3')
        .then(() => console.log("Alex audio played successfully"))
        .catch(err => console.error("Failed to play Alex audio:", err));
      
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
        
        // Call completion callback
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 2500); // Animation lasts 2.5 seconds
      
      // Cleanup
      return () => {
        if (mouthIntervalRef.current) {
          clearInterval(mouthIntervalRef.current);
        }
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }
      };
    }
  }, [isVisible, isComplete, onAnimationComplete]);
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="absolute bottom-0 left-0 z-40" style={{ pointerEvents: 'none' }}>
      <div
        className="relative"
        style={{
          width: '50vw',  // Half the screen width
          height: '70vh', // Tall enough to show half of Alex
          transform: 'translateY(50%)', // Push down to show only upper half
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