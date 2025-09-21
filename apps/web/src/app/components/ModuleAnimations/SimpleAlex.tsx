'use client';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { playAudio, cleanupAudio } from '../../utils/audioPlayer';

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

  const stopSpeech = () => {
    console.log('[SimpleAlex] Stopping speech and clearing timers');

    // Clear all voice timers
    allTimersRef.current.forEach(timer => clearTimeout(timer));
    allTimersRef.current = [];

    // Clear mouth movement
    stopMouthMovement();

    // Stop any current audio
    cleanupAudio();

    // Reset state
    setCurrentDialogue(0);
  };

  const playAlexVoice = (index: number) => {
    const dialogue = dialogues[index];
    console.log(`[SimpleAlex] Playing voice ${index}:`, dialogue.path);
    playAudio(dialogue.path).catch(err => {
      console.error('Voice playback failed:', err);
    });
  };

  const startAlexSequence = () => {
    startMouthMovement();
    let totalDelay = 0;

    // Clear any existing timers first
    allTimersRef.current.forEach(timer => clearTimeout(timer));
    allTimersRef.current = [];

    dialogues.forEach((dialogue, index) => {
      const timer = setTimeout(() => {
        setCurrentDialogue(index);
        playAlexVoice(index);
      }, totalDelay);

      allTimersRef.current.push(timer);
      totalDelay += dialogue.duration;
    });

    // Cleanup and finish after last dialogue
    const finishTimer = setTimeout(() => {
      stopMouthMovement();
      cleanupAudio();
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

    setTimeout(() => {
      startAlexSequence();
    }, 200);

    return () => {
      stopSpeech();
    };
  }, [isVisible, onAnimationComplete]);

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
