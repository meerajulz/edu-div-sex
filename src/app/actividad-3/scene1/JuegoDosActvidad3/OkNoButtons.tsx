// OkNoButtons Component for JuegoDosActividad3

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GAME_CONFIG } from './config';

interface OkNoButtonsProps {
  isVisible: boolean;
  onSelect: (answer: 'YES' | 'NO') => void;
  disabled: boolean;
}

const OkNoButtons: React.FC<OkNoButtonsProps> = ({
  isVisible,
  onSelect,
  disabled
}) => {
  const [hoveredButton, setHoveredButton] = useState<'OK' | 'NO' | null>(null);

  if (!isVisible) return null;

  const handleButtonClick = (answer: 'YES' | 'NO') => {
    if (disabled) return;
    console.log('🎮 Button clicked:', answer);
    onSelect(answer);
  };

  return (
    <>
      {/* OK Button - Left Side */}
      <motion.div
        className="absolute left-16 bottom-8 z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          onClick={() => handleButtonClick('YES')}
          disabled={disabled}
          onMouseEnter={() => setHoveredButton('OK')}
          onMouseLeave={() => setHoveredButton(null)}
          className={`transform transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'
          }`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <div className="relative w-32 h-32">
            <Image
              src={hoveredButton === 'OK' ? GAME_CONFIG.buttonImages.okHover : GAME_CONFIG.buttonImages.ok}
              alt="OK"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.button>
      </motion.div>

      {/* NO Button - Right Side */}
      <motion.div
        className="absolute right-16 bottom-8 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          onClick={() => handleButtonClick('NO')}
          disabled={disabled}
          onMouseEnter={() => setHoveredButton('NO')}
          onMouseLeave={() => setHoveredButton(null)}
          className={`transform transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'
          }`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <div className="relative w-32 h-32">
            <Image
              src={hoveredButton === 'NO' ? GAME_CONFIG.buttonImages.noHover : GAME_CONFIG.buttonImages.no}
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

export default OkNoButtons;