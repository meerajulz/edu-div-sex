'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura4Scene2Page() {
  useActivityTracking();
  useActivityProtection();

  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const [isAnimating, setIsAnimating] = useState(false);

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleVolver = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    await saveProgress('aventura-4', 'scene2', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsAnimating(false);
      router.push('/aventura-4');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 z-0" />

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
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>
      <div className="">
        <LogoComponent configKey="actividad-5-scene1" />
      </div>

      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-10 shadow-2xl max-w-lg mx-4">
            <div className="text-7xl mb-6">🚀</div>
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              ¡Próximamente!
            </h1>
            <p className="text-white/90 text-xl mb-8">
              ¿Qué dice mi tono de voz?
            </p>
            <motion.button
              onClick={handleVolver}
              disabled={isAnimating}
              className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volver al menú
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
