// audioPlayer.ts - Utility for handling audio playback
'use client';

// Track if we've received user interaction, needed for Safari browsers
let hasUserInteraction = false;

// Audio elements cache
const audioCache: Record<string, HTMLAudioElement> = {};

// Function to set user interaction flag
export const markUserInteraction = () => {
  hasUserInteraction = true;
};

// Check if running on iOS (iPhone/iPad)
export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// Check if running on any Safari browser (Mac, iPad, iPhone)
export const isSafari = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for Safari but not Chrome (as Chrome on iOS also reports as Safari)
  const isSafariBrowser = 
    /Safari/.test(navigator.userAgent) && 
    !/Chrome/.test(navigator.userAgent) &&
    !/CriOS/.test(navigator.userAgent);
    
  return isSafariBrowser || isIOS();
};

// Check if user interaction might be needed for audio
export const needsInteractionForAudio = (): boolean => {
  return isSafari() && !hasUserInteraction;
};

// Preload audio files
export const preloadAudio = (src: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    if (audioCache[src]) {
      resolve(audioCache[src]);
      return;
    }

    const audio = new Audio();
    audio.preload = 'auto';
    
    // Set a timeout in case oncanplaythrough doesn't fire
    const timeout = setTimeout(() => {
      console.warn(`Preload timeout for ${src}, resolving anyway`);
      audioCache[src] = audio;
      resolve(audio);
    }, 3000);
    
    audio.oncanplaythrough = () => {
      clearTimeout(timeout);
      audioCache[src] = audio;
      resolve(audio);
    };
    
    audio.onerror = (error) => {
      clearTimeout(timeout);
      console.error(`Error loading audio file ${src}:`, error);
      reject(error);
    };
    
    audio.src = src;
    audio.load();
  });
};

// Play audio with special handling for Safari browsers
export const playAudio = (
  src: string, 
  onEnd?: () => void,
  volume = 1.0
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Debug log
      console.log(`Attempting to play audio: ${src}`);
      console.log(`Browser info: Safari: ${isSafari()}, iOS: ${isIOS()}, Has interaction: ${hasUserInteraction}`);
      
      // Handle Safari restrictions which require user interaction
      if (needsInteractionForAudio()) {
        console.warn("Safari requires user interaction before audio can play");
        if (onEnd) setTimeout(onEnd, 500);
        resolve();
        return;
      }
      
      // Get or create audio element
      let audio: HTMLAudioElement;
      try {
        audio = await preloadAudio(src);
      } catch (error) {
        console.error("Failed to load audio:", error);
        if (onEnd) onEnd();
        resolve();
        return;
      }
      
      // Reset audio state
      audio.currentTime = 0;
      audio.volume = volume;
      
      // Set up event handlers
      const endHandler = () => {
        audio.removeEventListener('ended', endHandler);
        if (onEnd) onEnd();
        resolve();
      };
      
      audio.addEventListener('ended', endHandler);
      
      // Play the audio with additional Safari handling
      try {
        const playPromise = audio.play();
        
        // Modern browsers return a promise from audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing audio:", error);
            
            // If we get a user interaction error, mark that we need interaction
            if (error.name === 'NotAllowedError') {
              hasUserInteraction = false;
            }
            
            endHandler(); // Call the end handler anyway to ensure flow continues
          });
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        endHandler(); // Call the end handler anyway to ensure flow continues
      }
    } catch (error) {
      console.error("Unexpected error in playAudio:", error);
      if (onEnd) onEnd();
      resolve(); // Resolve anyway to prevent blocking the UI
    }
  });
};

// Helper to preload multiple audio files
export const preloadAudioFiles = async (sources: string[]): Promise<void> => {
  const preloadPromises = sources.map(src => 
    preloadAudio(src).catch(error => {
      console.warn(`Failed to preload ${src}:`, error);
      return null;
    })
  );
  
  await Promise.all(preloadPromises);
};