// OptionsList Component - Shows clickable option images preserving aspect ratio

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Option {
  readonly id: string;
  readonly audio: string;
  readonly image: string;
  readonly isCorrect: boolean;
  readonly feedback: {
    readonly audio: string;
  };
}

interface OptionsListProps {
  options: readonly Option[];
  currentOptionIndex: number;
  gamePhase: 'title' | 'situation' | 'options' | 'waiting_for_click' | 'feedback' | 'complete';
  onOptionSelect: (optionId: string) => void;
  selectedOption: string | null;
  situationId?: string;
}

const OptionsList: React.FC<OptionsListProps> = ({
  options,
  currentOptionIndex,
  gamePhase,
  onOptionSelect,
  selectedOption,
  situationId
}) => {
  const canClick = gamePhase === 'waiting_for_click';
  // Only show options during 'options' and 'waiting_for_click' phases
  const showOptions = gamePhase === 'options' || gamePhase === 'waiting_for_click';

  if (!showOptions) return null;

  // Special handling for situation3 (3 GIFs) - make them much bigger
  const isSituation3 = situationId?.includes('situation_3');

  // Calculate spacing and height based on number of options
  const spacing = options.length === 3 ? (isSituation3 ? 'space-y-0' : 'space-y-2') : 'space-y-4';
  const optionHeight = options.length === 3 ? (isSituation3 ? 'h-60' : 'h-48') : 'h-64';

  return (
    <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center z-0 mt-8">
      <div className={`flex flex-col ${spacing} w-full justify-center max-h-[90%] px-4`}>
        {options.map((option, index) => {
          const isCurrentlyPlaying = gamePhase === 'options' && index === currentOptionIndex;
          const isClickable = canClick;
          const isSelected = selectedOption === option.id;
          
          return (
            <motion.div
              key={option.id}
              className="relative flex justify-center"
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: isCurrentlyPlaying ? 1.05 : 1,
              }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2,
                ease: 'easeOut' 
              }}
            >
              {/* Option button - preserving aspect ratio */}
              <motion.button
                onClick={() => isClickable && onOptionSelect(option.id)}
                disabled={!isClickable}
                className={`
                  relative ${optionHeight} rounded-lg overflow-hidden
                  transition-all duration-200
                  ${isClickable
                    ? 'hover:scale-105  cursor-pointer'
                    : 'cursor-not-allowed opacity-70'
                  }
                `}
                style={{
                  aspectRatio: isSituation3 ? '500/380' : '306/280',
                  width: 'auto',
                  maxWidth: '100%',
                  transform: isSituation3 ? 'none' : undefined
                }}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                <Image
                  src={option.image}
                  alt={`Opción ${String.fromCharCode(65 + index)}`}
                  fill
                  className="object-contain"
                  priority
                />

                {/* Playing indicator - ONLY yellow border, no overlay */}
                {isCurrentlyPlaying && (
                  <motion.div
                    className="absolute inset-0 border-4 border-yellow-400 rounded-lg z-10"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                {/* Selected indicator - matches image aspect ratio */}
                {isSelected && (
                  <div className="absolute inset-0 border-5 border-red rounded-lg z-10" />
                )}

  
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OptionsList;