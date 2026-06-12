'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import LogoComponent from '../../components/LogoComponent/LogoComponent';
import JugarButton from '../../components/JugarButton/JugarButton';
import OptimizedVideo from '../../components/OptimizedVideo';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { playGameAudio } from '../../utils/gameAudio';
import { setAvanzadoContext } from '../../utils/avanzadoContext';

const HEADER_TEXT = 'AVENTURA 3 - El placer sexual';

export default function Aventura3Scene5Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  useActivityTracking();
  useActivityProtection();

  const [phase, setPhase] = useState<'intro' | 'video' | 'congrats'>('intro');
  const [videoEnded, setVideoEnded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keep the forced Aventura 3 header on this final video page too.
  useEffect(() => {
    setAvanzadoContext(HEADER_TEXT);
  }, []);

  const playSound = () => {
    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button Click Sound');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleStart = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => {
      setIsAnimating(false);
      setPhase('video');
    }, 800);
  };

  // After the (placeholder) video, mark the whole Aventura 3 complete.
  const handleVideoContinue = async () => {
    if (isSaving) return;
    setIsSaving(true);
    playSound();
    await saveProgress('aventura-3', 'scene5', 'completed', 100, {
      activity_completed: true,
      completed_at: new Date().toISOString(),
    });
    setIsSaving(false);
    setPhase('congrats');
  };

  const handleGoToMenu = () => {
    playSound();
    router.push('/aventura-3');
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-pink-400 to-yellow-400 z-0" />

      {/* Floating bubbles */}
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

      <LogoComponent customText={HEADER_TEXT} customImage="/image/logo-image/aventura-3.png" customBgColor="bg-pink-500" />
      <div className="absolute top-0 right-0 z-50">
        <FloatingMenu />
      </div>

      {/* Entry button */}
      {phase === 'intro' && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8 }}
          >
            <JugarButton text="Ver vídeo" onClick={handleStart} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      {/* Video */}
      {phase === 'video' && (
        <div className="fixed inset-0 z-40 bg-black">
          {!videoEnded ? (
            <OptimizedVideo
              ref={videoRef}
              src="/video/avanzado/Actividad_3_scene_5.mp4"
              className="absolute inset-0 w-full h-full object-contain z-20"
              autoPlay
              playsInline
              volume={0.8}
              onEnded={() => setVideoEnded(true)}
              onLoadedData={() => {
                if (videoRef.current) videoRef.current.volume = 0.8;
              }}
              lazyLoad={true}
              lowPowerMode={true}
              maxRetries={3}
            />
          ) : (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-b from-purple-600 via-pink-500 to-yellow-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                onClick={handleVideoContinue}
                disabled={isSaving}
                className="bg-white text-purple-600 font-bold py-3 px-10 rounded-full shadow-xl text-lg disabled:opacity-60"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSaving ? 'Guardando...' : 'Continuar →'}
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

      {/* Completion */}
      {phase === 'congrats' && (
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
            <p className="text-white text-lg mb-6">Has completado la Aventura Placer Sexual</p>
            <motion.button
              onClick={handleGoToMenu}
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              IR A LA PROXIMA AVENTURA!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
