'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

export default function Scene7Page() {

  // Track current activity URL for continue feature
  useActivityTracking();
//  const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
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
    const audio = new Audio('/audio/button/Bright.mp3');
    audio.volume = 0.7;
    audio.play().catch(console.warn);
    setVideoEnded(true);
    
    console.log('🎉 Scene7: Final scene video ended, saving progress for completed activity');
    
    // Save progress for scene7 and mark entire activity as completed
    const progressSaved = await saveProgress('actividad-1', 'scene7', 'completed', 100, {
      video_watched: true,
      activity_completed: true,
      completed_at: new Date().toISOString()
    });
    
    if (progressSaved) {
      console.log('✅ Scene7: Activity 1 completed successfully!');
    } else {
      console.error('❌ Scene7: Failed to save progress');
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

  const handleBackClick = async () => {
    console.log('🏠 Scene7: Returning to actividad-1 main page');
    // Go back to actividad-1 main page
    router.push('/actividad-1');
  };

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-300 to-yellow-300 flex items-center justify-center">
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
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-pink-300 via-blue-200 to-yellow-300" />

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
            <JugarButton onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
              src="/video/ACTIVIDAD-1-ESCENA-7.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
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
                                Haz completado la aventura.
                            </p>
                        </motion.div>
                        <motion.div
                            className="inline-block"
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ transformOrigin: 'center center' }}
                        >
                            <div className="whitespace-nowrap">
                                <JugarButton text="IR A LA PROXIMA AVENTURA!" onClick={handleBackClick} disabled={isAnimating} />
                            </div>
                        </motion.div>
                    </div>
                    
          )}
        </div>
      )}
    </motion.div>
  );
}