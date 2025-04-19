'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  onAnimationComplete?: () => void;
}

const Bunny: React.FC<BunnyProps> = ({
  isVisible = false,
  treesAnimationComplete = false,
  zIndex = 30,
  initialDelay = 0.2,
  className = '',
  browserWidth = 1200,
  onAnimationComplete,
}) => {
  // State to track which position the bunny should be in
  const [bunnyPosition, setBunnyPosition] = useState<'hidden' | 'right' | 'left'>('hidden');
  const shouldShowBunny = isVisible && treesAnimationComplete;
  
  // Refs to track animation state and prevent duplicate notifications
  const hasCalledCallbackRef = useRef(false);
  const animationTimersRef = useRef<NodeJS.Timeout[]>([]);
  const completedAppearancesRef = useRef(0);
  const isBunnyFinishedRef = useRef(false);
  
  // Clear all timers function for cleanup
  const clearAllTimers = () => {
    animationTimersRef.current.forEach(timer => {
      clearTimeout(timer);
    });
    animationTimersRef.current = [];
  };
  
  // Effect to handle the bunny position sequence
  useEffect(() => {
    // If bunny is not supposed to be shown or has already finished, do nothing
    if (!shouldShowBunny || isBunnyFinishedRef.current) {
      setBunnyPosition('hidden');
      clearAllTimers();
      return;
    }
    
    // Reset tracking
    completedAppearancesRef.current = 0;
    hasCalledCallbackRef.current = false;
    
    const runBunnyAnimation = () => {
      // Stop if we've already completed 3 appearances
      if (completedAppearancesRef.current >= 3) {
        console.log("Bunny animation completed 3 times. Stopping.");
        isBunnyFinishedRef.current = true;
        setBunnyPosition('hidden');
        clearAllTimers();
        
        // Call onAnimationComplete if it hasn't been called yet
        if (onAnimationComplete && !hasCalledCallbackRef.current) {
          onAnimationComplete();
          hasCalledCallbackRef.current = true;
        }
        return;
      }
      
      // Initial appearance on the right
      const timer1 = setTimeout(() => {
        setBunnyPosition('right');
        console.log("Bunny appears on right");
        
        // After a few seconds, disappear and reappear on the left
        const timer2 = setTimeout(() => {
          setBunnyPosition('hidden');
          console.log("Bunny hides");
          
          // Short delay before appearing on the left
          const timer3 = setTimeout(() => {
            setBunnyPosition('left');
            console.log("Bunny appears on left");
            
            // After a few more seconds, go back to hidden
            const timer4 = setTimeout(() => {
              setBunnyPosition('hidden');
              console.log("Bunny hides again");
              
              // Increment completed appearances
              completedAppearancesRef.current += 1;
              
              // If we've completed 3 appearances, stop
              if (completedAppearancesRef.current >= 3) {
                console.log("Bunny animation completed 3 times. Stopping.");
                isBunnyFinishedRef.current = true;
                clearAllTimers();
                
                // Call onAnimationComplete if it hasn't been called yet
                if (onAnimationComplete && !hasCalledCallbackRef.current) {
                  onAnimationComplete();
                  hasCalledCallbackRef.current = true;
                }
                return;
              }
              
              // Continue animation if not completed 3 times
              runBunnyAnimation();
            }, 3000);
            
            animationTimersRef.current.push(timer4);
          }, 500);
          
          animationTimersRef.current.push(timer3);
        }, 3000);
        
        animationTimersRef.current.push(timer2);
      }, initialDelay * 1000);
      
      animationTimersRef.current.push(timer1);
    };
    
    // Start the first animation cycle
    runBunnyAnimation();
    
    // Cleanup when component unmounts
    return clearAllTimers;
  }, [shouldShowBunny, initialDelay, onAnimationComplete]);
  
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

  // If bunny has finished its 3 appearances, render nothing
  if (isBunnyFinishedRef.current) {
    return null;
  }

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