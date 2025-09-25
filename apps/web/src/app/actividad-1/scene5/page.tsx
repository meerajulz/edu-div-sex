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
import { playGameAudio, getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';

export default function Scene5Page() {
 
  // Track current activity URL for continue feature
  useActivityTracking();
// const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [videoEnded, setVideoEnded] = useState(false);
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
      console.log('🍎 Scene5 iPhone: Video connected to Web Audio');
    } catch (e) {
      console.error('🍎 Scene5 iPhone: Web Audio failed:', e);
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

      const video = videoRef.current;
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
    };

    window.addEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    return () => window.removeEventListener('globalVolumeChange', handleVolumeChange as EventListener);
  }, [deviceInfo.isIOS]);

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
            <JugarButton text='Jugar' onClick={handleButtonClick} disabled={isAnimating} />
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
            onLoadedData={() => {
              const video = videoRef.current;
              if (video) {
                video.volume = currentVolume;
                console.log(`🎬 Scene5: Video loaded, volume: ${currentVolume}`);
              }
            }}
            onPlay={async () => {
              const video = videoRef.current;
              if (!video) return;

              video.muted = false;
              video.volume = currentVolume;
              console.log(`🎬 Scene5: Video playing, volume: ${currentVolume}`);

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
                console.error('Scene5: Audio setup failed:', error);
              }
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
