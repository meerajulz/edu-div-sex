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
import ContinueButton from '../components/ContinueButton/ContinueButton';
import { playGameAudio, getDeviceAudioInfo, stopBackgroundMusic } from '../utils/gameAudio';
import { AVENTURA_4_CONFIG } from '../components/ActivityMenu/activityConfig';

const ActivityMenu = dynamic(() => import('../components/ActivityMenu/ActivityMenu'), { ssr: false });
const Ardilla = dynamic(() => import('../components/ModuleAnimations/Ardilla'), { ssr: false });
const SimpleAlex = dynamic(() => import('../components/ModuleAnimations/SimpleAlex'), { ssr: false });
const SunGif = dynamic(() => import('../components/ModuleAnimations/SunGif'), { ssr: false });
import { SimpleAlexRef } from '../components/ModuleAnimations/SimpleAlex';

export default function Aventura4NivelAvanzadoPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showArdilla, setShowArdilla] = useState(false);
  const [showAlex, setShowAlex] = useState(false);
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [showSun, setShowSun] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [canPlayVideo] = useState(false);

  const [isExiting, setIsExiting] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const simpleAlexRef = useRef<SimpleAlexRef>(null);
  const [deviceInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      return getDeviceAudioInfo();
    }
    return { isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false };
  });

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;
  const [isAnimating, setIsAnimating] = useState(false);

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
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume } = event.detail;
      const video = videoRef.current;
      if (video && video.readyState > 0) {
        video.muted = false;
        video.volume = volume;
      }
    };
    window.addEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    return () => window.removeEventListener('globalVolumeChange', handleVolumeChange as EventListener);
  }, [deviceInfo.isIOS]);

  useEffect(() => {
    const checkAudio = async () => {
      const needs = needsInteractionForAudio();
      setNeedsInteraction(needs);
      if (!needs) {
        try { await initAudio(); } catch (e) { console.warn('Audio auto init failed:', e); }
      }
    };
    checkAudio();
  }, []);

  // Skip intro on return visits
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('aventura-4-intro-seen') === 'true';
    if (hasSeenIntro) {
      setVideoEnded(true);
      setShowSun(true);
      setTimeout(() => setShowArdilla(true), 100);
      setTimeout(() => setShowAlex(true), 600);
      setTimeout(() => {
        setShowActivityMenu(true);
        setShowContinueButton(true);
      }, 1200);
    }
  }, []);

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  const playSound = () => {
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound');
  };

  const handleVideoEnd = () => {
    cleanupAudio();
    stopBackgroundMusic('aventura-4-bg');
    localStorage.setItem('aventura-4-intro-seen', 'true');
    setVideoEnded(true);
    setShowSun(true);
    setTimeout(() => setShowArdilla(true), 100);
    setTimeout(() => setShowAlex(true), 1800);
    setTimeout(() => {
      setShowActivityMenu(true);
      setShowContinueButton(true);
    }, 2800);
  };

  const handleSectionSelect = async (section: { scenes: string[]; soundClick?: string }) => {
    if (isNavigating) return;
    setIsNavigating(true);

    if (section.soundClick) {
      try {
        await new Promise<void>((resolve) => {
          const audio = new Audio(section.soundClick);
          audio.volume = 0.7;
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
          audio.play().catch(() => resolve());
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn('Could not play section audio:', error);
      }
    }

    if (simpleAlexRef.current) simpleAlexRef.current.stopSpeech();
    setShowContinueButton(false);
    cleanupAudio();
    stopBackgroundMusic('aventura-4-bg');
    setIsExiting(true);

    const firstScene = section.scenes[0];
    if (firstScene) setPendingNavigation(firstScene);
  };

  const handleExitComplete = () => {
    if (pendingNavigation) router.push(pendingNavigation);
  };

  const handleJugarClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => setIsAnimating(false), 800);
    markUserInteraction();
    setNeedsInteraction(false);
    // No intro video yet — skip directly to menu
    handleVideoEnd();
  };

  const exitVariants = {
    exit: {
      y: '120vh',
      opacity: 0,
      transition: { duration: 1.5, ease: 'easeInOut' }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {!videoEnded && (!canPlayVideo || needsInteraction) && (
        <>
          <div className="absolute inset-0 z-50 bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-400" />
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
                animate={{ y: [0, -20, 0], x: [0, Math.random() * 20 - 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
              />
            ))}
          </div>
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <motion.div
              animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <JugarButton text="Nos entendemos y respetamos" onClick={handleJugarClick} />
            </motion.div>
          </div>
        </>
      )}

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      <ContinueButton
        showWhen={showContinueButton}
        onNavigate={(url) => {
          setShowContinueButton(false);
          cleanupAudio();
          stopBackgroundMusic('aventura-4-bg');
          setIsExiting(true);
          setPendingNavigation(url);
        }}
        onHide={() => setShowContinueButton(false)}
      />

      {isExiting && (
        <div className="fixed inset-0 bg-gradient-to-b from-yellow-200 via-orange-200 to-pink-300 z-0" />
      )}

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
              autoPlay
              playsInline
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
                <SimpleAlex ref={simpleAlexRef} isVisible={true} />
              </motion.div>
            )}

            {showActivityMenu && (
              <>
                {isNavigating && (
                  <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-lg flex items-center justify-center">
                    <div className="text-white text-xl font-bold animate-pulse">Cargando...</div>
                  </div>
                )}
                <div className="w-full px-6 pb-6 z-30 flex justify-center">
                  <ActivityMenu
                    isVisible={true}
                    config={AVENTURA_4_CONFIG}
                    onSectionClick={handleSectionSelect}
                    isNavigating={isNavigating}
                    activeItemScale={2}
                  />
                </div>
              </>
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
