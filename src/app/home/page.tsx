'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RootLayout from '../layout';
import AnimatedSky from '../components/AnimatedSky/page';
import BirdAnimation from '../components/BirdAnimation/page';
import BirdsFlying from '../components/BirdsFlying/page';
import BirdsSoaring from '../components/BirdsSoaring/page';
import OrbitalCarousel from '../components/OrbitalCarousel/page'; // Make sure this path is correct
import FloatingMenu from '../components/FloatingMenu/page';
import RoomBackground from '../components/RoomBackground/page';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Debug log function
  const logDebug = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
    console.log(message);
  };

  // Handle activity selection
  const handleSelectActivity = (url: string) => {
    logDebug(`Activity selected: ${url}`);
    
    // Start the exit animation
    setIsExiting(true);
    logDebug("Exit animation triggered");
    
    // Store the URL to navigate to after animation completes
    setPendingNavigation(url);
  };

  // Callback for when exit animation completes
  const handleExitComplete = () => {
    logDebug("Exit animation completed");
    
    if (pendingNavigation) {
      logDebug(`Navigating to: ${pendingNavigation}`);
      // Navigate to the selected activity
      router.push(pendingNavigation);
    }
  };

  // Add listener for animation events
  useEffect(() => {
    const handleAnimationStart = () => {
      logDebug("Animation started");
    };

    const handleAnimationEnd = () => {
      logDebug("Animation ended");
    };

    document.addEventListener('animationstart', handleAnimationStart);
    document.addEventListener('animationend', handleAnimationEnd);

    return () => {
      document.removeEventListener('animationstart', handleAnimationStart);
      document.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  return (
    <RootLayout>
      <div className='relative min-h-screen'>
        {/* Birds in the background */}
        <div className="absolute inset-0 z-0">
          <BirdsFlying count={1} />
        </div>

        {/* Room background with exit animation */}
        <div className='absolute inset-0 z-10'>
          <RoomBackground 
            imagePath='/svg/HOME.svg' 
            isExiting={isExiting}
            onExitComplete={handleExitComplete}
          />
        </div>

        {/* Sky background that will be visible after room exits */}
        {isExiting && (
          <div className="absolute inset-0 z-5 bg-gradient-to-b from-blue-300 to-blue-100">
            {/* Add additional sky elements if needed */}
            <AnimatedSky />
            <BirdsSoaring count={5} />
          </div>
        )}

        {/* Orbital Carousel with activity selection callback */}
        <div className='absolute top-0 left-0 right-0 z-50 flex justify-center'>
          <OrbitalCarousel onSelectActivity={handleSelectActivity} />
        </div>

        {/* Floating menu */}
        <div className='absolute top-0 right-0 z-50 flex'>
          <FloatingMenu />
        </div>

        {/* Debug overlay - only visible during development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-0 left-0 bg-black/70 text-white p-2 max-w-xs max-h-40 overflow-auto text-xs z-[1000]">
            <div>isExiting: {isExiting ? 'true' : 'false'}</div>
            <div>pendingNav: {pendingNavigation || 'none'}</div>
            {debugInfo.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        )}
      </div>
    </RootLayout>
  );
};

export default Dashboard;