'use client';

import React, { useEffect, useRef, useState } from 'react';
import FloatingMenu from '../components/FloatingMenu/FloatingMenu';
import {
  markUserInteraction,
  needsInteractionForAudio,
  initAudio,
  cleanupAudio
} from '../utils/audioPlayer';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import JugarButton from '../components/JugarButton/JugarButton';

const ActivityLabels = dynamic(() => import('../components/ModuleAnimations/ActivityLabels'), { ssr: false });
const Ardilla = dynamic(() => import('../components/ModuleAnimations/Ardilla'), { ssr: false });
const SimpleAlex = dynamic(() => import('../components/ModuleAnimations/SimpleAlex'), { ssr: false });
const SunGif = dynamic(() => import('../components/ModuleAnimations/SunGif'), { ssr: false });



export default function Aventura1Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showArdilla, setShowArdilla] = useState(false);
  const [showAlex, setShowAlex] = useState(false);
  const [showActivityLabels, setShowActivityLabels] = useState(false);
  const [showSun, setShowSun] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [userInteractionReceived, setUserInteractionReceived] = useState(false);
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  const [isExiting, setIsExiting] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
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

  //BUTTON
  
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

  //

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

useEffect(() => {
  const checkAudio = async () => {
    const needs = needsInteractionForAudio();
    setNeedsInteraction(needs);

    if (!needs) {
      try {
        await initAudio();
      } catch (e) {
        console.warn('Audio auto init failed:', e);
      }
    }
  };

  checkAudio();
}, []);

  const handleVideoEnd = () => {
    cleanupAudio();
    setVideoEnded(true);
    setTimeout(() => setShowArdilla(true), 100);
    setTimeout(() => setShowAlex(true), 1800);
    setTimeout(() => {
      setShowActivityLabels(true);
      setShowSun(true);
    }, 0);
  };

  const handleActivitySelect = (id: number, url: string) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    cleanupAudio();
    setIsExiting(true);
    setPendingNavigation(url);

    if (bgMusicRef.current) {
      try {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      } catch (e) {
        console.warn('Failed to stop background music:', e);
      }
    }

  };

  const handleExitComplete = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleJugarClick = () => {

    console.log('Start Scene 2 game');
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
     // handleJugarClick();
    }, 800);

    markUserInteraction();
    setUserInteractionReceived(true);
    setNeedsInteraction(false);

    // Start background music
    const music = new Audio('/audio/Softy.mp3');
    music.loop = true;
    music.volume = 0.5;
    music.play().catch(console.warn);
    bgMusicRef.current = music;

    //initAudio().then(setAudioInitialized).catch(console.warn);
    setCanPlayVideo(true);
  };

  const exitVariants = {
    exit: {
      y: '-120vh',
      opacity: 0,
      transition: { duration: 1.5, ease: 'easeInOut' }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Only show animated background and button BEFORE video */}
      {!videoEnded && (!canPlayVideo || needsInteraction) && (
        <>
          <div className="absolute inset-0 z-50 bg-gradient-to-b from-indigo-400 via-yellow-200 to-purple-300" />

          {/* Floating bubbles */}
          <div className="absolute inset-0 z-50">
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

          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <motion.div animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}} transition={{ duration: 0.8, ease: 'easeInOut' }}>
            <JugarButton text='Actividad Uno' onClick={handleJugarClick} />
            </motion.div>
          </div>
        </>
      )}

      {/* Floating menu */}
      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      <motion.div
        className="absolute inset-0"
        variants={exitVariants}
        animate={isExiting ? 'exit' : 'initial'}
        onAnimationComplete={isExiting ? handleExitComplete : undefined}
      >
        <div className="absolute" style={containerStyle}>
          {!videoEnded && canPlayVideo ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
              src="/video/INTRO_ACTIVIDAD-1.mp4"
              autoPlay
              playsInline
              muted={needsInteraction && !userInteractionReceived}
              onEnded={handleVideoEnd}
            />
          ) : (
            <Image
              src="/image/INTRO_MODULO-1.jpg"
              width={containerDimensions.width}
              height={containerDimensions.height}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}
        </div>

        {videoEnded && (
          <>
            {showArdilla && (
              <motion.div
                className="absolute bottom-6 left-6 z-40 w-[260px] h-[260px]"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              >
                <Ardilla isVisible={true} bunnyShown={true} zIndex={50} browserWidth={1200} />
              </motion.div>
            )}

            {showAlex && (
              <motion.div
                className="absolute bottom-[-30%] left-[-40%] z-40 w-[50%] h-full pointer-events-none"
                animate={{ x: 0, opacity: 1 }}
                initial={{ x: '-100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              >
                <SimpleAlex isVisible={true} />
              </motion.div>
            )}

            {showActivityLabels && (
              <div className="w-full px-6 pb-6 z-30 flex justify-center">
                <ActivityLabels isVisible={true} onLabelClick={handleActivitySelect} />
              </div>
            )}

            {showSun && (
              <div className="absolute top-0 left-0 z-30 w-full h-[300px]">
                <SunGif />
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}