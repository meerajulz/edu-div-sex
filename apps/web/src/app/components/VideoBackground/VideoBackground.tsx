'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WindowBirds from '../WindowBirds/WindowBirds';
import Table from '../Table/Table';
import Backpack from '../Backpack/Backpack';
import { getDeviceAudioInfo } from '../../utils/gameAudio';
// Note: Simplified approach - just handle video volume directly without complex WebAudio integration

interface Hotspot {
  id: string;
  position: {
    left: number;
    top?: number;
    bottom?: number;
    width: number;
    height: number;
  };
  onClick?: () => void;
}

interface VideoBackgroundProps {
  videoPath: string;
  backgroundImagePath?: string;
  isExiting?: boolean;
  onExitComplete?: () => void;
  onVideoEnd?: () => void; // Add this callback
  debug?: boolean;
  hotspots?: Hotspot[];
}

interface Position {
  left: number;
  top?: number;
  bottom?: number;
  width: number;
  height: number;
  right?: number;
}

interface Positions {
  [key: string]: Position;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoPath,
  backgroundImagePath = '/svg/HOME.svg',
  isExiting = false,
  onExitComplete,
  onVideoEnd, // Add this
  debug = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const [currentVolume, setCurrentVolume] = useState(0.9);
  const [deviceInfo] = useState(() => {
    const info = getDeviceAudioInfo();
    console.log(`🎬 VideoBackground: Device audio info:`, info);
    return info;
  });

  const aspectRatio = 16 / 9;

  // Function to connect video element to Web Audio API for iOS volume control
  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      console.log(`🍎 iPad/iPhone: Attempting to connect video to Web Audio API...`);
      console.log(`🍎 iPad/iPhone: Video readyState: ${video.readyState}`);
      console.log(`🍎 iPad/iPhone: AudioContext state: ${audioContext.state}`);

