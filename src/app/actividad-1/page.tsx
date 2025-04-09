'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  markUserInteraction, 
  needsInteractionForAudio,
  isIOS,
  isIPad,
  isSafari,
  initAudio,
  cleanupAudio
} from '../utils/audioPlayer';

// Import animation components with no SSR to prevent hydration issues
const TitleAnimation = dynamic(
  () => import('../components/ModuleAnimations/TitleAnimation'),
  { ssr: false }
);

const MapAnimation = dynamic(
  () => import('../components/ModuleAnimations/MapAnimation'),
  { ssr: false }
);

const CloudAnimation = dynamic(
  () => import('../components/ModuleAnimations/CloudAnimation'),
  { ssr: false }
);

const GrassBackground = dynamic(
  () => import('../components/ModuleAnimations/GrassBackground'),
  { ssr: false }
);

export default function Aventura1Page() {
  // Add hydration-safe flag
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Animation states
  const [currentStep, setCurrentStep] = useState<'loading' | 'title' | 'map' | 'clouds' | 'transitioning' | 'grass' | 'content'>('loading');
  
  // Exit animation states
  const [isCloudsExiting, setIsCloudsExiting] = useState(false);
  const [isGrassVisible, setIsGrassVisible] = useState(false);
  
  // Audio states
  const [userInteractionReceived, setUserInteractionReceived] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Add state to track bunny appearances
  const [bunnyAppearanceCount, setBunnyAppearanceCount] = useState(0);
  const [showArdilla, setShowArdilla] = useState(false);
  
  // Set hydrated flag after initial render
  useEffect(() => {
    setIsHydrated(true);
    // Only after hydration is complete, move to the title step
    setCurrentStep('title');
  }, []);
  
  // Check browser compatibility and initialize audio
  useEffect(() => {
    // Skip during server-side rendering
    if (!isHydrated) return;
    
    const checkAudioCompatibility = async () => {
      console.log('Checking audio compatibility...');
      console.log(`Browser detection: iOS: ${isIOS()}, iPad: ${isIPad()}, Safari: ${isSafari()}`);
      
      // Determine if we need user interaction
      const needsInteract = needsInteractionForAudio();
      setNeedsInteraction(needsInteract);
      
      if (!needsInteract) {
        // Try to initialize audio automatically if no interaction is needed
        try {
          const initialized = await initAudio();
          setAudioInitialized(initialized);
          console.log(`Auto audio initialization: ${initialized}`);
        } catch (e) {
          console.warn('Auto audio initialization failed:', e);
        }
      }
    };
    
    checkAudioCompatibility();
  }, [isHydrated]);
  
  // Handle user interaction for audio
  const handleUserInteraction = async () => {
    console.log("User interaction received");
    
    // Mark that we've received interaction
    markUserInteraction();
    setUserInteractionReceived(true);
    setNeedsInteraction(false);
    
    // Try to initialize audio after user interaction
    try {
      const initialized = await initAudio();
      setAudioInitialized(initialized);
      console.log(`Audio initialized after interaction: ${initialized}`);
    } catch (e) {
      console.warn('Audio initialization failed after interaction:', e);
    }
  };
  
  // Set up document-wide event listeners for interaction
  useEffect(() => {
    // Skip during server-side rendering
    if (!isHydrated) return;
    
    // Only set up listeners if we need interaction and haven't received it yet
    if (needsInteraction && !userInteractionReceived) {
      console.log("Setting up document interaction listeners");
      
      const documentInteractionHandler = () => {
        handleUserInteraction();
        // Clean up listeners after first interaction
        document.removeEventListener('click', documentInteractionHandler);
        document.removeEventListener('touchstart', documentInteractionHandler);
      };
      
      document.addEventListener('click', documentInteractionHandler);
      document.addEventListener('touchstart', documentInteractionHandler);
      
      return () => {
        document.removeEventListener('click', documentInteractionHandler);
        document.removeEventListener('touchstart', documentInteractionHandler);
      };
    }
  }, [needsInteraction, userInteractionReceived, isHydrated]);
  
  // Handle bunny appearance tracking
  const handleBunnyAppeared = () => {
    const newCount = bunnyAppearanceCount + 1;
    console.log(`Bunny has appeared ${newCount} times`);
    setBunnyAppearanceCount(newCount);
    
    // After second appearance, show the ardilla
    if (newCount === 2) {
      console.log("Second bunny appearance detected - showing ardilla next");
      setShowArdilla(true);
    }
  };
  
  // Animation completion handlers
  const handleTitleComplete = () => {
    console.log("Title animation complete");
    setCurrentStep('map');
  };
  
  const handleMapComplete = () => {
    console.log("Map animation complete");
    setCurrentStep('clouds');
  };
  
  const handleCloudsComplete = () => {
    console.log("Clouds animation complete - starting exit animation");
    setIsGrassVisible(true);

    // Small delay before clouds exit to let grass start appearing
    setTimeout(() => {
      setIsCloudsExiting(true);
    }, 300);
  };
  
  const handleCloudsExitComplete = () => {
    console.log("Clouds exit animation complete");
    // Clean up any audio from clouds scene
    cleanupAudio();
    // Change to transitioning step to set up grass scene
    setCurrentStep('transitioning');
    // Reset for future animations if needed
    setIsCloudsExiting(false);
    
    // After a short delay to ensure smooth transition
    setTimeout(() => {
      setCurrentStep('grass');
    }, 100);
  };
  
  const handleGrassEnterComplete = () => {
    console.log("Grass enter animation complete");
    // After grass appears and animation completes, we can show the content
    setTimeout(() => {
      setCurrentStep('content');
    }, 800);
  };

  // Handle ardilla animation completion
  const handleArdillaComplete = () => {
    console.log("Ardilla animation complete");
    // Add any actions you want to happen after the squirrels run across
  };

  // Simplified loading state during server-side rendering and early hydration
  if (!isHydrated || currentStep === 'loading') {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-300 to-blue-100" />
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-blue-600">Cargando aventura...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Sky background - remains visible throughout */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-300 to-blue-100" />
      
      {/* User interaction prompt for audio */}
      {needsInteraction && !userInteractionReceived && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs text-center">
            <h3 className="text-xl font-bold mb-4">¡Toca la pantalla!</h3>
            <p className="mb-4">Para escuchar los sonidos, por favor toca en cualquier lugar de la pantalla.</p>
            <button 
              className="bg-orange-500 text-white font-bold py-3 px-6 rounded-full"
              onClick={handleUserInteraction}
            >
              Comenzar
            </button>
          </div>
        </div>
      )}
      
      {/* 
        Show animations and content if either:
        1. We don't need interaction for this browser
        2. We needed interaction and received it
      */}
      {(!needsInteraction || userInteractionReceived) && (
        <>
          {/* Render only the current animation step */}
          {currentStep === 'title' && (
            <TitleAnimation 
              activityNumber={1}
              onAnimationComplete={handleTitleComplete} 
              enableVoice={true}
            />
          )}
          
          {currentStep === 'map' && (
            <MapAnimation 
              onAnimationComplete={handleMapComplete}
              enableSound={true}
              mapSrc="/svg/actividad1/mapa.svg"
              soundSrc="/audio/map-rotation.mp3"
              duration={4000}
            />
          )}
          
          {(currentStep === 'clouds' || (currentStep === 'transitioning' && isCloudsExiting)) && (
            <CloudAnimation 
              onAnimationComplete={handleCloudsComplete}
              onExitComplete={handleCloudsExitComplete}
              enableSound={true}
              soundSrc="/audio/wind-ambient.mp3"
              duration={10000}
              isExiting={isCloudsExiting}
            />
          )}
          
          {/* Grass scene appears WHILE clouds are exiting */}
          {(isGrassVisible || currentStep === 'transitioning' || currentStep === 'grass' || currentStep === 'content') && (
            <GrassBackground 
              isVisible={true}
              // Only play bird sounds after clouds are gone
              enableSound={currentStep === 'grass' || currentStep === 'content'}
              soundSrc="/audio/birds.mp3"
              onEnterComplete={handleGrassEnterComplete}
              // Pass the new props for bunny tracking and ardilla animation
              onBunnyAppeared={handleBunnyAppeared}
              showArdilla={showArdilla}
              onArdillaComplete={handleArdillaComplete}
            />
          )}
          
          {/* Content appears on top of grass scene */}
          {currentStep === 'content' && (
            <div className="relative z-40 w-full min-h-screen flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-4xl">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Descubriendo Mi Cuerpo</h2>
                <p className="text-gray-700">
                  Aquí irá el contenido principal de la actividad 1.
                </p>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Debug info overlay - visible only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 left-0 bg-black/70 text-white p-2 max-w-xs max-h-40 overflow-auto text-xs z-[1000]">
          <div>iOS: {isIOS() ? 'true' : 'false'}</div>
          <div>iPad: {isIPad() ? 'true' : 'false'}</div>
          <div>Safari: {isSafari() ? 'true' : 'false'}</div>
          <div>needsInteraction: {needsInteraction ? 'true' : 'false'}</div>
          <div>userInteractionReceived: {userInteractionReceived ? 'true' : 'false'}</div>
          <div>audioInitialized: {audioInitialized ? 'true' : 'false'}</div>
          <div>currentStep: {currentStep}</div>
          <div>isCloudsExiting: {isCloudsExiting ? 'true' : 'false'}</div>
          <div>isGrassVisible: {isGrassVisible ? 'true' : 'false'}</div>
          <div>isHydrated: {isHydrated ? 'true' : 'false'}</div>
          <div>bunnyAppearanceCount: {bunnyAppearanceCount}</div>
          <div>showArdilla: {showArdilla ? 'true' : 'false'}</div>
        </div>
      )}
    </div>
  );
}