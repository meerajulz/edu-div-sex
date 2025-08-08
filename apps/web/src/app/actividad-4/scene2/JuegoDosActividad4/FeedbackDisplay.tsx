// FeedbackDisplay Component - Shows correct/incorrect feedback at the top

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GAME_CONFIG } from './config';

interface FeedbackDisplayProps {
  isCorrect: boolean;
  onComplete: () => void;
  duration?: number;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  isCorrect,
  onComplete,
  duration = 2000
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timeout);
  }, [onComplete, duration]);

  return (
    <motion.div
      className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: -50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.5 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="relative w-24 h-24">
        <Image
          src={isCorrect ? GAME_CONFIG.feedbackIcons.correct : GAME_CONFIG.feedbackIcons.incorrect}
          alt={isCorrect ? 'Correcto' : 'Incorrecto'}
          fill
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
};

export default FeedbackDisplay;