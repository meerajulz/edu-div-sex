'use client';

import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import JuegoCuatroAventura6 from './JuegoCuatroAventura6/JuegoCuatroAventura6';

export default function Aventura6Scene4Page() {
  useActivityTracking();
  useActivityProtection();

  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  const [isAnimating, setIsAnimating] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) { console.warn('Could not play sound:', error); }
  };

  const handleJugarClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => { setIsAnimating(false); setShowGameModal(true); }, 800);
  };

  const handleGameContinue = () => {
    setShowGameModal(false);
    setShowCongratulations(true);
  };

  const handleGoToHub = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    await saveProgress('aventura-6', 'scene4', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    localStorage.setItem('completedActivityId', '6');
    setTimeout(() => { setIsAnimating(false); router.push('/home'); }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-teal-200 via-emerald-100 to-green-200 z-0" />

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
            animate={{ y: [0, -20, 0], x: [0, Math.random() * 20 - 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {!showCongratulations && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text="¿QUÉ HACEMOS CUANDO NOS DEJAN?" onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      <JuegoCuatroAventura6
        isVisible={showGameModal}
        onClose={() => setShowGameModal(false)}
        onGameComplete={handleGameContinue}
      />

      {showCongratulations && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-teal-300 via-emerald-400 to-green-500 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">¡Felicidades!</h2>
            <p className="text-white text-lg mb-6">Has completado esta aventura</p>
            <motion.button
              onClick={handleGoToHub}
              disabled={isAnimating}
              className="bg-white text-teal-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
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
