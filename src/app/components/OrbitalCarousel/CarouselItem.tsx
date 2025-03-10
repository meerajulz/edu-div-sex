'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CarouselItemProps } from './types';

const CarouselItem: React.FC<CarouselItemProps> = ({ 
  item, 
  index, 
  activeIndex, 
  position, 
  containerSize, 
  handleCircleClick, 
  handleLabelClick 
}) => {
  const { x, y, scale, zIndex, opacity } = position;
  const iconSize = `${containerSize.iconSize}px`;
  
  return (
    <motion.div
      key={item.id}
      className="absolute top-1/2 left-1/2"
      animate={{
        x,
        y,
        scale,
        zIndex,
        opacity,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
      style={{
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          className={`
            rounded-full border-2 
            flex items-center justify-center
            bg-gradient-to-br 
            transition-all duration-300
            ${item.isUnlocked 
              ? 'border-blue-400/80 from-white to-blue-50 cursor-pointer hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
              : 'border-gray-300 from-gray-100 to-gray-200 cursor-not-allowed opacity-70'}
            ${index === activeIndex && item.isUnlocked ? 'shadow-lg shadow-blue-200/50' : ''}
          `}
          style={{
            width: iconSize,
            height: iconSize
          }}
          onClick={() => handleCircleClick(index, item.isUnlocked)}
          whileHover={item.isUnlocked ? { scale: 1.1 } : {}}
        >
          <div 
            style={{
              width: iconSize,
              height: iconSize,
              position: 'relative'
            }}
          >
            <Image 
              src={item.svgPath} 
              alt={item.label}
              fill
              style={{ objectFit: 'contain' }}
            />
            
            {/* Lock overlay for locked activities */}
            {!item.isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-500/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}
          </div>
        </motion.div>
        <motion.span 
          className={`
            px-3 py-1.5 rounded-full mt-2
            backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.05)]
            text-xs font-medium text-center
            transition-all duration-300
            sm:text-sm sm:px-4 sm:py-2
            md:text-base
            ${item.isUnlocked 
              ? `cursor-pointer ${index === activeIndex ? 'text-blue-600 bg-blue-50/90' : 'text-gray-700 bg-white/80'}` 
              : 'text-gray-500 bg-gray-100/80 cursor-not-allowed'}
          `}
          onClick={() => handleLabelClick(item.url, item.isUnlocked)}
          whileHover={item.isUnlocked ? { scale: 1.1 } : {}}
        >
          {item.label}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default CarouselItem;