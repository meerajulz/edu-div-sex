'use client';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import Image from 'next/image';

interface SimpleAlexProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
  className?: string;
}

export interface SimpleAlexRef {
  stopSpeech: () => void;
}

const dialogues = [
  { path: '/audio/alex/alex-1.mp3', duration: 1800 },
  { path: '/audio/alex/alex-2.mp3', duration: 2000 },
];

const SimpleAlex = forwardRef<SimpleAlexRef, SimpleAlexProps>(({
  isVisible,
  onAnimationComplete,
  className = ''
}, ref) => {
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDialogue, setCurrentDialogue] = useState(0);

  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStarted = useRef(false);
  const allTimersRef = useRef<NodeJS.Timeout[]>([]);
  const audioElementsRef = useRef<HTMLAudioElement[]>([]);

  const startMouthMovement = () => {
    if (mouthIntervalRef.current) return;
    mouthIntervalRef.current = setInterval(() => {
      setIsMouthOpen(prev => !prev);
    }, 350);
  };

  const stopMouthMovement = () => {
    if (mouthIntervalRef.current) {
      clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
    }
    setIsMouthOpen(false);
  };

  const stopSpeech = useCallback(() => {
    console.log('[SimpleAlex] Stopping speech and clearing timers');

    // Clear all voice timers
    allTimersRef.current.forEach(timer => clearTimeout(timer));
    allTimersRef.current = [];

    // Clear mouth movement
    stopMouthMovement();

    // Stop all audio elements
    audioElementsRef.current.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        console.warn('Failed to stop audio:', e);
      }
    });
    audioElementsRef.current = [];

    // Reset state
    setCurrentDialogue(0);
  }, []);

  const playAlexVoice = (index: number) => {
    const dialogue = dialogues[index];
    console.log(`[SimpleAlex] Playing voice ${index + 1} of ${dialogues.length}:`, dialogue.path);

    // Create independent Audio element for this dialogue
    const audio = new Audio(dialogue.path);

    // Get volume from localStorage
    const savedVolume = localStorage.getItem('video-volume');
    audio.volume = savedVolume ? parseFloat(savedVolume) : 0.7;

    audio.onended = () => {
      console.log(`[SimpleAlex] Dialogue ${index + 1} finished`);
    };

    audio.onerror = (err) => {
      console.error(`[SimpleAlex] Voice ${index + 1} playback failed:`, err);
    };

    audio.play().catch(err => {
      console.error(`[SimpleAlex] Failed to play voice ${index + 1}:`, err);
    });

    // Store audio element for cleanup
    audioElementsRef.current.push(audio);
  };

  const startAlexSequence = () => {
    console.log('[SimpleAlex] Starting Alex sequence with', dialogues.length, 'dialogues');
    startMouthMovement();
    let totalDelay = 0;

    // Clear any existing timers first
    allTimersRef.current.forEach(timer => clearTimeout(timer));
    allTimersRef.current = [];

    dialogues.forEach((dialogue, index) => {
      console.log(`[SimpleAlex] Scheduling dialogue ${index + 1} to play in ${totalDelay}ms`);
      const timer = setTimeout(() => {
        setCurrentDialogue(index);
        playAlexVoice(index);
      }, totalDelay);

      allTimersRef.current.push(timer);
      totalDelay += dialogue.duration;
    });

    console.log(`[SimpleAlex] Total sequence duration: ${totalDelay}ms`);

    // Cleanup and finish after last dialogue
    const finishTimer = setTimeout(() => {
      console.log('[SimpleAlex] All dialogues complete, stopping mouth movement');
      stopMouthMovement();
      onAnimationComplete?.();
    }, totalDelay + 200);

    allTimersRef.current.push(finishTimer);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    stopSpeech
  }));

  useEffect(() => {
    if (!isVisible || hasStarted.current) return;
    hasStarted.current = true;

    console.log('[SimpleAlex] Starting Alex sequence - both dialogues will play');
    setTimeout(() => {
      startAlexSequence();
    }, 200);

    return () => {
      console.log('[SimpleAlex] Cleanup - stopping speech');
      stopSpeech();
    };
  }, [isVisible, stopSpeech]);

  if (!isVisible) return null;

  return (
    <div className={`alexS absolute z-40 w-[200%] h-[1000px] ${className}`}>
      <Image
        src={
          isMouthOpen
            ? '/svg/alex-talk/eye-open-mouth-open-arms-down.svg'
            : '/svg/alex-talk/eye-open-mouth-close-arms-down.svg'
        }
        alt="Alex"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
});

SimpleAlex.displayName = 'SimpleAlex';

export default SimpleAlex;
