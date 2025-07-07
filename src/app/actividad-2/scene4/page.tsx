'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import { useState, useRef, useEffect } from 'react';
import JuegoCuatroActividad2 from './JuegoCuatroActividad2/JuegoCuatroActividad2';
import JuegoCincoActividad2 from './JuegoCincoActividad2/JuegoCincoActividad2';

export default function Actividad2Scene4Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showModalGame4, setShowModalGame4] = useState(false);
  const [showModalGame5, setShowModalGame5] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [game4Completed, setGame4Completed] = useState(false);
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
      if (!videoEnded) {
        setShowVideo(true);
      } else if (!game4Completed) {
        // Show game 4 modal if game 4 hasn't been completed yet
        setShowModalGame4(true);
      } else {
        // Show game 5 modal if game 4 is already completed
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
  };

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

      {/* JugarButton - shows initially and after video ends */}
      {(!showVideo || videoEnded) && !showModalGame4 && !showModalGame5 && (
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