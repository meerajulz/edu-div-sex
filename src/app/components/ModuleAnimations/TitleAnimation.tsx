'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { playAudio, preloadAudioFiles } from '../../utils/audioPlayer';

interface TitleAnimationProps {
  activityNumber: number | string;
  onAnimationComplete?: () => void;
  duration?: number;
  customTitle?: string; // Optional override for "Actividad X" format
  enableVoice?: boolean; // Option to enable/disable voice
}

const TitleAnimation: React.FC<TitleAnimationProps> = ({ 
  activityNumber,
  onAnimationComplete,
  duration = 3000,
  customTitle,
  enableVoice = true
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  
  // Generate title text based on activity number or use custom title if provided
  const titleText = customTitle || `Actividad ${activityNumber}`;
  
  // Generate audio file path based on activity number
  const titleAudioSrc = `/audio/actividad-${activityNumber}.mp3`;

  // Preload audio file when component mounts
  useEffect(() => {
    if (enableVoice) {
      preloadAudioFiles([titleAudioSrc]);
    }
  }, [enableVoice, titleAudioSrc]);

  // First animation step - show title and play title audio
  useEffect(() => {
    // Short delay before showing the title (once animation reaches center)
    const titleTimer = setTimeout(() => {
      setTitleVisible(true);
      
      // Play the title audio if voice is enabled
      if (enableVoice) {
        playAudio(titleAudioSrc);
      }
    }, 2000); // After 2 seconds, title should be centered
    
    return () => clearTimeout(titleTimer);
  }, [titleText, enableVoice, titleAudioSrc]);

  // Second animation step - complete animation
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
      
      // Call the completion callback
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 500);
      }
    }, duration);
    
    return () => clearTimeout(animationTimer);
  }, [duration, onAnimationComplete]);

  return (
    <>
      {/* Horizon line */}
      <div className="fixed bottom-0 left-0 right-0 h-[1px] bg-white/30 z-1" />
      
      {/* Animated title coming from horizon */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center perspective-[1000px]">
        <motion.div
          initial={{ 
            y: 300, 
            z: -500, 
            scale: 0.1, 
            opacity: 0.2 
          }}
          animate={{ 
            y: 0, 
            z: 0, 
            scale: 1, 
            opacity: animationComplete ? 0 : 1 
          }}
          transition={{ 
            duration: 2.5, 
            ease: "easeOut" 
          }}
          className="font-bold text-center w-full max-w-[90vw] px-2"
          style={{ 
            transformStyle: "preserve-3d",
          }}
        >
          {/* Responsive title that scales with viewport width */}
          <div 
            className="whitespace-normal break-words"
            style={{ 
              fontSize: "max(3rem, min(10vw, 10rem))",
              lineHeight: "1.1",
              color: "#FF8C00", // Orange color
              textShadow: "0 4px 8px rgba(0,0,0,0.3)" // Enhanced shadow for better visibility
            }}
          >
            {titleText}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default TitleAnimation;