'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoCincoActividad2 from '../scene5/JuegoCincoActividad2/JuegoCincoActividad2';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import dynamic from 'next/dynamic';

const AlexFinalCongratulations = dynamic(() => import('../components/AlexFinalCongratulations/AlexFinalCongratulations'), { ssr: false });
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Scene5Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showJuegoCinco, setShowJuegoCinco] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showAlexCongratulations, setShowAlexCongratulations] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    setIsHydrated(true);
  }, []);


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
      handleOpenJuegoCinco();
    }, 800);
  };

  const handleOpenJuegoCinco = () => {
    playSound();
    setShowJuegoCinco(true);
  };

  const handleCloseJuegoCinco = () => {
    setShowJuegoCinco(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setShowJuegoCinco(false);
    setTimeout(() => {
      setShowAlexCongratulations(true);
    }, 1000);
  };

  const handleAlexAnimationComplete = () => {
    setShowAlexCongratulations(false);
    setTimeout(() => {
      setShowCongratulations(true);
    }, 500);
  };

  const handleGoToHome = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    console.log('🎉 Scene5: Final scene completed, saving progress and completing Activity 2');
    
    const progressSaved = await saveProgress('actividad-2', 'scene5', 'completed', 100, {
      game_completed: gameCompleted,
      activity_completed: true,
      completed_at: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Scene5: Activity 2 completed successfully!');
        // Set flag that activity was just completed for auto-rotation
        localStorage.setItem('completedActivityId', '2');
      } else {
        console.error('❌ Scene5: Failed to save progress, but continuing');
        // Set flag even if save failed
        localStorage.setItem('completedActivityId', '2');
      }
      router.push('/home');
    }, 800);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200" />
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
        <LogoComponent configKey="actividad-2-scene1" />
      </div>

      {/* Background for JuegoCinco */}
      {showJuegoCinco && (
        <div
          className="fixed inset-0 z-30 bg-cover bg-center"
          style={{ backgroundImage: "url('/image/actividad_2/bg.png')" }}
        />
      )}

      {/* Main Game Button - No video, direct to game */}
      {!showJuegoCinco && !showAlexCongratulations && !showCongratulations ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='Jugar Tu Cofre de la Intimidad' onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : null}

      {/* JuegoCinco Game Modal */}
      <JuegoCincoActividad2 
        isOpen={showJuegoCinco}
        onClose={handleCloseJuegoCinco}
        onGameComplete={handleGameComplete}
      />

      {/* Alex Final Congratulations after Game Complete */}
      <AlexFinalCongratulations 
        isVisible={showAlexCongratulations}
        onAnimationComplete={handleAlexAnimationComplete}
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
              ¡Excelente!
            </h2>
            <p className="text-white text-lg mb-6">
              Has completado la Actividad Intimidad
            </p>
            <motion.button
              onClick={handleGoToHome}
              disabled={isAnimating}
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              IR A LA PROXIMA AVENTURA!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}