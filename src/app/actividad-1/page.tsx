'use client';

import React, { useState, useEffect } from 'react';
import RootLayout from '../layout';
import { TitleAnimation } from '../components/ModuleAnimations';
import { 
  markUserInteraction, 
  needsInteractionForAudio,
  isIOS,
  isIPad,
  isSafari,
  initAudio
} from '../utils/audioPlayer';

const Aventura1Page: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [introComplete, setIntroComplete] = useState(false);
  const [userInteractionReceived, setUserInteractionReceived] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Check browser compatibility and initialize audio
  useEffect(() => {
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
  }, []);
  
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
  }, [needsInteraction, userInteractionReceived]);
  
  const handleAnimationComplete = () => {
    setIntroComplete(true);
  };

  return (
    <RootLayout>
      <div className="relative min-h-screen">
        {/* Sky background */}
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
          Show animation if either:
          1. We don't need interaction for this browser
          2. We needed interaction and received it
        */}
        {(!needsInteraction || userInteractionReceived) && (
          <>
            {/* Title animation */}
            <TitleAnimation 
              activityNumber={1}
              onAnimationComplete={handleAnimationComplete} 
              enableVoice={true}
            />
            
            {/* Content that appears after animation completes */}
            {introComplete && (
              <div className="relative z-20 w-full min-h-screen flex items-center justify-center">
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
            <div>introComplete: {introComplete ? 'true' : 'false'}</div>
          </div>
        )}
      </div>
    </RootLayout>
  );
};

export default Aventura1Page;