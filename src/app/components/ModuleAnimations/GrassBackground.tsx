'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { playAudio, cleanupAudio } from '../../utils/audioPlayer';
import Bunny from './Bunny'; // Assuming Bunny is in its own file
import Ardilla from './Ardilla'; // Import the Ardilla component

// Tree subcomponent with correct TypeScript types and animation complete callback
interface TreeProps {
  // Position properties
  left?: string;
  right?: string;
  bottom?: string;
  // Size properties
  scale?: number;
  height?: string;
  width?: string;
  // Z-index for layering
  zIndex?: number;
  // Animation delay
  animationDelay?: number;
  // Animation complete callback
  onAnimationComplete?: () => void;
  // Custom styles
  className?: string;
}

const Tree: React.FC<TreeProps> = ({
  left,
  right,
  bottom = '5%',
  scale = 1,
  height = '250px',
  width = '200px',
  zIndex = 15,
  animationDelay = 0,
  onAnimationComplete,
  className = '',
}) => {
  // Animation variants for tree - comes from above
  const treeVariants = {
    hidden: {
      y: '-100vh', // Start from above the screen
      opacity: 0,
      scale: scale * 0.8, // Start slightly smaller
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: scale,
      transition: {
        type: 'spring',
        damping: 15, // Less damping for more bounce
        stiffness: 70,
        delay: animationDelay, // Custom delay passed as prop
        duration: 1.2,
      },
    },
  };

  // Determine the positioning style with proper TypeScript typing
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    bottom,
    zIndex,
  };

  // Apply left or right position (not both)
  if (left) positionStyle.left = left;
  if (right) positionStyle.right = right;

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={positionStyle}
      initial="hidden"
      animate="visible"
      variants={treeVariants}
      onAnimationComplete={() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }}
    >
      <div
        className="relative"
        style={{
          height,
          width,
        }}
      >
        <Image
          src="/svg/actividad1/tree.svg"
          alt="Tree"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
    </motion.div>
  );
};

interface GrassBackgroundProps {
  isVisible?: boolean;
  onEnterComplete?: () => void;
  enableSound?: boolean;
  soundSrc?: string;
  showArdilla?: boolean;      // Add prop to control ardilla visibility
  onArdillaComplete?: () => void; // Add callback for ardilla animation completion
}

