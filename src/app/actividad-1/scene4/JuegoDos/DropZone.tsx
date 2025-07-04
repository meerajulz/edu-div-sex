'use client';

import { useDroppable } from '@dnd-kit/core';
import React from 'react';

interface DropZoneProps {
  id: string;
  position: { top: string; left: string };
  isMatched: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ id, position, isMatched }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`absolute w-10 h-10 rounded-full transition-all duration-300 ${
        isMatched ? 'bg-green-400/50 border-4 border-green-600' : 'bg-white/20 border-4 border-magenta-500'
      }`}
      style={{ 
        top: position.top, 
        left: position.left,
        borderColor: isMatched ? '#16a34a' : '#d946ef',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default DropZone;