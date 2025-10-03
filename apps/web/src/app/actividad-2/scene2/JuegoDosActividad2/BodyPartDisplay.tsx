import React from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';

interface BodyPartDisplayProps {
  image: string;
  name: string;
  isVisible: boolean;
}

const BodyPartDisplay: React.FC<BodyPartDisplayProps> = ({
  image,
  name,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute top-10 w-full flex justify-center z-30"
      initial={GAME_CONFIG.animations.imageEntry.initial}
      animate={GAME_CONFIG.animations.imageEntry.animate}
      transition={GAME_CONFIG.animations.imageEntry.transition}
    >
      <div className="rounded-xl flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-80 h-80 object-contain rounded-lg"
          style={{
            maxWidth: '350px',
            maxHeight: '350px',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))'
          }}
        />
      </div>
    </motion.div>
  );
};

export default BodyPartDisplay;