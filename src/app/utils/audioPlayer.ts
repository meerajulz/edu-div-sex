'use client';

// ========== User Interaction Handling ==========
let hasUserInteraction = false;

export const markUserInteraction = () => {
  hasUserInteraction = true;
  // Try to resume audio context if it exists
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(e => {
      console.warn('Failed to resume audio context:', e);
    });
  }
};

// ========== Browser Detection ==========
export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

export const isIPad = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  // Modern iPads don't report as iPad in user agent, check for iPad specific features
  const isModernIPad = 
    navigator.platform === 'MacIntel' && 
    navigator.maxTouchPoints > 0 &&
    !(/iPhone|iPod/.test(navigator.userAgent));
  
  return /iPad/.test(navigator.userAgent) || isModernIPad;
};

export const isSafari = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for Safari but not Chrome (as Chrome on iOS also reports as Safari)
  return /Safari/.test(navigator.userAgent) && 
    !/Chrome/.test(navigator.userAgent) &&
    !/CriOS/.test(navigator.userAgent);
};

export const isChromiumBased = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Chrome/.test(navigator.userAgent) || /CriOS/.test(navigator.userAgent);
};

export const needsInteractionForAudio = (): boolean => {
  // All iOS devices and Safari need interaction
  return (isIOS() || isIPad() || isSafari()) && !hasUserInteraction;
};

// ========== Audio Context Handling ==========
let audioContext: AudioContext | null = null;
const bufferCache: Record<string, AudioBuffer> = {};
let currentSource: AudioBufferSourceNode | null = null;

// ========== HTMLAudio Handling ==========
let globalAudioElement: HTMLAudioElement | null = null;
const audioElementCache: Record<string, HTMLAudioElement> = {};

// Initialize the audio system - must be called after user interaction on iOS
export const initAudio = async (): Promise<boolean> => {
  // Already initialized
  if (audioContext && audioContext.state === 'running') return true;
  
  try {
    // Use AudioContext if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    
    if (AudioContextClass) {
      console.log('Creating AudioContext');
      // Create new context or resume existing
      if (!audioContext) {
        audioContext = new AudioContextClass();
      }
      
      // iOS/Safari specific unlock
      if (audioContext.state === 'suspended') {
        console.log('Attempting to resume suspended audio context');
        await audioContext.resume();
      }
      
      // Unlock workaround with empty buffer
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      
      // Initialize global audio element for fallback
      setTimeout(() => {
        try {
          if (!globalAudioElement) {
            globalAudioElement = new Audio();
            globalAudioElement.autoplay = false;
            globalAudioElement.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            globalAudioElement.play().catch(e => {
              console.warn('Silent audio play failed (might need user interaction):', e);
            });
          }
        } catch (e) {
          console.warn('Global audio element init failed:', e);
        }
      }, 0);
      
      console.log('Audio system initialized successfully');
      return true;
    }
  } catch (e) {
    console.warn('Failed to initialize audio system:', e);
  }
  
  return false;
};

// Preload audio file for both methods
export const preloadAudio = async (url: string): Promise<boolean> => {
  try {
    // Try to use AudioContext (better performance)
    if (audioContext) {
      if (bufferCache[url]) return true;
      
      console.log(`Preloading with AudioContext: ${url}`);
      const response = await fetch(url).catch(e => {
        console.warn(`Fetch failed for ${url}:`, e);
        throw e;
      });
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      bufferCache[url] = audioBuffer;
      console.log(`Successfully cached audio buffer: ${url}`);
      return true;
    }
    
    // Fallback to HTML Audio element preloading
    if (audioElementCache[url]) return true;
    
    console.log(`Preloading with HTML Audio: ${url}`);
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = 'auto';
      
      const timeout = setTimeout(() => {
        console.warn(`Preload timeout for ${url}, resolving anyway`);
        audioElementCache[url] = audio;
        resolve(true);
      }, 5000);
      
      const handleLoaded = () => {
        clearTimeout(timeout);
        audio.removeEventListener('canplaythrough', handleLoaded);
        audioElementCache[url] = audio;
        console.log(`Successfully cached audio element: ${url}`);
        resolve(true);
      };
      
      const handleError = (e: Event) => {
        clearTimeout(timeout);
        audio.removeEventListener('error', handleError);
        console.warn(`Failed to preload: ${url}`, e);
        resolve(false);
      };
      
      audio.addEventListener('canplaythrough', handleLoaded);
      audio.addEventListener('error', handleError);
      audio.src = url;
      audio.load();
    });
  } catch (e) {
    console.warn(`Failed to preload audio: ${url}`, e);
    return false;
  }
};

