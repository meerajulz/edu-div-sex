'use client';

import React, { useEffect, useRef, useState } from 'react';
import FloatingMenu from '../components/FloatingMenu/FloatingMenu';
import {
  markUserInteraction,
  needsInteractionForAudio,
  initAudio,
  cleanupAudio
} from '../utils/audioPlayer';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import JugarButton from '../components/JugarButton/JugarButton';
import { useSession } from 'next-auth/react';
import ContinueButton from '../components/ContinueButton/ContinueButton';

const ActivityMenu = dynamic(() => import('../components/ActivityMenu/ActivityMenu'), { ssr: false });
const Ardilla = dynamic(() => import('../components/ModuleAnimations/Ardilla'), { ssr: false });
const SimpleAlex = dynamic(() => import('../components/ModuleAnimations/SimpleAlex'), { ssr: false });
const SunGif = dynamic(() => import('../components/ModuleAnimations/SunGif'), { ssr: false });
import { SimpleAlexRef } from '../components/ModuleAnimations/SimpleAlex';
import { ACTIVITY_6_CONFIG } from '../components/ActivityMenu/activityConfig';

export default function Actividad6Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showArdilla, setShowArdilla] = useState(false);
  const [showAlex, setShowAlex] = useState(false);
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [showSun, setShowSun] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [userInteractionReceived, setUserInteractionReceived] = useState(false);
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  const [isExiting, setIsExiting] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  const [showContinueButton, setShowContinueButton] = useState(false);
  const simpleAlexRef = useRef<SimpleAlexRef>(null);

  // Debug mode for development
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setBrowserDimensions({ width: vw, height: vh });

      let width = vw;
      let height = width / aspectRatio;

      if (height < vh) {
        height = vh;
        width = height * aspectRatio;
      }

      setContainerDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const [isAnimating, setIsAnimating] = useState(false);

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

useEffect(() => {
  const checkAudio = async () => {
    const needs = needsInteractionForAudio();
    setNeedsInteraction(needs);

    if (!needs) {
      try {
        await initAudio();
      } catch (e) {
        console.warn('Audio auto init failed:', e);
      }
    }
  };

  checkAudio();
}, []);

