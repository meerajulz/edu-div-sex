// SituationDisplay Component - Shows situation image

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SituationDisplayProps {
  image: string;
  position: {
    top: string;
    left: string;
    transform?: string;
  };
  alt: string;
  isVisible: boolean;
}

const SituationDisplay: React.FC<SituationDisplayProps> = ({
  image,
  position,
  alt,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute z-20"
      style={{
        top: position.top,
        left: position.left,
        transform: position.transform || 'none'
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative w-80 h-60">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain rounded-lg shadow-lg"
          priority
        />
      </div>
    </motion.div>
  );
};

export default SituationDisplay;