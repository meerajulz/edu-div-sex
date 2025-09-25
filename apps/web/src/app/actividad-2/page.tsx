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
import { playGameAudio, getDeviceAudioInfo } from '../utils/gameAudio';

const ActivityMenu = dynamic(() => import('../components/ActivityMenu/ActivityMenu'), { ssr: false });
const Ardilla = dynamic(() => import('../components/ModuleAnimations/Ardilla'), { ssr: false });
const SimpleAlex = dynamic(() => import('../components/ModuleAnimations/SimpleAlex'), { ssr: false });
const SunGif = dynamic(() => import('../components/ModuleAnimations/SunGif'), { ssr: false });
import { SimpleAlexRef } from '../components/ModuleAnimations/SimpleAlex';
import { ACTIVITY_2_CONFIG } from '../components/ActivityMenu/activityConfig';

export default function Actividad2Page() {
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
  const simpleAlexRef = useRef<SimpleAlexRef>(null);
  const [currentVolume, setCurrentVolume] = useState(0.9);
  const [deviceInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const info = getDeviceAudioInfo();
      console.log(`🎬 Activity2: Device audio info:`, info);
      return info;
    }
    return { isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false };
  });

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // Function to connect video element to Web Audio API for iOS volume control
  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      console.log(`🍎 Activity2 iPhone: Attempting to connect video to Web Audio API...`);
      console.log(`🍎 Activity2 iPhone: Video readyState: ${video.readyState}`);
      console.log(`🍎 Activity2 iPhone: AudioContext state: ${audioContext.state}`);

      // Check if video already connected to avoid double-connection
      if ((video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected) {
        console.log(`🍎 Activity2 iPhone: Video already connected to Web Audio API, skipping`);
        return;
      }

      // Create MediaElementSource from video
      const source = audioContext.createMediaElementSource(video);
      console.log(`🍎 Activity2 iPhone: MediaElementSource created successfully`);

      // CRITICAL: Use the EXACT same gain node that FloatingMenu volume buttons control
      let sharedGainNode = window.globalGainNode;

      if (!sharedGainNode) {
        // Create the shared gain node that FloatingMenu will also use
        sharedGainNode = audioContext.createGain();
        window.globalGainNode = sharedGainNode;
        console.log(`🍎 Activity2 iPhone: Created shared gainNode (FloatingMenu will use this same one)`);
      } else {
        console.log(`🍎 Activity2 iPhone: Using pre-existing shared gainNode`);
      }

      // Set initial volume
      sharedGainNode.gain.value = currentVolume;
      console.log(`🍎 Activity2 iPhone: Shared gainNode value set to: ${sharedGainNode.gain.value}`);

      // Connect: video -> sharedGainNode -> speakers
      source.connect(sharedGainNode);
      console.log(`🍎 Activity2 iPhone: Video source connected to shared gainNode`);

      sharedGainNode.connect(audioContext.destination);
      console.log(`🍎 Activity2 iPhone: Shared gainNode connected to AudioContext destination`);

      // Store same reference for both video and global controls
      window.videoGainNode = sharedGainNode;
      window.globalGainNode = sharedGainNode; // Ensure they're the same object
      (video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected = true;

      console.log(`🍎 Activity2 iPhone: ✅ Video SUCCESSFULLY connected to shared Web Audio API!`);
      console.log(`🍎 Activity2 iPhone: videoGainNode stored: ${!!window.videoGainNode}`);
      console.log(`🍎 Activity2 iPhone: globalGainNode stored: ${!!window.globalGainNode}`);
    } catch (e) {
      console.error('🍎 Activity2 iPhone: ❌ FAILED to connect video to Web Audio API:', e);
    }
  };

  // Debug mode for development
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
    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button Click Sound');
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
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
      const { volume } = event.detail;
      console.log(`🎵 Activity2: Received global volume change: ${volume} (deviceInfo.isIOS: ${deviceInfo.isIOS})`);

      // Apply volume immediately to video element if it exists and is loaded
      const video = videoRef.current;
      if (video && video.readyState > 0) {
        const isIPhone = /iPhone/.test(navigator?.userAgent || '');

        if (isIPhone) {
          // iPhone: Use Web Audio API gain node
          video.muted = false; // Ensure not muted
          video.volume = 1.0; // Keep at max, gain node controls volume

          if (window.videoGainNode) {
            window.videoGainNode.gain.value = volume;
            console.log(`📱 Activity2 iPhone: Applied volume ${volume} via Web Audio videoGainNode`);
          } else {
            console.warn(`📱 Activity2 iPhone: videoGainNode not available for volume ${volume}`);
          }
        } else {
          // Desktop/Android/iPad: Direct video volume (original behavior)
          video.muted = false;
          video.volume = volume;
          console.log(`🖥️ Activity2 Desktop/Android/iPad: Applied volume ${volume} directly to video`);
        }
      } else {
        console.log(`🎬 Activity2: Video not ready (readyState: ${video?.readyState}), setting volume for later`);
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
  console.log('🔒 Actividad-2: Session status changed:', status);
  console.log('🔒 Actividad-2: Session data:', session);
}, [session, status]);


  const handleVideoEnd = () => {
    cleanupAudio();
    setVideoEnded(true);
    setTimeout(() => setShowArdilla(true), 100);
    setTimeout(() => setShowAlex(true), 1800);
    setTimeout(() => {
      setShowActivityMenu(true);
      setShowSun(true);
      // Don't show continue button if user just completed an activity
      const justCompleted = localStorage.getItem('completedActivityId');
      if (!justCompleted) {
        setShowContinueButton(true);
      }
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
    setIsExiting(true);
    
    // Navigate to first scene of the section
    const firstScene = section.scenes[0];
    if (firstScene) {
      console.log('🎯 Setting pending navigation to:', firstScene);
      setPendingNavigation(firstScene);
    }

    // Background music will stop automatically when leaving page
  };

  const handleExitComplete = () => {
    console.log('🎯 Exit animation complete, navigating to:', pendingNavigation);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleJugarClick = () => {
    console.log('Start Activity 2');
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    markUserInteraction();
    setUserInteractionReceived(true);
    setNeedsInteraction(false);

    // Start background music using iOS-compatible audio
    playGameAudio('/audio/Softy.mp3', 0.4, 'Background-Music');

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
          <div className="absolute inset-0 z-50 bg-gradient-to-b from-purple-400 via-pink-300 to-orange-300" />

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
            <JugarButton text='Intimidad' onClick={handleJugarClick} />
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
              onLoadedData={() => {
                const video = videoRef.current;
                if (!video) return;

                // Apply volume when video loads
                video.volume = currentVolume;
                console.log(`🎬 Activity2: Video loaded, volume applied: ${currentVolume}`);
              }}
              onPlay={() => {
                const video = videoRef.current;
                if (!video) return;

                // When video starts playing, ensure it's unmuted and volume is applied
                video.muted = false;
                video.volume = currentVolume;
                console.log(`🎬 Activity2: Video started playing, unmuted: ${!video.muted}, volume set to: ${currentVolume}`);

                // Only for iPhone: Initialize Web Audio API
                const isIPhone = /iPhone/.test(navigator?.userAgent || '');

                if (isIPhone) {
                  console.log(`📱 Activity2 iPhone detected - initializing Web Audio API`);

                  try {
                    // CRITICAL: Initialize the SAME AudioContext that FloatingMenu will use
                    let sharedAudioContext = window.globalAudioContext;

                    if (!sharedAudioContext) {
                      console.log('🍎 Activity2 iPhone: Initializing shared AudioContext for video');
                      const AudioContext = window.AudioContext || window.webkitAudioContext;
                      if (AudioContext) {
                        sharedAudioContext = new AudioContext();
                        window.globalAudioContext = sharedAudioContext;

                        // ALSO initialize the gain node here so FloatingMenu can use it
                        if (!(window.globalGainNode)) {
                          const initialGainNode = sharedAudioContext.createGain();
                          initialGainNode.gain.value = currentVolume;
                          window.globalGainNode = initialGainNode;
                          console.log('🍎 Activity2 iPhone: Pre-created globalGainNode for FloatingMenu to use');
                        }
                      }
                    } else {
                      console.log('🍎 Activity2 iPhone: Using existing shared AudioContext');
                    }

                    if (sharedAudioContext) {
                      if (sharedAudioContext.state === 'suspended') {
                        sharedAudioContext.resume().then(() => {
                          console.log('🍎 Activity2 iPhone: Shared AudioContext resumed');
                          connectVideoToWebAudio(video, sharedAudioContext);
                        });
                      } else {
                        console.log('🍎 Activity2 iPhone: Shared AudioContext already running');
                        connectVideoToWebAudio(video, sharedAudioContext);
                      }
                    }
                  } catch (e) {
                    console.error('🍎 Activity2 iPhone: AudioContext setup failed:', e);
                  }
                } else {
                  console.log(`🖥️ Activity2 Desktop/Android/iPad: Using direct video volume (original behavior)`);
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
                  config={ACTIVITY_2_CONFIG}
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
          <div className="font-bold mb-1">Actividad-2 Debug</div>
          <div>👤 User: {session?.user?.username || session?.user?.email || 'none'}</div>
          <div>🏷️ Role: {(session?.user as { role?: string })?.role || 'none'}</div>
          <div>⚧️ Sex: {(session?.user as { sex?: string })?.sex || 'none'}</div>
          <div>📊 Status: {status}</div>
          <div>🎬 Video Ended: {videoEnded ? 'yes' : 'no'}</div>
          <div>🔊 Can Play Video: {canPlayVideo ? 'yes' : 'no'}</div>
          <div>👆 Needs Interaction: {needsInteraction ? 'yes' : 'no'}</div>
          <div className="text-yellow-300">Press Ctrl+D to toggle</div>
        </div>
      )}
    </div>
  );
}