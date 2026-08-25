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
import JuegoSeisActividad2 from '../../actividad-2/scene5/JuegoSeisActividad2/JuegoSeisActividad2';

const HEADER_TEXT = 'AVENTURA 2 - El círculo de confianza';

export default function Aventura2Scene5Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  useActivityTracking();
  useActivityProtection();

  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // This page has its own title (overrides the "AVENTURA 2 - Intimidad" context
  // set by the previous scene). scene6 resets it afterwards.
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
      setShowVideo(true);
    }, 800);
  };

  const handleContinue = async () => {
    if (isSaving) return;
    setIsSaving(true);
    playSound();
    await saveProgress('aventura-2', 'scene5', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    router.push('/aventura-2/scene6');
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 z-0" />

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

      <LogoComponent customText={HEADER_TEXT} customImage="/image/logo-image/aventura-4.png" customBgColor="bg-red-300" />
      <div className="absolute top-0 right-0 z-50">
        <FloatingMenu />
      </div>

      {/* Entry button */}
      {!showVideo && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8 }}
          >
            <JugarButton text="El círculo de confianza" onClick={handleStart} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      {/* Video */}
      {showVideo && !showGame && (
        <div className="fixed inset-0 z-40 bg-black">
          {!videoEnded ? (
            <OptimizedVideo
              ref={videoRef}
              src="/video/avanzado/Actividad_2_scene_5.mp4"
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
              className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <JugarButton text="Jugar" onClick={() => setShowGame(true)} disabled={isSaving} />
            </motion.div>
          )}
        </div>
      )}

      {/* Círculo de confianza game (advanced-only). On completion: save + go to scene6. */}
      <JuegoSeisActividad2
        isVisible={showGame}
        onClose={() => setShowGame(false)}
        onGameComplete={handleContinue}
      />
    </motion.div>
  );
}