// Play audio with unified approach and fallbacks
export const playAudio = async (
  url: string, 
  onEnd?: () => void,
  volume = 1.0
): Promise<boolean> => {
  try {
    // Initialize audio if not already done
    if (!audioContext) {
      await initAudio();
    }
    
    // Debug logging
    console.log(`Playing audio: ${url}`);
    console.log(`Browser info: iOS: ${isIOS()}, iPad: ${isIPad()}, Safari: ${isSafari()}, Chromium: ${isChromiumBased()}`);
    console.log(`Audio state: Context: ${audioContext?.state || 'none'}, Interaction: ${hasUserInteraction}`);
    
    // Check for user interaction requirements
    if (needsInteractionForAudio()) {
      console.warn("Browser requires user interaction for audio");
      if (onEnd) setTimeout(onEnd, 500);
      return false;
    }
    
    // Try AudioContext method first (better performance)
    if (audioContext && audioContext.state === 'running') {
      try {
        // Clean up existing sounds
        if (currentSource) {
          try {
            currentSource.stop();
            currentSource.disconnect();
          } catch (e) {
            console.warn('Failed to stop existing source', e);
            // Ignore errors from already stopped sources
          }
          currentSource = null;
        }
        
        // Get or load buffer
        let buffer = bufferCache[url];
        if (!buffer) {
          console.log(`Buffer not found, preloading: ${url}`);
          const loaded = await preloadAudio(url);
          if (!loaded) throw new Error('Failed to load audio buffer');
          buffer = bufferCache[url];
        }
        
        if (!buffer) throw new Error('Buffer still null after preload');
        
        // Create and connect nodes
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set up completion callback
        source.onended = () => {
          if (onEnd) onEnd();
        };
        
        // Start playback
        source.start(0);
        currentSource = source;
        
        console.log(`Playing audio with AudioContext: ${url}`);
        return true;
      } catch (e) {
        console.warn(`AudioContext playback failed for ${url}:`, e);
        // Fall through to HTML Audio fallback
      }
    }
    
    // Fallback to HTML Audio element
    try {
      let audio = audioElementCache[url];
      
      if (!audio) {
        console.log(`Audio element not cached, creating new: ${url}`);
        audio = new Audio(url);
        audioElementCache[url] = audio;
      }
      
      // Reset state
      audio.volume = volume;
      audio.currentTime = 0;
      
      // Set up completion callback
      if (onEnd) {
        const endHandler = () => {
          audio.removeEventListener('ended', endHandler);
          onEnd();
        };
        audio.addEventListener('ended', endHandler);
      }
      
      // Start playback
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(e => {
          console.warn(`HTML Audio play failed for ${url}:`, e);
          
          // Handle NotAllowedError which happens when user interaction is needed
          if (e.name === 'NotAllowedError') {
            hasUserInteraction = false;
          }
          
          if (onEnd) onEnd();
        });
      }
      
      console.log(`Playing audio with HTML Audio: ${url}`);
      return true;
    } catch (e) {
      console.warn(`HTML Audio playback failed for ${url}:`, e);
      if (onEnd) onEnd();
      return false;
    }
  } catch (e) {
    console.error(`Complete audio playback failure for ${url}:`, e);
    if (onEnd) onEnd();
    return false;
  }
};

// Helper to preload multiple audio files
export const preloadAudioFiles = async (sources: string[]): Promise<void> => {
  // Initialize audio system first
  await initAudio();
  
  console.log(`Preloading ${sources.length} audio files`);
  
  const preloadPromises = sources.map(src => 
    preloadAudio(src).catch(error => {
      console.warn(`Failed to preload ${src}:`, error);
      return false;
    })
  );
  
  await Promise.all(preloadPromises);
  console.log('Audio preloading complete');
};

// Clean up all audio resources
export const cleanupAudio = (): void => {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch (e) {
      console.warn('Failed to stop current audio source:', e);
    }
    currentSource = null;
  }
  
  // Stop all cached HTML audio elements
  Object.values(audioElementCache).forEach(audio => {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {
      console.warn('Failed to stop cached audio element:', e);
      // Ignore errors from already paused audio
    }
  });
  
  if (globalAudioElement) {
    try {
      globalAudioElement.pause();
      globalAudioElement.currentTime = 0;
    } catch (e) {
      console.warn('Failed to stop global audio element:', e);
    }
  }
  
  console.log('Audio resources cleaned up');
};