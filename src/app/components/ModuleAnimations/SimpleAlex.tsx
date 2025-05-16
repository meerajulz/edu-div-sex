'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { playAudio, cleanupAudio } from '../../utils/audioPlayer';

interface SimpleAlexProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
  className?: string;
}

const dialogues = [
  { path: '/audio/alex/intro/1-alex.mp3', duration: 1800 },
  { path: '/audio/alex/intro/juego/ahora-jugamos.mp3', duration: 2500 },
  { path: '/audio/alex/intro/juego/click-actividad.mp3', duration: 2000 }
];

const SimpleAlex: React.FC<SimpleAlexProps> = ({
  isVisible,
  onAnimationComplete,
  className = ''
}) => {
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDialogue, setCurrentDialogue] = useState(0);

  const mouthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStarted = useRef(false);

  const startMouthMovement = () => {
    if (mouthIntervalRef.current) return;
    mouthIntervalRef.current = setInterval(() => {
      setIsMouthOpen(prev => !prev);
    }, 200);
  };

  const stopMouthMovement = () => {
    if (mouthIntervalRef.current) {
      clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
    }
    setIsMouthOpen(false);
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

    dialogues.forEach((dialogue, index) => {
      voiceTimerRef.current = setTimeout(() => {
        setCurrentDialogue(index);
        playAlexVoice(index);
      }, totalDelay);

      totalDelay += dialogue.duration;
    });

    // Cleanup and finish after last dialogue
    setTimeout(() => {
      stopMouthMovement();
      cleanupAudio();
      onAnimationComplete?.();
    }, totalDelay + 200);
  };

  useEffect(() => {
    if (!isVisible || hasStarted.current) return;
    hasStarted.current = true;

    setTimeout(() => {
      startAlexSequence();
    }, 200);

    return () => {
      stopMouthMovement();
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
      cleanupAudio();
    };
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className={`absolute z-40 w-[200%] h-[1000px] ${className}`}>
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
};

export default SimpleAlex;
