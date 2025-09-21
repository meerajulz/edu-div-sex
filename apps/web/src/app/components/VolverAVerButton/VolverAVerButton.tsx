'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface VolverAVerButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const VolverAVerButton: React.FC<VolverAVerButtonProps> = ({
  onClick,
  disabled = false,
  className = ""
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`bg-orange-500/90 hover:bg-orange-500 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full border-2 border-orange-400 hover:border-orange-300 transition-all duration-300 shadow-2xl flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Volver a ver
    </motion.button>
  );
};

export default VolverAVerButton;