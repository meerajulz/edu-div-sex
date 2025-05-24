
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import ButtonGlobe from '../../components/ButtonGlobe/ButtonGlobe';
import Cris from '../../components/Cris/Cris';
import JuegoUno from './JuegoUno/JuegoUno';

import Image from 'next/image';

export default function Scene1Page() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCris, setShowCris] = useState(true);
  const [showJuegoUno, setShowJuegoUno] = useState(false);

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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleBackClick = () => {
    router.push('/actividad-1');
  };
  
  const handleJugarClick = () => {
    setShowVideo(true);
  };

  const [isAnimating, setIsAnimating] = useState(false);

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleButtonClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      handleJugarClick();
    }, 800);
  };


  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleGlobeButtonClick = () => {
    console.log('Globe button clicked - ready for next page navigation');
    setShowJuegoUno(true);
    // setShowCris(false);
   
  };

  const pageVariants = {
    initial: { y: '100vh', opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeOut' }
    },
    exit: {
      y: '-100vh',
      opacity: 0,
      transition: { duration: 0.8, ease: 'easeIn' }
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200" />
      <div className="absolute inset-0 z-1">
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
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {!showVideo ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>

          <motion.button
            className="mt-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackClick}
          >
            ← Volver a Actividades
          </motion.button>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
              src="/video/ACTIVIDA_1-ESCENA-1.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <>
              <Image
                width={containerDimensions.width}
                height={containerDimensions.height}
                src="/image/escena_1/bg.jpg"
                alt="Escena 1 Background"
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
              <div className="absolute  inset-0">
                <ButtonGlobe
                  onButtonClick={handleGlobeButtonClick}
                  isVisible={true}
                />
                <Cris isVisible={showCris} />
              </div>
              <JuegoUno 
                onClose={() => {
                setShowJuegoUno(false)}}
                isVisible={showJuegoUno} />
            </>
          )}
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/10 to-transparent z-5" />
    </motion.div>
  );
}


