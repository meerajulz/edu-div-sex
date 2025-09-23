// YesNoButtons Component - Updated with left/right positioning

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GAME_CONFIG } from './config';
import { playGameAudio } from '../../../utils/gameAudio';

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
      playGameAudio(audioPath, 0.7, answer === 'YES' ? 'Yes Button' : 'No Button');
    } catch (err) {
      console.warn('Error playing button audio:', err);
    }

    // Trigger selection
    onSelect(answer);
  };

  return (
    <>
      {/* YES Button - Left Side */}
      <motion.div
        className="absolute left-8 bottom-0 transform translate-y-1/2 z-30"
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
      </motion.div>

      {/* NO Button - Right Side */}
      <motion.div
        className="absolute right-8 bottom-0 transform translate-y-1/2 z-30"
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
      </motion.div>
    </>
  );
};

export default YesNoButtons;