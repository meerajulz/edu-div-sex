'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoUnoActividad3 from './JuegoUnoActividad3/juegoUnoActividad3';
import JuegoDosActividad3 from './JuegoDosActvidad3/JuegoDosActividad3';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';

export default function Actividad3Scene1Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showVideo2, setShowVideo2] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [video2Ended, setVideo2Ended] = useState(false);
  const [showJuegoUno, setShowJuegoUno] = useState(false);
  const [showJuegoDos, setShowJuegoDos] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [juego1Completed, setJuego1Completed] = useState(false);
  
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

  const handleVideo2End = () => {
    setVideo2Ended(true);
  };

  const handleOpenJuegoUno = () => {
    playSound();
    setShowJuegoUno(true);
  };

  const handleCloseJuegoUno = () => {
    setShowJuegoUno(false);
  };

  const handleGameComplete = () => {
    setJuego1Completed(true);
    // Close game modal and start second video
    setShowJuegoUno(false);
    setTimeout(() => {
      setShowVideo2(true);
    }, 500);
  };

  const handleOpenJuegoDos = () => {
    playSound();
    setShowJuegoDos(true);
  };

  const handleCloseJuegoDos = () => {
    setShowJuegoDos(false);
  };

  // Handle Game 2 completion
  const handleJuego2Complete = () => {
    setGameCompleted(true);
    setShowJuegoDos(false);
  };

  // Handle go to next scene
  const handleGoToScene2 = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => {
      setIsAnimating(false);
      router.push('/actividad-3/scene2');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Colorful Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 z-0" />

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
            key={`star-${i}`}
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
            <div className="w-4 h-4 bg-white/30 rounded-full" />
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>
      <div className="">
        <LogoComponent configKey="actividad-3-scene1" />
      </div>

      {!showVideo && !showVideo2 ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='Continuar...' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : showVideo2 ? (
        <div className="absolute" style={containerStyle}>
          {!video2Ended ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDAD-3-ESCENA-1_1.mp4"
              autoPlay
              playsInline
              onEnded={handleVideo2End}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.div
                animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {!gameCompleted ? (
                  <JugarButton 
                    text="Juego: ¿Qué pasa cuando me excito?" 
                    onClick={handleOpenJuegoDos} 
                    disabled={isAnimating} 
                  />
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <JugarButton 
                      text="Continuar..." 
                      onClick={handleGoToScene2} 
                      disabled={isAnimating}
                    />
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDAD-3-ESCENA-1.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!juego1Completed && (
                <motion.div
                  animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  <JugarButton 
                    text='JUEGO 1 ¿Qué pasa cuando me excito?' 
                    onClick={handleOpenJuegoUno} 
                    disabled={isAnimating} 
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}

      {/* JuegoUnoActividad3 Game Modal */}
      <JuegoUnoActividad3 
        isVisible={showJuegoUno} 
        onClose={handleCloseJuegoUno}
        onGameComplete={handleGameComplete}
      />

      {/* JuegoDosActividad3 Game Modal */}
      <JuegoDosActividad3 
        isVisible={showJuegoDos} 
        onClose={handleCloseJuegoDos}
        onGameComplete={handleJuego2Complete}
      />
    </motion.div>
  );
}