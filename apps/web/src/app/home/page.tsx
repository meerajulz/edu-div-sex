'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedSky from '../components/AnimatedSky/page';
import OrbitalCarousel from '../components/OrbitalCarousel/index';
import FloatingMenu from '../components/FloatingMenu/FloatingMenu';
import VideoBackground from '../components/VideoBackground';
import AudioPreloader from '../components/AudioPreloader/AudioPreloader';
import { initAudio } from '../utils/audioHandler';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { getLastActivityUrl } from '../hooks/useActivityTracking';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isExiting, setIsExiting] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [videoHasPlayed, setVideoHasPlayed] = useState(false); // Changed back to false - only show after video ends

  const [showWelcome, setShowWelcome] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioPreloadProgress, setAudioPreloadProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastActivityUrl, setLastActivityUrl] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showContinueOption, setShowContinueOption] = useState(false);

  // For development only
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');

  const logDebug = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
    console.log(message);
  };

  // Clear any stale localStorage flags on home page load
  useEffect(() => {
    // Clear localStorage flag after a delay to ensure OrbitalCarousel has processed it
    const clearTimer = setTimeout(() => {
      const flag = localStorage.getItem('completedActivityId');
      if (flag) {
        console.log('🧹 Clearing stale completedActivityId flag on home page:', flag);
        localStorage.removeItem('completedActivityId');
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(clearTimer);
  }, []);

  // Handle session status changes and role-based redirects
  useEffect(() => {
    logDebug(`[HOME] Session status: ${status}`);
    console.log('🏠 [TERMINAL] Home page - Session status:', status, 'Session exists:', !!session, 'User:', session?.user?.email, 'Role:', session?.user?.role);
    
    if (status === 'authenticated' && session?.user) {
      logDebug(`User logged in: ${session.user.email || session.user.username} (Role: ${session.user.role})`);
      console.log('✅ [TERMINAL] Home page - Session found for user:', session.user.email, 'Role:', session.user.role);
      
      console.log('🎓 [TERMINAL] Home page - User authenticated, staying on home page');
      
      // Check if user has a saved activity to continue
      getLastActivityUrl().then(result => {
        if (result && result.showButton && result.lastUrl) {
          setLastActivityUrl(result.lastUrl);
          setShowContinueOption(true);
          logDebug(`Found last activity: ${result.lastUrl}`);
        }
      }).catch(error => {
        console.warn('⚠️ Failed to get last activity URL:', error);
      });
    } else if (status === 'unauthenticated') {
      console.log('❌ [TERMINAL] Home page - No session found, redirecting to login');
      logDebug('User not authenticated, redirecting to login page');
      router.push('/auth/login');
    }
  }, [status, session, router]);

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

  const handleVideoEnd = () => {
    logDebug("Video has ended");
    setVideoHasPlayed(true);
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

  // Hot key for toggling debug mode in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'd' && e.ctrlKey) {
          setShowDebug(prev => !prev);
          logDebug(`Debug mode ${!showDebug ? 'enabled' : 'disabled'}`);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDebug]);

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-purple-300">
        <div className="text-white text-xl mb-4">Loading session...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Redirect unauthenticated users - don't show home content
  if (status === 'unauthenticated') {
    return (
      <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-purple-300">
        <div className="text-white text-xl mb-4">Redirecting to login...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
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
            <VideoBackground 
              videoPath='/video/HOME.mp4'
              backgroundImagePath='/svg/HOME_1.svg'
              isExiting={isExiting}
              onExitComplete={handleExitComplete}
              onVideoEnd={handleVideoEnd}
              debug={showDebug}
            />
          </div>

          {isExiting && (
            <div className="absolute inset-0 z-5 bg-gradient-to-b from-blue-300 to-blue-100">
              <AnimatedSky />
            </div>
          )}

          {/* Logo in top-left */}
          <div className="absolute top-4 left-4 z-50">
            <Image
              src="/svg/logo/logo.svg"
              alt="App Logo"
              width={120}
              height={40}
              className="w-auto h-auto"
            />
          </div>
          {/* Dashboard link for non-student users */}
          {session?.user?.role && session.user.role !== 'student' && (
            <div className="absolute top-40 left-4  z-50">
              <Link 
                href="/dashboard"
                className="bg-white/90 backdrop-blur-sm text-blue-600 font-semibold px-6 py-3 rounded-full border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Panel de Control
              </Link>
            </div>
          )}



          <div className='absolute top-0 left-0 right-0 z-30 pointer-events-none'>
            <div className='flex justify-center'>
              <div className='pointer-events-auto'>
                <OrbitalCarousel 
                  onSelectActivity={handleSelectActivity} 
                />
              </div>
            </div>
            
            {/* Arrow indicator - show only after video has played */}
            {videoHasPlayed && !isExiting && (
              <motion.div
                className="absolute  -translate-x-1/2 pointer-events-none"
                style={{
                  top: '350px', // Adjust based on your carousel height
                  left: '52%',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -10, 0]
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  y: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  }
                }}
              >
                <svg
                  className="text-pink-500 drop-shadow-lg"
                  width="60"
                  height="60"
                  viewBox="0 0 64 64"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: 'rotate(180deg)',
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                  }}
                >
                  <path d="M32 4 C30 4 28 6 28 8 L28 40 L16 28 C14 26 10 26 8 28 C6 30 6 34 8 36 L30 58 C31 59 33 59 34 58 L56 36 C58 34 58 30 56 28 C54 26 50 26 48 28 L36 40 L36 8 C36 6 34 4 32 4 Z" />
                </svg>
                
                <motion.span
                  className="absolute whitespace-nowrap text-pink-600 font-bold text-sm top-15 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                >
                  ¡JUGAR!
                </motion.span>
              </motion.div>
            )}
          </div>

          <div className='absolute top-0 right-0 z-50 flex'>
            <FloatingMenu />
          </div>

          {/* Door overlay - ensure it's on top of everything */}
          {!isExiting && !videoHasPlayed && (
            <div 
              className="absolute cursor-pointer z-[10001]"
              style={{
                left: '30.1%',
                top: '33%', 
                width: '10.5%',
                height: '35%'
              }}
              onClick={() => {
                // Find video element and play it
                const video = document.querySelector('video');
                if (video) {
                  video.play().catch(() => {
                    console.log('Video play failed');
                  });
                }
              }}
            />
          )}

          {/* Continue where you left off button */}
          {/* {showContinueOption && lastActivityUrl && (
            <motion.div
              className="absolute bottom-[30%] left-10 right-0 z-[100] flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => {
                  logDebug(`Continuing from last activity: ${lastActivityUrl}`);
                  router.push(lastActivityUrl);
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continuar donde lo dejaste
              </button>
            </motion.div>
          )} */}

          {showDebug && (
            <div className="fixed bottom-0 left-0 bg-black/70 text-white p-2 max-w-xs max-h-40 overflow-auto text-xs z-[10]">
              <div>isExiting: {isExiting ? 'true' : 'false'}</div>
              <div>pendingNav: {pendingNavigation || 'none'}</div>
              <div>audioInit: {audioInitialized ? 'true' : 'false'}</div>
              <div>audioProgress: {audioPreloadProgress}%</div>
              <div>videoPlayed: {videoHasPlayed ? 'true' : 'false'}</div>
              <div className="border-t border-white/30 mt-1 pt-1">
                <div>🔐 Session: {status}</div>
                <div>👤 User: {session?.user?.username || session?.user?.email || 'loading...'}</div>
                <div>🏷️ Role: {session?.user?.role || 'none'}</div>
                <div>⚧️ Sex: {session?.user?.sex || 'none'}</div>
              </div>
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
    </>
  );
};

export default Dashboard;