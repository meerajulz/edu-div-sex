import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';

interface DropZonesProps {
  onDrop: (zoneId: 'PRIVATE' | 'PUBLIC', situationId: string) => void;
  disabled?: boolean;
  droppedItems: { [key: string]: Array<typeof GAME_CONFIG.situations[number]> };
  situations: Array<typeof GAME_CONFIG.situations[number]>;
}

const DropZones: React.FC<DropZonesProps> = ({ 
  onDrop, 
  disabled = false, 
  droppedItems,  
}) => {
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (!disabled) {
      setDragOverZone(zoneId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(null);
  };

  const handleDrop = (e: React.DragEvent, zoneId: 'PRIVATE' | 'PUBLIC') => {
    e.preventDefault();
    if (disabled) return;

    const situationId = e.dataTransfer.getData('text/plain');
    if (situationId) {
      onDrop(zoneId, situationId);
    }
    setDragOverZone(null);
  };


  return (
    <div className="flex justify-center gap-8 mb-8">
      {/* Private Zone - Left */}
      <motion.div
        className={`
          relative flex-1 max-w-[50%] h-80 rounded-xl border-4 border-dashed
          flex flex-col items-center justify-center cursor-pointer
          transition-all duration-300
          ${dragOverZone === 'PRIVATE' 
            ? 'border-orange-400 bg-orange-100 scale-105' 
            : 'border-orange-300 bg-orange-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{ backgroundColor: `${GAME_CONFIG.dropZones.private.color}40` }}
        onDragOver={(e) => handleDragOver(e, 'PRIVATE')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'PRIVATE')}
        whileHover={!disabled ? GAME_CONFIG.animations.dropZoneHover : {}}
      >
        {/* Decorative Lock Image - Top Left */}
        <div 
          className="absolute -top-28 -left-10 w-[180px] h-[180px] pointer-events-none z-10"
          style={{
            backgroundImage: "url('/image/actividad_2/juego_3/Candado_.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />

        {/* Zone Header */}
        <div className="text-center mt-2">
          <div 
            className="text-lg font-bold"
            style={{ color: '#b45309' }}
          >
            {GAME_CONFIG.dropZones.private.name}
          </div>
        </div>

        {/* Dropped Items - More Free Layout */}
        <div className="relative flex-1 w-full p-4">
          {droppedItems.PRIVATE?.map((situation, index) => {
            // Create more organic, scattered positioning
            const positions = [
              { top: '10%', left: '15%', rotation: -5 },
              { top: '20%', left: '60%', rotation: 8 },
              { top: '45%', left: '25%', rotation: -3 },
              { top: '60%', left: '70%', rotation: 6 },
              { top: '35%', left: '45%', rotation: -8 },
              { top: '75%', left: '20%', rotation: 4 },
              { top: '15%', left: '80%', rotation: -6 }
            ];
            
            const position = positions[index % positions.length];
            
            return (
              <motion.div
                key={`dropped-${situation.id}`}
                className="absolute w-28 h-28 rounded-lg overflow-hidden border-2 border-green-400"
                style={{
                  top: position.top,
                  left: position.left,
                  transform: `rotate(${position.rotation}deg)`,
                  zIndex: 5
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: position.rotation,
                  transition: { 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }
                }}
              >
                <img
                  src={situation.image}
                  alt={situation.name}
                  className="w-full h-full object-cover"
                />
                {/* Success indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Visual feedback for drag over */}
        {dragOverZone === 'PRIVATE' && (
          <motion.div
            className="absolute inset-0 bg-orange-200 rounded-xl opacity-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      {/* Public Zone - Right */}
      <motion.div
        className={`
           relative flex-1 max-w-[50%] h-80 rounded-xl border-4 border-dashed
          flex flex-col items-center justify-center cursor-pointer
          transition-all duration-300
          ${dragOverZone === 'PUBLIC' 
            ? 'border-blue-400 bg-blue-100 scale-105' 
            : 'border-blue-300 bg-blue-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{ backgroundColor: `${GAME_CONFIG.dropZones.public.color}40` }}
        onDragOver={(e) => handleDragOver(e, 'PUBLIC')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'PUBLIC')}
        whileHover={!disabled ? GAME_CONFIG.animations.dropZoneHover : {}}
      >
        {/* Decorative OK Image - Top Right */}
        <div 
          className="absolute -top-28 -right-0 w-[180px] h-[180px] pointer-events-none z-10"
          style={{
            backgroundImage: "url('/image/actividad_2/juego_3/ok_.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />

        {/* Zone Header */}
        <div className="text-center mt-2">
          <div 
            className="text-lg font-bold"
            style={{ color: '#1e3a8a' }}
          >
            {GAME_CONFIG.dropZones.public.name}
          </div>
        </div>

        {/* Dropped Items - More Free Layout */}
        <div className="relative flex-1 w-full p-4">
          {droppedItems.PUBLIC?.map((situation, index) => {
            // Create more organic, scattered positioning
            const positions = [
              { top: '15%', left: '20%', rotation: 7 },
              { top: '30%', left: '65%', rotation: -4 },
              { top: '50%', left: '30%', rotation: 9 },
              { top: '25%', left: '75%', rotation: -7 },
              { top: '65%', left: '15%', rotation: 3 },
              { top: '40%', left: '55%', rotation: -5 },
              { top: '70%', left: '70%', rotation: 8 }
            ];
            
            const position = positions[index % positions.length];
            
            return (
              <motion.div
                key={`dropped-${situation.id}`}
                className="absolute w-28 h-28 rounded-lg overflow-hidden border-2 border-green-400"
                style={{
                  top: position.top,
                  left: position.left,
                  transform: `rotate(${position.rotation}deg)`,
                  zIndex: 5
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: position.rotation,
                  transition: { 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }
                }}
              >
                <img
                  src={situation.image}
                  alt={situation.name}
                  className="w-full h-full object-cover"
                />
                {/* Success indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Visual feedback for drag over */}
        {dragOverZone === 'PUBLIC' && (
          <motion.div
            className="absolute inset-0 bg-blue-200 rounded-xl opacity-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default DropZones;