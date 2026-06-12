'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { playGameAudio } from '../../utils/gameAudio';
import JuegoCuatroAventura4 from './JuegoCuatroAventura4/JuegoCuatroAventura4';
import JuegoQuintoAventura4 from './JuegoQuintoAventura4/JuegoQuintoAventura4';

export default function Aventura4Scene3Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  useActivityTracking();
  useActivityProtection();

  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showJuego4, setShowJuego4] = useState(false);
  const [showJuego5, setShowJuego5] = useState(false);
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

  const handleJuego4Complete = () => {
    setShowJuego4(false);
    setShowJuego5(true);
  };

  const handleJuego5Complete = async () => {
    setShowJuego5(false);
    await saveProgress('aventura-4', 'scene3', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    setShowCongratulations(true);
  };

  const handleGoToHub = () => {
    router.push('/aventura-4');
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-400 to-orange-300 z-0" />
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i} className="absolute rounded-full bg-white/20"
            style={{ width: Math.random() * 60 + 20, height: Math.random() * 60 + 20, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50"><FloatingMenu /></div>

      {/* Entry button */}
      {!showVideo && !showCongratulations && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}} transition={{ duration: 0.8 }}>
            <JugarButton text='¿CÓMO LE PIDO SALIR?' onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      {/* Video placeholder — replace with <OptimizedVideo> when file is ready */}
      {showVideo && !videoEnded && (
        <motion.div
          className="fixed inset-0 z-40 bg-gradient-to-b from-rose-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center gap-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <div className="text-white text-center px-8">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-3xl font-bold mb-2">¡Próximamente!</h2>
            <p className="text-lg text-white/80">El vídeo de esta sección estará disponible muy pronto.</p>
          </div>
          <motion.button
            onClick={() => setVideoEnded(true)}
            className="bg-white text-rose-600 font-bold py-3 px-10 rounded-full shadow-xl text-lg"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            Continuar →
          </motion.button>
        </motion.div>
      )}

      {/* Jugar button after video */}
      {showVideo && videoEnded && !showJuego4 && !showJuego5 && !showCongratulations && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <JugarButton text='Jugar' onClick={() => setShowJuego4(true)} disabled={isAnimating} />
        </div>
      )}

      <JuegoCuatroAventura4
        isVisible={showJuego4}
        onClose={() => setShowJuego4(false)}
        onGameComplete={handleJuego4Complete}
      />

      <JuegoQuintoAventura4
        isVisible={showJuego5}
        onClose={() => setShowJuego5(false)}
        onGameComplete={handleJuego5Complete}
      />

      {showCongratulations && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-rose-300 via-pink-400 to-orange-400 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">¡Muy bien!</h2>
            <p className="text-white text-lg mb-6">Has completado esta sección</p>
            <motion.button
              onClick={handleGoToHub}
              className="bg-white text-rose-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              Volver al menú
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