// Hot key for toggling debug mode in development
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        setShowDebug(prev => !prev);
        console.log(`Debug mode ${!showDebug ? 'enabled' : 'disabled'}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }
}, [showDebug]);

// Log session status changes
useEffect(() => {
  console.log('🔒 Actividad-6: Session status changed:', status);
  console.log('🔒 Actividad-6: Session data:', session);
}, [session, status]);


  const handleVideoEnd = () => {
    cleanupAudio();
    setVideoEnded(true);
    setTimeout(() => setShowArdilla(true), 100);
    setTimeout(() => setShowAlex(true), 1800);
    setTimeout(() => {
      setShowActivityMenu(true);
      setShowSun(true);
      setShowContinueButton(true);
    }, 0);
  };

  const handleSectionSelect = (section: { scenes: string[] }) => {
    console.log('🎯 Section selected:', section);
    console.log('🎯 First scene:', section.scenes[0]);

    // Stop SimpleAlex speech when ActivityMenu label is clicked
    if (simpleAlexRef.current) {
      simpleAlexRef.current.stopSpeech();
    }

    setShowContinueButton(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    cleanupAudio();
    setIsExiting(true);

    // Navigate to first scene of the section
    const firstScene = section.scenes[0];
    if (firstScene) {
      console.log('🎯 Setting pending navigation to:', firstScene);
      setPendingNavigation(firstScene);
    }

    if (bgMusicRef.current) {
      try {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      } catch (e) {
        console.warn('Failed to stop background music:', e);
      }
    }
  };

  const handleExitComplete = () => {
    console.log('🎯 Exit animation complete, navigating to:', pendingNavigation);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleJugarClick = () => {
    console.log('Start Activity 6');
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    markUserInteraction();
    setUserInteractionReceived(true);
    setNeedsInteraction(false);

    // Start background music
    const music = new Audio('/audio/Softy.mp3');
    music.loop = true;
    music.volume = 0.4;
    music.play().catch(console.warn);
    bgMusicRef.current = music;

    setCanPlayVideo(true);
  };

  const exitVariants = {
    exit: {
      y: '120vh',
      opacity: 0,
      transition: { duration: 1.5, ease: 'easeInOut' }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Only show animated background and button BEFORE video */}
      {!videoEnded && (!canPlayVideo || needsInteraction) && (
        <>
          <div className="absolute inset-0 z-50 bg-gradient-to-b from-blue-400 via-indigo-300 to-purple-300" />

          {/* Floating bubbles */}
          <div className="absolute inset-0 z-50">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: Math.random() * 60 + 20,
                  height: Math.random() * 60 + 20,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <motion.div animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}} transition={{ duration: 0.8, ease: 'easeInOut' }}>
            <JugarButton text='Abuso' onClick={handleJugarClick} />
            </motion.div>
          </div>
        </>
      )}

      {/* Floating menu */}
      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {/* Continue where you left off button */}
      <ContinueButton
        showWhen={showContinueButton}
        onNavigate={(url) => {
          setShowContinueButton(false);
          cleanupAudio();
          setIsExiting(true);
          setPendingNavigation(url);
        }}
        onHide={() => setShowContinueButton(false)}
      />

      {/* Blue sky background during exit animation */}
      {isExiting && (
        <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200 z-0" />
      )}

      <motion.div
        className="absolute inset-0"
        variants={exitVariants}
        animate={isExiting ? 'exit' : 'initial'}
        onAnimationComplete={isExiting ? handleExitComplete : undefined}
      >
        <div className="absolute" style={containerStyle}>
          {!videoEnded && canPlayVideo ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
              src="/video/INTRO_ACTIVIDAD-1.mp4"
              autoPlay
              playsInline
              muted={needsInteraction && !userInteractionReceived}
              onEnded={handleVideoEnd}
              onError={(e) => {
                console.error('Video failed to load:', e);
                console.log('Skipping video and showing activity menu directly');
                handleVideoEnd();
              }}
            />
          ) : (
            <Image
              src="/image/INTRO_MODULO-1.jpg"
              width={containerDimensions.width}
              height={containerDimensions.height}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}
        </div>

        {videoEnded && (
          <>
            {showArdilla && (
              <motion.div
                className="absolute bottom-6 left-6 z-40 w-[260px] h-[260px]"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              >
                <Ardilla isVisible={true} bunnyShown={true} zIndex={50} browserWidth={1200} />
              </motion.div>
            )}

            {showAlex && (
              <motion.div
                className="absolute bottom-[-30%] left-[-40%] z-40 w-[50%] h-full pointer-events-none"
                animate={{ x: 0, opacity: 1 }}
                initial={{ x: '-100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              >
                <SimpleAlex ref={simpleAlexRef} isVisible={true} />
              </motion.div>
            )}

            {showActivityMenu && (
              <div className="w-full px-6 pb-6 z-30 flex justify-center">
                <ActivityMenu
                  isVisible={true}
                  config={ACTIVITY_6_CONFIG}
                  onSectionClick={handleSectionSelect}
                />
              </div>
            )}

            {showSun && (
              <div className="absolute top-0 left-0 z-30 w-full h-[300px]">
                <SunGif />
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Debug panel */}
      {showDebug && (
        <div className="fixed bottom-0 left-0 bg-black/70 text-white p-2 max-w-xs max-h-40 overflow-auto text-xs z-[1000]">
          <div className="font-bold mb-1">Actividad-6 Debug</div>
          <div>👤 User: {session?.user?.username || session?.user?.email || 'none'}</div>
          <div>🏷️ Role: {(session?.user as { role?: string })?.role || 'none'}</div>
          <div>⚧️ Sex: {(session?.user as { sex?: string })?.sex || 'none'}</div>
          <div>📊 Status: {status}</div>
          <div>🎬 Video Ended: {videoEnded ? 'yes' : 'no'}</div>
          <div>🔊 Can Play Video: {canPlayVideo ? 'yes' : 'no'}</div>
          <div>👆 Needs Interaction: {needsInteraction ? 'yes' : 'no'}</div>
          <div className="text-yellow-300">Press Ctrl+D to toggle</div>
        </div>
      )}
    </div>
  );
}