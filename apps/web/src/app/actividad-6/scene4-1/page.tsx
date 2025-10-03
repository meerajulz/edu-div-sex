'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoSeisActividad6 from '../scene4/JuegoSeisActividad6/JuegoSeisActividad6';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';

export default function Actividad6Scene4_1Page() {

  // Track current activity URL for continue feature
  useActivityTracking();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  useActivityProtection();
  const finalVideoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showJuegoSeis, setShowJuegoSeis] = useState(false);
  const [juegoSeisCompleted, setJuegoSeisCompleted] = useState(false);
  const [showFinalVideo, setShowFinalVideo] = useState(false);
  const [finalVideoEnded, setFinalVideoEnded] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hasWatchedFinalVideo, setHasWatchedFinalVideo] = useState(false);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // iOS volume control state
  const [deviceInfo, setDeviceInfo] = useState({ isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false });
  const [currentVolume, setCurrentVolume] = useState(0.8);

  // Function to connect video element to Web Audio API for iOS volume control
  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      console.log(`🍎 Activity6-Scene4-1 iPhone: Connecting video to Web Audio API...`);
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
      console.log(`🍎 Activity6-Scene4-1 iPhone: ✅ Video connected to Web Audio`);
    } catch (e) {
      console.error('🍎 Activity6-Scene4-1 iPhone: ❌ Web Audio connection failed:', e);
    }
  };

  useEffect(() => {
    // Initialize device info and volume
    const info = getDeviceAudioInfo();
    setDeviceInfo(info);
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) setCurrentVolume(parseFloat(savedVolume));
    console.log('📱 Activity6-Scene4-1: Device info initialized:', info);
  }, []);

  // Listen for global volume changes from FloatingMenu
  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume } = event.detail;
      console.log(`🎵 Activity6-Scene4-1: Received global volume change: ${volume}`);

      const video = finalVideoRef.current;
      if (video && video.readyState > 0) {
        const isIPhone = /iPhone/.test(navigator?.userAgent || '');
        if (isIPhone) {
          video.muted = false;
          video.volume = 1.0;
          if (window.videoGainNode) {
            window.videoGainNode.gain.value = volume;
            console.log(`📱 Activity6-Scene4-1 iPhone: Applied volume ${volume} via Web Audio`);
          }
        } else {
          video.muted = false;
          video.volume = volume;
          console.log(`🖥️ Activity6-Scene4-1 Desktop/Android/iPad: Applied volume ${volume}`);
        }
      }
      setCurrentVolume(volume);
    };

    window.addEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    return () => window.removeEventListener('globalVolumeChange', handleVolumeChange as EventListener);
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
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleOpenJuegoSeis = () => {
    if (isAnimating) return;
    playSound();
    setShowJuegoSeis(true);
  };

  const handleCloseJuegoSeis = () => {
    setShowJuegoSeis(false);
  };

  const handleGameComplete = () => {
    setJuegoSeisCompleted(true);
    setShowJuegoSeis(false);
    // Show final video after game completion
    setTimeout(() => {
      setShowFinalVideo(true);
    }, 500);
  };

  const handleFinalVideoEnd = () => {
    setFinalVideoEnded(true);
    setHasWatchedFinalVideo(true);
    // Show congratulations after final video
    setTimeout(() => {
      setShowCongratulations(true);
    }, 500);
  };

  const handleReplayFinalVideo = () => {
    setFinalVideoEnded(false);
    setShowCongratulations(false);
    setShowFinalVideo(true);
    // Reset video to beginning
    if (finalVideoRef.current) {
      finalVideoRef.current.currentTime = 0;
    }
  };

  // Handle final completion and go to home
  const handleGoToHome = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    console.log('🎯 Actividad6-Scene4-1: Final scene completed, saving progress and going to home');

    const progressSaved = await saveProgress('actividad-6', 'scene4-1', 'completed', 100, {
      juego6_completed: juegoSeisCompleted,
      final_video_watched: finalVideoEnded,
      activity_completed: true,
      completed_at: new Date().toISOString()
    });

    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad6-Scene4-1: Activity 6 completed successfully!');
      } else {
        console.error('❌ Actividad6-Scene4-1: Failed to save progress, but continuing');
      }
      // Set flag that activity was just completed for auto-rotation
      localStorage.setItem('completedActivityId', '6');
      router.push('/home');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Colorful Background gradient - Final scene theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 z-0" />

      {/* Floating particles animation */}
      <div className="absolute inset-0 z-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 80 + 30,
              height: Math.random() * 80 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Additional colorful elements */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          >
            <div className="w-4 h-4 bg-white/30 rounded-full" />
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>
      <div className="">
        <LogoComponent configKey="actividad-6-scene1" />
      </div>

      {!showFinalVideo && !showCongratulations ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton
              text='Jugar'
              onClick={handleOpenJuegoSeis}
              disabled={isAnimating}
            />
          </motion.div>
        </div>
      ) : showFinalVideo && !finalVideoEnded ? (
        <div className="absolute" style={containerStyle}>
          <video
            ref={finalVideoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDA_6-ESCENA_5-FINAL.mp4"
            autoPlay
            playsInline
            onEnded={handleFinalVideoEnd}
            onLoadedData={() => {
              const video = finalVideoRef.current;
              if (video) {
                video.volume = currentVolume;
                console.log(`🎬 Activity6-Scene4-1: Final video loaded, volume: ${currentVolume}`);
              }
            }}
            onPlay={async () => {
              const video = finalVideoRef.current;
              if (!video) return;

              video.muted = false;
              video.volume = currentVolume;
              console.log(`🎬 Activity6-Scene4-1: Final video playing, volume: ${currentVolume}`);

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
                console.error('Activity6-Scene4-1: Audio setup failed:', error);
              }
            }}
          />
        </div>
      ) : null}

      {/* JuegoSeisActividad6 Game Modal */}
      <JuegoSeisActividad6
        isVisible={showJuegoSeis}
        onClose={handleCloseJuegoSeis}
        onGameComplete={handleGameComplete}
      />

      {/* Congratulations Overlay */}
      {showCongratulations && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              ¡Felicidades!
            </h2>
            <p className="text-white text-lg mb-6">
              Has completado todas las aventuras
            </p>
            <div className="flex flex-col items-center gap-4">
              <motion.button
                onClick={handleGoToHome}
                disabled={isAnimating}
                className="bg-white text-orange-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ir a la próxima aventura
              </motion.button>

              {/* Volver a ver Button - positioned under main button */}
              {hasWatchedFinalVideo && (
                <VolverAVerButton onClick={handleReplayFinalVideo} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}