'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Ardilla (squirrel) component for animations
interface ArdillaProps {
  isVisible?: boolean;
  bunnyShown?: boolean;
  zIndex?: number;
  initialDelay?: number;
  className?: string;
  browserWidth?: number;
}

const Ardilla: React.FC<ArdillaProps> = ({
  isVisible = false,
  bunnyShown = false, // This will be set to true after bunny has been shown
  zIndex = 35,
  initialDelay = 1,
  className = '',
  browserWidth = 1200,
}) => {
  // State to track which position/image the ardillas should be using
  const [ardillaState, setArdillaState] = useState<'hidden' | 'running' | 'finished'>('hidden');
  const [useSecondImage, setUseSecondImage] = useState(false);
  const [useSecondImageForSecondArdilla, setUseSecondImageForSecondArdilla] = useState(true);
  const shouldShowArdilla = isVisible && bunnyShown;
  
  // Effect to handle the ardilla animation sequence
  useEffect(() => {
    if (!shouldShowArdilla) {
      setArdillaState('hidden');
      return;
    }
    
    // Begin animation after the initial delay
    const initialTimer = setTimeout(() => {
      setArdillaState('running');
      
      // Toggle between images for running animation - first ardilla
      const imageToggleInterval = setInterval(() => {
        setUseSecondImage(prev => !prev);
      }, 200); // Toggle every 200ms for a running effect
      
      // Toggle between images for running animation - second ardilla (slightly out of sync)
      const imageToggleInterval2 = setInterval(() => {
        setUseSecondImageForSecondArdilla(prev => !prev);
      }, 220); // Slightly different timing to create variety
      
      // After the animation completes, mark as finished and clear interval
      setTimeout(() => {
        setArdillaState('finished');
        clearInterval(imageToggleInterval);
        clearInterval(imageToggleInterval2);
      }, 7000); // 7 seconds to ensure both ardillas are off screen
      
      return () => {
        clearInterval(imageToggleInterval);
        clearInterval(imageToggleInterval2);
      };
    }, initialDelay * 1000);
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, [shouldShowArdilla, initialDelay]);
  
  // First Ardilla animation - run from right to left (faster)
  const ardillaVariants = {
    hidden: {
      x: '100vw', // Start from right off-screen
      opacity: 1, // Full opacity, no fade in
    },
    running: {
      x: '-100vw', // Run to left off-screen
      opacity: 1, // Maintain full opacity
      transition: {
        type: 'tween', // Use a smooth linear movement
        ease: 'linear',
        duration: 5, // 5 seconds to cross the screen
      },
    },
    finished: {
      x: '-100vw',
      opacity: 1, // No fade out
      transition: {
        duration: 0.3,
      },
    },
  };
  
  // Second Ardilla animation - run from right to left (slower)
  const secondArdillaVariants = {
    hidden: {
      x: '110vw', // Start further right off-screen
      opacity: 1,
    },
    running: {
      x: '-100vw', // Run to left off-screen
      opacity: 1,
      transition: {
        type: 'tween',
        ease: 'linear',
        duration: 6.5, // Slower - takes 6.5 seconds to cross
        delay: 0.7, // Starts a bit later
      },
    },
    finished: {
      x: '-100vw',
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Get responsive sizes based on device
  const getArdillaSize = () => {
    const isMobile = browserWidth < 768;
    const isTablet = browserWidth >= 768 && browserWidth < 1024;
    const isLargeTablet = browserWidth >= 1024 && browserWidth <= 1366;
    
    if (isMobile) {
      return {
        height: '70px',
        width: '90px',
      };
    } else if (isTablet) {
      return {
        height: '80px',
        width: '100px',
      };
    } else if (isLargeTablet) {
      return {
        height: '90px',
        width: '110px',
      };
    } else {
      return {
        height: '100px',
        width: '120px',
      };
    }
  };

  // Get slightly smaller size for second ardilla
  const getSecondArdillaSize = () => {
    const mainSize = getArdillaSize();
    return {
      height: `${parseInt(mainSize.height) * 0.85}px`,
      width: `${parseInt(mainSize.width) * 0.85}px`,
    };
  };

  // Get vertical position for the ardilla, more visible on various screens
  const getArdillaPosition = () => {
    const isMobile = browserWidth < 768;
    const isTablet = browserWidth >= 768 && browserWidth < 1024;
    
    if (isMobile) {
      return '40%'; // Higher on mobile screens
    } else if (isTablet) {
      return '35%'; // Slightly lower on tablets
    } else {
      return '30%'; // Lower on desktop
    }
  };
  
  // Second ardilla positioned a bit lower
  const getSecondArdillaPosition = () => {
    const mainPosition = parseInt(getArdillaPosition());
    return `${mainPosition + 5}%`;
  };

  const ardillaSize = getArdillaSize();
  const secondArdillaSize = getSecondArdillaSize();
  const bottomPosition = getArdillaPosition();
  const secondBottomPosition = getSecondArdillaPosition();

  return (
    <>
      {shouldShowArdilla && (
        <AnimatePresence>
          {ardillaState === 'running' && (
            <>
              {/* First Ardilla - faster */}
              <motion.div
                className={`pointer-events-none absolute ${className}`}
                style={{
                  position: 'absolute',
                  bottom: bottomPosition,
                  zIndex,
                  width: '100%', // Full width to allow animation
                  display: 'flex',
                  justifyContent: 'center', // This will be overridden by the x-transform
                }}
                initial="hidden"
                animate="running"
                exit="finished"
                variants={ardillaVariants}
              >
                <div
                  className="relative"
                  style={{
                    height: ardillaSize.height,
                    width: ardillaSize.width,
                  }}
                >
                  <Image
                    src={useSecondImage ? 
                      "/svg/actividad1/ardilla2.svg" : 
                      "/svg/actividad1/ardilla.svg"}
                    alt="Ardilla"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
              
              {/* Second Ardilla - slower and slightly behind */}
              <motion.div
                className={`pointer-events-none absolute ${className}`}
                style={{
                  position: 'absolute',
                  bottom: secondBottomPosition,
                  zIndex: zIndex - 1, // Slightly behind the first ardilla
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                initial="hidden"
                animate="running"
                exit="finished"
                variants={secondArdillaVariants}
              >
                <div
                  className="relative"
                  style={{
                    height: secondArdillaSize.height,
                    width: secondArdillaSize.width,
                  }}
                >
                  <Image
                    src={useSecondImageForSecondArdilla ? 
                      "/svg/actividad1/ardilla2.svg" : 
                      "/svg/actividad1/ardilla.svg"}
                    alt="Second Ardilla"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default Ardilla;
