// SituationDisplay Component - Shows situation images for Juego 2

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SituationDisplayProps {
  image: string;
  alt: string;
  isVisible: boolean;
}

const SituationDisplay: React.FC<SituationDisplayProps> = ({
  image,
  alt,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-0"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative w-80 h-64 max-w-[80%] max-h-[60%]">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
};

export default SituationDisplay;