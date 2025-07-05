// YesNoButtons Component - Updated with image buttons

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

  const handleButtonClick = async (answer: 'YES' | 'NO') => {
    if (disabled) return;

    // Play button audio
    const audioPath = answer === 'YES' 
      ? GAME_CONFIG.globalAudio.yesButton 
      : GAME_CONFIG.globalAudio.noButton;
    
    try {
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (err) {
      console.warn('Error playing button audio:', err);
    }

    // Trigger selection
    onSelect(answer);
  };

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex space-x-8">
        
        {/* YES Button */}
        <motion.button
          onClick={() => handleButtonClick('YES')}
          disabled={disabled}
          className={`transform transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <div className="relative w-32 h-32">
            <Image
              src={GAME_CONFIG.buttonImages.yes}
              alt="SÍ"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.button>

        {/* NO Button */}
        <motion.button
          onClick={() => handleButtonClick('NO')}
          disabled={disabled}
          className={`transform transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <div className="relative w-32 h-32">
            <Image
              src={GAME_CONFIG.buttonImages.no}
              alt="NO"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.button>

      </div>
    </motion.div>
  );
};

export default YesNoButtons;