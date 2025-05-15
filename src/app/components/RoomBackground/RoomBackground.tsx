'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Add framer-motion
import AnimatedDoor from '../AnimatedDoor/page';
import WindowBirds from '../WindowBirdsOLD/WindowBirds';
import Backpack from '../BackpackOLD/Backpack';
import Table from '../Table/Table';

interface BackgroundProps {
  imagePath: string;
  debug?: boolean;
  isExiting?: boolean; // New prop to control exit animation
  onExitComplete?: () => void; // Callback when exit animation completes
}

const RoomBackground: React.FC<BackgroundProps> = ({ 
  imagePath, 
  //debug = false, 
  isExiting = false,
  onExitComplete 
}) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  const POSITIONS = {
    door: {
      left: 30.1,    
      top: 43,       
      width: 7.5,     
      height: 25,    
    },
    window: {
      left: 68,    
      top: 48,     
      width: 8,   
      height: 20,    
    },
    table: {
      left: 5,
      bottom: 15,
      width: 20,
      height: 15,
    }
  };

  useEffect(() => {
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
  }, []);

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  // Animation variants
  const roomVariants = {
    visible: { y: 0, opacity: 1 },
    exit: { y: '-110%', opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }
  };

  const furnishingVariants = {
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Sky background that will be revealed when room exits */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100"
      />

      {/* Background gradient - will exit with room */}
      <motion.div 
        className="absolute inset-0"
        initial="visible"
        animate={isExiting ? "exit" : "visible"}
        variants={roomVariants}
        style={{
          background: `
            linear-gradient(
              to bottom,
              #f5e6d3 0%,
              #e6d5b8 30%,
              #d4c4a7 100%
            )
          `
        }}
      />

      {/* Main container that maintains aspect ratio */}
      <motion.div 
        className="absolute"
        style={containerStyle}
        initial="visible"
        animate={isExiting ? "exit" : "visible"}
        variants={roomVariants}
        onAnimationComplete={() => {
          if (isExiting && onExitComplete) {
            onExitComplete();
          }
        }}
      >
        {/* Window Container */}
        <div 
          className="absolute z-10 cursor-pointer overflow-hidden"
          style={{
            left: `${POSITIONS.window.left}%`,
            top: `${POSITIONS.window.top}%`,
            width: `${POSITIONS.window.width}%`,
            height: `${POSITIONS.window.height}%`,
            backgroundImage: `url(./svg/clouds.svg), linear-gradient(#00b3f0 0%, rgb(193, 227, 228) 100%)`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <WindowBirds count={8} />
        </div>

        {/* Background Image Container */}
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat relative z-20"
          style={{ 
            backgroundImage: `url(${imagePath})`,
            boxShadow: '0 0 50px rgba(0,0,0,0.1)'
          }}
        >
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  to bottom,
                  rgba(245, 230, 211, 0.2) 0%,
                  transparent 20%,
                  transparent 80%,
                  rgba(183, 150, 107, 0.2) 100%
                )
              `
            }}
          />

          {/* Furnishings with their own exit animations */}
          <motion.div
            initial="visible"
            animate={isExiting ? "exit" : "visible"}
            variants={furnishingVariants}
          >
            <Backpack scale={2.5} />
          </motion.div>

          {/* Table positioned on the left side */}
          <motion.div
            initial="visible"
            animate={isExiting ? "exit" : "visible"}
            variants={furnishingVariants}
          >
            <Table 
              left={`${POSITIONS.table.left}%`}
              bottom={`${POSITIONS.table.bottom}%`}
              width={`${POSITIONS.table.width}%`}
              height={`${POSITIONS.table.height}%`}
              scale={1}
              imagePath="/svg/table.svg"
            />
          </motion.div>

          {/* Door Container */}
          <div 
            className="absolute"
            id="door-container"
            style={{
              left: `${POSITIONS.door.left}%`,
              top: `${POSITIONS.door.top}%`,
              width: `${POSITIONS.door.width}%`,
              height: `${POSITIONS.door.height}%`,
            }}
          >
            <AnimatedDoor />
          </div>

          {/* Debug Position Indicators */}
          {/* {debug && Object.entries(POSITIONS).map(([key, position]) => (
            <div 
              key={key}
              className="absolute border-2 border-dashed"
              style={{
                left: `${position.left}%`,
                top: 'top' in position ? `${position.top}%` : undefined,
                bottom: 'bottom' in position ? `${position.bottom}%` : undefined,
                width: `${position.width}%`,
                height: `${position.height}%`,
                borderColor: 
                  key === 'door' ? 'rgba(255, 0, 0, 0.5)' : 
                  key === 'window' ? 'rgba(0, 255, 0, 0.5)' :
                  'rgba(0, 0, 255, 0.5)',
              }}
            >
              <div className="absolute -top-5 left-0 text-xs bg-black/50 text-white px-1 rounded">
                {key}
              </div>
            </div>
          ))} */}
        </div>
      </motion.div>
    </div>
  );
};

export default RoomBackground;