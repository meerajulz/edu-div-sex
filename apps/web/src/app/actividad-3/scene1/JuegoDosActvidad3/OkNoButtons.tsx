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
  const [clickedButton, setClickedButton] = useState<'OK' | 'NO' | null>(null);

  if (!isVisible) return null;

  const handleButtonClick = (answer: 'YES' | 'NO') => {
    if (disabled) return;
    console.log('🎮 Button clicked:', answer);
    setClickedButton(answer === 'YES' ? 'OK' : 'NO');
    onSelect(answer);
    
    // Reset clicked state after animation
    setTimeout(() => {
      setClickedButton(null);
    }, 200);
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
          onMouseEnter={() => !disabled && setHoveredButton('OK')}
          onMouseLeave={() => setHoveredButton(null)}
          className={`transform transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          animate={{
            scale: clickedButton === 'OK' ? 1.05 : hoveredButton === 'OK' ? 1.05 : 1
          }}
          transition={{ duration: 0.1 }}
        >
          <div className="relative w-32 h-32">
            <Image
              src={(hoveredButton === 'OK' || clickedButton === 'OK') 
                ? GAME_CONFIG.buttonImages.okHover 
                : GAME_CONFIG.buttonImages.ok}
              alt="OK"
              fill
              className="object-contain"
              priority
              sizes="128px"
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
          onMouseEnter={() => !disabled && setHoveredButton('NO')}
          onMouseLeave={() => setHoveredButton(null)}
          className={`transform transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          animate={{
            scale: clickedButton === 'NO' ? 1.05 : hoveredButton === 'NO' ? 1.05 : 1
          }}
          transition={{ duration: 0.1 }}
        >
          <div className="relative w-32 h-32">
            <Image
              src={(hoveredButton === 'NO' || clickedButton === 'NO')
                ? GAME_CONFIG.buttonImages.noHover 
                : GAME_CONFIG.buttonImages.no}
              alt="NO"
              fill
              className="object-contain"
              priority
              sizes="128px"
            />
          </div>
        </motion.button>
      </motion.div>
    </>
  );
};

export default OkNoButtons;