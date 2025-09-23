'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { playGameAudio } from '../../utils/gameAudio';

interface CongratsOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  emoji?: string;
  bgColor?: string;
  textColor?: string;
  onComplete?: () => void;
  autoCloseDelay?: number;
}

export default function CongratsOverlay({
  isVisible,
  title = "¡Muy Bien!",
  subtitle = "Has completado el juego",
  emoji = "🎉",
  bgColor = "bg-green-500/20",
  textColor = "text-green-800",
  onComplete,
  autoCloseDelay = 3000
}: CongratsOverlayProps) {
  // Audio setup for congratulations sound
  useEffect(() => {
    if (isVisible) {
      // Play the congratulations sound when component becomes visible
      playGameAudio('/audio/muy_bien_bright.mp3', 0.7, 'CongratsOverlay');
    }
  }, [isVisible]);

  // Auto-close after delay
  useEffect(() => {
    if (isVisible && onComplete && autoCloseDelay > 0) {
      console.log(`🎊 CongratsOverlay: Starting auto-close timer for ${autoCloseDelay}ms`);
      const timer = setTimeout(() => {
        console.log(`🎊 CongratsOverlay: Auto-close timer expired, calling onComplete callback`);
        onComplete();
      }, autoCloseDelay);
      return () => {
        console.log(`🎊 CongratsOverlay: Clearing auto-close timer`);
        clearTimeout(timer);
      };
    }
  }, [isVisible, onComplete, autoCloseDelay]);

  // Debug visibility changes
  useEffect(() => {
    console.log(`🎊 CongratsOverlay: isVisible changed to ${isVisible}`);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`fixed inset-0 flex items-center justify-center z-[9999] ${bgColor} backdrop-blur-sm`}
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 0.5, 
            repeat: 3,
            ease: "easeInOut"
          }}
          className="text-6xl mb-4"
        >
          {emoji}
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-3xl font-bold ${textColor} mb-2`}
        >
          {title}
        </motion.h3>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-lg ${textColor.replace('800', '700')} mt-2`}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Celebratory particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ 
                opacity: 0,
                scale: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-50, -100, -150],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2,
                delay: Math.random() * 1,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}