'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WindowBirds from '../WindowBirds/WindowBirds';
import Table from '../Table/Table';
import Backpack from '../Backpack/Backpack';

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

  const aspectRatio = 16 / 9;

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsLoaded(true);
    const handlePlay = () => setIsPlaying(true);
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
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [videoPath, onVideoEnd]);

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