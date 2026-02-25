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
import { useSession } from 'next-auth/react';
import ContinueButton from '../components/ContinueButton/ContinueButton';
import { playGameAudio, getDeviceAudioInfo, playBackgroundMusic, stopBackgroundMusic } from '../utils/gameAudio';

const ActivityMenu = dynamic(() => import('../components/ActivityMenu/ActivityMenu'), { ssr: false });
const Ardilla = dynamic(() => import('../components/ModuleAnimations/Ardilla'), { ssr: false });
const SimpleAlex = dynamic(() => import('../components/ModuleAnimations/SimpleAlex'), { ssr: false });
const SunGif = dynamic(() => import('../components/ModuleAnimations/SunGif'), { ssr: false });
import { SimpleAlexRef } from '../components/ModuleAnimations/SimpleAlex';
import { AVENTURA_1_CONFIG } from '../components/ActivityMenu/activityConfig';

// TODO: replace with /video/INTRO_AVENTURA-1.mp4 when the video is ready
const INTRO_VIDEO_SRC = '/video/INTRO_ACTIVIDAD-1.mp4';

export default function Aventura1NivelAvanzadoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showArdilla, setShowArdilla] = useState(false);
  const [showAlex, setShowAlex] = useState(false);
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [showSun, setShowSun] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [userInteractionReceived, setUserInteractionReceived] = useState(false);
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  const [isExiting, setIsExiting] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const simpleAlexRef = useRef<SimpleAlexRef>(null);
  const [currentVolume, setCurrentVolume] = useState(0.9);
  const [deviceInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const info = getDeviceAudioInfo();
      return info;
    }
    return { isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false };
  });

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // Connect video element to Web Audio API for iOS volume control
  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      if ((video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected) {
        return;
      }

      const source = audioContext.createMediaElementSource(video);

      let sharedGainNode = window.globalGainNode;
      if (!sharedGainNode) {
        sharedGainNode = audioContext.createGain();
        window.globalGainNode = sharedGainNode;
      }

      sharedGainNode.gain.value = currentVolume;
      source.connect(sharedGainNode);
      sharedGainNode.connect(audioContext.destination);

      window.videoGainNode = sharedGainNode;
      window.globalGainNode = sharedGainNode;
      (video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected = true;
    } catch (e) {
      console.error('Aventura-1 iPhone: FAILED to connect video to Web Audio API:', e);
    }
  };

  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');

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

  const [isAnimating, setIsAnimating] = useState(false);

  const playSound = () => {
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound');
  };

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  // Initialize video volume from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) {
      setCurrentVolume(parseFloat(savedVolume));
    }
  }, []);

  // Listen for global volume changes from FloatingMenu
  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume, isIPhone, isIPad } = event.detail;

      const video = videoRef.current;
      if (video && video.readyState > 0) {
        if (isIPhone) {
          video.muted = false;
          video.volume = 1.0;
          if (window.videoGainNode) {
            window.videoGainNode.gain.value = volume;
          }
        } else if (isIPad) {
          video.volume = volume;
          video.muted = volume === 0;
        } else {
          video.muted = false;
          video.volume = volume;
        }
      }

      setCurrentVolume(volume);
    };

    window.addEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    return () => {
      window.removeEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    };
  }, [deviceInfo.isIOS]);

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

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'd' && e.ctrlKey) {
          setShowDebug(prev => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDebug]);

  // Skip intro video on return visits (user has already seen it)
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('aventura-1-intro-seen') === 'true';
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

  const handleVideoEnd = () => {
    cleanupAudio();
    stopBackgroundMusic('aventura-1-bg');
    localStorage.setItem('aventura-1-intro-seen', 'true');
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

    if (simpleAlexRef.current) {
      simpleAlexRef.current.stopSpeech();
    }

    setShowContinueButton(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    cleanupAudio();
    stopBackgroundMusic('aventura-1-bg');
    setIsExiting(true);

    const firstScene = section.scenes[0];
    if (firstScene) {
      setPendingNavigation(firstScene);
    }
  };

  const handleExitComplete = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleJugarClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    markUserInteraction();
    setUserInteractionReceived(true);
    setNeedsInteraction(false);

    playBackgroundMusic('/audio/Softy.mp3', 0.4, 'aventura-1-bg');
    setCanPlayVideo(true);
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
      {/* Animated background + JugarButton shown BEFORE video starts */}
      {!videoEnded && (!canPlayVideo || needsInteraction) && (
        <>
          <div className="absolute inset-0 z-50 bg-gradient-to-b from-purple-500 via-pink-400 to-orange-300" />

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
            <motion.div
              animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <JugarButton text="Descubriendo mi sexualidad" onClick={handleJugarClick} />
            </motion.div>
          </div>
        </>
      )}

      {/* Floating menu */}
      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {/* Continue where you left off button */}
      <ContinueButton
        showWhen={showContinueButton}
        onNavigate={(url) => {
          setShowContinueButton(false);
          cleanupAudio();
          stopBackgroundMusic('aventura-1-bg');
          setIsExiting(true);
          setPendingNavigation(url);
        }}
        onHide={() => setShowContinueButton(false)}
      />

      {/* Blue sky background during exit animation */}
      {isExiting && (
        <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200 z-0" />
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
              src={INTRO_VIDEO_SRC}
              autoPlay
              playsInline
              muted={needsInteraction && !userInteractionReceived}
              onEnded={handleVideoEnd}
              onLoadedData={() => {
                const video = videoRef.current;
                if (!video) return;
                video.volume = currentVolume;
              }}
              onPlay={async () => {
                const video = videoRef.current;
                if (!video) return;

                const isIPhone = /iPhone/.test(navigator?.userAgent || '');
                const isIPad = /iPad/.test(navigator?.userAgent || '') ||
                  (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

                if (isIPhone) {
                  video.muted = false;
                  video.volume = 1.0;
                } else if (isIPad) {
                  video.volume = currentVolume;
                  video.muted = currentVolume === 0;
                } else {
                  video.muted = false;
                  video.volume = currentVolume;
                }

                try {
                  await initAudio();
                } catch (e) {
                  console.warn('Aventura-1: Audio init failed:', e);
                }

                if (isIPhone) {
                  try {
                    let sharedAudioContext = window.globalAudioContext;
                    if (!sharedAudioContext) {
                      const AudioContext = window.AudioContext || window.webkitAudioContext;
                      if (AudioContext) {
                        sharedAudioContext = new AudioContext();
                        window.globalAudioContext = sharedAudioContext;
                        if (!window.globalGainNode) {
                          const initialGainNode = sharedAudioContext.createGain();
                          initialGainNode.gain.value = currentVolume;
                          window.globalGainNode = initialGainNode;
                        }
                      }
                    }
                    if (sharedAudioContext) {
                      if (sharedAudioContext.state === 'suspended') {
                        await sharedAudioContext.resume();
                      }
                      connectVideoToWebAudio(video, sharedAudioContext);
                    }
                  } catch (e) {
                    console.error('Aventura-1 iPhone: AudioContext setup failed:', e);
                  }
                } else if (isIPad) {
                  try {
                    let sharedAudioContext = window.sharedAudioContext;
                    if (!sharedAudioContext) {
                      sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                      window.sharedAudioContext = sharedAudioContext;
                    }
                    if (sharedAudioContext.state === 'suspended') {
                      await sharedAudioContext.resume();
                    }
                  } catch (error) {
                    console.error('Aventura-1 iPad: Error setting up audio context:', error);
                  }
                }
              }}
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
                  <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white text-xl font-bold animate-pulse">
                      Cargando...
                    </div>
                  </div>
                )}
                <div className="w-full px-6 pb-6 z-30 flex justify-center">
                  <ActivityMenu
                    isVisible={true}
                    config={AVENTURA_1_CONFIG}
                    onSectionClick={handleSectionSelect}
                    isNavigating={isNavigating}
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

      {/* Debug panel */}
      {showDebug && (
        <div className="fixed bottom-0 left-0 bg-black/70 text-white p-2 max-w-xs max-h-40 overflow-auto text-xs z-[1000]">
          <div className="font-bold mb-1">Aventura-1 Debug</div>
          <div>User: {session?.user?.username || session?.user?.email || 'none'}</div>
          <div>Role: {(session?.user as { role?: string })?.role || 'none'}</div>
          <div>Status: {status}</div>
          <div>Video Ended: {videoEnded ? 'yes' : 'no'}</div>
          <div>Can Play Video: {canPlayVideo ? 'yes' : 'no'}</div>
          <div>Needs Interaction: {needsInteraction ? 'yes' : 'no'}</div>
          <div className="text-yellow-300">Ctrl+D to toggle</div>
        </div>
      )}
    </div>
  );
}
