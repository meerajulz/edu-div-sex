'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { playGameAudio, getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';
import OptimizedVideo from '../../components/OptimizedVideo';
import SkipVideoButton from '../../components/SkipVideoButton/SkipVideoButton';
import JuegoSeisAventura8 from './JuegoSeisAventura8/JuegoSeisAventura8';

export default function Aventura8Scene5Page() {
  useActivityTracking();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  const [deviceInfo, setDeviceInfo] = useState({ isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false });
  const [currentVolume, setCurrentVolume] = useState(0.8);

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
    } catch (e) {
      console.error('Aventura8-Scene5: Web Audio connection failed:', e);
    }
  };

  useEffect(() => {
    const info = getDeviceAudioInfo();
    setDeviceInfo(info);
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) setCurrentVolume(parseFloat(savedVolume));
    setHasWatchedVideo(!!localStorage.getItem('a8-scene5-video-watched'));
  }, []);

  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent) => {
      const { volume } = event.detail;
      const video = videoRef.current;
      if (video && video.readyState > 0) {
        const isIPhone = /iPhone/.test(navigator?.userAgent || '');
        if (isIPhone) {
          video.muted = false;
          video.volume = 1.0;
          if (window.videoGainNode) window.videoGainNode.gain.value = volume;
        } else {
          video.muted = false;
          video.volume = volume;
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
      if (height < vh) { height = vh; width = height * aspectRatio; }
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

  const playSound = () => { playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound'); };

  const handleJugarClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => { setIsAnimating(false); setShowVideo(true); }, 800);
  };

  const handleVideoEnd = () => {
    localStorage.setItem('a8-scene5-video-watched', 'true');
    setVideoEnded(true);
    setHasWatchedVideo(true);
  };

  const handleReplayVideo = () => {
    setVideoEnded(false);
    setShowVideo(true);
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  const handleGameComplete = () => {
    setShowGame(false);
    setGameCompleted(true);
    setShowCongratulations(true);
  };

  const handleGoToMenu = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    await saveProgress('aventura-8', 'scene5', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: gameCompleted,
      completed_at: new Date().toISOString(),
    });
    setTimeout(() => { setIsAnimating(false); router.push('/aventura-8'); }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-teal-200 via-cyan-100 to-indigo-300 z-0" />

      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i} className="absolute rounded-full bg-white/20"
            style={{ width: Math.random() * 60 + 20, height: Math.random() * 60 + 20, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -20, 0], x: [0, Math.random() * 20 - 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex"><FloatingMenu /></div>
      <div className=""><LogoComponent customText="AVENTURA 8 - Abuso sexual" customImage="/image/logo-image/aventura-8.png" customBgColor="bg-red-500" /></div>

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}} transition={{ duration: 0.8, ease: 'easeInOut' }}>
            <JugarButton text='APRENDO A DECIR NO' onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <>
              <OptimizedVideo
                ref={videoRef}
                src="/video/avanzado/actividad_8-scene_5.mp4"
                className="absolute inset-0 w-full h-full object-cover z-20"
                autoPlay
                playsInline
                volume={currentVolume}
                onEnded={handleVideoEnd}
                onLoadedData={() => { const video = videoRef.current; if (video) video.volume = currentVolume; }}
                onPlay={async () => {
                  const video = videoRef.current;
                  if (!video) return;
                  video.muted = false;
                  video.volume = currentVolume;
                  try {
                    await initAudio();
                    const isIPhone = /iPhone/.test(navigator?.userAgent || '');
                    if (isIPhone) {
                      let ctx = window.sharedAudioContext;
                      if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); window.sharedAudioContext = ctx; }
                      if (ctx.state === 'suspended') await ctx.resume();
                      connectVideoToWebAudio(video, ctx);
                    }
                  } catch (e) { console.error('Aventura8-Scene5: Audio setup failed:', e); }
                }}
                lazyLoad={true}
                lowPowerMode={true}
                maxRetries={3}
              />
              {hasWatchedVideo && <SkipVideoButton onClick={handleVideoEnd} />}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.div animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}} transition={{ duration: 0.8, ease: 'easeInOut' }}>
                <div className="flex flex-col items-center gap-6">
                  {!gameCompleted ? (
                    <JugarButton onClick={() => setShowGame(true)} disabled={isAnimating} text="Jugar" />
                  ) : (
                    <JugarButton onClick={handleGoToMenu} disabled={isAnimating} text="Volver al menú" />
                  )}
                  {hasWatchedVideo && <VolverAVerButton onClick={handleReplayVideo} />}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {showCongratulations && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-teal-300 via-cyan-400 to-indigo-500 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">¡Felicidades!</h2>
            <p className="text-white text-lg mb-6">Has completado esta sección</p>
            <motion.button
              onClick={handleGoToMenu}
              disabled={isAnimating}
              className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              Volver al menú
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      <JuegoSeisAventura8
        isVisible={showGame}
        onClose={() => setShowGame(false)}
        onGameComplete={handleGameComplete}
      />
    </motion.div>
  );
}
