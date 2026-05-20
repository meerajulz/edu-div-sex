'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Aventura8Scene5Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const [isAnimating, setIsAnimating] = useState(false);

  useActivityTracking();

  const handleGoToMenu = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    await saveProgress('aventura-8', 'scene5', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsAnimating(false);
      router.push('/aventura-8');
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-300 via-cyan-200 to-indigo-300" />

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

      <div className="absolute top-0 right-0 z-50 flex"><FloatingMenu /></div>
      <div className=""><LogoComponent configKey="actividad-6-scene1" /></div>

      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <motion.div
          className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl max-w-lg mx-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', damping: 15 }}
        >
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-3xl font-bold text-indigo-700 mb-3">¡Próximamente!</h2>
          <p className="text-gray-600 text-lg mb-8">Esta escena estará disponible muy pronto.</p>
          <motion.button
            onClick={handleGoToMenu}
            disabled={isAnimating}
            className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Volver al menú
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
