'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JuegoCuatroAventura1 from './JuegoCuatroAventura1/JuegoCuatroAventura1';

export default function Aventura1Juego4Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  useActivityTracking();

  const [showGame, setShowGame] = useState(true);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGameComplete = async () => {
    setShowGame(false);
    await saveProgress('aventura-1', 'juego4', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    setShowCongratulations(true);
  };

  const handleClose = () => {
    router.push('/home');
  };

  const handleGoToHub = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      router.push('/home');
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-400 via-orange-300 to-yellow-300">
      <div className="absolute top-0 right-0 z-50">
        <FloatingMenu />
      </div>

      <JuegoCuatroAventura1
        isVisible={showGame}
        onClose={handleClose}
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
            className="bg-gradient-to-br from-purple-300 via-purple-400 to-pink-500 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">¡Felicidades!</h2>
            <p className="text-white text-lg mb-6">Has completado esta sección</p>
            <motion.button
              onClick={handleGoToHub}
              disabled={isAnimating}
              className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volver al menú
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
