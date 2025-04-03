'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Bunny component for animations
interface BunnyProps {
  isVisible?: boolean;
  treesAnimationComplete?: boolean;
  zIndex?: number;
  initialDelay?: number;
  className?: string;
}

const Bunny: React.FC<BunnyProps> = ({
  isVisible = false,
  treesAnimationComplete = false,
  zIndex = 30,
  initialDelay = 0.2,
  className = '',
}) => {
  // Only show bunny if both component is visible and trees are done animating
  const shouldShowBunny = isVisible && treesAnimationComplete;
  
  // First animation: Bunny hops up and down on the left side
  const bunnyFirstAppearance = {
    hidden: {
      y: 100,
      opacity: 0,
      rotate: 0,
    },
    visible: {
      y: [100, 0, 20, 0], // Hop up from below, then small bounce
      opacity: 1,
      rotate: 15, // Add rotation directly in the animation
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 80,
        delay: initialDelay,
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
  
  // Second animation: Bunny appears from left side of screen and moves
  const bunnySecondAppearance = {
    hidden: {
      x: '-5vw',
      y: '60vh',
      opacity: 0,
      rotate: 0,
    },
    visible: {
      x: ['-5vw', '20vw'],
      y: ['60vh', '40vh'],
      opacity: [0, 1],
      rotate: 15, // Add rotation directly in the animation
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 70,
        delay: initialDelay + 1.5,
        duration: 2,
      },
    },
  };

  // Mobile responsive sizes
  const getBunnySize = () => {
    return {
      height: '120px',
      width: '100px',
    };
  };

  const bunnySize = getBunnySize();

  return (
    <>
      {shouldShowBunny && (
        <>
          {/* First bunny appearance - bottom left, where the red drawing is */}
          <motion.div
            className={`pointer-events-none absolute ${className}`}
            style={{
              position: 'absolute',
              left: '10%',
              bottom: '2%',
              zIndex,
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={bunnyFirstAppearance}
          >
            {/* Add an extra div for the horizontal flip */}
            <div
              className="relative md:scale-110 lg:scale-125"
              style={{
                height: bunnySize.height,
                width: bunnySize.width,
                transform: 'scaleX(-1)', // Only flip horizontally here
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

          {/* Second bunny appearance - moving from left bottom area */}
          <motion.div
            className={`pointer-events-none absolute ${className}`}
            style={{
              position: 'absolute',
              zIndex,
              left: 0,
              top: 0,
            }}
            initial="hidden"
            animate="visible"
            variants={bunnySecondAppearance}
          >
            {/* Add an extra div for the horizontal flip */}
            <div
              className="relative md:scale-110 lg:scale-125"
              style={{
                height: bunnySize.height,
                width: bunnySize.width,
                transform: 'scaleX(-1)', // Only flip horizontally here
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
        </>
      )}
    </>
  );
};

export default Bunny;