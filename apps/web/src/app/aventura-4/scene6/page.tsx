'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura4Scene6Page() {
  useActivityTracking();
  useActivityProtection();

  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGoBack = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    await saveProgress('aventura-4', 'scene6', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsAnimating(false);
      router.push('/aventura-4');
    }, 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-400 via-rose-300 to-orange-300" />

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen gap-8">
        <motion.div
          className="bg-white/20 backdrop-blur-lg rounded-3xl p-10 max-w-md text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🔜</div>
          <h2 className="text-3xl font-bold text-white mb-4">¡Próximamente!</h2>
          <p className="text-white text-lg">¿Cómo le pido salir a la persona que me gusta?</p>
        </motion.div>

        <motion.button
          onClick={handleGoBack}
          disabled={isAnimating}
          className="bg-white text-pink-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Volver
        </motion.button>
      </div>
    </div>
  );
}
