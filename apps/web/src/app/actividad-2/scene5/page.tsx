'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { playGameAudio } from '../../utils/gameAudio';
import JuegoSeisActividad2 from './JuegoSeisActividad2/JuegoSeisActividad2';

export default function Scene5Page() {
  useActivityTracking();
  useActivityProtection();

  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const playSound = () => {
    try { playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button Click Sound'); } catch (e) { console.warn(e); }
  };

  const handleButtonClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => { setIsAnimating(false); setShowVideo(true); }, 800);
  };

  const handleVideoEnd = () => setVideoEnded(true);

  const handleGameComplete = () => {
    setShowGame(false);
    setShowCongratulations(true);
  };

  const handleGoToNext = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    await saveProgress('actividad-2', 'scene5', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    setTimeout(() => {
      setIsAnimating(false);
      const returnTo = localStorage.getItem('aventura-2-return-to');
      if (returnTo) {
        localStorage.removeItem('aventura-2-return-to');
        router.push(returnTo);
      } else {
        router.push('/actividad-2');
      }
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200" />
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i} className="absolute rounded-full bg-white/10"
            style={{ width: Math.random() * 60 + 20, height: Math.random() * 60 + 20, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], x: [0, Math.random() * 20 - 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-[95]"><FloatingMenu /></div>
      <div className="z-[95] relative"><LogoComponent configKey="actividad-2-scene1" /></div>

      {/* Entry button */}
      {!showVideo && !showGame && !showCongratulations && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}} transition={{ duration: 0.8 }}>
            <JugarButton text='EL CÍRCULO DE CONFIANZA' onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      {/* Video placeholder — replace with <OptimizedVideo src="/video/ACTIVIDAD-2-ESCENA-5.mp4"> when ready */}
      {showVideo && !videoEnded && (
        <motion.div
          className="fixed inset-0 z-40 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center gap-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <div className="text-white text-center px-8">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-3xl font-bold mb-2">¡Próximamente!</h2>
            <p className="text-lg text-white/80">El vídeo de esta sección estará disponible muy pronto.</p>
          </div>
          <motion.button
            onClick={handleVideoEnd}
            className="bg-white text-purple-600 font-bold py-3 px-10 rounded-full shadow-xl text-lg"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {/* Game button after video */}
      {showVideo && videoEnded && !showGame && !showCongratulations && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <JugarButton text='Jugar' onClick={() => setShowGame(true)} disabled={isAnimating} />
        </div>
      )}

      <JuegoSeisActividad2
        isVisible={showGame}
        onClose={() => setShowGame(false)}
        onGameComplete={handleGameComplete}
      />

      {showCongratulations && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-purple-300 via-purple-400 to-pink-500 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">¡Muy bien!</h2>
            <p className="text-white text-lg mb-6">Has completado el Círculo de Confianza</p>
            <motion.button
              onClick={handleGoToNext}
              disabled={isAnimating}
              className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              Continuar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
