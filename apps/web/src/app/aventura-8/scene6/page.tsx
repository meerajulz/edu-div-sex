'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import JuegoSeisActividad6 from '../../actividad-6/scene4/JuegoSeisActividad6/JuegoSeisActividad6';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { playGameAudio } from '../../utils/gameAudio';

export default function Aventura8Scene6Page() {

  useActivityTracking();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  const [isAnimating, setIsAnimating] = useState(false);
  const [showJuegoSeis, setShowJuegoSeis] = useState(false);
  const [juegoSeisCompleted, setJuegoSeisCompleted] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const playSound = () => playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound');

  const handleOpenJuegoSeis = () => {
    if (isAnimating) return;
    playSound();
    setShowJuegoSeis(true);
  };

  const handleCloseJuegoSeis = () => setShowJuegoSeis(false);

  const handleGameComplete = () => {
    setJuegoSeisCompleted(true);
    setShowJuegoSeis(false);
    setTimeout(() => setShowCongratulations(true), 500);
  };

  const handleGoToMenu = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    await saveProgress('aventura-8', 'scene6', 'completed', 100, {
      juego6_completed: juegoSeisCompleted,
      completed_at: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsAnimating(false);
      router.push('/aventura-8');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 z-0" />

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
            animate={{ y: [0, -30, 0], x: [0, Math.random() * 30 - 15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex"><FloatingMenu /></div>
      <div className=""><LogoComponent configKey="actividad-6-scene1" /></div>

      {!juegoSeisCompleted && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text="¿QUÉ HACER SI SUCEDE?" onClick={handleOpenJuegoSeis} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      <JuegoSeisActividad6
        isVisible={showJuegoSeis}
        onClose={handleCloseJuegoSeis}
        onGameComplete={handleGameComplete}
      />

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
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">¡Felicidades!</h2>
            <p className="text-white text-lg mb-6">Has completado esta sección de la actividad</p>
            <motion.button
              onClick={handleGoToMenu}
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
