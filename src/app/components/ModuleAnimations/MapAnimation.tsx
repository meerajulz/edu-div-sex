'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  playAudio, 
  preloadAudioFiles,
  initAudio
} from '../../utils/audioPlayer';

interface MapAnimationProps {
  onAnimationComplete?: () => void;
  duration?: number;
  enableSound?: boolean;
  mapSrc?: string;
  soundSrc?: string;
}

const MapAnimation: React.FC<MapAnimationProps> = ({ 
  onAnimationComplete,
  duration = 4000,
  enableSound = true,
  mapSrc = '/svg/actividad1/mapa.svg',
  soundSrc = '/audio/map-rotation.mp3'
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [mapVisible, setMapVisible] = useState(false);

  // Init and preload audio when component mounts
  useEffect(() => {
    if (enableSound) {
      const setupAudio = async () => {
        // Initialize audio system
        try {
          await initAudio();
          await preloadAudioFiles([soundSrc]);
          console.log('Audio initialization and preloading complete for MapAnimation');
        } catch (e) {
          console.warn('Map audio setup error:', e);
        }
      };
      
      setupAudio();
    }
  }, [enableSound, soundSrc]);

  // Animation and audio playback effect
  useEffect(() => {
    let soundTimer: NodeJS.Timeout;
    
    // Start the map animation after a short delay
    const mapTimer = setTimeout(() => {
      setMapVisible(true);
      
      // Play the map rotation sound if enabled
      if (enableSound && !soundPlayed) {
        // Try multiple times in case the audio system isn't ready yet
        const attemptPlay = async () => {
          console.log('Attempting to play map animation sound');
          const success = await playAudio(soundSrc);
          
          if (success) {
            console.log('Map animation sound played successfully');
            setSoundPlayed(true);
          } else {
            console.warn('Failed to play map sound, will retry');
            // Retry after a short delay
            soundTimer = setTimeout(attemptPlay, 500);
          }
        };
        
        attemptPlay();
      }
    }, 1000);
    
    // Animation completion
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
      
      // Call the completion callback
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 500);
      }
    }, duration);
    
    return () => {
      clearTimeout(mapTimer);
      clearTimeout(animationTimer);
      if (soundTimer) clearTimeout(soundTimer);
    };
  }, [soundSrc, enableSound, duration, onAnimationComplete, soundPlayed]);

  return (
    <div className="relative z-10 w-full min-h-screen flex items-center justify-center perspective-[1000px]">
      <motion.div
        initial={{ 
          scale: 0.01,
          opacity: 0.2,
          rotateY: 0
        }}
        animate={{ 
          scale: animationComplete ? 1 : [0.01, 1, 1],
          opacity: animationComplete ? 1 : [0.2, 1, 1],
          rotateY: animationComplete ? 0 : [0, 360, 0]
        }}
        transition={{ 
          duration: duration / 1000, // Convert to seconds
          ease: "easeOut",
          times: [0, 0.7, 1] // Control when each keyframe happens
        }}
        className="w-full max-w-[80vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw] relative"
        style={{ 
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative w-full aspect-square">
          <Image
            src={mapSrc}
            alt="Mapa de actividad"
            fill
            priority
            style={{ 
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MapAnimation;