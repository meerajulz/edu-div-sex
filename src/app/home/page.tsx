// Updated Dashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
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

  const [showWelcome, setShowWelcome] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioPreloadProgress, setAudioPreloadProgress] = useState(0);

  const logDebug = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
    console.log(message);
  };

  const handleSelectActivity = (url: string) => {
    logDebug(`Activity selected: ${url}`);
    setIsExiting(true);
    logDebug("Exit animation triggered");
    setPendingNavigation(url);
  };

  const handleExitComplete = () => {
    logDebug("Exit animation completed");
    if (pendingNavigation) {
      logDebug(`Navigating to: ${pendingNavigation}`);
      router.push(pendingNavigation);
    }
  };

  const handleStartClick = async () => {
    logDebug("Start button clicked, initializing audio");
    try {
      const initialized = await initAudio();
      setAudioInitialized(initialized);
      logDebug(`Audio initialized: ${initialized}`);
    } catch (error) {
      logDebug(`Audio initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (audioPreloadProgress === 100) {
      logDebug("Audio preloading complete, hiding welcome screen");
      setShowWelcome(false);
    }
  }, [audioPreloadProgress]);

  return (
    <RootLayout>
      {showWelcome ? (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-blue-500 text-white">
          {!audioInitialized ? (
            <button 
              onClick={handleStartClick}
              className="bg-white text-blue-500 font-bold py-4 px-8 rounded-full text-lg"
            >
              Start
            </button>
          ) : (
            <>
              <p className="text-lg mb-4">Loading audio files...</p>
              <div className="w-64 h-4 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${audioPreloadProgress}%` }}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className='relative min-h-screen'>
          <div className='absolute inset-0 z-10'>
            <RoomBackground 
              imagePath='/svg/HOME.svg' 
              isExiting={isExiting}
              onExitComplete={handleExitComplete}
            />
          </div>

          {isExiting && (
            <div className="absolute inset-0 z-5 bg-gradient-to-b from-blue-300 to-blue-100">
              <AnimatedSky />
            </div>
          )}

          <div className='absolute top-0 left-0 right-0 z-50 flex justify-center'>
            <OrbitalCarousel onSelectActivity={handleSelectActivity} />
          </div>

          <div className='absolute top-0 right-0 z-50 flex'>
            <FloatingMenu />
          </div>

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

      <AudioPreloader 
        isInitialized={audioInitialized}
        onProgress={setAudioPreloadProgress}
      />
    </RootLayout>
  );
};

export default Dashboard;