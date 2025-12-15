'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoDosActividad3Male from '../scene1/JuegoDosActvidad3/JuegoDosActividad3Male';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { playGameAudio, getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';
import OptimizedVideo from '../../components/OptimizedVideo';

export default function Actividad3Scene1_1Page() {

  // Track current activity URL for continue feature
  useActivityTracking();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showGame, setShowGame] = useState(false);
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
      console.log(`🍎 Scene1-1 iPhone: Attempting to connect video to Web Audio API...`);
      console.log(`🍎 Scene1-1 iPhone: Video readyState: ${video.readyState}`);

      // Check if video already connected to avoid double-connection
      if ((video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected) {
        console.log(`🍎 Scene1-1 iPhone: Video already connected to Web Audio API`);
        return;
      }

      // Create MediaElementSource from video
      const source = audioContext.createMediaElementSource(video);
      console.log(`🍎 Scene1-1 iPhone: Created MediaElementSource`);

      // Get or create shared gain node from FloatingMenu
      let sharedGainNode = window.sharedGainNode;
      if (!sharedGainNode) {
        console.log(`🍎 Scene1-1 iPhone: Creating new shared gain node`);
        sharedGainNode = audioContext.createGain();
        sharedGainNode.gain.value = currentVolume; // Use current volume
        window.sharedGainNode = sharedGainNode;

        // Connect to speakers
        sharedGainNode.connect(audioContext.destination);
      }

      // Connect: video -> sharedGainNode -> speakers
      source.connect(sharedGainNode);

      console.log(`🍎 Scene1-1 iPhone: Connected video to shared gain node`);
      console.log(`🍎 Scene1-1 iPhone: Gain value: ${sharedGainNode.gain.value}`);

      // Store same reference for both video and global controls
      window.videoGainNode = sharedGainNode;

      (video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected = true;

      console.log(`🍎 Scene1-1 iPhone: ✅ Successfully connected video to Web Audio API`);
      console.log(`🍎 Scene1-1 iPhone: videoGainNode stored: ${!!window.videoGainNode}`);

    } catch {
      console.error('🍎 Scene1-1 iPhone: ❌ FAILED to connect video to Web Audio API');
    }
  };

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

  // Initialize device info for iOS volume control
  useEffect(() => {
    const info = getDeviceAudioInfo();
    setDeviceInfo(info);
    console.log('📱 Scene1-1: Device info initialized:', info);
  }, []);

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
      console.log(`🎵 Scene1-1: Received global volume change: ${volume} (deviceInfo.isIOS: ${deviceInfo.isIOS})`);

      // Apply volume immediately to video element if it exists and is loaded
      const videos = [videoRef.current].filter(Boolean) as HTMLVideoElement[];

      videos.forEach((video, index) => {
        if (video && video.readyState > 0) {
          const isIPhone = /iPhone/.test(navigator?.userAgent || '');

          if (isIPhone) {
            // iPhone: Use Web Audio API gain node
            video.muted = false; // Ensure not muted
            video.volume = 1.0; // Keep at max, gain node controls volume

            if (window.videoGainNode) {
              window.videoGainNode.gain.value = volume;
              console.log(`📱 Scene1-1 iPhone: Applied volume ${volume} via Web Audio videoGainNode to video ${index + 1}`);
            } else {
              console.warn(`📱 Scene1-1 iPhone: videoGainNode not available for volume ${volume}`);
            }
          } else {
            // Desktop/Android/iPad: Direct video volume (original behavior)
            video.muted = false;
            video.volume = volume;
            console.log(`🖥️ Scene1-1 Desktop/Android/iPad: Applied volume ${volume} directly to video ${index + 1}`);
          }
        } else {
          console.log(`🎬 Scene1-1: Video ${index + 1} not ready (readyState: ${video?.readyState}), setting volume for later`);
        }
      });

      setCurrentVolume(volume);
    };

    window.addEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    return () => {
      window.removeEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    };
  }, [deviceInfo.isIOS]);

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  const playSound = () => {
    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'Activity 3 Scene 1-1 button');
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

  const handleOpenGame = () => {
    playSound();
    setShowGame(true);
  };

  const handleCloseGame = () => {
    setShowGame(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setShowGame(false);
    // Show congratulations after game completion
    setTimeout(() => {
      setShowCongratulations(true);
    }, 500);
  };

  // Handle completion and go back to menu
  const handleGoToMenu = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    console.log('🎯 Actividad3-Scene1-1: All content completed, saving progress and returning to menu');

    const progressSaved = await saveProgress('actividad-3', 'scene1-1', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: gameCompleted,
      completed_at: new Date().toISOString()
    });

    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad3-Scene1-1: Progress saved successfully');
      } else {
        console.error('❌ Actividad3-Scene1-1: Failed to save progress, but continuing');
      }
      router.push('/actividad-3');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Colorful Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 z-0" />

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
        <LogoComponent configKey="actividad-3-scene1" />
      </div>

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text='EL ORGASMO MASCULINO: LA EYACULACIÓN' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <OptimizedVideo
              ref={videoRef}
              src="/video/ACTIVIDAD-3-ESCENA-1_1.mp4"
              className="absolute inset-0 w-full h-full object-cover z-20"
              autoPlay
              playsInline
              volume={currentVolume}
              onEnded={handleVideoEnd}
              onLoadedData={() => {
                const video = videoRef.current;
                if (!video) return;

                // Apply volume when video loads
                video.volume = currentVolume;
                console.log(`🎬 Scene1-1: Video loaded, volume set to: ${currentVolume}`);
              }}
              onPlay={async () => {
                const video = videoRef.current;
                if (!video) return;

                // When video starts playing, ensure it's unmuted and volume is applied
                video.muted = false;
                video.volume = currentVolume;
                console.log(`🎬 Scene1-1: Video started playing, unmuted: ${!video.muted}, volume set to: ${currentVolume}`);

                // Initialize audio for volume control if needed
                try {
                  await initAudio();
                  console.log('🍎 Scene1-1: Audio initialized for volume control');
                } catch (e) {
                  console.warn('Scene1-1: Audio initialization failed:', e);
                }

                // For iPhone, connect to Web Audio API for volume control
                const isIPhone = /iPhone/.test(navigator?.userAgent || '');
                if (isIPhone) {
                  try {
                    // Get or create shared AudioContext from FloatingMenu
                    let sharedAudioContext = window.sharedAudioContext;
                    if (!sharedAudioContext) {
                      console.log('🍎 Scene1-1 iPhone: Initializing shared AudioContext for video');
                      try {
                        sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                        window.sharedAudioContext = sharedAudioContext;
                        console.log('🍎 Scene1-1 iPhone: ✅ Created new shared AudioContext');
                      } catch (audioError) {
                        console.error('🍎 Scene1-1 iPhone: ❌ Failed to create AudioContext:', audioError);
                        return;
                      }
                    }

                    // Ensure AudioContext is running
                    if (sharedAudioContext.state === 'suspended') {
                      try {
                        await sharedAudioContext.resume();
                        console.log('🍎 Scene1-1 iPhone: ✅ Resumed suspended AudioContext');
                      } catch (resumeError) {
                        console.error('🍎 Scene1-1 iPhone: ❌ Failed to resume AudioContext:', resumeError);
                      }
                    }

                    if (sharedAudioContext.state === 'running') {
                      // Connect video to Web Audio API for iPhone volume control
                      connectVideoToWebAudio(video, sharedAudioContext);
                    } else {
                      connectVideoToWebAudio(video, sharedAudioContext);
                    }
                  } catch (error) {
                    console.error('🍎 Scene1-1 iPhone: ❌ Error setting up Web Audio API:', error);
                  }
                } else {
                  console.log(`🖥️ Scene1-1 Desktop/Android/iPad: Using direct video volume (original behavior)`);
                }
              }}
              lazyLoad={true}
              lowPowerMode={true}
              maxRetries={3}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  {!gameCompleted && (
                    <JugarButton
                      text='Jugar'
                      onClick={handleOpenGame}
                      disabled={isAnimating}
                    />
                  )}
                </motion.div>

                {/* Volver a ver Button - positioned under main button */}
                {hasWatchedVideo && !gameCompleted && (
                  <VolverAVerButton onClick={handleReplayVideo} />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* JuegoDosActividad3Male Game Modal */}
      <JuegoDosActividad3Male
        isVisible={showGame}
        onClose={handleCloseGame}
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
              onClick={handleGoToMenu}
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