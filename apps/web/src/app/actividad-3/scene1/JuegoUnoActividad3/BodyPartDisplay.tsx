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
      className="absolute right-8 top-[38%] transform -translate-y-1/2 z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative w-[480px] h-[360px]">
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