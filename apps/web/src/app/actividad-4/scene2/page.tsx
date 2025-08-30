'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoDosActividad4 from './JuegoDosActividad4/JuegoDosActividad4';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Actividad4Scene2Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
//const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showJuegoDos, setShowJuegoDos] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
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

  const handleOpenJuegoDos = () => {
    playSound();
    setShowJuegoDos(true);
  };

  const handleCloseJuegoDos = () => {
    setShowJuegoDos(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const handleContinue = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    console.log('🎉 Actividad4-Scene2: Final scene completed, saving progress for completed activity');
    
    const progressSaved = await saveProgress('actividad-4', 'scene2', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: gameCompleted,
      activity_completed: true,
      completed_at: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad4-Scene2: Activity 4 completed successfully!');
      } else {
        console.error('❌ Actividad4-Scene2: Failed to save progress, but continuing');
      }
      // Navigate back to main activity menu
      router.push('/actividad-1');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient - Light pink tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-200 via-rose-100 to-pink-300 z-0" />

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
            <JugarButton text='Continuar...' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDAD-4-ESCENA-2.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!showJuegoDos && (
                <motion.div
                  animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  {!gameCompleted ? (
                    <JugarButton text='Juego Higiene menstrual' onClick={handleOpenJuegoDos} disabled={isAnimating} />
                  ) : (

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
                            <p className="text-lg sm:text-xl text-white drop-shadow-md">
                               Has completado la actividad.
                            </p>
                        </motion.div>
                      <motion.div
                      //scale: [1, 1.1, 1], 
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <JugarButton text="IR A LA PROXIMA AVENTURA! " onClick={handleContinue} disabled={isAnimating} />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}

      {/* JuegoDosActividad4 Game Modal */}
      <JuegoDosActividad4 
        isVisible={showJuegoDos} 
        onClose={handleCloseJuegoDos}
        onGameComplete={handleGameComplete}
      />
    </motion.div>
  );
}