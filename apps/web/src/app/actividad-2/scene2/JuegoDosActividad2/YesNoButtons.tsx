import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';

interface YesNoButtonsProps {
  isVisible: boolean;
  onSelect: (answer: 'YES' | 'NO') => void;
  disabled?: boolean;
}

const YesNoButtons: React.FC<YesNoButtonsProps> = ({
  isVisible,
  onSelect,
  disabled = false
}) => {
  const [pressedButton, setPressedButton] = useState<'YES' | 'NO' | null>(null);

  const handleButtonClick = async (answer: 'YES' | 'NO') => {
    if (disabled) return;

    // Visual feedback
    setPressedButton(answer);
    
    // Call the onSelect callback
    onSelect(answer);

    // Reset pressed state after animation
    setTimeout(() => setPressedButton(null), 200);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute bottom-8 w-full flex justify-center z-30"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Question text */}
      <div className="flex space-x-24 items-center justify-center">
        {/* YES Button */}
        <motion.button
          onClick={() => handleButtonClick('YES')}
          disabled={disabled}
          className="relative focus:outline-none"
          animate={pressedButton === 'YES' ? { scale: [1, 0.95, 1], transition: { duration: 0.15 } } : {}}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={GAME_CONFIG.buttonImages.yes.normal}
            alt="Sí - Es privado"
            className="w-32 h-32 transition-opacity duration-150"
          />
    
        </motion.button>

        {/* NO Button */}
        <motion.button
          onClick={() => handleButtonClick('NO')}
          disabled={disabled}
          className="relative focus:outline-none"
          animate={pressedButton === 'NO' ? { scale: [1, 0.95, 1], transition: { duration: 0.15 } } : {}}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={GAME_CONFIG.buttonImages.no.normal}
            alt="No - No es privado"
            className="w-32 h-32 transition-opacity duration-150"
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default YesNoButtons;