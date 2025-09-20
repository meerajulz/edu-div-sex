'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoDosActividad5 from './JuegoDosActividad5/JuegoDosActividad5';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Actividad5Scene1_1Page() {

  // Track current activity URL for continue feature
  useActivityTracking();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  useActivityProtection();
  const [isAnimating, setIsAnimating] = useState(false);

  const [showJuegoDos, setShowJuegoDos] = useState(false);
  const [juego2Completed, setJuego2Completed] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);


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
    playSound();
    setShowJuegoDos(true);
  };


  const handleCloseJuegoDos = () => {
    setShowJuegoDos(false);
  };

  const handleGameComplete = () => {
    setJuego2Completed(true);
    setShowJuegoDos(false); // Close the game modal
    // Show congratulations after a short delay
    setTimeout(() => {
      setShowCongratulations(true);
    }, 500);
  };

  // Handle game completion and go back to menu
  const handleGoToMenu = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    console.log('🎯 Actividad5-Scene1-1: Game completed, saving progress and returning to menu');

    const progressSaved = await saveProgress('actividad-5', 'scene1-1', 'completed', 100, {
      juego2_completed: juego2Completed,
      completed_at: new Date().toISOString()
    });

    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad5-Scene1-1: Progress saved successfully');
      } else {
        console.error('❌ Actividad5-Scene1-1: Failed to save progress, but continuing');
      }
      router.push('/actividad-5');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Colorful Background gradient - Orange theme for voice */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 z-0" />

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
        <LogoComponent configKey="actividad-5-scene1-1" />
      </div>

      {!showCongratulations && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='¿Qué dice mi tono de voz?' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      {/* JuegoDosActividad5 Game Modal */}
      <JuegoDosActividad5
        isVisible={showJuegoDos}
        onClose={handleCloseJuegoDos}
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
              onClick={handleGoToMenu}
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