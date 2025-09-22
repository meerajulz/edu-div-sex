'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import LogoComponent from '../../components/LogoComponent/LogoComponent';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import Cris from '../../components/Cris/Cris';
import JuegoUno from './JuegoUno/JuegoUno';
import { useActivityTracking } from '../../hooks/useActivityTracking';

import Image from 'next/image';

export default function Scene1Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Track current activity URL for continue feature
  useActivityTracking();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  const [isReplayingVideo, setIsReplayingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCris, setShowCris] = useState(true);
  const [crisPaused, setCrisPaused] = useState(false);
  const [showJuegoUno, setShowJuegoUno] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // Debug mode for development
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');

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

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  useEffect(() => {
    setIsHydrated(true);
    // Check if user has watched the video before
    const hasWatched = localStorage.getItem('scene1-video-watched');
    if (hasWatched === 'true') {
      setHasWatchedVideo(true);
    }
  }, []);

  // Session debugging
  useEffect(() => {
    console.log('🔒 Scene1: Session status changed:', status);
    console.log('🔒 Scene1: Session data:', session);
  }, [session, status]);

  // Hot key for toggling debug mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'd' && e.ctrlKey) {
          setShowDebug(prev => !prev);
          console.log(`Scene1 Debug mode ${!showDebug ? 'enabled' : 'disabled'}`);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDebug]);

  // const handleBackClick = () => {
  //   router.push('/actividad-1');
  // };
  
  const handleJugarClick = () => {
    setShowVideo(true);
  };

  const handleReplayVideo = () => {
    console.log('🔄 Replay video clicked - pausing Cris');
    setIsReplayingVideo(true);
    setVideoEnded(false);
    setShowVideo(true);
    setCrisPaused(true); // Pause Cris during video replay
    console.log('🔇 Cris should now be paused');
    // Reset video to beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

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

  const handleButtonClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      handleJugarClick();
    }, 800);
  };


  const handleVideoEnd = () => {
    console.log('🎬 Video ended - resuming Cris');
    setVideoEnded(true);
    setIsReplayingVideo(false);
    setHasWatchedVideo(true);
    setCrisPaused(false); // Resume Cris after video ends
    console.log('🗣️ Cris should now be resumed');
    // Save to localStorage so the button shows on future visits
    localStorage.setItem('scene1-video-watched', 'true');
  };

  const handleGlobeButtonClick = () => {
    console.log('Globe button clicked - ready for next page navigation');
    setShowJuegoUno(true);
    // setShowCris(false);
  };

  const handleGameComplete = () => {
    setShowJuegoUno(false);
    setTimeout(() => {
      setShowCongratulations(true);
    }, 500);
  };

  const handleGoToActivityMenu = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    setTimeout(() => {
      setIsAnimating(false);
      router.push('/actividad-1');
    }, 800);
  };

  const pageVariants = {
    initial: { y: '100vh', opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeOut' }
    },
    exit: {
      y: '-100vh',
      opacity: 0,
      transition: { duration: 0.8, ease: 'easeIn' }
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200" />
      <div className="absolute inset-0 z-1">
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
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
       
      </div>
      <div className="">
         <LogoComponent configKey="actividad-1-scene1" />
      </div>

      {!showVideo ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          {/* Main Jugar Button - always show first - opens video */}
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text="Jugar" onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>
{/* 
          <motion.button
            className="mt-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackClick}
          >
            ← Volver a Actividades
          </motion.button> */}
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {/* Video layer */}
          {!videoEnded && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDA_1-ESCENA-1.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          )}

          {/* Background image - only show when video has ended */}
          {videoEnded && (
            <Image
              width={containerDimensions.width}
              height={containerDimensions.height}
              src="/image/escena_1/bg.jpg"
              alt="Escena 1 Background"
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}

          {/* UI Elements - only show when video has ended */}
          {videoEnded && (
            <div className="absolute inset-0">
              {/* JugarButton positioned below the replay button */}
              <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-30">
                <JugarButton
                  text="Jugar"
                  onClick={handleGlobeButtonClick}
                />
              </div>

              {/* Volver a ver Button - positioned on top of Cris head */}
              {hasWatchedVideo && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40">
                  <VolverAVerButton onClick={handleReplayVideo} />
                </div>
              )}
            </div>
          )}

          {/* Cris - always present after first video (stays mounted) */}
          {hasWatchedVideo && (
            <Cris isVisible={showCris && videoEnded} isPaused={crisPaused} />
          )}

          {/* Debug info - always present for debugging */}
          {hasWatchedVideo && (
            <div className="absolute top-10 right-10 bg-black/70 text-white p-2 text-xs z-50">
              crisPaused: {crisPaused.toString()}
            </div>
          )}

          {/* Game component */}
          <JuegoUno
            onClose={() => setShowJuegoUno(false)}
            onComplete={handleGameComplete}
            isVisible={showJuegoUno} />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/10 to-transparent z-5" />

      {/* Congratulations Overlay */}
      {showCongratulations && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              ¡Felicidades!
            </h2>
            <p className="text-white text-lg mb-6">
              Has completado esta sección de la actividad
            </p>
            <motion.button
              onClick={handleGoToActivityMenu}
              disabled={isAnimating}
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continuar al menú
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Debug panel */}
      {showDebug && (
        <div className="fixed bottom-0 right-0 bg-black/70 text-white p-2 max-w-xs max-h-40 overflow-auto text-xs z-[1000]">
          <div className="font-bold mb-1">Scene1 Debug</div>
          <div>👤 User: {session?.user?.username || session?.user?.email || 'none'}</div>
          <div>🏷️ Role: {session?.user?.role || 'none'}</div>
          <div>⚧️ Sex: {session?.user?.sex || 'none'}</div>
          <div>📊 Status: {status}</div>
          <div>🎬 Video Ended: {videoEnded ? 'yes' : 'no'}</div>
          <div>🎮 Show Game: {showJuegoUno ? 'yes' : 'no'}</div>
          <div>💧 Hydrated: {isHydrated ? 'yes' : 'no'}</div>
          <div className="text-yellow-300">Press Ctrl+D to toggle</div>
        </div>
      )}
    </motion.div>
  );
}


