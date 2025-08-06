'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoUnoActividad4 from './JuegoUnoActividad4/JuegoUnoActividad4';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Actividad4Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [allVideosEnded, setAllVideosEnded] = useState(false);
  const [showJuegoUno, setShowJuegoUno] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // Video sequence
  const videos = [
    '/video/ACTIVIDAD-4-ESCENA-1_1.mp4',
   // '/video/ACTIVIDAD-4-ESCENA-1-TUTORIAL.mp4',
   // '/video/ACTIVIDAD-4-ESCENA-1-TUTORIAL_1.mp4'
  ];

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
    if (currentVideoIndex < videos.length - 1) {
      // Move to next video
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      // All videos have ended
      setAllVideosEnded(true);
    }
  };

  const handleOpenJuegoUno = () => {
    playSound();
    setShowJuegoUno(true);
  };

  const handleCloseJuegoUno = () => {
    setShowJuegoUno(false);
    // Don't reset game completion status, allow reopening
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const handleContinue = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => {
      setIsAnimating(false);
      // Navigate to next scene or activity
      // router.push('/next-activity');
      console.log('Continue to next activity');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient - Light blue tones for doctor scene */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-blue-100 to-cyan-200 z-0" />

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
          {!allVideosEnded ? (
            <video
              ref={videoRef}
              key={currentVideoIndex} // Force re-render when video changes
              className="absolute inset-0 w-full h-full object-cover z-20"
              src={videos[currentVideoIndex]}
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!showJuegoUno && (
                <motion.div
                  animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  {!gameCompleted ? (
                    <JugarButton onClick={handleOpenJuegoUno} disabled={isAnimating} />
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-2xl font-bold text-center bg-green-500/80 px-6 py-3 rounded-full"
                      >
                        ¡Juego Completado! 🎉
                      </motion.div>
                      <JugarButton 
                        onClick={handleContinue} 
                        disabled={isAnimating}
                        text="Continuar..."
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}

      {/* JuegoUnoActividad4 Game Modal */}
      <JuegoUnoActividad4 
        isVisible={showJuegoUno} 
        onClose={handleCloseJuegoUno}
        onGameComplete={handleGameComplete}
      />
    </motion.div>
  );
}