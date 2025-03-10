'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ContainerSize, ItemData } from './types';
import { calculatePosition, playSound, getDefaultItems } from './utils';
import CarouselItem from './CarouselItem';

interface OrbitalCarouselProps {
  onSelectActivity?: (url: string) => void; // Callback for when activity is selected
}

const OrbitalCarousel: React.FC<OrbitalCarouselProps> = ({ onSelectActivity }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [moveAudio, setMoveAudio] = useState<HTMLAudioElement | null>(null);
  const [clickAudio, setClickAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 600,
    height: 200,
    iconSize: 100
  });

  // Get items data
  const items: ItemData[] = getDefaultItems();

  // Responsive container size calculation
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      
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

    // Store the selected URL to use after animation completes
    setSelectedUrl(url);
    
    // Notify parent component that an activity was selected
    if (onSelectActivity) {
      onSelectActivity(url);
    } else {
      // If no callback is provided, navigate directly
      router.push(url);
    }
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-screen-lg">      
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
          <div className="absolute inset-0" />
          
          {/* Content container */}
          <div 
            className="absolute top-[40%] left-1/2 w-full h-full" 
            style={{ transform: 'translate(-64.6667%, -87%)' }}
          >
            <AnimatePresence>
              {items.map((item, index) => {
                const position = calculatePosition(
                  index, 
                  activeIndex, 
                  items.length, 
                  containerSize
                );
                
                return (
                  <CarouselItem
                    key={item.id}
                    item={item}
                    index={index}
                    activeIndex={activeIndex}
                    position={position}
                    containerSize={containerSize}
                    handleCircleClick={handleCircleClick}
                    handleLabelClick={handleLabelClick}
                  />
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