'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoCuatroActividad3Fem from './JuegoTresActividad3/JuegoTresActividad3';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Actividad3Scene2Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showJuegoCuatro, setShowJuegoCuatro] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setBrowserDimensions({ width: vw, height: vh });

      let width = vw;
      let height = width / aspectRatio;

      if (height < vh) {
        height = vh;
        width = height * aspectRatio;
      }

      setContainerDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleJugarClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      setShowVideo(true);
    }, 800);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleOpenJuegoCuatro = () => {
    playSound();
    setShowJuegoCuatro(true);
  };

  const handleCloseJuegoCuatro = () => {
    setShowJuegoCuatro(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const handleGoToNextActivity = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => {
      setIsAnimating(false);
      // Navigate to next activity or main menu
      router.push('/actividades');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Colorful Background gradient - Different colors for Scene 2 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-400 to-green-400 z-0" />

      {/* Floating particles animation */}
      <div className="absolute inset-0 z-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 80 + 30,
              height: Math.random() * 80 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Additional colorful elements */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`diamond-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          >
            <div className="w-4 h-4 bg-white/30 transform rotate-45" />
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDAD-3-ESCENA-2.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!showJuegoCuatro && (
                <motion.div
                  animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  {!gameCompleted ? (
                    <JugarButton onClick={handleOpenJuegoCuatro} disabled={isAnimating} />
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-2xl font-bold text-center bg-green-500/80 px-6 py-3 rounded-full"
                      >
                        ¡Actividad Completada! 🎉
                      </motion.div>
                      <JugarButton 
                        onClick={handleGoToNextActivity} 
                        disabled={isAnimating}
                        text="Finalizar"
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}

      {/* JuegoCuatroActividad3Fem Game Modal - Placeholder */}
      <JuegoCuatroActividad3Fem 
        isVisible={showJuegoCuatro} 
        onClose={handleCloseJuegoCuatro}
        onGameComplete={handleGameComplete}
      />
    </motion.div>
  );
}