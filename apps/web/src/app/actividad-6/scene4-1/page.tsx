'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoSeisActividad6 from '../scene4/JuegoSeisActividad6/JuegoSeisActividad6';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Actividad6Scene4_1Page() {

  // Track current activity URL for continue feature
  useActivityTracking();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  useActivityProtection();
  const finalVideoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showJuegoSeis, setShowJuegoSeis] = useState(false);
  const [juegoSeisCompleted, setJuegoSeisCompleted] = useState(false);
  const [showFinalVideo, setShowFinalVideo] = useState(false);
  const [finalVideoEnded, setFinalVideoEnded] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

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

  const handleOpenJuegoSeis = () => {
    if (isAnimating) return;
    playSound();
    setShowJuegoSeis(true);
  };

  const handleCloseJuegoSeis = () => {
    setShowJuegoSeis(false);
  };

  const handleGameComplete = () => {
    setJuegoSeisCompleted(true);
    setShowJuegoSeis(false);
    // Show final video after game completion
    setTimeout(() => {
      setShowFinalVideo(true);
    }, 500);
  };

  const handleFinalVideoEnd = () => {
    setFinalVideoEnded(true);
    // Show congratulations after final video
    setTimeout(() => {
      setShowCongratulations(true);
    }, 500);
  };

  // Handle final completion and go to home
  const handleGoToHome = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    console.log('🎯 Actividad6-Scene4-1: Final scene completed, saving progress and going to home');

    const progressSaved = await saveProgress('actividad-6', 'scene4-1', 'completed', 100, {
      juego6_completed: juegoSeisCompleted,
      final_video_watched: finalVideoEnded,
      activity_completed: true,
      completed_at: new Date().toISOString()
    });

    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad6-Scene4-1: Activity 6 completed successfully!');
      } else {
        console.error('❌ Actividad6-Scene4-1: Failed to save progress, but continuing');
      }
      // Set flag that activity was just completed for auto-rotation
      localStorage.setItem('completedActivityId', '6');
      router.push('/home');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Colorful Background gradient - Final scene theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 z-0" />

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

      {/* Additional colorful elements */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          >
            <div className="w-4 h-4 bg-white/30 rounded-full" />
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>
      <div className="">
        <LogoComponent configKey="actividad-6-scene4-1" />
      </div>

      {!showFinalVideo && !showCongratulations ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton
              text='Juego ¿Qué hacer si sucede?'
              onClick={handleOpenJuegoSeis}
              disabled={isAnimating}
            />
          </motion.div>
        </div>
      ) : showFinalVideo && !finalVideoEnded ? (
        <div className="absolute" style={containerStyle}>
          <video
            ref={finalVideoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDA_6-ESCENA_5-FINAL.mp4"
            autoPlay
            playsInline
            onEnded={handleFinalVideoEnd}
          />
        </div>
      ) : null}

      {/* JuegoSeisActividad6 Game Modal */}
      <JuegoSeisActividad6
        isVisible={showJuegoSeis}
        onClose={handleCloseJuegoSeis}
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
              Has completado todas las aventuras
            </p>
            <motion.button
              onClick={handleGoToHome}
              disabled={isAnimating}
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ir a la próxima aventura
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}