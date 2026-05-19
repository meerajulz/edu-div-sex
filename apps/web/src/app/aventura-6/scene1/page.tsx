'use client';

import { motion } from 'framer-motion';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import OptimizedVideo from '../../components/OptimizedVideo';
import SkipVideoButton from '../../components/SkipVideoButton/SkipVideoButton';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { getDeviceAudioInfo } from '../../utils/gameAudio';
import { initAudio } from '../../utils/audioHandler';
import JuegoUnoAventura6 from './JuegoUnoAventura6/JuegoUnoAventura6';

export default function Aventura6Scene1Page() {
  useActivityTracking();
  useActivityProtection();

  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0.8);
  const [deviceInfo, setDeviceInfo] = useState({ isIOS: false, isSafari: false, hasWebAudio: false, hasGainNode: false });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  const connectVideoToWebAudio = (video: HTMLVideoElement, audioContext: AudioContext) => {
    try {
      if (video._webAudioConnected) return;
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
      video._webAudioConnected = true;
    } catch (e) { console.error('Web Audio connection failed:', e); }
  };

  useEffect(() => {
    const info = getDeviceAudioInfo();
    setDeviceInfo(info);
    const savedVolume = localStorage.getItem('video-volume');
    if (savedVolume) setCurrentVolume(parseFloat(savedVolume));
    setHasWatchedVideo(!!localStorage.getItem('av6-scene1-video-watched'));
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

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) { console.warn('Could not play sound:', error); }
  };

  const handleJugarClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    setTimeout(() => { setIsAnimating(false); setShowVideo(true); }, 800);
  };

  const handleVideoEnd = () => {
    localStorage.setItem('av6-scene1-video-watched', 'true');
    setVideoEnded(true);
    setHasWatchedVideo(true);
  };

  const handleReplayVideo = () => {
    setVideoEnded(false);
    setShowVideo(true);
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  const handleOpenGame = () => {
    playSound();
    setShowGameModal(true);
  };

  const handleGameContinue = () => {
    setShowGameModal(false);
    setShowCongratulations(true);
  };

  const handleGoToHub = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    await saveProgress('aventura-6', 'scene1', 'completed', 100, {
      video_watched: true,
      completed_at: new Date().toISOString(),
    });
    setTimeout(() => { setIsAnimating(false); router.push('/aventura-6'); }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-rose-200 via-pink-100 to-red-200 z-0" />

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
            animate={{ y: [0, -20, 0], x: [0, Math.random() * 20 - 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {!showVideo ? (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton text="LA RELACIÓN DE PAREJA" onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      ) : (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <>
              <OptimizedVideo
                ref={videoRef}
                src="/video/avanzado/Actividad_6_scene_1.mp4"
                className="absolute inset-0 w-full h-full object-cover z-20"
                autoPlay
                playsInline
                volume={currentVolume}
                onEnded={handleVideoEnd}
                onLoadedData={() => { if (videoRef.current) videoRef.current.volume = currentVolume; }}
                onPlay={async () => {
                  const video = videoRef.current;
                  if (!video) return;
                  video.muted = false;
                  video.volume = currentVolume;
                  try {
                    await initAudio();
                    const isIPhone = /iPhone/.test(navigator?.userAgent || '');
                    if (isIPhone) {
                      let sharedAudioContext = window.sharedAudioContext;
                      if (!sharedAudioContext) {
                        sharedAudioContext = new (window.AudioContext || window.webkitAudioContext!)();
                        window.sharedAudioContext = sharedAudioContext;
                      }
                      if (sharedAudioContext.state === 'suspended') await sharedAudioContext.resume();
                      connectVideoToWebAudio(video, sharedAudioContext);
                    }
                  } catch (error) { console.error('Audio setup failed:', error); }
                }}
                lazyLoad={true}
                lowPowerMode={true}
                maxRetries={3}
              />
              {hasWatchedVideo && <SkipVideoButton onClick={handleVideoEnd} />}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  <JugarButton text="Jugar" onClick={handleOpenGame} disabled={isAnimating} />
                </motion.div>
                {hasWatchedVideo && <VolverAVerButton onClick={handleReplayVideo} />}
              </div>
            </div>
          )}
        </div>
      )}

      <JuegoUnoAventura6
        isVisible={showGameModal}
        onClose={() => setShowGameModal(false)}
        onGameComplete={handleGameContinue}
      />

      {showCongratulations && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-rose-300 via-pink-400 to-red-500 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">¡Felicidades!</h2>
            <p className="text-white text-lg mb-6">Has completado esta sección</p>
            <motion.button
              onClick={handleGoToHub}
              disabled={isAnimating}
              className="bg-white text-rose-600 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
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
