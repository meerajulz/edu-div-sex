'use client';

import { useDroppable } from '@dnd-kit/core';
import React from 'react';

interface DropZoneProps {
  id: string;
  position: { top: string; left: string };
  hit: { top: string; left: string; width: string; height: string };
  isMatched: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ id, position, hit, isMatched }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <>
      {/* Big invisible drop area (the actual droppable). Large, non-overlapping
          band so the piece is easy to drop and always maps to one body part. */}
      <div
        ref={setNodeRef}
        className="absolute"
        style={{ top: hit.top, left: hit.left, width: hit.width, height: hit.height }}
      />

      {/* Visible circle — just a marker to show kids where to aim. */}
      <div
        className={`absolute w-20 h-20 rounded-full border-4 transition-all duration-300 pointer-events-none ${
          isMatched ? 'bg-green-400/50' : 'bg-white/20'
        }`}
        style={{
          top: position.top,
          left: position.left,
          transform: 'translate(-50%, -50%)',
          borderColor: isMatched ? '#16a34a' : '#d946ef',
        }}
      />
    </>
  );
};

export default DropZone;
