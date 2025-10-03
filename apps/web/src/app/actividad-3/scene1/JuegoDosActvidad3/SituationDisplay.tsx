// SituationDisplay Component - Shows situation images for Juego 2

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SituationDisplayProps {
  image: string;
  alt: string;
  isVisible: boolean;
  onClick?: () => void;
  clickable?: boolean;
}

const SituationDisplay: React.FC<SituationDisplayProps> = ({
  image,
  alt,
  isVisible,
  onClick,
  clickable = false
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-0"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div
        className={`relative w-[600px] h-[450px] max-w-[90%] max-h-[70%] ${clickable ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}`}
        onClick={clickable ? onClick : undefined}
        role={clickable ? "button" : undefined}
        aria-label={clickable ? "Escuchar situación de nuevo" : undefined}
      >
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain"
          priority
        />
        {clickable && (
          <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
            <span className="text-2xl">🔊</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SituationDisplay;