      // Check if video already connected to avoid double-connection
      if ((video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected) {
        console.log(`🍎 iPad/iPhone: Video already connected to Web Audio API, skipping`);
        return;
      }

      // Create MediaElementSource from video
      const source = audioContext.createMediaElementSource(video);
      console.log(`🍎 iPad/iPhone: MediaElementSource created successfully`);

      // CRITICAL: Use the EXACT same gain node that FloatingMenu volume buttons control
      let sharedGainNode = window.globalGainNode;

      if (!sharedGainNode) {
        // Create the shared gain node that FloatingMenu will also use
        sharedGainNode = audioContext.createGain();
        window.globalGainNode = sharedGainNode;
        console.log(`🍎 iPad/iPhone: Created shared gainNode (FloatingMenu will use this same one)`);
      } else {
        console.log(`🍎 iPad/iPhone: Using pre-existing shared gainNode`);
      }

      // Set initial volume
      sharedGainNode.gain.value = currentVolume;
      console.log(`🍎 iPad/iPhone: Shared gainNode value set to: ${sharedGainNode.gain.value}`);

      // Connect: video -> sharedGainNode -> speakers
      source.connect(sharedGainNode);
      console.log(`🍎 iPad/iPhone: Video source connected to shared gainNode`);

      sharedGainNode.connect(audioContext.destination);
      console.log(`🍎 iPad/iPhone: Shared gainNode connected to AudioContext destination`);

      // Store same reference for both video and global controls
      window.videoGainNode = sharedGainNode;
      window.globalGainNode = sharedGainNode; // Ensure they're the same object
      (video as HTMLVideoElement & { _webAudioConnected?: boolean })._webAudioConnected = true;

      console.log(`🍎 iPad/iPhone: ✅ Video SUCCESSFULLY connected to shared Web Audio API!`);
      console.log(`🍎 iPad/iPhone: videoGainNode stored: ${!!window.videoGainNode}`);
      console.log(`🍎 iPad/iPhone: globalGainNode stored: ${!!window.globalGainNode}`);
    } catch (e) {
      console.error('🍎 iPad/iPhone: ❌ FAILED to connect video to Web Audio API:', e);
    }
  };

  const POSITIONS: Positions = {
    door: {
      left: 30.1,
      top: 33,
      width: 10.5,
      height: 35,
    },
    window: {
      left: 69,
      top: 36,
      width: 10,
      height: 27,
    },
    table: {
      left: 5,
      bottom: 15,
      width: 20,
      height: 15,
    },
    backpack: {
      right: 20,
      left: -10,
      bottom: 22,
      width: 10,
      height: 20,
    },
  };

  const furnishingVariants = {
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
  };

  // Initialize video volume from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) {
      setCurrentVolume(parseFloat(savedVolume));
    }
  }, []);

  // Apply volume to video element when it changes (without affecting playback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log(`🎬 VideoBackground: Applying volume ${currentVolume} to home video (iOS: ${deviceInfo.isIOS})`);

    // Don't change volume if video is not loaded yet
    if (video.readyState === 0) {
      console.log(`🎬 VideoBackground: Video not ready (readyState: 0), skipping volume change`);
      return;
    }

    console.log(`🎬 VideoBackground: Video ready (readyState: ${video.readyState}), applying volume`);

    // Only iPhone uses Web Audio API, everything else uses direct video volume
    const isIPhone = /iPhone/.test(navigator?.userAgent || '');

    if (isIPhone) {
      // iPhone: Use Web Audio API
      video.volume = 1.0;
      console.log(`📱 iPhone: Video set to max volume (1.0), Web Audio API will control actual volume`);
    } else {
      // Desktop/Android/iPad: Direct video volume (original behavior)
      video.volume = currentVolume;
      console.log(`🖥️ Desktop/Android/iPad: Applied volume ${currentVolume} directly to video`);
    }
  }, [currentVolume, deviceInfo.isIOS]);

  // Listen for global volume changes from FloatingMenu
  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume, isIOS } = event.detail;
      console.log(`🎵 VideoBackground: Received global volume change: ${volume} (iOS: ${isIOS}, deviceInfo.isIOS: ${deviceInfo.isIOS})`);

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
            console.log(`📱 iPhone: Applied volume ${volume} via Web Audio videoGainNode`);
          } else {
            console.warn(`📱 iPhone: videoGainNode not available for volume ${volume}`);
          }
        } else {
          // Desktop/Android/iPad: Direct video volume (original behavior)
          video.muted = false;
          video.volume = volume;
          console.log(`🖥️ Desktop/Android/iPad: Applied volume ${volume} directly to video`);
        }
      } else {
        console.log(`🎬 VideoBackground: Video not ready (readyState: ${video?.readyState}), setting volume for later`);
      }

      setCurrentVolume(volume);
    };

    window.addEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    return () => {
      window.removeEventListener('globalVolumeChange', handleVolumeChange as EventListener);
    };
  }, [deviceInfo.isIOS]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Apply volume when video loads - same approach that works on desktop/Mac/tablets
      video.volume = currentVolume;
      console.log(`🎬 VideoBackground: Video loaded, volume applied: ${currentVolume}`);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      // When video starts playing, ensure it's unmuted and volume is applied (important for iOS)
      video.muted = false;
      video.volume = currentVolume;

      // Check if video actually has audio tracks
      console.log(`🎬 Video started playing, unmuted: ${!video.muted}, volume set to: ${currentVolume}`);

      // Only for iPhone: Initialize Web Audio API
      const isIPhone = /iPhone/.test(navigator?.userAgent || '');

      if (isIPhone) {
        console.log(`📱 iPhone detected - initializing Web Audio API`);

        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const audioContext = new AudioContext();
            if (audioContext.state === 'suspended') {
              audioContext.resume().then(() => {
                console.log('📱 iPhone: AudioContext resumed for audio playback');
              });
            }
          }
        } catch (e) {
          console.log('📱 iPhone: AudioContext initialization failed:', e);
        }
      } else {
        console.log(`🖥️ Desktop/Android/iPad: Using direct video volume (original behavior)`);
      }

      // Only for iPhone: Connect video to Web Audio API
      if (isIPhone) {
        try {
          // CRITICAL: Initialize the SAME AudioContext that FloatingMenu will use
          // This ensures volume controls and video audio use the same gain node
          let sharedAudioContext = window.globalAudioContext;

          if (!sharedAudioContext) {
            console.log('🍎 iPad/iPhone: Initializing shared AudioContext for video (FloatingMenu will use same one)');
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
              sharedAudioContext = new AudioContext();
              window.globalAudioContext = sharedAudioContext;

              // ALSO initialize the gain node here so FloatingMenu can use it
              if (!(window.globalGainNode)) {
                const initialGainNode = sharedAudioContext.createGain();
                initialGainNode.gain.value = currentVolume;
                window.globalGainNode = initialGainNode;
                console.log('🍎 iPad/iPhone: Pre-created globalGainNode for FloatingMenu to use');
              }
            }
          } else {
            console.log('🍎 iPad/iPhone: Using existing shared AudioContext');
          }

          if (sharedAudioContext) {
            if (sharedAudioContext.state === 'suspended') {
              sharedAudioContext.resume().then(() => {
                console.log('🍎 iPad/iPhone: Shared AudioContext resumed');
                connectVideoToWebAudio(video, sharedAudioContext);
              });
            } else {
              console.log('🍎 iPad/iPhone: Shared AudioContext already running');
              connectVideoToWebAudio(video, sharedAudioContext);
            }
          }
        } catch (e) {
          console.error('🍎 iPad/iPhone: AudioContext setup failed:', e);
        }
      }
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setVideoFinished(true);
      // Call the callback when video ends
      if (onVideoEnd) {
        onVideoEnd();
      }
    };
    const handleError = () => {
      const errorMessage = video.error ? video.error.message : 'Unknown video error';
      setVideoError(errorMessage);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // iPhone-specific video setup (only on initial load)
    const isIPhone = /iPhone/.test(navigator?.userAgent || '');
    if (isIPhone) {
      video.setAttribute('playsinline', 'true');
      video.preload = 'auto';
      console.log(`📱 iPhone: Video attributes applied`);
    }

    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [videoPath, onVideoEnd, deviceInfo.isIOS]); // REMOVED currentVolume from dependencies!

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

  useEffect(() => {
    if (isExiting && onExitComplete) {
      const timer = setTimeout(() => onExitComplete(), 1200);
      return () => clearTimeout(timer);
    }
  }, [isExiting, onExitComplete]);

  const playVideo = () => {
    if (videoRef.current && !isPlaying && !videoFinished) {
      videoRef.current.play().catch(() => {
        setVideoError("Browser prevented video playback. Please check your browser settings.");
      });
    }
  };

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  const videoContainerVariants = {
    visible: { y: 0, opacity: 1 },
    exit: { y: '-110%', opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } },
  };


  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100" />
      <motion.div
        className="absolute inset-0"
        initial="visible"
        animate={isExiting ? 'exit' : 'visible'}
        variants={videoContainerVariants}
        style={{
          background: `linear-gradient(to bottom, #f5e6d3 0%, #e6d5b8 30%, #d4c4a7 100%)`,
        }}
      />

      <motion.div
        className="absolute"
        style={containerStyle}
        initial="visible"
        animate={isExiting ? 'exit' : 'visible'}
        variants={videoContainerVariants}
      >
        <div className="relative w-full h-full">
          {!isPlaying && (
            <div
              className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat ARROW"
              style={{ backgroundImage: `url(${backgroundImagePath})` }}
            />
          )}

          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
            playsInline
            preload="auto"
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Window */}
          {!isPlaying && (
            <div
              className="absolute z-30 cursor-pointer overflow-hidden"
              style={{
                left: `${POSITIONS.window.left}%`,
                top: `${POSITIONS.window.top}%`,
                width: `${POSITIONS.window.width}%`,
                height: `${POSITIONS.window.height}%`,
              }}
            >
              <WindowBirds  />
            </div>
          )}

          {/* Backpack */}
          {!isPlaying && (
            <div
              className="absolute z-30"
              style={{
                right: `${POSITIONS.backpack.right}%`,
                bottom: `${POSITIONS.backpack.bottom}%`,
                width: `${POSITIONS.backpack.width}%`,
                height: `${POSITIONS.backpack.height}%`,
              }}
            >
              <motion.div
                initial="visible"
                animate={isExiting ? 'exit' : 'visible'}
                variants={furnishingVariants}
                className="w-full h-full"
              >
                <Backpack scale={15} />
              </motion.div>
            </div>
          )}

          {/* Table */}
          {!isPlaying && (
            <div
              className="absolute z-30"
              style={{
                left: `${POSITIONS.table.left}%`,
                bottom: `${POSITIONS.table.bottom}%`,
                width: `${POSITIONS.table.width}%`,
                height: `${POSITIONS.table.height}%`,
              }}
            >
              <motion.div
                initial="visible"
                animate={isExiting ? 'exit' : 'visible'}
                variants={furnishingVariants}
                className="w-full h-full"
              >
                <Table
                  left="0%"
                  bottom="0%"
                  width="100%"
                  height="100%"
                  scale={1}
                  imagePath="/svg/table.svg"
                />
              </motion.div>
            </div>
          )}

          {/* Door Area with Arrow */}
          {!isExiting && (
            <div
              key="door"
              className={`absolute ${debug ? 'border-2 border-dashed' : ''} cursor-pointer z-[1000] flex items-start justify-center door`}
              style={{
                left: `${POSITIONS.door.left}%`,
                top: POSITIONS.door.top ? `${POSITIONS.door.top}%` : undefined,
                bottom: POSITIONS.door.bottom ? `${POSITIONS.door.bottom}%` : undefined,
                width: `${POSITIONS.door.width}%`,
                height: `${POSITIONS.door.height}%`,
                borderColor: 'rgba(255, 0, 0, 0.5)',
              }}
              onClick={playVideo}
            >
              {!videoFinished && !isPlaying && (
                <div className="mt-[10px] arrow ">
                  <svg
                    className="text-pink-500 hover:brightness-125 active:animate-ping transition duration-200 animate-bounce drop-shadow-md"
                    width="40"
                    height="40"
                    viewBox="0 0 64 64"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M32 4 C30 4 28 6 28 8 L28 40 L16 28 C14 26 10 26 8 28 C6 30 6 34 8 36 L30 58 C31 59 33 59 34 58 L56 36 C58 34 58 30 56 28 C54 26 50 26 48 28 L36 40 L36 8 C36 6 34 4 32 4 Z" />
                  </svg>
                </div>
              )}
              {debug && (
                <div className="absolute -top-5 left-0 text-xs bg-black/50 text-white px-1 rounded">
                  door
                </div>
              )}
            </div>
          )}

          {videoError && (
            <div className="absolute inset-0 z-100 flex items-center justify-center bg-black/50">
              <div className="bg-white p-4 rounded shadow-lg max-w-md">
                <p className="text-red-500 mb-2">Error loading video: {videoError}</p>
                <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Reload Page
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VideoBackground;