// YesNoButtons Component for Actividad 3

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GAME_CONFIG } from './config';

interface YesNoButtonsProps {
  isVisible: boolean;
  onSelect: (answer: 'YES' | 'NO') => void;
  disabled: boolean;
}

const YesNoButtons: React.FC<YesNoButtonsProps> = ({
  isVisible,
  onSelect,
  disabled
}) => {
  if (!isVisible) return null;

  const handleButtonClick = (answer: 'YES' | 'NO') => {
    if (disabled) return;
    onSelect(answer);
  };

  return (
    <>
      {/* YES Button - Left Side */}
      <motion.div
        className="absolute left-8 bottom-8 z-30"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          onClick={() => handleButtonClick('YES')}
          disabled={disabled}
          className={`transform transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <div className="relative w-24 h-24">
            <Image
              src={GAME_CONFIG.buttonImages.yes}
              alt="SÍ"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.button>
      </motion.div>

      {/* NO Button - Right Side */}
      <motion.div
        className="absolute right-8 bottom-8 z-30"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          onClick={() => handleButtonClick('NO')}
          disabled={disabled}
          className={`transform transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <div className="relative w-24 h-24">
            <Image
              src={GAME_CONFIG.buttonImages.no}
              alt="NO"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.button>
      </motion.div>
    </>
  );
};

export default YesNoButtons;