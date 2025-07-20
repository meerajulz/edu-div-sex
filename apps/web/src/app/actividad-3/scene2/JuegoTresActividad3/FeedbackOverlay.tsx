// FeedbackOverlay Component - Shows ok.png/no.png feedback

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GAME_CONFIG } from './config';

interface FeedbackOverlayProps {
  isVisible: boolean;
  isCorrect: boolean;
  onComplete: () => void;
  duration?: number;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  isVisible,
  isCorrect,
  onComplete,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, onComplete, duration]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-center p-8 rounded-xl  max-w-lg mx-4"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Feedback Image */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-6"
          animate={{
            scale: [1, 1.1, 1],
            rotate: isCorrect ? [0, 5, -5, 0] : [0, -5, 5, 0],
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        >
          <Image
            src={isCorrect ? GAME_CONFIG.feedbackImages.correct : GAME_CONFIG.feedbackImages.incorrect}
            alt={isCorrect ? 'Correcto' : 'Incorrecto'}
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Audio playing indicator */}
        <motion.div
          className="bg-white/20 rounded-full px-6 py-3"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="text-white text-lg font-bold flex items-center justify-center space-x-2">
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0,
              }}
            />
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.4,
              }}
            />
          </div>
          <div className="text-white text-sm mt-2">
            Reproduciendo respuesta...
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="w-full bg-white/50 rounded-full h-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackOverlay;