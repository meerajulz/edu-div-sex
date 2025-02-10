'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ItemData {
  id: number;
  label: string;
  url: string;
  icon: string;
}

const OrbitalCarousel = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [moveAudio, setMoveAudio] = useState<HTMLAudioElement | null>(null);
  const [clickAudio, setClickAudio] = useState<HTMLAudioElement | null>(null);
  const [containerSize, setContainerSize] = useState({
    width: 420,
    height: 180,
    iconSize: 96
  });

  // Complete items data
  const items: ItemData[] = [
    {
      id: 1,
      label: "Modulo 1",
      url: "/dashboard",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
        <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
        <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
        <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <circle cx="60" cy="25" r="6" fill="#FFA500"/>
        <circle cx="25" cy="25" r="5" fill="#8B4513"/>
        <circle cx="23" cy="23" r="2" fill="#654321"/>
        <circle cx="27" cy="23" r="2" fill="#654321"/>
        <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
      </svg>`
    },
    {
      id: 2,
      label: "Modulo 2",
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
      id: 3,
      label: "Modulo 3",
      url: "/dashboard",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
        <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
        <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
        <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <circle cx="60" cy="25" r="6" fill="#FFA500"/>
        <circle cx="25" cy="25" r="5" fill="#8B4513"/>
        <circle cx="23" cy="23" r="2" fill="#654321"/>
        <circle cx="27" cy="23" r="2" fill="#654321"/>
        <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
      </svg>`
    },
    {
      id: 4,
      label: "Modulo 4",
      url: "/dashboard",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
        <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
        <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
        <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <circle cx="60" cy="25" r="6" fill="#FFA500"/>
        <circle cx="25" cy="25" r="5" fill="#8B4513"/>
        <circle cx="23" cy="23" r="2" fill="#654321"/>
        <circle cx="27" cy="23" r="2" fill="#654321"/>
        <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
      </svg>`
    },
    {
      id: 5,
      label: "Modulo 4",
      url: "/dashboard",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
        <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
        <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
        <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <circle cx="60" cy="25" r="6" fill="#FFA500"/>
        <circle cx="25" cy="25" r="5" fill="#8B4513"/>
        <circle cx="23" cy="23" r="2" fill="#654321"/>
        <circle cx="27" cy="23" r="2" fill="#654321"/>
        <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
      </svg>`
    },
    {
      id: 6,
      label: "Modulo 4",
      url: "/dashboard",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="#fff" stroke="#1C274C" stroke-width="2"/>
        <rect x="15" y="30" width="50" height="25" fill="#FFB6C1" stroke="#1C274C" stroke-width="1.5"/>
        <path d="M15 45h50" stroke="#1C274C" stroke-width="1.5"/>
        <rect x="20" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <rect x="35" y="35" width="12" height="8" fill="#fff" stroke="#1C274C"/>
        <circle cx="60" cy="25" r="6" fill="#FFA500"/>
        <circle cx="25" cy="25" r="5" fill="#8B4513"/>
        <circle cx="23" cy="23" r="2" fill="#654321"/>
        <circle cx="27" cy="23" r="2" fill="#654321"/>
        <path d="M20 55v5M60 55v5" stroke="#8B4513" stroke-width="2"/>
      </svg>`
    }
  ];

  // Responsive container size calculation
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      // Base radius calculations that we'll preserve
      const baseRadiusX = 150;
      const baseRadiusY = 80;
      
      if (width < 640) { // sm
        setContainerSize({
          width: 300,
          height: 140,
          iconSize: 64
        });
      } else if (width < 768) { // md
        setContainerSize({
          width: 360,
          height: 160,
          iconSize: 80
        });
      } else { // lg and above
        setContainerSize({
          width: 420,
          height: 180,
          iconSize: 96
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Audio initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const moveSound = new Audio('/ui-sound/whoosh.mp3');
      moveSound.preload = 'auto';
      moveSound.volume = 0.3;
      setMoveAudio(moveSound);

      const clickSound = new Audio('/ui-sound/click.mp3');
      clickSound.preload = 'auto';
      clickSound.volume = 0.5;
      setClickAudio(clickSound);

      return () => {
        moveSound.pause();
        clickSound.pause();
      };
    }
  }, []);

  const calculatePosition = (index: number, totalItems: number) => {
    const angleStep = 360 / totalItems;
    const angle = ((index - activeIndex) * angleStep) % 360;
    const angleRad = (angle * Math.PI) / 180;
    
    // Keep original radius proportions
    const radiusX = containerSize.width * 0.357; // Maintains proportion of 150/420
    const radiusY = containerSize.height * 0.444; // Maintains proportion of 80/180
    
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

  const playSound = async (audio: HTMLAudioElement | null) => {
    try {
      if (audio) {
        audio.currentTime = 0;
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleCircleClick = async (index: number) => {
    if (index !== activeIndex) {
      await playSound(clickAudio);
      await playSound(moveAudio);
    }
    setActiveIndex(index);
  };

  const handleLabelClick = async (url: string) => {
    await playSound(clickAudio);
    router.push(url);
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-screen-lg">
      {/* Main background with blur */}
      <div className="absolute inset-0 " />
      
      {/* Carousel container */}
      <div className="relative z-10 px-4 py-8 sm:py-12">
        <div 
          className="relative mx-auto rounded-full overflow-hidden"
          style={{ 
            width: containerSize.width, 
            height: containerSize.height
          }}
        >
          {/* Enhanced glass effect background */}
          <div className="absolute inset-0 " />
          
          {/* Glowing border */}
          <div className="absolute inset-0 " />
          
          {/* Content container */}
          <div 
            className="absolute top-[30%] left-1/2 w-full h-full" 
            style={{ transform: 'translate(-59.6667%, -90%)' }}
          >
            <AnimatePresence>
              {items.map((item, index) => {
                const pos = calculatePosition(index, items.length);
                const iconSize = `${containerSize.iconSize}px`;
                
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
                          rounded-full border-2 border-blue-400/80 
                          flex items-center justify-center cursor-pointer
                          bg-gradient-to-br from-white to-blue-50
                          ${index === activeIndex ? 'shadow-lg shadow-blue-200/50' : ''}
                          transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]
                        `}
                        style={{
                          width: iconSize,
                          height: iconSize
                        }}
                        onClick={() => handleCircleClick(index)}
                        whileHover={{ scale: 1.1 }}
                      >
                        <div 
                          style={{
                            width: iconSize,
                            height: iconSize
                          }}
                          dangerouslySetInnerHTML={{ __html: item.icon }}
                        />
                      </motion.div>
                      <motion.span 
                        className={`
                          px-3 py-1.5 rounded-full mt-2
                          bg-white/80 backdrop-blur-md
                          shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                          text-xs font-medium text-center cursor-pointer
                          ${index === activeIndex ? 'text-blue-600 bg-blue-50/90' : 'text-gray-700'}
                          transition-all duration-300
                          sm:text-sm sm:px-4 sm:py-2
                          md:text-base
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
    </div>
  );
};

export default OrbitalCarousel;