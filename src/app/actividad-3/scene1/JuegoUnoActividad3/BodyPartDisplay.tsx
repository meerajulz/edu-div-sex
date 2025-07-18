// BodyPartDisplay Component - Shows body response images

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BodyPartDisplayProps {
  image: string;
  alt: string;
  isVisible: boolean;
}

const BodyPartDisplay: React.FC<BodyPartDisplayProps> = ({
  image,
  alt,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative w-64 h-64">
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

export default BodyPartDisplay;