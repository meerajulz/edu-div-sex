'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoTresActividad2 from './JuegoTresActividad2/JuegoTresActividad2';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { playGameAudio, getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';

export default function Actividad2Scene3Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
//const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
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
      console.log(`🍎 Activity2-Scene3 iPhone: Connecting video to Web Audio API...`);
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
      console.log(`🍎 Activity2-Scene3 iPhone: ✅ Video connected to Web Audio`);
    } catch (e) {
      console.error('🍎 Activity2-Scene3 iPhone: ❌ Web Audio connection failed:', e);
    }
  };

  useEffect(() => {
    // Initialize device info and volume
    const info = getDeviceAudioInfo();
    setDeviceInfo(info);
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) setCurrentVolume(parseFloat(savedVolume));
    console.log('📱 Activity2-Scene3: Device info initialized:', info);
  }, []);

  // Listen for global volume changes from FloatingMenu
  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume } = event.detail;
      console.log(`🎵 Activity2-Scene3: Received global volume change: ${volume}`);

      const video = videoRef.current;
      if (video && video.readyState > 0) {
        const isIPhone = /iPhone/.test(navigator?.userAgent || '');
        if (isIPhone) {
          video.muted = false;
          video.volume = 1.0;
          if (window.videoGainNode) {
            window.videoGainNode.gain.value = volume;
            console.log(`📱 Activity2-Scene3 iPhone: Applied volume ${volume} via Web Audio`);
          }
        } else {
          video.muted = false;
          video.volume = volume;
          console.log(`🖥️ Activity2-Scene3 Desktop/Android/iPad: Applied volume ${volume}`);
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
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button Click Sound');
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
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
    setShowButton(true);
    setHasWatchedVideo(true);
  };

  const handleReplayVideo = () => {
    setShowVideo(true);
    setShowButton(false);
    // Reset video to beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleOpenGame = () => {
    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      setShowGame(true);
    }, 800);
  };

  const handleGameClose = () => {
    setShowGame(false);
    // Don't change any other state - keep showing button
  };

  const handleGameComplete = () => {
    console.log('Game 3 completed!');
    setShowGame(false);
    setGameCompleted(true);
    setTimeout(() => {
      setShowCongratulations(true);
    }, 1000);
  };

  const handleGoToActivityMenu = async () => {
    console.log('🎯 Scene3: Game completed, saving progress and returning to activity menu');
    
    const progressSaved = await saveProgress('actividad-2', 'scene3', 'completed', 100, {
      video_watched: true,
      game_completed: gameCompleted,
      completed_at: new Date().toISOString()
    });
    
    if (progressSaved) {
      console.log('✅ Scene3: Progress saved successfully');
    } else {
      console.error('❌ Scene3: Failed to save progress, but continuing');
    }
    router.push('/actividad-2');
  };

  const handleButtonClick = () => {
    if (gameCompleted) {
      // Game completed, go to next scene
      handleNextPageClick();
    } else {
      // Game not completed yet, open game
      handleOpenGame();
    }
  };

  const handleNextPageClick = async () => {
    setIsAnimating(true);
    playSound();
    
    console.log('🎯 Actividad2-Scene3: Game completed, saving progress and moving to scene4');
    
    const progressSaved = await saveProgress('actividad-2', 'scene3', 'completed', 100, {
      video_watched: showVideo,
      game_completed: gameCompleted,
      completed_at: new Date().toISOString()
    });

    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad2-Scene3: Progress saved successfully');
      } else {
        console.error('❌ Actividad2-Scene3: Failed to save progress, but continuing');
      }
      handleGoToActivityMenu();
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-600 via-blue-300 to-purple-300 z-0" />

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
          <LogoComponent configKey="actividad-2-scene1" />
        </div>

      {!showVideo && !showButton ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='Jugar' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : showVideo && !showButton ? (
        <div className="absolute" style={containerStyle}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            src="/video/ACTIVIDAD-2-ESCENA-3.mp4"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            onLoadedData={() => {
              const video = videoRef.current;
              if (video) {
                video.volume = currentVolume;
                console.log(`🎬 Activity2-Scene3: Video loaded, volume: ${currentVolume}`);
              }
            }}
            onPlay={async () => {
              const video = videoRef.current;
              if (!video) return;

              video.muted = false;
              video.volume = currentVolume;
              console.log(`🎬 Activity2-Scene3: Video playing, volume: ${currentVolume}`);

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
                console.error('Activity2-Scene3: Audio setup failed:', error);
              }
            }}
          />
        </div>
      ) : showButton ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <JugarButton
                text={gameCompleted ? 'Jugar' : 'Jugar'}
                onClick={handleButtonClick}
                disabled={isAnimating}
              />
            </motion.div>

            {/* Volver a ver Button - positioned under main button */}
            {hasWatchedVideo && !gameCompleted && (
              <VolverAVerButton onClick={handleReplayVideo} />
            )}
          </div>
        </div>
      ) : null}

      {/* Juego Tres Actividad 2 */}
      <JuegoTresActividad2
        isVisible={showGame}
        onClose={handleGameClose}
        onGameComplete={handleGameComplete}
        userId="user123" // Replace with actual user ID
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
              disabled={false}
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