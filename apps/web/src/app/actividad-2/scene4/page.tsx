'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import { useState, useRef, useEffect } from 'react';
import JuegoCuatroActividad2 from './JuegoCuatroActividad2/JuegoCuatroActividad2';
import JuegoCincoActividad2 from './JuegoCincoActividad2/JuegoCincoActividad2';


export default function Actividad2Scene4Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const alexAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showModalGame4, setShowModalGame4] = useState(false);
  const [showModalGame5, setShowModalGame5] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [game4Completed, setGame4Completed] = useState(false);
  const [game5Completed, setGame5Completed] = useState(false);
  const [showAlexCongrats, setShowAlexCongrats] = useState(false);
  const [alexTalkEnded, setAlexTalkEnded] = useState(false);
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

  // Check if both games are completed to show Alex congratulations
  useEffect(() => {
    if (game4Completed && game5Completed && !showAlexCongrats) {
      setShowAlexCongrats(true);
      // Play Alex's audio
      const audio = new Audio('/audio/actividad-2/juego5/Alex-final.mp3');
      alexAudioRef.current = audio;
      
      audio.onended = () => {
        setAlexTalkEnded(true);
        alexAudioRef.current = null;
      };
      
      audio.onerror = () => {
        console.warn('Alex audio failed to load');
        setAlexTalkEnded(true);
        alexAudioRef.current = null;
      };

      audio.play().catch(() => {
        console.warn('Alex audio failed to play');
        setAlexTalkEnded(true);
        alexAudioRef.current = null;
      });
    }
  }, [game4Completed, game5Completed, showAlexCongrats]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (alexAudioRef.current) {
        alexAudioRef.current.pause();
        alexAudioRef.current = null;
      }
    };
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
      if (!videoEnded) {
        setShowVideo(true);
      } else if (!game4Completed) {
        // Show game 4 modal if game 4 hasn't been completed yet
        setShowModalGame4(true);
      } else if (!game5Completed) {
        // Show game 5 modal if game 5 hasn't been completed yet
        setShowModalGame5(true);
      }
    }, 800);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowVideo(false);
  };

  const handleCloseModalGame4 = () => {
    setShowModalGame4(false);
    // Mark game 4 as completed when modal closes (assuming it was completed)
    setGame4Completed(true);
  };

  const handleCloseModalGame5 = () => {
    setShowModalGame5(false);
    // Mark game 5 as completed when modal closes (assuming it was completed)
    setGame5Completed(true);
  };

  const handleNextLevel = () => {
    playSound();
    // Add your navigation logic here to go to the next level
    console.log('Going to next level...');
    router.push('/actividad-1');
  };

  // Show Alex congratulations scene if both games are completed
  if (showAlexCongrats) {
    return (
      <motion.div
        className="relative min-h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: `url('/image/actividad_2/bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20 z-0" />

        <div className="absolute top-0 right-0 z-50 flex">
          <FloatingMenu />
        </div>

        {/* Alex GIF and Congratulations */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
          <AnimatePresence mode="wait">
            {!alexTalkEnded ? (
              // Alex talking
              <motion.div
                key="alex-talking"
                className="flex flex-col items-center justify-end min-h-screen pb-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ 
                  opacity: 0,
                  scale: 2.5,        // Scale UP (comes toward viewer)
                  z: 100,            // Bring to front layer
                  transition: { 
                    duration: 1.2,   // Longer duration for smoother effect
                    ease: 'easeInOut',
                    opacity: { 
                      duration: 0.8, 
                      delay: 0.4     // Fade out after scaling starts
                    }
                  }
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div 
                  className="w-full flex justify-center items-end"
                  style={{ height: '70vh', minHeight: '400px' }}
                >
                  <img
                    src="/image/alex-talk.gif"
                    alt="Alex hablando"
                    className="object-contain object-bottom"
                    style={{ 
                      height: '80%',
                      width: 'auto',
                      transform: 'scale(2)',
                      transformOrigin: 'bottom center'
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              // Congratulations message and next level button
              <motion.div
                key="congratulations"
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {/* Congratulations text */}
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 shadow-2xl mb-8"
                  initial={{ rotate: -5 }}
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    ¡Felicidades!
                  </h1>
                  <p className="text-xl sm:text-2xl text-white/90 font-semibold">
                    Acabaste la a Actividad 2
                  </p>
                </motion.div>

                {/* Sparkle effects */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-300 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}

                {/* Next Level Button */}
                <motion.button
                  onClick={handleNextLevel}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <span className="text-xl sm:text-2xl">Ir al Siguiente Nivel</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient - always visible when video is not playing */}
      <div className={`absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-purple-300 z-0 ${showVideo ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />

      {!showModalGame4 && !showModalGame5 && (
        <div className={`absolute inset-0 z-10 ${showVideo ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
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
      )}

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {/* JugarButton - shows initially and after video ends, but not if both games are completed */}
      {(!showVideo || videoEnded) && !showModalGame4 && !showModalGame5 && !(game4Completed && game5Completed) && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      {/* Video */}
      {showVideo && (
        <div className="absolute" style={containerStyle}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDAD-2-ESCENA-4.mp4"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
          />
        </div>
      )}

      {/* Game 4 Modal */}
      {showModalGame4 && (
        <JuegoCuatroActividad2 
          isOpen={showModalGame4}
          onClose={handleCloseModalGame4}
        />
      )}

      {/* Game 5 Modal */}
      {showModalGame5 && (
        <JuegoCincoActividad2 
          isOpen={showModalGame5}
          onClose={handleCloseModalGame5}
        />
      )}
    </motion.div>
  );
}