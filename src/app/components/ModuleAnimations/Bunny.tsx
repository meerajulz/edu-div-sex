'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Bunny component for animations
interface BunnyProps {
  isVisible?: boolean;
  treesAnimationComplete?: boolean;
  zIndex?: number;
  initialDelay?: number;
  className?: string;
  browserWidth?: number;
}

const Bunny: React.FC<BunnyProps> = ({
  isVisible = false,
  treesAnimationComplete = false,
  zIndex = 30,
  initialDelay = 0.2,
  className = '',
  browserWidth = 1200,
}) => {
  // State to track which position the bunny should be in
  const [bunnyPosition, setBunnyPosition] = useState<'hidden' | 'right' | 'left'>('hidden');
  const shouldShowBunny = isVisible && treesAnimationComplete;
  
  // Effect to handle the bunny position sequence
  useEffect(() => {
    if (!shouldShowBunny) {
      setBunnyPosition('hidden');
      return;
    }
    
    // Initial appearance on the right
    const initialTimer = setTimeout(() => {
      setBunnyPosition('right');
    }, initialDelay * 1000);
    
    // After a few seconds, disappear and reappear on the left
    const leftTimer = setTimeout(() => {
      setBunnyPosition('hidden');
      
      // Short delay before appearing on the left
      setTimeout(() => {
        setBunnyPosition('left');
        
        // After a few more seconds, go back to the right
        setTimeout(() => {
          setBunnyPosition('hidden');
          
          // Short delay before reappearing on the right
          setTimeout(() => {
            setBunnyPosition('right');
          }, 500);
        }, 3000);
      }, 500);
    }, 3000);
    
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(leftTimer);
    };
  }, [shouldShowBunny, initialDelay]);
  
  // Bunny right side animation (by the tree)
  const bunnyRightVariants = {
    hidden: {
      y: 100,
      opacity: 0,
    },
    visible: {
      y: [100, 0, 20, 0], // Hop up from below, then small bounce
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 80,
        duration: 1,
      },
    },
    exit: {
      y: 100,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };
  
  // Bunny left side animation
  const bunnyLeftVariants = {
    hidden: {
      x: -100,
      opacity: 0,
    },
    visible: {
      x: [-100, 20, 0], // Slide in from left with small overshoot
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 70,
        duration: 1,
      },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Mobile responsive sizes
  const getBunnySize = () => {
    // Adjust size for different devices
    const isMobile = browserWidth < 768;
    const isTablet = browserWidth >= 768 && browserWidth < 1024;
    const isLargeTablet = browserWidth >= 1024 && browserWidth <= 1366;
    
    if (isMobile) {
      return {
        height: '100px',
        width: '85px',
      };
    } else if (isTablet) {
      return {
        height: '110px',
        width: '90px',
      };
    } else if (isLargeTablet) {
      return {
        height: '130px', // Larger size for iPad Pro
        width: '110px',
      };
    } else {
      return {
        height: '120px',
        width: '100px',
      };
    }
  };

  // Get left position based on device
  const getLeftPosition = () => {
    const isMobile = browserWidth < 768;
    const isTablet = browserWidth >= 768 && browserWidth < 1024;
    const isLargeTablet = browserWidth >= 1024 && browserWidth <= 1366;
    
    if (isMobile) {
      return '8%'; // Move further to the right on mobile for better visibility
    } else if (isTablet) {
      return '8%'; // Ensure full visibility on smaller iPads
    } else if (isLargeTablet) {
      return '9%'; // Special position for iPad Pro and devices with width 1366px
    } else {
      return '8%'; // Desktop position - more visible
    }
  };

  const bunnySize = getBunnySize();
  const leftPosition = getLeftPosition();

  return (
    <>
      {shouldShowBunny && (
        <>
          {/* Right side bunny */}
          <AnimatePresence>
            {bunnyPosition === 'right' && (
              <motion.div
                className={`pointer-events-none absolute ${className}`}
                style={{
                  position: 'absolute',
                  right: '18%', // Position near the tree on the right
                  bottom: '-1%', // Just above the bottom
                  zIndex,
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={bunnyRightVariants}
              >
                <div
                  className="relative md:scale-110 lg:scale-125"
                  style={{
                    height: bunnySize.height,
                    width: bunnySize.width,
                  }}
                >
                  <Image
                    src="/svg/actividad1/bunny.svg"
                    alt="Bunny"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Left side bunny */}
          <AnimatePresence>
            {bunnyPosition === 'left' && (
              <motion.div
                className={`pointer-events-none absolute ${className}`}
                style={{
                  position: 'absolute',
                  left: leftPosition, // Responsive position based on device
                  bottom: '5%', // Slightly above the bottom
                  zIndex,
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={bunnyLeftVariants}
              >
                <div
                  className="relative md:scale-110 lg:scale-125"
                  style={{
                    height: bunnySize.height,
                    width: bunnySize.width,
                  }}
                >
                  <Image
                    src="/svg/actividad1/bunny2.svg"
                    alt="Bunny"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default Bunny;