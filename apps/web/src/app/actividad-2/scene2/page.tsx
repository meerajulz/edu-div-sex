'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import JuegoDosActividad2 from './JuegoDosActividad2/JuegoDosActividad2';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Actividad2Scene2Page() {
 
  // Track current activity URL for continue feature
  useActivityTracking();
// const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
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

  const handleVideoEnd = async () => {
    setShowVideo(false);
    setGameCompleted(true);
    
    console.log('🎬 Actividad2-Scene2: Video ended, saving progress and moving to scene3');
    
    const progressSaved = await saveProgress('actividad-2', 'scene2', 'completed', 100, {
      video_watched: true,
      completed_at: new Date().toISOString()
    });
    
    if (progressSaved) {
      console.log('✅ Actividad2-Scene2: Progress saved successfully');
      setTimeout(() => {
        router.push('/actividad-2/scene3');
      }, 200);
    } else {
      console.error('❌ Actividad2-Scene2: Failed to save progress, but continuing');
      router.push('/actividad-2/scene3');
    }
  };

  const handleGameComplete = () => {
    setShowGameModal(false);
    router.push('/actividad-2/scene3');
  };

  const handleCloseGame = () => {
    setShowGameModal(false);
    // Stay on current page
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 via-blue-200 to-pink-300 z-0" />

      <div className="absolute inset-0 z-10">
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

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>
          <div className="">
            <LogoComponent configKey="actividad-2-scene1" />
          </div>

      {!showVideo && !showGameModal && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='Continuar...' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      {showVideo && (
        <div className="absolute" style={containerStyle}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDAD-2-ESCENA-2.mp4"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
          />
        </div>
      )}

      {/* Game Component */}
      <JuegoDosActividad2
        isVisible={showGameModal}
        onClose={handleCloseGame}
        onGameComplete={handleGameComplete}
        userId="user123" // You can pass the actual user ID here
      />
     
      {/* After the game ends, show the final button */}
      {gameCompleted && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -360] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton
              text="Continuar..."
              onClick={() => router.push('/actividad-2/scene3')}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}