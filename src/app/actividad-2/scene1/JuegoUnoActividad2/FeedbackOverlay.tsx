// FeedbackOverlay Component - Shows correct/incorrect feedback

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface FeedbackOverlayProps {
  isVisible: boolean;
  isCorrect: boolean;
  message: string;
  onComplete: () => void;
  duration?: number;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  isVisible,
  isCorrect,
  message,
  onComplete,
  duration = 3000
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
        className={`
          text-center p-8 rounded-xl shadow-xl max-w-md mx-4
          ${isCorrect 
            ? 'bg-green-500/90 border-2 border-green-400' 
            : 'bg-red-500/90 border-2 border-red-400'
          }
        `}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Icon */}
        <div className="text-6xl mb-4">
          {isCorrect ? '✅' : '❌'}
        </div>

        {/* Feedback Message */}
        <p className="text-white text-xl font-bold leading-relaxed">
          {message}
        </p>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="w-full bg-white/20 rounded-full h-2">
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