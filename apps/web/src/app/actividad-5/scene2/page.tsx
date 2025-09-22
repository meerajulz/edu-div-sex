'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoCuatroActividad5 from './JuegoCuatroActividad5/JuegoCuatroActividad5';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Actividad5Scene2Page() {
 
  // Track current activity URL for continue feature
  useActivityTracking();
// const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  
  // Game states
  const [showJuegoCuatro, setShowJuegoCuatro] = useState(false);
  const [juegoCuatroCompleted, setJuegoCuatroCompleted] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  
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

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
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

  const handleJugarClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      setShowVideo(true);
    }, 800);
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

  // Juego Cuatro handlers
  const handleOpenJuegoCuatro = () => {
    playSound();
    setShowJuegoCuatro(true);
  };

  const handleCloseJuegoCuatro = () => {
    setShowJuegoCuatro(false);
  };

  const handleJuegoCuatroComplete = () => {
    setJuegoCuatroCompleted(true);
    setShowJuegoCuatro(false);
  };

  // Continue to next page
  const handleContinueToNextPage = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    console.log('🎉 Actividad5-Scene2: Final scene completed, saving progress for completed activity');
    
    const progressSaved = await saveProgress('actividad-5', 'scene2', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: juegoCuatroCompleted,
      activity_completed: true,
      completed_at: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad5-Scene2: Activity 5 completed successfully!');
      } else {
        console.error('❌ Actividad5-Scene2: Failed to save progress, but continuing');
      }
      // Set flag that activity was just completed for auto-rotation
      localStorage.setItem('completedActivityId', '5');
      router.push('/home');
    }, 800);
  };

  // Determine current button state
  const getCurrentButton = () => {
    if (!juegoCuatroCompleted) {
      return (
        <div className="flex flex-col items-center gap-6">
          <JugarButton
            onClick={handleOpenJuegoCuatro}
            disabled={isAnimating}
            text="JUEGO: ¿Cómo ligamos?"
          />

          {/* Volver a ver Button - positioned under main button */}
          {hasWatchedVideo && (
            <VolverAVerButton onClick={handleReplayVideo} />
          )}
        </div>
      );
    } else {
      // Game completed - show completion message
      return (

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
            <motion.div
                className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 shadow-2xl mb-8"
                initial={{ rotate: -5 }}
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    ¡Felicidades!
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 font-semibold">
                    Haz completado la aventura de Noa.
                </p>
            </motion.div>
            <motion.div
                className="inline-block"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: 'center center' }}
            >
                <div className="whitespace-nowrap">
                    <JugarButton text="IR A LA PROXIMA AVENTURA!" onClick={handleContinueToNextPage} disabled={isAnimating} />
                </div>
            </motion.div>
        </div>
      );
    }
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient - Pink theme for relationships */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 z-0" />

      {/* Floating particles animation */}
      <div className="absolute inset-0 z-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 80 + 30,
              height: Math.random() * 80 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>


      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>
              <div className="">
                <LogoComponent configKey="actividad-5-scene1" />
              </div>
                        

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text="¿Cómo ligamos?" onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDAD_5_ESCENA_2.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.div
                animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {getCurrentButton()}
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Game Modal */}
      <JuegoCuatroActividad5 
        isVisible={showJuegoCuatro} 
        onClose={handleCloseJuegoCuatro}
        onGameComplete={handleJuegoCuatroComplete}
      />
    </motion.div>
  );
}