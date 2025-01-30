'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence, Reorder } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ItemData {
  id: number;
  label: string;
  url: string;
  icon: string;
}

// Sample data structure - replace with your JSON data
const itemsData: ItemData[] = [
  {
    id: 1,
    label: "Modulo 1",
    url: "/dashboard",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
  <!-- Bed -->
  <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
  <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
  <!-- Pillows -->
  <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
  <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
  <!-- Lamp -->
  <circle cx="60" cy="25" r="6" fill="#FFA500"/>
  <!-- Teddy -->
  <circle cx="25" cy="25" r="5" fill="#8B4513"/>
  <circle cx="23" cy="23" r="2" fill="#654321"/>
  <circle cx="27" cy="23" r="2" fill="#654321"/>
  <!-- Bed legs -->
  <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
</svg>`
  },
  {
    id: 1,
    label: "Modulo 2",
    url: "/dashboard",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
  <!-- Bed -->
  <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
  <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
  <!-- Pillows -->
  <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
  <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
  <!-- Lamp -->
  <circle cx="60" cy="25" r="6" fill="#FFA500"/>
  <!-- Teddy -->
  <circle cx="25" cy="25" r="5" fill="#8B4513"/>
  <circle cx="23" cy="23" r="2" fill="#654321"/>
  <circle cx="27" cy="23" r="2" fill="#654321"/>
  <!-- Bed legs -->
  <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
</svg>`
  },
  {
    id: 1,
    label: "Modulo 2",
    url: "/dashboard",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
  <!-- Bed -->
  <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
  <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
  <!-- Pillows -->
  <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
  <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
  <!-- Lamp -->
  <circle cx="60" cy="25" r="6" fill="#FFA500"/>
  <!-- Teddy -->
  <circle cx="25" cy="25" r="5" fill="#8B4513"/>
  <circle cx="23" cy="23" r="2" fill="#654321"/>
  <circle cx="27" cy="23" r="2" fill="#654321"/>
  <!-- Bed legs -->
  <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
</svg>`
  },
  {
    id: 1,
    label: "Modulo 4",
    url: "/dashboard",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
          <rect x="15" y="20" width="50" height="40" fill="#B2EBF2" stroke="#1C274C" stroke-width="1.5"/>
          <path d="M25 20v40M35 20v40M45 20v40M55 20v40" stroke="#1C274C" stroke-width="1.5"/>
          <circle cx="25" cy="15" r="2" fill="#1C274C"/>
          <circle cx="35" cy="15" r="2" fill="#1C274C"/>
          <circle cx="45" cy="15" r="2" fill="#1C274C"/>
          <circle cx="55" cy="15" r="2" fill="#1C274C"/>
          <path d="M20 60l5 5 5-5M40 60l5 5 5-5" fill="none" stroke="#1C274C" stroke-width="1.5"/>
        </svg>`
  },
    {
    id: 1,
    label: "Modulo 4",
    url: "/dashboard",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
  <!-- Bed -->
  <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
  <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
  <!-- Pillows -->
  <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
  <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
  <!-- Lamp -->
  <circle cx="60" cy="25" r="6" fill="#FFA500"/>
  <!-- Teddy -->
  <circle cx="25" cy="25" r="5" fill="#8B4513"/>
  <circle cx="23" cy="23" r="2" fill="#654321"/>
  <circle cx="27" cy="23" r="2" fill="#654321"/>
  <!-- Bed legs -->
  <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
</svg>`
  },
  // Add more items following the same structure
];

interface Props {
  items?: ItemData[];
}

const OrbitalCarousel = ({ items = itemsData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const calculatePosition = (index: number, totalItems: number) => {
    const angleStep = 360 / totalItems;
    const angle = ((index - activeIndex) * angleStep) % 360;
    const angleRad = (angle * Math.PI) / 180;
    
    const radiusX = 200;
    const radiusY = 80;
    
    const x = Math.sin(angleRad) * radiusX;
    const y = Math.cos(angleRad) * radiusY;
    
    const scale = 0.6 + Math.cos(angleRad) * 0.4;
    const zIndex = Math.round((Math.cos(angleRad) + 1) * 500);

    return {
      x,
      y: y / 2,
      scale,
      zIndex,
      opacity: 0.8 + Math.cos(angleRad) * 0.5
    };
  };

  const handleCircleClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleLabelClick = (url: string) => {
    router.push(url);
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-32">
      <div className="relative w-[500px] h-[400px]">
        <div className="absolute top-1/2 left-1/2 w-full h-full" style={{ transform: 'translate(-59.6667%, -50%)' }}>
          <AnimatePresence>
            {items.map((item, index) => {
              const pos = calculatePosition(index, items.length);
              return (
                <motion.div
                  key={item.id}
                  className="absolute top-1/2 left-1/2"
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    scale: pos.scale,
                    zIndex: pos.zIndex,
                    opacity: pos.opacity,
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
                        w-24 h-24 rounded-full border-2 border-blue-500 
                        flex items-center justify-center cursor-pointer
                        ${index === activeIndex ? 'bg-white shadow-lg' : 'bg-white/90'}
                        transition-all duration-300
                      `}
                      onClick={() => handleCircleClick(index)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div 
                        className="w-24 h-24"
                        dangerouslySetInnerHTML={{ __html: item.icon }}
                      />
                    </motion.div>
                    <motion.span 
                      className={`
                        mt-2 text-sm font-medium text-center cursor-pointer
                        ${index === activeIndex ? 'text-blue-500' : 'text-gray-600'}
                        transition-all duration-300
                      `}
                      onClick={() => handleLabelClick(item.url)}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OrbitalCarousel;