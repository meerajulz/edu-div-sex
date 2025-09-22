'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface CrisProps {
  isVisible: boolean;
  isPaused?: boolean;
  position?: {
    bottom?: string;
    left?: string;
    right?: string;
    top?: string;
  };
}

const Cris: React.FC<CrisProps> = ({
  isVisible,
  isPaused = false,
  position = { bottom: '0', left: '0%' }
}) => {
  const [isTalking, setIsTalking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debug prop changes
  useEffect(() => {
    console.log('🎭 Cris props changed - isVisible:', isVisible, 'isPaused:', isPaused);
  }, [isVisible, isPaused]);

  useEffect(() => {
    if (isVisible && !isPaused) {
      timeoutRef.current = setTimeout(() => {
        console.log('🗣️ Starting Cris audio');
        // Start talking
        const audio = new Audio('/audio/actividad-1/escena_1/juego_1_cris.mp3');
        audioRef.current = audio;
        setIsTalking(true);

        audio.play().then(() => {
          console.log('🎵 Audio started playing successfully');
        }).catch((error) => {
          console.warn('❌ Error playing audio:', error);
        });

        audio.onended = () => {
          console.log('🔚 Audio ended naturally');
          setIsTalking(false);
        };
      }, 3000); // wait 3s after showing

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isVisible, isPaused]);

  // Stop audio and talking when paused
  useEffect(() => {
    console.log('🎵 Cris isPaused changed to:', isPaused);

    if (isPaused) {
      console.log('🔇 Pausing Cris - clearing timeout and stopping audio');

      // Clear any pending timeout
      if (timeoutRef.current) {
        console.log('⏹️ Clearing timeout');
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Stop current audio if playing
      if (audioRef.current) {
        console.log('🔇 Stopping audio - pausing and resetting');
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch (error) {
          console.warn('Error stopping audio:', error);
        }
        audioRef.current = null;
      } else {
        console.log('⚠️ No audio reference found to stop');
      }

      // Stop talking animation
      console.log('🤫 Setting talking to false');
      setIsTalking(false);
    }
  }, [isPaused]);

  const positionStyles: React.CSSProperties = {
    position: 'absolute',
    ...position,
  };

  if (!isVisible) return null;

  return (
    <div
        className="z-20"
        style={{
          ...positionStyles,
          width: '100%',         // Full width of parent
          height: '100%',        // Full height of parent
          maxWidth: '100%',
          maxHeight: '100%',
          pointerEvents: 'none', // Allow clicks to pass through
        }}
      >
      <Image
        src={
          isTalking && !isPaused
            ? '/image/escena_1/cris_talking.gif'
            : '/image/escena_1/cris_static.gif'
        }
        alt="Cris"
        fill
        unoptimized
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Cris;