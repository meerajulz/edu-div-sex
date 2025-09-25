'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking, clearLastActivity } from '../../hooks/useActivityTracking';
import { playGameAudio, getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';

export default function Scene7Page() {

  // Track current activity URL for continue feature
  useActivityTracking();
//  const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showScene7Replay, setShowScene7Replay] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // iOS volume control state
  const [deviceInfo, setDeviceInfo] = useState({ isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false });
  const [currentVolume, setCurrentVolume] = useState(0.8);

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

  // Function to connect video to Web Audio API for iOS
  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      if ((video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected) return;
      const source = audioContext.createMediaElementSource(video);
      let sharedGainNode = window.sharedGainNode;
      if (!sharedGainNode) {
        sharedGainNode = audioContext.createGain();
        sharedGainNode.gain.value = currentVolume;
        window.sharedGainNode = sharedGainNode;
        sharedGainNode.connect(audioContext.destination);
      }
      source.connect(sharedGainNode);
      window.videoGainNode = sharedGainNode;
      (video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected = true;
      console.log('🍎 Scene7 iPhone: Video connected to Web Audio');
    } catch (e) {
      console.error('🍎 Scene7 iPhone: Web Audio failed:', e);
    }
  };

  // Setup iOS volume handling
  const setupVideoVolumeHandling = async (video: HTMLVideoElement) => {
    if (!video) return;
    video.muted = false;
    video.volume = currentVolume;

    try {
      await initAudio();
      const isIPhone = /iPhone/.test(navigator?.userAgent || '');
      if (isIPhone) {
        let sharedAudioContext = window.sharedAudioContext;
        if (!sharedAudioContext) {
          sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)();
          window.sharedAudioContext = sharedAudioContext;
        }
        if (sharedAudioContext.state === 'suspended') {
          await sharedAudioContext.resume();
        }
        connectVideoToWebAudio(video, sharedAudioContext);
      }
    } catch (error) {
      console.error('Scene7: Audio setup failed:', error);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    // Initialize device info
    const info = getDeviceAudioInfo();
    setDeviceInfo(info);
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) setCurrentVolume(parseFloat(savedVolume));
  }, []);

  // Listen for global volume changes
  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume } = event.detail;
      setCurrentVolume(volume);

      // Apply to all possible videos in Scene 7
      const videos = [
        videoRef.current,
        document.querySelector('[src="/video/ACTIVIDAD-1-ESCENA-7.mp4"]')
      ] as HTMLVideoElement[];

      videos.forEach((video) => {
        if (video && video.readyState > 0) {
          const isIPhone = /iPhone/.test(navigator?.userAgent || '');
          if (isIPhone) {
            video.muted = false;
            video.volume = 1.0;
            if (window.videoGainNode) {
              window.videoGainNode.gain.value = volume;
            }
          } else {
            video.muted = false;
            video.volume = volume;
          }
        }
      });
    };

    window.addEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    return () => window.removeEventListener('globalVolumeChange', handleVolumeChange as EventListener);
  }, [deviceInfo.isIOS]);

  const handleJugarClick = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = async () => {
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Video-End-Sound');
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
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound');
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

  const handleVolverAVerScene7 = () => {
    setShowScene7Replay(true);
  };

  const handleScene7ReplayEnd = () => {
    setShowScene7Replay(false);
  };

  const handleBackClick = async () => {
    console.log('🏠 Scene7: Returning to home page after completing activity');

    // Clear last activity tracking to prevent redirect issues
    await clearLastActivity();

    // Set flag that activity was just completed for auto-rotation
    localStorage.setItem('completedActivityId', '1');
    // Go back to home main page
    router.push('/home');
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

      {!showVideo && !showScene7Replay ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : showScene7Replay ? (
        <div className="absolute" style={containerStyle}>
          <video
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDAD-1-ESCENA-7.mp4"
            autoPlay
            playsInline
            onEnded={handleScene7ReplayEnd}
            onLoadedData={(e) => {
              const video = e.target as HTMLVideoElement;
              video.volume = currentVolume;
            }}
            onPlay={(e) => setupVideoVolumeHandling(e.target as HTMLVideoElement)}
          />
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
              onLoadedData={() => {
                const video = videoRef.current;
                if (video) video.volume = currentVolume;
              }}
              onPlay={() => {
                if (videoRef.current) setupVideoVolumeHandling(videoRef.current);
              }}
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
                        <div className="flex flex-col items-center gap-6">
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

                          {/* Button to replay Scene 7 video */}
                          <VolverAVerButton onClick={handleVolverAVerScene7} />
                        </div>
                    </div>
                    
          )}
        </div>
      )}
    </motion.div>
  );
}