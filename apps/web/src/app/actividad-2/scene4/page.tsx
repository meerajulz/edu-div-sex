'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoCuatroActividad2 from './JuegoCuatroActividad2/JuegoCuatroActividad2';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Scene4Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showJuegoCuatro, setShowJuegoCuatro] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleJugarClick = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setHasWatchedVideo(true);
  };

  const handleReplayVideo = () => {
    setVideoEnded(false);
    setShowVideo(true);
    // Reset video to beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

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

  const handleOpenJuegoCuatro = () => {
    playSound();
    setShowJuegoCuatro(true);
  };

  const handleCloseJuegoCuatro = () => {
    setShowJuegoCuatro(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setTimeout(() => {
      setShowCongratulations(true);
    }, 1000);
  };

  const handleGoToActivityMenu = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    console.log('🎯 Scene4: Game completed, saving progress and returning to activity menu');
    
    const progressSaved = await saveProgress('actividad-2', 'scene4', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: gameCompleted,
      completed_at: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Scene4: Progress saved successfully');
      } else {
        console.error('❌ Scene4: Failed to save progress, but continuing');
      }
      router.push('/actividad-2');
    }, 800);
  };

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-300 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-400 via-blue-300 to-purple-300" />
      
      {!showJuegoCuatro && (
        <div className="absolute inset-0 z-10">
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
      )}

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>
      
      <div className="">
        <LogoComponent configKey="actividad-2-scene1" />
      </div>

      {/* Background for JuegoCuatro */}
      {showJuegoCuatro && (
        <div
          className="fixed inset-0 z-30 bg-cover bg-center"
          style={{ backgroundImage: "url('/image/actividad_2/bg.png')" }}
        />
      )}

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='Jugar' onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
              src="/video/ACTIVIDAD-2-ESCENA-4.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  {!gameCompleted ? (
                    <JugarButton text='Jugar ¿Qué hacer si alguien no respeta tu intimidad?' onClick={handleOpenJuegoCuatro} disabled={isAnimating} />
                  ) : !showCongratulations ? (
                    <div className="flex flex-col items-center space-y-4">
                      <JugarButton
                        onClick={handleGoToActivityMenu}
                        disabled={isAnimating}
                        text="Continuar..."
                      />
                    </div>
                  ) : null}
                </motion.div>

                {/* Volver a ver Button - positioned under main button */}
                {hasWatchedVideo && !gameCompleted && (
                  <VolverAVerButton onClick={handleReplayVideo} />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* JuegoCuatro Game Modal */}
      <JuegoCuatroActividad2 
        isOpen={showJuegoCuatro}
        onClose={handleCloseJuegoCuatro}
        onGameComplete={handleGameComplete}
      />

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
    </motion.div>
  );
}