const GrassBackground: React.FC<GrassBackgroundProps> = ({
  isVisible = false,
  onEnterComplete,
  enableSound = true,
  soundSrc = '/audio/birds.mp3',
  showArdilla = false,       // Set default to false
  onArdillaComplete,         // Add ardilla callback
}) => {
  // Use useState with explicit types and safe initial values for SSR
  const [containerDimensions, setContainerDimensions] = useState({ width: 1, height: 1 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 1, height: 1 });
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [isGrassAnimationComplete, setIsGrassAnimationComplete] = useState(false);
  const [isTreesAnimationComplete, setIsTreesAnimationComplete] = useState(false);
  const [isBunnyShown, setIsBunnyShown] = useState(false);
  // Add client-side rendering guard
  const [hasMounted, setHasMounted] = useState(false);
  const aspectRatio = 16 / 9;

  // Set mounted flag after component mounts on client
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect to track when bunny has been shown
  useEffect(() => {
    if (isTreesAnimationComplete && isVisible) {
      // After 3 seconds, the bunny will have been shown
      const bunnyTimer = setTimeout(() => {
        setIsBunnyShown(true);
      }, 3000);
      
      return () => clearTimeout(bunnyTimer);
    }
  }, [isTreesAnimationComplete, isVisible]);

  // Play bird sounds when the component becomes visible
  useEffect(() => {
    // Skip during SSR
    if (!hasMounted) return;
    
    // Function to play sounds in a loop
    const playBirdSoundsLoop = async () => {
      if (isVisible && enableSound && !soundPlaying) {
        setSoundPlaying(true);
        try {
          // Use the onEnd callback to create a loop
          await playAudio(
            soundSrc, 
            // When sound ends, play it again if component is still visible
            () => {
              if (isVisible) {
                playBirdSoundsLoop();
              }
            },
            0.6 // Lower volume (60%)
          );
        } catch (e) {
          console.warn('Failed to play bird sounds:', e);
          setSoundPlaying(false);
        }
      }
    };

    if (isVisible && enableSound) {
      playBirdSoundsLoop();
    }

    // Cleanup function
    return () => {
      if (soundPlaying) {
        cleanupAudio();
        setSoundPlaying(false);
      }
    };
  }, [isVisible, enableSound, soundSrc, soundPlaying, hasMounted]);

  // Handle responsive sizing - safely guarded for SSR
  useEffect(() => {
    // Skip during server-side rendering
    if (!hasMounted) return;
    
    // Set initial browser dimensions
    setBrowserDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Update browser dimensions
      setBrowserDimensions({
        width: viewportWidth,
        height: viewportHeight
      });
      
      // Calculate dimensions to maintain aspect ratio while filling screen
      let width = viewportWidth;
      let height = width / aspectRatio;
      
      if (height < viewportHeight) {
        height = viewportHeight;
        width = height * aspectRatio;
      }
      
      setContainerDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [hasMounted]);

  // Only calculate container style on client-side
  const containerStyle = hasMounted ? {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  } : {};

  // Animation variants - Coming from the bottom
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: "130vh" // Start from below the screen
    },
    visible: { 
      opacity: 1,
      y: 0, // Move to final position
      transition: { 
        type: "spring",
        damping: 22,
        stiffness: 80,
        duration: 1.0,
        when: "beforeChildren"
      }
    }
  };

  // Animation variants for grass elements
  const grassVariants = {
    hidden: { 
      y: 100, 
      opacity: 0,
      scale: 0.9
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 90,
        delay: 0.1,
        duration: 0.8,
        onComplete: () => {
          setIsGrassAnimationComplete(true);
        }
      }
    }
  };

  // Function to handle when tree animations are complete
  const handleTreesAnimationComplete = () => {
    setIsTreesAnimationComplete(true);
  };

  // Determine tree sizes and positions based on container dimensions
  const getTreeProps = () => {
    const isMobile = hasMounted && browserDimensions.width < 768;
    const isTablet = hasMounted && browserDimensions.width >= 768 && browserDimensions.width < 1024;
    
    // Using the specified positioning
    // Distant tree (smaller, on the left)
    const distantTree = {
      left: isMobile ? '19%' : (isTablet ? '20%' : '20%'),
      bottom: isMobile ? '80%' :  (isTablet ? '80%' : '85%'),
      height: isMobile ? '120px' : (isTablet ? '150px' : '180px'),
      width: isMobile ? '100px' : (isTablet ? '130px' : '150px'),
      scale: 0.9,
      zIndex: 12,
      animationDelay: 0.2
    };
    
    // Close tree (larger, on the right)
    const closeTree = {
      right: isMobile ? '0%' : '5%',
      bottom: isMobile ? '0%' : '0%',
      height: isMobile ? '380px' : (isTablet ? '350px' : '550px'),
      width: isMobile ? '200px' : (isTablet ? '300px' : '320px'),
      scale: 1.1,
      zIndex: 25,
      animationDelay: 0.4
    };
    
    return { distantTree, closeTree };
  };
  
  const { distantTree, closeTree } = getTreeProps();

  // Handler for ardilla animation completion
  const handleArdillaComplete = () => {
    console.log("Ardilla animation would be completed in GrassBackground");
    if (onArdillaComplete) {
      onArdillaComplete();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Sky background gradient - stays in place */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100 z-0" />
      
      {/* Conditionally render the full content only after client-side mounting */}
      {hasMounted ? (
        <motion.div 
          className="absolute z-10"
          style={containerStyle}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          onAnimationComplete={() => {
            if (isVisible && onEnterComplete) {
              onEnterComplete();
            }
          }}
        >
          {/* Grass background that aligns at the bottom */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <motion.div 
              className="w-full h-3/5 bg-bottom bg-cover bg-no-repeat relative"
              style={{ 
                backgroundImage: `url(/svg/actividad1/grass.svg)`,
              }}
              variants={grassVariants}
            >
              {/* Gradient overlay to blend with sky */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(173, 216, 230, 0.3) 0%, rgba(173, 216, 230, 0) 20%)'
                }}
              />
              
              {/* Trees - only visible after grass animation completes */}
              {isGrassAnimationComplete && (
                <>
                  {/* Distant tree (smaller, on the left) */}
                  <Tree
                    left={distantTree.left}
                    bottom={distantTree.bottom}
                    height={distantTree.height}
                    width={distantTree.width}
                    scale={distantTree.scale}
                    zIndex={distantTree.zIndex}
                    animationDelay={distantTree.animationDelay}
                  />
                  
                  {/* Close tree (larger, on the right) */}
                  <Tree
                    right={closeTree.right}
                    bottom={closeTree.bottom}
                    height={closeTree.height}
                    width={closeTree.width}
                    scale={closeTree.scale}
                    zIndex={closeTree.zIndex}
                    animationDelay={closeTree.animationDelay}
                    className="tree-right"
                    onAnimationComplete={handleTreesAnimationComplete}
                  />
                </>
              )}
              
              {/* Bunny animation - appears after trees are done */}
              <Bunny 
                isVisible={isVisible}
                treesAnimationComplete={isTreesAnimationComplete}
                zIndex={35} // Higher than trees to be in front
                initialDelay={0.2} // Short delay after trees finish
                browserWidth={browserDimensions.width} // Pass browser width to Bunny
              />
              
              {/* Ardilla (squirrel) animation - runs after bunny has been shown */}
              {showArdilla && (
                <Ardilla
                  isVisible={isVisible}
                  bunnyShown={isBunnyShown}
                  zIndex={35} // Same z-index as bunny
                  initialDelay={1} // Delay after bunny shown state is triggered
                  browserWidth={browserDimensions.width} // Pass browser width
                />
              )}
            </motion.div>
          </div>
          
          {/* Future interactive elements can be placed here */}
          <motion.div 
            className="absolute inset-0 z-20"
            variants={grassVariants}
          >
            {/* This will be filled with actual content later */}
          </motion.div>
        </motion.div>
      ) : (
        // Simple placeholder during server-side rendering
        <div className="absolute z-10"></div>
      )}
    </div>
  );
};

export default GrassBackground;