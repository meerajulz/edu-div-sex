'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoUnoActividad4 from './JuegoUnoActividad4/JuegoUnoActividad4';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Actividad4Scene1Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
//const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [allVideosEnded, setAllVideosEnded] = useState(false);
  const [showJuegoUno, setShowJuegoUno] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hasWatchedVideos, setHasWatchedVideos] = useState(false);
  
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // Video sequence
  const videos = [
    '/video/ACTIVIDAD-4-ESCENA-1_1.mp4',
    '/video/ACTIVIDAD-4-ESCENA-1-TUTORIAL.mp4',
    '/video/ACTIVIDAD-4-ESCENA-1-TUTORIAL_1.mp4'
  ];

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
    if (currentVideoIndex < videos.length - 1) {
      // Move to next video
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      // All videos have ended
      setAllVideosEnded(true);
      setHasWatchedVideos(true);
    }
  };

  const handleReplayVideos = () => {
    setCurrentVideoIndex(0);
    setAllVideosEnded(false);
    setShowVideo(true);
  };

  const handleOpenJuegoUno = () => {
    playSound();
    setShowJuegoUno(true);
  };

  const handleCloseJuegoUno = () => {
    setShowJuegoUno(false);
    // Don't reset game completion status, allow reopening
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setShowJuegoUno(false); // Close the game modal
    // Show congratulations after a short delay
    setTimeout(() => {
      setShowCongratulations(true);
    }, 500);
  };

  const handleContinue = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    console.log('🎯 Actividad4-Scene1: Game completed, saving progress and returning to menu');

    const progressSaved = await saveProgress('actividad-4', 'scene1', 'completed', 100, {
      videos_watched: allVideosEnded,
      game_completed: gameCompleted,
      completed_at: new Date().toISOString()
    });

    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad4-Scene1: Progress saved successfully');
      } else {
        console.error('❌ Actividad4-Scene1: Failed to save progress, but continuing');
      }
      router.push('/actividad-4');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient - Light blue tones for doctor scene */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-blue-100 to-cyan-200 z-0" />

      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
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

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      <div className="">
        <LogoComponent configKey="actividad-4-scene1" />
      </div>

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='Jugar' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!allVideosEnded ? (
            <video
              ref={videoRef}
              key={currentVideoIndex} // Force re-render when video changes
              className="absolute inset-0 w-full h-full object-cover z-20"
              src={videos[currentVideoIndex]}
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!showJuegoUno && (
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    {!gameCompleted ? (
                      <JugarButton text='Juego Ayuda a Cris o Dani en su higiene.' onClick={handleOpenJuegoUno} disabled={isAnimating} />
                    ) : !showCongratulations ? (
                      <JugarButton
                        text="Volver al menú"
                        onClick={handleContinue}
                        disabled={isAnimating}
                      />
                    ) : null}
                  </motion.div>

                  {/* Volver a ver Button - positioned under main button */}
                  {hasWatchedVideos && !gameCompleted && (
                    <VolverAVerButton onClick={handleReplayVideos} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* JuegoUnoActividad4 Game Modal */}
      <JuegoUnoActividad4
        isVisible={showJuegoUno}
        onClose={handleCloseJuegoUno}
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
              onClick={handleContinue}
              disabled={isAnimating}
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volver al menú
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}