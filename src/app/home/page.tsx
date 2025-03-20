// Modify Dashboard.tsx to include audio initialization
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RootLayout from '../layout';
import AnimatedSky from '../components/AnimatedSky/page';
import OrbitalCarousel from '../components/OrbitalCarousel/index';
import FloatingMenu from '../components/FloatingMenu/FloatingMenu';
import RoomBackground from '../components/RoomBackground/RoomBackground';
import AudioPreloader from '../components/AudioPreloader/AudioPreloader';
import { initAudio } from '../utils/audioHandler';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Audio initialization states
  const [showWelcome, setShowWelcome] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioPreloadProgress, setAudioPreloadProgress] = useState(0);

  // Debug log function
  const logDebug = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
    console.log(message);
  };

  // Handle activity selection
  const handleSelectActivity = (url: string) => {
    logDebug(`Activity selected: ${url}`);
    setIsExiting(true);
    logDebug("Exit animation triggered");
    setPendingNavigation(url);
  };

  // Callback for when exit animation completes
  const handleExitComplete = () => {
    logDebug("Exit animation completed");
    if (pendingNavigation) {
      logDebug(`Navigating to: ${pendingNavigation}`);
      router.push(pendingNavigation);
    }
  };

  // Initialize audio on start button click
  const handleStartClick = async () => {
    logDebug("Start button clicked, initializing audio");
    
    try {
      // Attempt to initialize audio, but don't let it block UI transition
      const initialized = await Promise.race([
        initAudio(),
        // Timeout after 2 seconds to ensure we don't get stuck
        new Promise(resolve => setTimeout(() => resolve(false), 2000))
      ]);
      
      setAudioInitialized(initialized as boolean);
      logDebug(`Audio initialized: ${initialized}`);
    } catch (error) {
      logDebug(`Audio initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Continue anyway, don't block UI
    } finally {
      // Ensure this always runs, even if there's an error
      logDebug("Hiding welcome screen");
      setShowWelcome(false);
    }
  };

  return (
    <RootLayout>
      {showWelcome ? (
       <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-500">
       <button 
         onClick={() => handleStartClick()}
         className="bg-white text-blue-500 font-bold py-4 px-8 rounded-full text-lg"
       >
         Start
       </button>
     </div>
      ) : (
        <div className='relative min-h-screen'>
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
              <AnimatedSky />
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
              <div>audioInit: {audioInitialized ? 'true' : 'false'}</div>
              <div>audioProgress: {audioPreloadProgress}%</div>
              {debugInfo.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Audio preloader component */}
      <AudioPreloader 
        isInitialized={audioInitialized}
        onProgress={setAudioPreloadProgress}
      />
    </RootLayout>
  );
};

export default Dashboard;