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
import { ACTIVITY_4_CONFIG } from '../components/ActivityMenu/activityConfig';

export default function Actividad4Page() {
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

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  const [showContinueButton, setShowContinueButton] = useState(false);
  const simpleAlexRef = useRef<SimpleAlexRef>(null);
  const [currentVolume, setCurrentVolume] = useState(0.9);
  const [deviceInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const info = getDeviceAudioInfo();
      console.log(`🎬 Activity4: Device audio info:`, info);
      return info;
    }
    return { isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false };
  });

  // Function to connect video element to Web Audio API for iOS volume control
  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      console.log(`🍎 Activity4 iPhone: Attempting to connect video to Web Audio API...`);
      console.log(`🍎 Activity4 iPhone: Video readyState: ${video.readyState}`);
      console.log(`🍎 Activity4 iPhone: AudioContext state: ${audioContext.state}`);

      // Check if video already connected to avoid double-connection
      if ((video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected) {
        console.log(`🍎 Activity4 iPhone: Video already connected to Web Audio API, skipping`);
        return;
      }

      // Create MediaElementSource from video
      const source = audioContext.createMediaElementSource(video);
      console.log(`🍎 Activity4 iPhone: MediaElementSource created successfully`);

      // CRITICAL: Use the EXACT same gain node that FloatingMenu volume buttons control
      let sharedGainNode = window.globalGainNode;

      if (!sharedGainNode) {
        // Create the shared gain node that FloatingMenu will also use
        sharedGainNode = audioContext.createGain();
        window.globalGainNode = sharedGainNode;
        console.log(`🍎 Activity4 iPhone: Created shared gainNode (FloatingMenu will use this same one)`);
      } else {
        console.log(`🍎 Activity4 iPhone: Using pre-existing shared gainNode`);
      }

      // Set initial volume
      sharedGainNode.gain.value = currentVolume;
      console.log(`🍎 Activity4 iPhone: Shared gainNode value set to: ${sharedGainNode.gain.value}`);

      // Connect: video -> sharedGainNode -> speakers
      source.connect(sharedGainNode);
      console.log(`🍎 Activity4 iPhone: Video source connected to shared gainNode`);

      sharedGainNode.connect(audioContext.destination);
      console.log(`🍎 Activity4 iPhone: Shared gainNode connected to AudioContext destination`);

      // Store same reference for both video and global controls
      window.videoGainNode = sharedGainNode;
      window.globalGainNode = sharedGainNode; // Ensure they're the same object

      // Mark video as connected to prevent duplicate connections
      (video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected = true;
      console.log(`🍎 Activity4 iPhone: Video successfully connected to Web Audio API for volume control`);

    } catch (error) {
      console.error(`🍎 Activity4 iPhone: Failed to connect video to Web Audio API:`, error);
    }
  };

  // Debug mode for development
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');

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

  const [isAnimating, setIsAnimating] = useState(false);

  const playSound = () => {
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Activity 4 Button Sound');
  };

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

