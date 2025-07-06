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
  situations 
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

  const getSituationById = (id: string) => {
    return situations.find(s => s.id === id);
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
        {/* Zone Header */}
        <div className="text-center mb-2">
          <div className="text-2xl mb-1">🔒</div>
          <div 
            className="text-lg font-bold"
            style={{ color: '#b45309' }}
          >
            {GAME_CONFIG.dropZones.private.name}
          </div>
        </div>

        {/* Dropped Items */}
        <div className="flex flex-wrap gap-1 justify-center items-center flex-1 w-full px-2">
          {droppedItems.PRIVATE?.map((situation) => (
            <div
              key={`dropped-${situation.id}`}
              className="w-12 h-12 rounded-lg overflow-hidden border-2 border-green-400 relative"
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
            </div>
          ))}
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
        {/* Zone Header */}
        <div className="text-center mb-2">
          <div className="text-2xl mb-1">🌍</div>
          <div 
            className="text-lg font-bold"
            style={{ color: '#1e3a8a' }}
          >
            {GAME_CONFIG.dropZones.public.name}
          </div>
        </div>

        {/* Dropped Items */}
        <div className="flex flex-wrap gap-1 justify-center items-center flex-1 w-full px-2">
          {droppedItems.PUBLIC?.map((situation) => (
            <div
              key={`dropped-${situation.id}`}
              className="w-24 h-24 rounded-lg overflow-hidden border-2 border-green-400 relative"
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
            </div>
          ))}
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