// SituationDisplay Component - Shows situation images taking 50% of modal width

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
      className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center z-20 p-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative w-full h-full max-w-full max-h-full">
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