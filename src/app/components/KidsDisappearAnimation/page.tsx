'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KidsDisappearAnimationProps {
  shouldStartAnimation: boolean;
  onComplete?: () => void;
  onCrisDisappear?: () => void;
  onDaniDisappear?: () => void;
  onNoaDisappear?: () => void;
}

const KidsDisappearAnimation: React.FC<KidsDisappearAnimationProps> = ({ 
  shouldStartAnimation, 
  onComplete,
  onCrisDisappear,
  onDaniDisappear,
  onNoaDisappear 
}) => {
  const [animationStage, setAnimationStage] = useState<'initial' | 'cris' | 'dani' | 'noa' | 'complete'>('initial');
  const [flashEffect, setFlashEffect] = useState(false);
  
  // Refs for audio
  const soundRef = useRef<HTMLAudioElement | null>(null);
  
  // Animation timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const noaTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Sound effect for disappearing
      soundRef.current = new Audio('/ui-sound/whoosh.mp3');
      
      // Preload sounds
      soundRef.current.preload = 'auto';
      
      // Set volume
      soundRef.current.volume = 0.6;
    }
    
    return () => {
      // Cleanup audio
      if (soundRef.current) soundRef.current.pause();
      
      // Clear any timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (noaTimerRef.current) clearTimeout(noaTimerRef.current);
    };
  }, []);
  
  // Start animation sequence when triggered
  useEffect(() => {
    if (shouldStartAnimation && animationStage === 'initial') {
      // Start disappearing immediately after Noa finishes talking
      // (reduced from 2000ms to 500ms)
      timerRef.current = setTimeout(() => {
        startDisappearSequence();
      }, 500);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (noaTimerRef.current) clearTimeout(noaTimerRef.current);
    };
  }, [shouldStartAnimation, animationStage]);
  
  // Handle animations for each disappearance
  useEffect(() => {
    if (animationStage === 'cris') {
      playCrisDisappearAnimation();
    } else if (animationStage === 'dani') {
      playDaniDisappearAnimation();
    } else if (animationStage === 'noa') {
      playNoaDisappearAnimation();
    }
  }, [animationStage]);
  
  // Play audio with error handling
  const playSound = async (audio: HTMLAudioElement | null) => {
    try {
      if (audio) {
        audio.currentTime = 0;
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  // Start the disappear sequence
  const startDisappearSequence = () => {
    // Start with Cris
    setAnimationStage('cris');
  };
  
  // Cris disappear animation
  const playCrisDisappearAnimation = () => {
    // Play sound
    playSound(soundRef.current);
    
    // Make Cris disappear
    if (onCrisDisappear) onCrisDisappear();
    
    // Move to next character after a shorter delay
    timerRef.current = setTimeout(() => {
      setAnimationStage('dani');
    }, 1000); // Reduced from 1500ms to 1000ms
  };
  
  // Dani disappear animation
  const playDaniDisappearAnimation = () => {
    // Play sound
    playSound(soundRef.current);
    
    // Make Dani disappear
    if (onDaniDisappear) onDaniDisappear();
    
    // Start Noa's disappearance while Dani is still in process
    // Only wait 500ms before starting Noa's disappearance
    noaTimerRef.current = setTimeout(() => {
      // Play another sound for Noa
      playSound(soundRef.current);
      
      // Make Noa disappear
      if (onNoaDisappear) onNoaDisappear();
      
      // Move to next stage
      setAnimationStage('noa');
      
      // Complete the animation sequence after a short delay
      timerRef.current = setTimeout(() => {
        setAnimationStage('complete');
        if (onComplete) onComplete();
      }, 800);
      
    }, 500); // Noa starts disappearing 500ms after Dani
  };
  
  // Noa disappear animation - this will only handle completion now
  const playNoaDisappearAnimation = () => {
    // No additional actions needed here since Noa's disappearance
    // is now handled in the Dani stage
  };
  
  // Don't render anything during initial stage
  if (animationStage === 'initial') return null;
  
  // No visible UI in this component - just handling the sequence timing
  return null;
};

export default KidsDisappearAnimation;