// 'use client';
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
      className={`absolute w-16 h-16 rounded-full transition-all duration-300 ${
        isMatched ? 'bg-green-400/50 border-2 border-white' : 'bg-white/20 border border-white/30'
      }`}
      style={{ top: position.top, left: position.left }}
    />
  );
};


export default DropZone;