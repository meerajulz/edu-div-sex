'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoCuatroActividad6 from './JuegoCuatroActividad6/JuegoCuatroActividad6';
import JuegoCincoActividad6 from './JuegoCincoActividad6/JuegoCincoActividad6';
import JuegoSeisActividad6 from './JuegoSeisActividad6/JuegoSeisActividad6';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Actividad6Scene4Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const finalVideoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Video states
  const [showInitialVideo, setShowInitialVideo] = useState(false);
  const [initialVideoEnded, setInitialVideoEnded] = useState(true);
  const [showFinalVideo, setShowFinalVideo] = useState(false);
  const [finalVideoEnded, setFinalVideoEnded] = useState(false);
  
  // Game states
  const [showJuegoCuatro, setShowJuegoCuatro] = useState(false);
  const [juegoCuatroCompleted, setJuegoCuatroCompleted] = useState(true);
  const [showJuegoCinco, setShowJuegoCinco] = useState(false);
  const [juegoCincoCompleted, setJuegoCincoCompleted] = useState(false);
  const [showJuegoSeis, setShowJuegoSeis] = useState(false);
  const [juegoSeisCompleted, setJuegoSeisCompleted] = useState(false);
  
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

  // Initial video handlers
  const handleJugarClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      setShowInitialVideo(true);
    }, 800);
  };

  const handleInitialVideoEnd = () => {
    setInitialVideoEnded(true);
  };

  // Game handlers
  const handleOpenJuegoCuatro = () => {
    playSound();
    setShowJuegoCuatro(true);
  };

  const handleCloseJuegoCuatro = () => {
    setShowJuegoCuatro(false);
  };

  const handleJuegoCuatroComplete = () => {
    setJuegoCuatroCompleted(true);
    setShowJuegoCuatro(false);
  };

  const handleOpenJuegoCinco = () => {
    playSound();
    setShowJuegoCinco(true);
  };

  const handleCloseJuegoCinco = () => {
    setShowJuegoCinco(false);
  };

  const handleJuegoCincoComplete = () => {
    setJuegoCincoCompleted(true);
    setShowJuegoCinco(false);
  };

  const handleOpenJuegoSeis = () => {
    playSound();
    setShowJuegoSeis(true);
  };

  const handleCloseJuegoSeis = () => {
    setShowJuegoSeis(false);
  };

  const handleJuegoSeisComplete = () => {
    setJuegoSeisCompleted(true);
    setShowJuegoSeis(false);
    // Trigger final video after all games completed
    setTimeout(() => {
      setShowFinalVideo(true);
    }, 1000);
  };

  // Final video handlers
  const handleFinalVideoEnd = () => {
    setFinalVideoEnded(true);
    // Play celebration sound when congratulations screen appears
    setTimeout(() => {
      try {
        const celebrationAudio = new Audio('/audio/muy_bien_bright.mp3');
        celebrationAudio.volume = 0.8;
        celebrationAudio.play().catch(console.warn);
      } catch (error) {
        console.warn('Could not play celebration sound:', error);
      }
    }, 500);
  };

  // Continue to home
  const handleContinueToHome = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => {
      setIsAnimating(false);
      router.push('/home');
    }, 800);
  };

  // Determine current button state
  const getCurrentButton = () => {
    if (!juegoCuatroCompleted) {
      return (
        <JugarButton 
          onClick={handleOpenJuegoCuatro} 
          disabled={isAnimating}
          text="Juego Abusador 1 "
        />
      );
    } else if (!juegoCincoCompleted) {
      return (
        <JugarButton 
          onClick={handleOpenJuegoCinco} 
          disabled={isAnimating}
          text="Juego Abusador 2"
        />
      );
    } else if (!juegoSeisCompleted) {
      return (
        <JugarButton 
          onClick={handleOpenJuegoSeis} 
          disabled={isAnimating}
          text="Jugar ¿Qué hacer si sucede?"
        />
      );
    }
    // All games completed, final video will play automatically
    return null;
  };

  const getFinalButton = () => {
    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Celebration Emojis Floating Around */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`celebration-${i}`}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.8],
                y: [0, -30, -60],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
            >
              {['🎉', '🎊', '⭐', '🏆', '✨', '🌟'][i % 6]}
            </motion.div>
          ))}
        </div>

        {/* Main Congratulations */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-white text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-8 py-4 rounded-full shadow-xl border-4 border-yellow-300"
          >
            ¡Felicitaciones! 🎉
          </motion.div>
          
          {/* Sparkle effect around main badge */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              style={{
                left: `${50 + Math.cos(i * Math.PI / 4) * 60}%`,
                top: `${50 + Math.sin(i * Math.PI / 4) * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Level Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-white text-xl font-semibold text-center bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 rounded-full shadow-lg border-2 border-green-300"
          >
            Has acabado Nivel 1 ⭐
          </motion.div>
        </motion.div>

        {/* Pulsing Trophy */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5, ease: 'easeOut' }}
          className="text-8xl"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🏆
          </motion.div>
        </motion.div>

        {/* Final Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <JugarButton 
              onClick={handleContinueToHome} 
              disabled={isAnimating}
              text="Ir al Menú Principal"
            />
          </motion.div>
        </motion.div>

        {/* Confetti Rain */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'][i % 6],
              }}
              initial={{ y: -10, opacity: 1 }}
              animate={{
                y: window.innerHeight + 50,
                x: [0, Math.random() * 200 - 100],
                rotate: [0, 360 * 3],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient - Purple/Blue to Green/Orange/Red */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-blue-200 via-green-200 via-orange-200 to-red-300 z-0" />

      <div className="absolute inset-0 z-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {/* Initial flow - before games */}
      {!showInitialVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : !initialVideoEnded ? (
        // Initial Video
        <div className="absolute" style={containerStyle}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDA_6-ESCENA_4.mp4"
            autoPlay
            playsInline
            onEnded={handleInitialVideoEnd}
          />
        </div>
      ) : !showFinalVideo ? (
        // Games phase
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {getCurrentButton()}
          </motion.div>
        </div>
      ) : !finalVideoEnded ? (
        // Final Video
        <div className="absolute" style={containerStyle}>
          <video
            ref={finalVideoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDA_6-ESCENA_5-FINAL.mp4"
            autoPlay
            playsInline
            onEnded={handleFinalVideoEnd}
          />
        </div>
      ) : (
        // Final completion screen
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {getFinalButton()}
          </motion.div>
        </div>
      )}

      {/* Game Modals */}
      <JuegoCuatroActividad6 
        isVisible={showJuegoCuatro} 
        onClose={handleCloseJuegoCuatro}
        onGameComplete={handleJuegoCuatroComplete}
      />

      <JuegoCincoActividad6 
        isVisible={showJuegoCinco} 
        onClose={handleCloseJuegoCinco}
        onGameComplete={handleJuegoCincoComplete}
      />

      <JuegoSeisActividad6 
        isVisible={showJuegoSeis} 
        onClose={handleCloseJuegoSeis}
        onGameComplete={handleJuegoSeisComplete}
      />
    </motion.div>
  );
}