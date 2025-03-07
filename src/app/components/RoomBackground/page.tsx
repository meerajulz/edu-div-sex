'use client';

import React, { useEffect, useState } from 'react';
import AnimatedDoor from '../AnimatedDoor/page';
import WindowBirds from '../WindowBirds/page';

interface BackgroundProps {
  imagePath: string;
  debug?: boolean;
}

interface Position {
  left: number;
  top: number;
  width: number;
  height: number;
}

const RoomBackground: React.FC<BackgroundProps> = ({ imagePath, debug = false }) => {
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

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
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
      <div 
        className="absolute"
        style={containerStyle}
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
          {debug && Object.entries(POSITIONS).map(([key, position]) => (
            <div 
              key={key}
              className="absolute border-2 border-dashed"
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                width: `${position.width}%`,
                height: `${position.height}%`,
                borderColor: key === 'door' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)',
              }}
            >
              <div className="absolute -top-5 left-0 text-xs bg-black/50 text-white px-1 rounded">
                {key}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomBackground;