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
  const [items, setItems] = useState<ItemData[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 600,
    height: 300,
    iconSize: 100,
    yOffset: 0,
    spacing: 1.0
  });

  // Load items with unlock status
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoadingProgress(true);
        const itemsWithProgress = await getDefaultItems();
        setItems(itemsWithProgress);
      } catch (error) {
        console.error('❌ Failed to load orbital items:', error);
        // Fallback to basic items if API fails
        setItems([
          {
            id: 1,
            label: "Aventura 1",
            url: "/actividad-1/scene1/",
            svgPath: "/svg/menu/orbital/activity1-descubriendo-mi-cuerpo.svg",
            isUnlocked: true
          }
        ]);
      } finally {
        setIsLoadingProgress(false);
      }
    };
    
    loadItems();
  }, []);

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
      // Play locked sound or show notification
      console.log('🔒 Activity is locked! Complete previous activities first.');
      return;
    }
    
    // If clicking on the already active item, go to the activity
    if (index === activeIndex) {
      await playSound(clickAudio);
      const item = items[index];
      if (onSelectActivity) {
        onSelectActivity(item.url);
        console.log("Activity selected from active circle:", item.url);
      } else {
        console.log("No animation callback provided, navigating directly");
        router.push(item.url);
      }
      return;
    }
    
    // Otherwise, just rotate to that position
    await playSound(clickAudio);
    await playSound(moveAudio);
    setActiveIndex(index);
    console.log(`Rotated carousel to position ${index}`);
  };

  const handleLabelClick = async (index: number, url: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      // Play locked sound or show notification
      console.log('🔒 Activity is locked! Complete previous activities first.');
      return;
    }
    
    // Only allow navigation if this item is in the active (front) position
    if (index !== activeIndex) {
      console.log('Item must be in front position to navigate. Rotating to front...');
      await playSound(moveAudio);
      setActiveIndex(index);
      return;
    }
    
    // Item is in front position, navigate to activity
    await playSound(clickAudio);
    
    if (onSelectActivity) {
      onSelectActivity(url);
      console.log("Activity selected from front position:", url);
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

  // Show loading while fetching progress
  if (isLoadingProgress) {
    return (
      <div className="relative left-1/2 -translate-x-1/2 w-full max-w-screen-lg">      
        <div className="relative z-10 px-4 py-4 sm:py-0 md:py-0 flex justify-center items-center" style={{ 
          transform: `translateY(${containerSize.yOffset}px)`,
          height: containerSize.height 
        }}>
          <div className="text-white text-lg">Cargando actividades...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-full max-w-screen-lg">      
      <div className="relative z-10 px-4 py-4 sm:py-0 md:py-0" style={{ 
        transform: `translateY(${containerSize.yOffset}px)` 
      }}>
        <div 
          className="relative mx-auto main-carousel-container"
          style={{ 
            width: containerSize.width, 
            height: containerSize.height
          }}
        >
          <div className="absolute inset-0" />
          
          <div 
            className="absolute w-full h-full" 
            style={{ 
              top: containerSize.width < 840 ? '20%' : '10%',
              left: containerSize.width < 840 ? '50%' : '45%',
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
                    handleLabelClick={(url: string, isUnlocked: boolean) => 
                      handleLabelClick(index, url, isUnlocked)
                    }
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