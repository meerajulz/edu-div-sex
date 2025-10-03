import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';

interface SituationItemsProps {
  situations: Array<typeof GAME_CONFIG.situations[number]>;
  completedSituations: Set<string>;
  onDragStart: (situationId: string) => void;
  disabled?: boolean;
}

const SituationItems: React.FC<SituationItemsProps> = ({
  situations,
  completedSituations,
  onDragStart,
  disabled = false
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, situationId: string) => {
    if (disabled || completedSituations.has(situationId)) return;

    e.dataTransfer.setData('text/plain', situationId);
    setDraggedItem(situationId);
    onDragStart(situationId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="w-full h-full pt-4 sm:pt-8 pb-2 pr-2">
      <div className="w-full h-full grid grid-cols-3 gap-0 content-start">
        {situations.map((situation) => {
          const isCompleted = completedSituations.has(situation.id);
          const isDragging = draggedItem === situation.id;

          return (
            <motion.div
              key={situation.id}
              className={`
                relative aspect-square overflow-hidden rounded-lg max-h-[160px] sm:max-h-[200px]
                transition-all duration-300
                ${isCompleted
                  ? 'opacity-75 cursor-not-allowed'
                  : 'cursor-grab'
                }
                ${isDragging ? 'opacity-50 scale-110' : ''}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
              style={{
                pointerEvents: isCompleted ? 'none' : 'auto',
                zIndex: isCompleted ? 1 : 10
              }}
                initial={GAME_CONFIG.animations.situationEntry.initial}
                animate={GAME_CONFIG.animations.situationEntry.animate}
                transition={{
                  ...GAME_CONFIG.animations.situationEntry.transition,
                  delay: situations.indexOf(situation) * 0.1
                }}
                whileHover={!disabled && !isCompleted ? { scale: 1.05 } : {}}
                whileTap={!disabled && !isCompleted ? { scale: 0.95 } : {}}
              >
                <div
                  draggable={!disabled && !isCompleted}
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, situation.id)}
                  onDragEnd={handleDragEnd}
                  onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
                  className="w-full h-full"
                >
                  <img
                    src={situation.image}
                    alt={situation.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Completed overlay - positioned to not block other items */}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center pointer-events-none">
                      <div className="text-2xl">✅</div>
                    </div>
                  )}

                  {/* Situation name tooltip */}
                  {!isCompleted && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                                  bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                                  group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {situation.name}
                    </div>
                  )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SituationItems;