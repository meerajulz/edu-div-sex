'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { playGameAudio, getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';

export default function Scene2Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
//const { data: session, status } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // iOS volume control state
  const [deviceInfo, setDeviceInfo] = useState({ isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false });
  const [currentVolume, setCurrentVolume] = useState(0.8);

  // Function to connect video element to Web Audio API for iOS volume control
  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      console.log(`🍎 Scene2 iPhone: Attempting to connect video to Web Audio API...`);
      console.log(`🍎 Scene2 iPhone: Video readyState: ${video.readyState}`);

      // Check if video already connected to avoid double-connection
      if ((video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected) {
        console.log(`🍎 Scene2 iPhone: Video already connected to Web Audio API`);
        return;
      }

      // Create MediaElementSource from video
      const source = audioContext.createMediaElementSource(video);
      console.log(`🍎 Scene2 iPhone: Created MediaElementSource`);

      // Get or create shared gain node from FloatingMenu
      let sharedGainNode = window.sharedGainNode;
      if (!sharedGainNode) {
        console.log(`🍎 Scene2 iPhone: Creating new shared gain node`);
        sharedGainNode = audioContext.createGain();
        sharedGainNode.gain.value = currentVolume;
        window.sharedGainNode = sharedGainNode;
        sharedGainNode.connect(audioContext.destination);
      }

      // Connect: video -> sharedGainNode -> speakers
      source.connect(sharedGainNode);
      window.videoGainNode = sharedGainNode;
      (video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected = true;

      console.log(`🍎 Scene2 iPhone: ✅ Successfully connected video to Web Audio API`);
    } catch (e) {
      console.error('🍎 Scene2 iPhone: ❌ FAILED to connect video to Web Audio API:', e);
    }
  };

  useEffect(() => {
    // Initialize device info for iOS volume control
    const info = getDeviceAudioInfo();
    setDeviceInfo(info);
    console.log('📱 Scene2: Device info initialized:', info);

    // Initialize video volume from localStorage
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) {
      setCurrentVolume(parseFloat(savedVolume));
    }
  }, []);

  // Listen for global volume changes from FloatingMenu
  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume, isIPhone, isIPad } = event.detail;
      console.log(`🎵 Scene2: Received global volume change: ${volume} (iPhone: ${isIPhone}, iPad: ${isIPad})`);

      // Apply volume to video element if it exists
      const video = videoRef.current;
      if (video && video.readyState > 0) {
        if (isIPhone) {
          video.muted = false;
          video.volume = 1.0;
          if (window.videoGainNode) {
            window.videoGainNode.gain.value = volume;
            console.log(`📱 Scene2 iPhone: Applied volume ${volume} via Web Audio`);
          }
        } else if (isIPad) {
          video.volume = volume;
          video.muted = volume === 0;
          console.log(`🔲 Scene2 iPad: Applied volume ${volume} directly (muted: ${volume === 0})`);
        } else {
          video.muted = false;
          video.volume = volume;
          console.log(`🖥️ Scene2 Desktop/Android: Applied volume ${volume} directly`);
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
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound');
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
    console.log('🎬 Scene2: Video ended, saving progress and moving to scene3');
    
    // Save progress for scene2
    const progressSaved = await saveProgress('actividad-1', 'scene2', 'completed', 100, {
      video_watched: true,
      completed_at: new Date().toISOString()
    });
    
    if (progressSaved) {
      console.log('✅ Scene2: Progress saved successfully');
      // Small delay to ensure progress is saved before navigation
      setTimeout(() => {
        router.push('/actividad-1/scene3');
      }, 200);
    } else {
      console.error('❌ Scene2: Failed to save progress, but continuing to next scene');
      router.push('/actividad-1/scene3');
    }
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-blue-200 to-pink-300 z-0" />

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
            <JugarButton text='¿QUÉ HA CAMBIADO?' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDAD_1_ESCENA_2.mp4"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            onLoadedData={() => {
              const video = videoRef.current;
              if (video) {
                video.volume = currentVolume;
                console.log(`🎬 Scene2: Video loaded, volume set to: ${currentVolume}`);
              }
            }}
            onPlay={async () => {
              const video = videoRef.current;
              if (!video) return;

              // Determine device type
              const isIPhone = /iPhone/.test(navigator?.userAgent || '');
              const isIPad = /iPad/.test(navigator?.userAgent || '') ||
                           (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

              if (isIPhone) {
                video.muted = false;
                video.volume = 1.0; // iPhone uses Web Audio for volume control
                console.log(`📱 Scene2 iPhone: Video playing, using Web Audio volume control`);
              } else if (isIPad) {
                video.volume = currentVolume;
                video.muted = currentVolume === 0;
                console.log(`🔲 Scene2 iPad: Video playing, direct volume: ${currentVolume} (muted: ${currentVolume === 0})`);
              } else {
                video.muted = false;
                video.volume = currentVolume;
                console.log(`🖥️ Scene2 Desktop/Android: Video playing, volume: ${currentVolume}`);
              }

              // Initialize audio for volume control
              try {
                await initAudio();
                console.log('🍎 Scene2: Audio initialized');
              } catch (e) {
                console.warn('Scene2: Audio init failed:', e);
              }

              // For iPhone, connect to Web Audio API
              if (isIPhone) {
                try {
                  let sharedAudioContext = window.sharedAudioContext;
                  if (!sharedAudioContext) {
                    sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                    window.sharedAudioContext = sharedAudioContext;
                  }

                  if (sharedAudioContext.state === 'suspended') {
                    await sharedAudioContext.resume();
                  }

                  connectVideoToWebAudio(video, sharedAudioContext);
                } catch (error) {
                  console.error('🍎 Scene2 iPhone: Error setting up Web Audio:', error);
                }
              }
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
