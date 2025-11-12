'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoTres from './JuegoTres/JuegoTres';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { playGameAudio, getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';

export default function Scene6Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
//const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showScene5Video, setShowScene5Video] = useState(false);
  const [showScene6Replay, setShowScene6Replay] = useState(false);
  const [showJuegoTres, setShowJuegoTres] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
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
      console.log('🍎 Scene6 iPhone: Video connected to Web Audio');
    } catch (e) {
      console.error('🍎 Scene6 iPhone: Web Audio failed:', e);
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
      console.error('Scene6: Audio setup failed:', error);
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

      // Apply to all possible videos in Scene 6
      const videos = [
        videoRef.current,
        document.querySelector('[src="/video/ACTIVIDAD-1-ESCENA-6.mp4"]')
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

  const handleVideoEnd = () => {
    setVideoEnded(true);
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

  const handleVolverAVerScene5 = () => {
    setShowScene5Video(true);
  };

  const handleScene5VideoEnd = () => {
    setShowScene5Video(false);
  };

  const handleVolverAVerScene6 = () => {
    setShowScene6Replay(true);
  };

  const handleScene6ReplayEnd = () => {
    setShowScene6Replay(false);
  };

  const handleOpenJuegoTres = () => {
    playSound();
    setShowJuegoTres(true);
  };

  const handleCloseJuegoTres = () => {
    setShowJuegoTres(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setTimeout(() => {
      setShowCongratulations(true);
    }, 1000);
  };

  const handleGoToActivityMenu = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    console.log('🎯 Scene6: Game completed, saving progress and returning to activity menu');
    
    const progressSaved = await saveProgress('actividad-1', 'scene6', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: gameCompleted,
      completed_at: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Scene6: Progress saved successfully');
      } else {
        console.error('❌ Scene6: Failed to save progress, but continuing');
      }
      router.push('/actividad-1');
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
      <div className="min-h-screen bg-gradient-to-b from-blue-300 to-green-300 flex items-center justify-center">
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
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-300 via-blue-200 to-green-300" />

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

      {/* Background change for JuegoTres */}
      {showJuegoTres && (
        <div
          className="fixed inset-0 z-30"
          style={{ 
            background: 'linear-gradient(to bottom, #a8e9f7, #fffad4)'
          }}
        />
      )}

      {!showVideo && !showScene5Video && !showScene6Replay ? (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen gap-6">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='¿QUÉ ES UNA ERECCIÓN?' onClick={handleButtonClick} disabled={isAnimating} />
          </motion.div>

          {/* Button to replay Scene 5 */}
          <VolverAVerButton onClick={handleVolverAVerScene5} />
        </div>
      ) : showScene5Video ? (
        <div className="absolute" style={containerStyle}>
          <video
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDAD-1-ESCENA-5.mp4"
            autoPlay
            playsInline
            onEnded={handleScene5VideoEnd}
            onLoadedData={(e) => {
              const video = e.target as HTMLVideoElement;
              video.volume = currentVolume;
            }}
            onPlay={(e) => setupVideoVolumeHandling(e.target as HTMLVideoElement)}
          />
        </div>
      ) : showScene6Replay ? (
        <div className="absolute" style={containerStyle}>
          <video
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDAD-1-ESCENA-6.mp4"
            autoPlay
            playsInline
            onEnded={handleScene6ReplayEnd}
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
              src="/video/ACTIVIDAD-1-ESCENA-6.mp4"
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
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!showJuegoTres && (
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    {!gameCompleted ? (
                      <JugarButton
                        text="Jugar"
                        onClick={handleOpenJuegoTres}
                        disabled={isAnimating}
                      />
                    ) : !showCongratulations ? (
                      <JugarButton
                        onClick={handleGoToActivityMenu}
                        disabled={isAnimating}
                        text="Continuar..."
                      />
                    ) : null}
                  </motion.div>

                  {/* Button to replay Scene 6 video when game is available */}
                  {!gameCompleted && (
                    <VolverAVerButton onClick={handleVolverAVerScene6} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* JuegoTres Game Modal */}
      <JuegoTres 
        isVisible={showJuegoTres} 
        onClose={handleCloseJuegoTres}
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
              Has completado esta sección de la actividad
            </p>
            <motion.button
              onClick={handleGoToActivityMenu}
              disabled={isAnimating}
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continuar al menú
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}