'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ItemData {
  id: number;
  label: string;
  url: string;
  svgPath: string;
  isUnlocked: boolean;
}

const OrbitalCarousel = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [moveAudio, setMoveAudio] = useState<HTMLAudioElement | null>(null);
  const [clickAudio, setClickAudio] = useState<HTMLAudioElement | null>(null);
  const [containerSize, setContainerSize] = useState({
    width: 600,
    height: 200,
    iconSize: 100
  });

  // Removed mock user progress state as we're setting unlocked status directly in items

  // Complete items data with SVG paths and locked status
  const items: ItemData[] = [
    {
      id: 1,
      label: "Actividad 1",
      url: "/actividad-1",
      svgPath: "/svg/menu/orbital/activity1-descubriendo-mi-cuerpo.svg",
      isUnlocked: true // First module is always unlocked
    },
    {
      id: 2,
      label: "Actividad 2",
      url: "/actividad-2",
      svgPath: "/svg/menu/orbital/activity2-intimidad.svg",
      isUnlocked: true // Manually set to false for now
    },
    {
      id: 3,
      label: "Actividad 3",
      url: "/actividad-3",
      svgPath: "/svg/menu/orbital/activity3-placer-sexual.svg",
      isUnlocked: false // Manually set to false for now
    },
    {
      id: 4,
      label: "Actividad 4",
      url: "/actividad-4",
      svgPath: "/svg/menu/orbital/activity4cuido-mi-sexualidad.svg",
      isUnlocked: false // Manually set to false for now
    },
    {
      id: 5,
      label: "Actividad 5",
      url: "/actividad-5",
      svgPath: "/svg/menu/orbital/activity5-entender-respectar.svg",
      isUnlocked: false // Manually set to false for now
    },
    {
      id: 6,
      label: "Actividad 6",
      url: "/actividad-6",
      svgPath: "/svg/menu/orbital/activity6.svg",
      isUnlocked: false // Manually set to false for now
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
          width: 600,
          height: 200,
          iconSize: 100
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

  const handleCircleClick = async (index: number, isUnlocked: boolean) => {
    // Only allow interaction with unlocked activities
    if (!isUnlocked) {
      return;
    }
    
    if (index !== activeIndex) {
      await playSound(clickAudio);
      await playSound(moveAudio);
    }
    setActiveIndex(index);
  };

  const handleLabelClick = async (url: string, isUnlocked: boolean) => {
    // Only navigate to unlocked activities
    if (!isUnlocked) {
      return;
    }
    
    await playSound(clickAudio);
    router.push(url);
  };

  // Unlock function removed as requested

  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-screen-lg">
      {/* Main background with blur */}
      <div className="absolute inset-0 " />
      
      {/* Carousel container */}
      <div className="relative z-10 px-4 py-8 sm:py-12">
        <div 
          className="relative mx-auto overflow-hidden"
          style={{ 
            width: containerSize.width, 
            height: containerSize.height
          }}
        >
          {/* Enhanced glass effect background */}
          <div className="absolute inset-0 " />
          
         
          
          {/* Content container */}
          <div 
            className="absolute top-[40%] left-1/2 w-full h-full" 
            style={{ transform: 'translate(-64.6667%, -87%)' }}
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
              })}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Demo button removed as requested */}
      </div>
    </div>
  );
};

export default OrbitalCarousel;