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
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, duration]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Feedback content */}
      <motion.div
        className={`relative z-50 p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center ${
          isCorrect 
            ? 'bg-green-500 border-4 border-green-300' 
            : 'bg-red-500 border-4 border-red-300'
        }`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Icon */}
        <div className="text-6xl mb-4">
          {isCorrect ? '✅' : '❌'}
        </div>
        
        {/* Result text */}
        <div className="text-2xl font-bold text-white mb-4">
          {isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
        </div>
        
        {/* Feedback message */}
        <p className="text-white text-lg leading-relaxed">
          {message}
        </p>
        
        {/* Progress indicator */}
        <motion.div
          className="mt-6 h-2 bg-white/30 rounded-full overflow-hidden"
          initial={{ width: '100%' }}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackOverlay;