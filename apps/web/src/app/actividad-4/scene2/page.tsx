'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoDosActividad4 from './JuegoDosActividad4/JuegoDosActividad4';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { playGameAudio, getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';

export default function Actividad4Scene2Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
//const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showJuegoDos, setShowJuegoDos] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  // iOS volume control state
  const [deviceInfo, setDeviceInfo] = useState({ isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false });
  const [currentVolume, setCurrentVolume] = useState(0.8);

  // Function to connect video element to Web Audio API for iOS volume control
  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      console.log(`🍎 Activity4-Scene2 iPhone: Connecting video to Web Audio API...`);
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
      console.log(`🍎 Activity4-Scene2 iPhone: ✅ Video connected to Web Audio`);
    } catch (e) {
      console.error('🍎 Activity4-Scene2 iPhone: ❌ Web Audio connection failed:', e);
    }
  };

  useEffect(() => {
    // Initialize device info and volume
    const info = getDeviceAudioInfo();
    setDeviceInfo(info);
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) setCurrentVolume(parseFloat(savedVolume));
    console.log('📱 Activity4-Scene2: Device info initialized:', info);
  }, []);

  // Listen for global volume changes from FloatingMenu
  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume } = event.detail;
      console.log(`🎵 Activity4-Scene2: Received global volume change: ${volume}`);

      const video = videoRef.current;
      if (video && video.readyState > 0) {
        const isIPhone = /iPhone/.test(navigator?.userAgent || '');
        if (isIPhone) {
          video.muted = false;
          video.volume = 1.0;
          if (window.videoGainNode) {
            window.videoGainNode.gain.value = volume;
            console.log(`📱 Activity4-Scene2 iPhone: Applied volume ${volume} via Web Audio`);
          }
        } else {
          video.muted = false;
          video.volume = volume;
          console.log(`🖥️ Activity4-Scene2 Desktop/Android/iPad: Applied volume ${volume}`);
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
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Scene2 Button Sound');
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

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setHasWatchedVideo(true);
  };

  const handleReplayVideo = () => {
    setVideoEnded(false);
    setShowVideo(true);
    // Reset video to beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleOpenJuegoDos = () => {
    playSound();
    setShowJuegoDos(true);
  };

  const handleCloseJuegoDos = () => {
    setShowJuegoDos(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const handleContinue = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    console.log('🎉 Actividad4-Scene2: Final scene completed, saving progress for completed activity');
    
    const progressSaved = await saveProgress('actividad-4', 'scene2', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: gameCompleted,
      activity_completed: true,
      completed_at: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad4-Scene2: Activity 4 completed successfully!');
      } else {
        console.error('❌ Actividad4-Scene2: Failed to save progress, but continuing');
      }
      // Set flag that activity was just completed for auto-rotation
      localStorage.setItem('completedActivityId', '4');
      // Navigate back to main activity menu
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
      {/* Background gradient - Light pink tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-200 via-rose-100 to-pink-300 z-0" />

      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
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
              <LogoComponent configKey="actividad-4-scene1" />
            </div>

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='Jugar' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDAD-4-ESCENA-2.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
              onLoadedData={() => {
                const video = videoRef.current;
                if (video) {
                  video.volume = currentVolume;
                  console.log(`🎬 Activity4-Scene2: Video loaded, volume: ${currentVolume}`);
                }
              }}
              onPlay={async () => {
                const video = videoRef.current;
                if (!video) return;

                video.muted = false;
                video.volume = currentVolume;
                console.log(`🎬 Activity4-Scene2: Video playing, volume: ${currentVolume}`);

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
                  console.error('Activity4-Scene2: Audio setup failed:', error);
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!showJuegoDos && (
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    {!gameCompleted ? (
                      <JugarButton text='Jugar' onClick={handleOpenJuegoDos} disabled={isAnimating} />
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
                              <p className="text-lg sm:text-xl text-white drop-shadow-md">
                                 Has completado la actividad.
                              </p>
                          </motion.div>
                        <motion.div
                          className="inline-block"
                          style={{ transformOrigin: 'center center' }}
                        >
                          <div className="whitespace-nowrap">
                            <JugarButton text="IR A LA PROXIMA AVENTURA!" onClick={handleContinue} disabled={isAnimating} />
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>

                  {/* Volver a ver Button - positioned under main button */}
                  {hasWatchedVideo && !gameCompleted && (
                    <VolverAVerButton onClick={handleReplayVideo} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* JuegoDosActividad4 Game Modal */}
      <JuegoDosActividad4 
        isVisible={showJuegoDos} 
        onClose={handleCloseJuegoDos}
        onGameComplete={handleGameComplete}
      />
    </motion.div>
  );
}