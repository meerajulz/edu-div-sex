'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Scene5Page() {
 
  // Track current activity URL for continue feature
  useActivityTracking();
// const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [videoEnded, setVideoEnded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleJugarClick = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = async () => {
    setVideoEnded(true);
    console.log('🎬 Scene5: Video ended, saving progress and moving to scene6');
    
    const progressSaved = await saveProgress('actividad-1', 'scene5', 'completed', 100, {
      video_watched: true,
      completed_at: new Date().toISOString()
    });
    
    if (progressSaved) {
      console.log('✅ Scene5: Progress saved successfully');
      setTimeout(() => {
        router.push('/actividad-1/scene6');
      }, 200);
    } else {
      console.error('❌ Scene5: Failed to save progress, but continuing to next scene');
      router.push('/actividad-1/scene6');
    }
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

  const handleButtonClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      handleJugarClick();
    }, 800);
  };

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-300 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-400 via-blue-200 to-blue-300" />

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
        <LogoComponent configKey="actividad-1-scene1" />
      </div>

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='Continuar...' onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-10"
            src="/video/ACTIVIDAD-1-ESCENA-5.mp4"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
          />
        </div>
      )}
    </motion.div>
  );
}
