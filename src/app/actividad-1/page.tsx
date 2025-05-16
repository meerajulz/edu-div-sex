'use client';

import React, { useEffect, useRef, useState } from 'react';
import FloatingMenu from '../components/FloatingMenu/FloatingMenu';
import { 
  markUserInteraction, 
  needsInteractionForAudio,
  initAudio,
  cleanupAudio
} from '../utils/audioPlayer';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const ActivityLabels = dynamic(() => import('../components/ModuleAnimations/ActivityLabels'), { ssr: false });
const Ardilla = dynamic(() => import('../components/ModuleAnimations/Ardilla'), { ssr: false });
const SimpleAlex = dynamic(() => import('../components/ModuleAnimations/SimpleAlex'), { ssr: false });
const SunGif = dynamic(() => import('../components/ModuleAnimations/SunGif'), { ssr: false });

export default function Aventura1Page() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isHydrated, setIsHydrated] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showArdilla, setShowArdilla] = useState(false);
  const [showAlex, setShowAlex] = useState(false);
  const [showActivityLabels, setShowActivityLabels] = useState(false);
  const [showSun, setShowSun] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [userInteractionReceived, setUserInteractionReceived] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audioInitialized, setAudioInitialized] = useState(false);


  const [canPlayVideo, setCanPlayVideo] = useState(false);


//RESPONSIVENEES

const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
const aspectRatio = 16 / 9;

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

//END RESPONSIVENES  

  useEffect(() => {
    setIsHydrated(true);

    const checkAudio = async () => {
      const needs = needsInteractionForAudio();
      setNeedsInteraction(needs);

      if (!needs) {
        try {
          const success = await initAudio();
          setAudioInitialized(success);
        } catch (e) {
          console.warn('Audio auto init failed:', e);
        }
      }
    };

    checkAudio();
  }, []);

  useEffect(() => {
    if (!isHydrated || !needsInteraction || userInteractionReceived) return;

    const onClick = () => {
      markUserInteraction();
      setUserInteractionReceived(true);
      setNeedsInteraction(false);

      initAudio()
        .then(setAudioInitialized)
        .catch(err => console.warn('Audio init failed after interaction', err));

      document.removeEventListener('click', onClick);
      document.removeEventListener('touchstart', onClick);
    };

    document.addEventListener('click', onClick);
    document.addEventListener('touchstart', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, [isHydrated, needsInteraction, userInteractionReceived]);

  const handleVideoEnd = () => {
    cleanupAudio();
    setVideoEnded(true);

    setTimeout(() => {
      setShowArdilla(true);
    }, 100);

    setTimeout(() => {
      setShowAlex(true);
    }, 1800);

    setTimeout(() => {
      setShowActivityLabels(true);
      setShowSun(true);
    }, 0);
  };


  const characterSlideVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-300 to-blue-100" />

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>


      {needsInteraction && !userInteractionReceived && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs text-center">
            <h3 className="text-xl font-bold mb-4">¡Toca la pantalla!</h3>
            <p className="mb-4">Para escuchar los sonidos, por favor toca en cualquier lugar de la pantalla.</p>
            <button 
              className="bg-orange-500 text-white font-bold py-3 px-6 rounded-full"
              onClick={() => {
                markUserInteraction();
                setUserInteractionReceived(true);
                initAudio().then(setAudioInitialized);
                setCanPlayVideo(true); // ✅ unlock video playback
              }}
            >
              Comenzar
            </button>
          </div>
        </div>
      )}

    <div className="absolute" style={containerStyle}>
      {!videoEnded && (!needsInteraction || canPlayVideo) ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
          src="/video/INTRO_ACTIVIDAD-1.mp4"
          autoPlay
          playsInline
          muted={needsInteraction && !userInteractionReceived}
          onEnded={handleVideoEnd}
        />
      ) : (
        <img
          src="/image/INTRO_MODULO-1.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}
      </div>

      {videoEnded && (
        <div className="">

          {showArdilla && (
            <div>
            
            <motion.div
              className="absolute bottom-6 left-6 z-40 w-[260px] h-[260px]"
              initial="hidden"
              animate="visible"
              variants={characterSlideVariants}
            >
              <Ardilla isVisible={true} bunnyShown={true} zIndex={50} browserWidth={1200} />
            </motion.div>
              
            </div>

          )}

          {showAlex && (
            <motion.div
              className="absolute bottom-[-30%] left-[-40%] z-40 w-[50%] h-full pointer-events-none"
              animate="visible"
              variants={characterSlideVariants}
            >
              <SimpleAlex isVisible={true} />
            </motion.div>
          )}
          {showActivityLabels && (
            <div className="w-full px-6 pb-6 z-30 flex justify-center">
              <ActivityLabels 
                isVisible={true}
                onLabelClick={(id, url) => {
                  console.log(`Clicked on activity ${id}: ${url}`);
                }}
              />
            </div>
          )}

          {showSun && (
            <div className="absolute top-0 left-0 z-30 w-full h-[300px]">
              <SunGif />
            </div>
          )}

        </div>
      )}
    </div>
  );
}