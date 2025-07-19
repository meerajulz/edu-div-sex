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
  onComplete: () => void;
}

const CongratsOverlay: React.FC<CongratsOverlayProps> = ({ onComplete }) => {
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;
      const audio = new Audio('/audio/actividad-2/juego4/muybien.mp3');
      audio.play().catch(console.warn);
    }

    const timeout = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [onComplete]);

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
          className="absolute top-1/2 left-1/2 text-white text-5xl font-bold drop-shadow-xl"
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