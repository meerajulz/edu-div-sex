'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { calculatePosition, playSound, getDefaultItems } from './utils';
import CarouselItem from './CarouselItem';

// Make sure to add this interface
interface ContainerSize {
  width: number;
  height: number;
  iconSize: number;
  yOffset: number; // Added yOffset for vertical positioning
  spacing: number; // Added spacing factor to control distance between items
}

// Add this interface if it's not already in your types file
interface ItemData {
  id: number;
  label: string;
  url: string;
  svgPath: string;
  isUnlocked: boolean;
}

interface OrbitalCarouselProps {
  onSelectActivity?: (url: string) => void; // Callback for when activity is selected
}

const OrbitalCarousel: React.FC<OrbitalCarouselProps> = ({ onSelectActivity }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [moveAudio, setMoveAudio] = useState<HTMLAudioElement | null>(null);
  const [clickAudio, setClickAudio] = useState<HTMLAudioElement | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 600,
    height: 200,
    iconSize: 100,
    yOffset: 0,
    spacing: 1.0
  });

  // Get items data
  const items: ItemData[] = getDefaultItems();

  // Enhanced responsive container size calculation
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      
      if (width < 640) { // sm
        setContainerSize({
          width: isLandscape ? 400 : 300,
          height: isLandscape ? 140 : 120,
          iconSize: isLandscape ? 60 : 50,
          yOffset: isLandscape ? 0 : -50, // Move up in portrait mode
          spacing: isLandscape ? 0.9 : 0.7 // Closer spacing in portrait mode
        });
      } else if (width < 768) { // md
        setContainerSize({
          width: 420,
          height: 160,
          iconSize: 70,
          yOffset: isLandscape ? 0 : -40,
          spacing: isLandscape ? 0.95 : 0.8
        });
      } else if (width < 1024) { // lg
        setContainerSize({
          width: 500,
          height: 180,
          iconSize: 85,
          yOffset: 0,
          spacing: 0.9
        });
      } else { // xl and above
        setContainerSize({
          width: 600,
          height: 200,
          iconSize: 100,
          yOffset: 0,
          spacing: 1.0
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Force orientation check on load and resize
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      document.body.classList.toggle('is-portrait', isPortrait);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('resize', checkOrientation);
    };
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
    
    // Notify parent component that an activity was selected
    if (onSelectActivity) {
      onSelectActivity(url);
      console.log("Activity selected, triggering animation:", url);
    } else {
      // If no callback is provided, navigate directly
      console.log("No animation callback provided, navigating directly");
      router.push(url);
    }
  };

  // Updated position calculation to include responsive adjustments
  const getUpdatedPosition = (index: number) => {
    return calculatePosition(
      index, 
      activeIndex, 
      items.length, 
      containerSize
    );
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-screen-lg">      
      {/* Carousel container with responsive adjustments */}
      <div className="relative z-10 px-4 py-4 sm:py-0 md:py-0" style={{ 
        transform: `translateY(${containerSize.yOffset}px)` 
      }}>
        <div 
          className="relative mx-auto overflow-hidden"
          style={{ 
            width: containerSize.width, 
            height: containerSize.height
          }}
        >
          {/* Enhanced glass effect background */}
          <div className="absolute inset-0" />
          
          {/* Content container with adjusted positioning */}
          <div 
            className="absolute top-[40%] left-1/2 w-full h-full" 
            style={{ 
              transform: 'translate(-64.6667%, -87%)',
              // Apply spacing factor to the container
              scale: containerSize.spacing
            }}
          >
            <AnimatePresence>
              {items.map((item, index) => {
                const position = getUpdatedPosition(index);
                
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