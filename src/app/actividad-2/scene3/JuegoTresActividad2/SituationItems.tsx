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

  const handleDragStart = (e: React.DragEvent, situationId: string) => {
    if (disabled || completedSituations.has(situationId)) return;
    
    e.dataTransfer.setData('text/plain', situationId);
    setDraggedItem(situationId);
    onDragStart(situationId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
      <div className=" rounded-2xl p-1 shadow-lg border-4 border-blue-300">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Arrastra las situaciones a las categorías
          </h3>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2">
          {situations.map((situation) => {
            const isCompleted = completedSituations.has(situation.id);
            const isDragging = draggedItem === situation.id;
            
            return (
              <motion.div
                key={situation.id}
                className={`
                  relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden
                  border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'border-green-400 opacity-75 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-blue-400 cursor-grab'
                  }
                  ${isDragging ? 'opacity-50 scale-110' : ''}
                  ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                `}
                style={{ 
                  pointerEvents: isCompleted ? 'none' : 'auto',
                  zIndex: isCompleted ? 1 : 10 
                }}
                draggable={!disabled && !isCompleted}
                onDragStart={(e) => handleDragStart(e, situation.id)}
                onDragEnd={handleDragEnd}
                initial={GAME_CONFIG.animations.situationEntry.initial}
                animate={GAME_CONFIG.animations.situationEntry.animate}
                transition={{
                  ...GAME_CONFIG.animations.situationEntry.transition,
                  delay: situations.indexOf(situation) * 0.1
                }}
                whileHover={!disabled && !isCompleted ? { scale: 1.05 } : {}}
                whileTap={!disabled && !isCompleted ? { scale: 0.95 } : {}}
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
              </motion.div>
            );
          })}
        </div>
        
        {/* Progress indicator */}
        <div className=" flex justify-center">
          <div className="text-sm text-gray-600">
            Completado: {completedSituations.size} / {situations.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SituationItems;