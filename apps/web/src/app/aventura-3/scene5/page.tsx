'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura3Scene5Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const [isAnimating, setIsAnimating] = useState(false);

  useActivityTracking();
  useActivityProtection();

  const handleGoHome = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    await saveProgress('aventura-3', 'scene5', 'completed', 100, {
      activity_completed: true,
      completed_at: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsAnimating(false);
      router.push('/aventura-3');
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-pink-400 to-yellow-400" />

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

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
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Felicidades!
          </h2>
          <p className="text-white text-lg mb-6">
            Has completado la Aventura Placer Sexual
          </p>
          <motion.button
            onClick={handleGoHome}
            disabled={isAnimating}
            className="bg-white text-orange-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            IR A LA PROXIMA AVENTURA!
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
