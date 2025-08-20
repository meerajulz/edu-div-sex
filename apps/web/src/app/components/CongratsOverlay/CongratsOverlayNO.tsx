'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const sparkleVariants = {
  animate: {
    scale: [0, 1.5, 0],
    opacity: [0, 1, 0],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

interface CongratsOverlayProps {
  isVisible?: boolean; // Added isVisible prop
  onComplete: () => void;
  duration?: number; // Added duration prop
}

const CongratsOverlay: React.FC<CongratsOverlayProps> = ({ 
  isVisible = true, // Default to true for backward compatibility
  onComplete, 
  duration = 2000 // Default duration
}) => {
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // Only run if visible
    if (!isVisible) return;

    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;
      const audio = new Audio('/audio/actividad-1/escena_2/elements/muy_bien_bright.mp3');
      audio.play().catch(console.warn);
    }

    const timeout = setTimeout(() => {
      onComplete();
    }, duration); // Use the duration prop

    return () => clearTimeout(timeout);
  }, [onComplete, duration, isVisible]);

  // Reset audio played flag when component becomes invisible
  useEffect(() => {
    if (!isVisible) {
      hasPlayedRef.current = false;
    }
  }, [isVisible]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 pointer-events-none">
      <div className="relative w-full h-full">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-yellow-300 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            variants={sparkleVariants}
            animate="animate"
          />
        ))}

        <motion.div
          className="absolute top-1/2 left-[1/2] text-white text-5xl font-bold drop-shadow-xl"
          style={{ transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          🎉 ¡Muy bien!
        </motion.div>
      </div>
    </div>
  );
};

export default CongratsOverlay;