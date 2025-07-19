'use client';

import React from 'react';
import Image from 'next/image';

interface TableProps {
  scale?: number;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  width?: string;
  height?: string;
  zIndex?: number;
  imagePath?: string;
}

const Table: React.FC<TableProps> = ({ 
  scale = 1,
  left,
  right, 
  top,
  bottom,
  width = '25%', 
  height = '20%',
  zIndex = 0,
  imagePath = '/svg/table.svg'
}) => {
  // Calculate scaled dimensions if needed
  const scaledWidth = width.includes('%') 
    ? `${parseFloat(width) * scale}%` 
    : width;
  
  const scaledHeight = height.includes('%') 
    ? `${parseFloat(height) * scale}%` 
    : height;

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        width: scaledWidth,
        height: scaledHeight,
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        zIndex: zIndex,
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={imagePath}
          alt="Table"
          fill
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Table;