// Hot key for toggling debug mode in development
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        setShowDebug(prev => !prev);
        console.log(`Debug mode ${!showDebug ? 'enabled' : 'disabled'}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }
}, [showDebug]);

// Log session status changes
useEffect(() => {
  console.log('🔒 Actividad-4: Session status changed:', status);
  console.log('🔒 Actividad-4: Session data:', session);
}, [session, status]);

// Listen for global volume changes from FloatingMenu
useEffect(() => {
  const handleGlobalVolumeChange = (e: CustomEvent) => {
    const { volume, isIPhone, isIPad } = e.detail;
    console.log(`🎵 Activity4: Received global volume change: ${volume} (iPhone: ${isIPhone}, iPad: ${isIPad})`);
    setCurrentVolume(volume);

    // Apply volume to video element
    const video = videoRef.current;
    if (video && video.readyState > 0) {
      if (isIPhone) {
        // iPhone: Use Web Audio API gain node
        video.muted = false;
        video.volume = 1.0; // Keep at max, gain node controls volume

        const sharedGainNode = window.globalGainNode || window.videoGainNode;
        if (sharedGainNode && sharedGainNode.gain) {
          sharedGainNode.gain.value = volume;
          console.log(`📱 Activity4 iPhone: Volume applied via shared gainNode: ${volume}`);
        }
      } else if (isIPad) {
        // iPad: Direct volume control
        video.volume = volume;
        video.muted = volume === 0;
        console.log(`🔲 Activity4 iPad: Applied volume ${volume} directly (muted: ${volume === 0})`);
      } else {
        // Desktop/Android: Direct video volume
        video.muted = false;
        video.volume = volume;
        console.log(`🖥️ Activity4 Desktop/Android: Applied volume ${volume} directly`);
      }
    }
  };

  window.addEventListener('globalVolumeChange', handleGlobalVolumeChange as EventListener);
  return () => window.removeEventListener('globalVolumeChange', handleGlobalVolumeChange as EventListener);
}, [deviceInfo.isIOS]);

  const handleVideoEnd = () => {
    cleanupAudio();
    // Stop background music when video ends
    stopBackgroundMusic('actividad-4-bg');
    setVideoEnded(true);
    setTimeout(() => setShowArdilla(true), 100);
    setTimeout(() => setShowAlex(true), 1800);
    setTimeout(() => {
      setShowActivityMenu(true);
      setShowSun(true);
      setShowContinueButton(true);
    }, 0);
  };

  const handleSectionSelect = (section: { scenes: string[] }) => {
    console.log('🎯 Section selected:', section);
    console.log('🎯 First scene:', section.scenes[0]);

    // Stop SimpleAlex speech when ActivityMenu label is clicked
    if (simpleAlexRef.current) {
      simpleAlexRef.current.stopSpeech();
    }

    setShowContinueButton(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    cleanupAudio();
    // Stop background music when leaving activity
    stopBackgroundMusic('actividad-4-bg');
    setIsExiting(true);

    // Navigate to first scene of the section
    const firstScene = section.scenes[0];
    if (firstScene) {
      console.log('🎯 Setting pending navigation to:', firstScene);
      setPendingNavigation(firstScene);
    }

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
    console.log('🎯 Exit animation complete, navigating to:', pendingNavigation);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleJugarClick = async () => {
    console.log('Start Activity 4');
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    markUserInteraction();
    setUserInteractionReceived(true);
    setNeedsInteraction(false);

    // Initialize audio system properly for volume control
    try {
      await initAudio();
      console.log('🍎 Activity4: Audio initialized for volume control');
    } catch (e) {
      console.warn('Activity4: Audio initialization failed:', e);
    }

    // Start background music using new background music system
    // This will respond to volume changes from FloatingMenu
    playBackgroundMusic('/audio/Softy.mp3', 0.4, 'actividad-4-bg');

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
      {/* Only show animated background and button BEFORE video */}
      {!videoEnded && (!canPlayVideo || needsInteraction) && (
        <>
          <div className="absolute inset-0 z-50 bg-gradient-to-b from-blue-400 via-cyan-300 to-teal-300" />

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
            <JugarButton text='Cuido de mi sexualidad' onClick={handleJugarClick} />
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
          // Stop background music when leaving activity
          stopBackgroundMusic('actividad-4-bg');
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
              src="/video/INTRO_ACTIVIDAD-1.mp4"
              autoPlay
              playsInline
              muted={needsInteraction && !userInteractionReceived}
              onEnded={handleVideoEnd}
              onError={(e) => {
                console.error('Video failed to load:', e);
                console.log('Skipping video and showing activity menu directly');
                handleVideoEnd();
              }}
              onLoadedMetadata={async () => {
                console.log(`🎬 Activity4: Video metadata loaded`);
                const video = videoRef.current;
                if (!video) return;

                // Determine device type
                const isIPhone = /iPhone/.test(navigator?.userAgent || '');
                const isIPad = /iPad/.test(navigator?.userAgent || '') ||
                             (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

                // Initialize audio for all devices
                try {
                  await initAudio();
                  console.log('🍎 Activity4: Audio initialized');
                } catch (e) {
                  console.warn('Activity4: Audio init failed:', e);
                }

                if (isIPhone) {
                  console.log(`📱 Activity4 iPhone: Setting up Web Audio API for volume control`);

                  // Get or create AudioContext for iPhone volume control
                  if (!window.globalAudioContext) {
                    window.globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                    console.log(`📱 Activity4 iPhone: AudioContext created`);
                  }

                  if (window.globalAudioContext.state === 'suspended') {
                    await window.globalAudioContext.resume();
                  }

                  // Connect video to Web Audio API for volume control
                  connectVideoToWebAudio(video, window.globalAudioContext);
                } else if (isIPad) {
                  // For iPad, initialize audio context for playGameAudio to work
                  try {
                    let sharedAudioContext = window.sharedAudioContext;
                    if (!sharedAudioContext) {
                      sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                      window.sharedAudioContext = sharedAudioContext;
                    }

                    if (sharedAudioContext.state === 'suspended') {
                      await sharedAudioContext.resume();
                    }
                    console.log(`🔲 Activity4 iPad: Audio context initialized for playGameAudio`);
                  } catch (error) {
                    console.error('🔲 Activity4 iPad: Error setting up audio context:', error);
                  }
                }
              }}
              onCanPlay={() => {
                console.log(`🎬 Activity4: Video can play`);
                const video = videoRef.current;
                if (!video) return;

                // Determine device type and apply volume
                const isIPhone = /iPhone/.test(navigator?.userAgent || '');
                const isIPad = /iPad/.test(navigator?.userAgent || '') ||
                             (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

                if (isIPhone) {
                  video.muted = false;
                  video.volume = 1.0; // iPhone uses Web Audio for volume control
                  console.log(`📱 Activity4 iPhone: Video ready, using Web Audio volume control`);
                } else if (isIPad) {
                  video.volume = currentVolume;
                  video.muted = currentVolume === 0;
                  console.log(`🔲 Activity4 iPad: Video ready, direct volume: ${currentVolume} (muted: ${currentVolume === 0})`);
                } else {
                  video.muted = false;
                  video.volume = currentVolume;
                  console.log(`🖥️ Activity4 Desktop/Android: Video ready, volume: ${currentVolume}`);
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
              <div className="w-full px-6 pb-6 z-30 flex justify-center">
                <ActivityMenu
                  isVisible={true}
                  config={ACTIVITY_4_CONFIG}
                  onSectionClick={handleSectionSelect}
                />
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

      {/* Debug panel */}
      {showDebug && (
        <div className="fixed bottom-0 left-0 bg-black/70 text-white p-2 max-w-xs max-h-40 overflow-auto text-xs z-[1000]">
          <div className="font-bold mb-1">Actividad-4 Debug</div>
          <div>👤 User: {session?.user?.username || session?.user?.email || 'none'}</div>
          <div>🏷️ Role: {(session?.user as { role?: string })?.role || 'none'}</div>
          <div>⚧️ Sex: {(session?.user as { sex?: string })?.sex || 'none'}</div>
          <div>📊 Status: {status}</div>
          <div>🎬 Video Ended: {videoEnded ? 'yes' : 'no'}</div>
          <div>🔊 Can Play Video: {canPlayVideo ? 'yes' : 'no'}</div>
          <div>👆 Needs Interaction: {needsInteraction ? 'yes' : 'no'}</div>
          <div>🍎 iOS: {deviceInfo.isIOS ? 'yes' : 'no'}</div>
          <div>🔊 Volume: {currentVolume.toFixed(2)}</div>
          <div className="text-yellow-300">Press Ctrl+D to toggle</div>
        </div>
      )}
    </div>
  );
}