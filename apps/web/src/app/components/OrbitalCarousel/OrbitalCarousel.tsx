'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { calculatePosition, playSound, getDefaultItems } from './utils';
import CarouselItem from './CarouselItem';

interface ContainerSize {
  width: number;
  height: number;
  iconSize: number;
  yOffset: number;
  spacing: number;
}

interface ItemData {
  id: number;
  label: string;
  url: string;
  svgPath: string;
  isUnlocked: boolean;
}

interface OrbitalCarouselProps {
  onSelectActivity?: (url: string) => void;
}

const OrbitalCarousel: React.FC<OrbitalCarouselProps> = ({ 
  onSelectActivity
}) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [moveAudio, setMoveAudio] = useState<HTMLAudioElement | null>(null);
  const [clickAudio, setClickAudio] = useState<HTMLAudioElement | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 600,
    height: 300,
    iconSize: 100,
    yOffset: 0,
    spacing: 1.0
  });

  const items: ItemData[] = getDefaultItems();

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      
      if (width < 640) { // sm
        setContainerSize({
          width: isLandscape ? 400 : 300,
          height: isLandscape ? 200 : 180,
          iconSize: isLandscape ? 60 : 50,
          yOffset: isLandscape ? 0 : -50,
          spacing: isLandscape ? 0.9 : 0.7
        });
      } else if (width < 768) { // md
        setContainerSize({
          width: 420,
          height: 240,
          iconSize: 70,
          yOffset: isLandscape ? 0 : -40,
          spacing: isLandscape ? 0.95 : 0.8
        });
      } else if (width < 1024) { // lg
        setContainerSize({
          width: 500,
          height: 270,
          iconSize: 85,
          yOffset: 0,
          spacing: 0.9
        });
      } else { // xl and above
        setContainerSize({
          width: 600,
          height: 400,
          iconSize: 100,
          yOffset: 0,
          spacing: 1.0
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
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
    if (!isUnlocked) {
      return;
    }
    
    await playSound(clickAudio);
    
    if (onSelectActivity) {
      onSelectActivity(url);
      console.log("Activity selected, triggering animation:", url);
    } else {
      console.log("No animation callback provided, navigating directly");
      router.push(url);
    }
  };

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
      <div className="relative z-10 px-4 py-4 sm:py-0 md:py-0" style={{ 
        transform: `translateY(${containerSize.yOffset}px)` 
      }}>
        <div 
          className="relative mx-auto"
          style={{ 
            width: containerSize.width, 
            height: containerSize.height
          }}
        >
          <div className="absolute inset-0" />
          
          <div 
            className="absolute w-full h-full" 
            style={{ 
              top: containerSize.width < 640 ? '20%' : '10%',
              left: containerSize.width < 640 ? '50%' : '45%',
              transform: 'translate(-50%, -50%)',
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