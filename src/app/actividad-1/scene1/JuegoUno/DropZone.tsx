// 'use client';
import React from 'react';

interface DropZoneProps {
  id: string;
  position: { top: string; left: string };
  isMatched: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ id, position, isMatched }) => {
  return (
    <div
      id={id}
      className={`absolute w-16 h-16 rounded-full ${
        isMatched ? 'bg-green-500/30' : 'bg-white/10 border border-white/30'
      }`}
      style={{
        top: position.top,
        left: position.left
      }}
    />
  );
};

export default DropZone;