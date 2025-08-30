'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoTresActividad6 from './JuegoTresActividad6/JuegoTresActividad6';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Actividad6Scene3Page() {
 
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
  const [showJuegoTres, setShowJuegoTres] = useState(false);
  const [juegoTresCompleted, setJuegoTresCompleted] = useState(false);
  
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
  };

  // Juego Tres handlers
  const handleOpenJuegoTres = () => {
    playSound();
    setShowJuegoTres(true);
  };

  const handleCloseJuegoTres = () => {
    setShowJuegoTres(false);
  };

  const handleJuegoTresComplete = () => {
    setJuegoTresCompleted(true);
    setShowJuegoTres(false);
  };

  // Continue to scene 4
  const handleContinueToScene4 = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    console.log('🎯 Actividad6-Scene3: Game completed, saving progress and moving to scene4');
    
    const progressSaved = await saveProgress('actividad-6', 'scene3', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: juegoTresCompleted,
      completed_at: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad6-Scene3: Progress saved successfully');
      } else {
        console.error('❌ Actividad6-Scene3: Failed to save progress, but continuing');
      }
      router.push('/actividad-6/scene4');
    }, 800);
  };

  // Determine current button state
  const getCurrentButton = () => {
    if (!juegoTresCompleted) {
      return (
        <JugarButton 
          onClick={handleOpenJuegoTres} 
          disabled={isAnimating}
          text="Jugar Secretos buenos y malos"
        />
      );
    } else {
      // Game completed - show completion message
      return (
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-2xl font-bold text-center bg-green-500/80 px-6 py-3 rounded-full"
          >
            ¡Juego Completado! 🎉
          </motion.div>
          <JugarButton 
            onClick={handleContinueToScene4} 
            disabled={isAnimating}
            text="Continuar..."
          />
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
      {/* Background gradient - Blue to Pink */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-indigo-100 to-pink-300 z-0" />

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
        <LogoComponent configKey="actividad-6-scene1" />
      </div>

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDA_6-ESCENA_3.mp4"
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
      <JuegoTresActividad6 
        isVisible={showJuegoTres} 
        onClose={handleCloseJuegoTres}
        onGameComplete={handleJuegoTresComplete}
      />
    </motion.div>
  );
}