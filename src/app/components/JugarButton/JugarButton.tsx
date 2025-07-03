'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface JugarButtonProps {
  onClick: () => void;
  text?: string;
  className?: string;
  delay?: number;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const JugarButton: React.FC<JugarButtonProps> = ({
  onClick,
  text = "JUGAR",
  className = "",
  delay = 0.8,
  disabled = false,
  size = 'large'
}) => {
  const sizeClasses = {
    small: "py-3 px-6 text-lg",
    medium: "py-4 px-8 text-xl",
    large: "py-6 px-12 text-2xl"
  };

  return (
    <motion.button
      className={`bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </motion.button>
  );
};

export default JugarButton;
