'use client';

import React, { useState, useEffect } from 'react';
import RootLayout from '../layout';
import { TitleAnimation } from '../components/ModuleAnimations';
import { 
  markUserInteraction, 
  needsInteractionForAudio, 
  isSafari,
  preloadAudioFiles 
} from '../utils/audioPlayer';

const Aventura1Page: React.FC = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [userInteractionReceived, setUserInteractionReceived] = useState(false);
  
  // Check if we're on Safari immediately
  const [needsInteraction, setNeedsInteraction] = useState(false);
  
  // Preload audio files and check browser type when component mounts
  useEffect(() => {
    // Define all audio files used in this module
    const audioFiles = [
      '/audio/actividad-1.mp3',
      // Add any other audio files used in this activity
    ];
    
    preloadAudioFiles(audioFiles);
    
    // Check if we need user interaction for this browser
    setNeedsInteraction(needsInteractionForAudio());
    
    // Debug log for troubleshooting
    console.log(`Browser detection: Safari: ${isSafari()}, Needs interaction: ${needsInteractionForAudio()}`);
  }, []);
  
  // Set up event listeners for user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log("User interaction received");
      markUserInteraction();
      setUserInteractionReceived(true);
      setNeedsInteraction(false);
      
      // Remove the listeners once we've received interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    // Only set up listeners if we need interaction
    if (needsInteraction) {
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [needsInteraction]);
  
  const handleAnimationComplete = () => {
    setIntroComplete(true);
  };

  return (
    <RootLayout>
      <div className="relative min-h-screen">
        {/* Sky background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-300 to-blue-100" />
        
        {/* Safari user interaction prompt */}
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
                  setNeedsInteraction(false);
                }}
              >
                Comenzar
              </button>
            </div>
          </div>
        )}
        
        {/* Only show the animation after we've received user interaction on Safari, or immediately on other platforms */}
        {(!needsInteraction || userInteractionReceived) && (
          <>
            {/* Title animation */}
            <TitleAnimation 
              activityNumber={1}
              onAnimationComplete={handleAnimationComplete} 
              enableVoice={true}
            />
            
            {/* Content that appears after animation completes */}
       
          </>
        )}
      </div>
    </RootLayout>
  );
};

export default Aventura1Page;