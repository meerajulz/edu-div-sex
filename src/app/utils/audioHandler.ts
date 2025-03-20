// utils/audioHandler.ts
let audioContext: AudioContext | null = null;
let initialized = false;
const bufferCache: Record<string, AudioBuffer> = {};
let currentSource: AudioBufferSourceNode | null = null;

// Global audio element for fallback method
let globalAudioElement: HTMLAudioElement | null = null;

/**
 * Initialize audio system on first user interaction
 * MUST be called directly from a user interaction event handler
 */
export const initAudio = async (): Promise<boolean> => {
  if (initialized) return true;
  
  try {
    // Create AudioContext
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
   
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
      
      // Create a silent audio buffer and play it to unblock audio
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      
      // Also create a global audio element and play a silent sound
      globalAudioElement = new Audio();
      globalAudioElement.autoplay = false;
      globalAudioElement.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      
      try {
        await globalAudioElement.play();
        globalAudioElement.pause();
      } catch (e) {
        console.warn('Failed to play global audio element:', e);
        // Ignore errors here
      }
      
      initialized = true;
      console.log('Audio system initialized successfully');
      return true;
    }
  } catch (e) {
    console.warn('Failed to initialize audio system:', e);
  }
  
  return false;
};

/**
 * Pre-load audio files for faster playback
 */
export const preloadAudio = async (url: string): Promise<boolean> => {
  try {
    // Try AudioContext method first
    if (audioContext) {
      // Skip if already cached
      if (bufferCache[url]) return true;
      
      // Fetch the audio file
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Cache the decoded buffer
      bufferCache[url] = audioBuffer;
      return true;
    }
    
    // Fallback to audio element preloading
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = 'auto';
      
      const handleLoaded = () => {
        audio.removeEventListener('canplaythrough', handleLoaded);
        resolve(true);
      };
      
      const handleError = () => {
        audio.removeEventListener('error', handleError);
        console.warn(`Failed to preload: ${url}`);
        resolve(false);
      };
      
      audio.addEventListener('canplaythrough', handleLoaded);
      audio.addEventListener('error', handleError);
      
      audio.src = url;
    });
  } catch (e) {
    console.warn(`Failed to preload audio: ${url}`, e);
    return false;
  }
};

/**
 * Play audio with fallback mechanisms
 */
export const playAudio = async (url: string, volume = 1.0): Promise<boolean> => {
  // Try to initialize audio context if needed
  if (!initialized) {
    try {
      await initAudio();
    } catch (e) {
      console.warn('Audio initialization failed:', e);
      // Ignore initialization errors here
    }
  }
  
  // Try to play using AudioContext (preferred method)
  if (audioContext && initialized) {
    try {
      // Stop any currently playing audio
      if (currentSource) {
        try {
          currentSource.stop();
          currentSource.disconnect();
        } catch (e) {
          console.warn('Error stopping previous audio:', e);
          // Ignore errors when stopping
        }
        currentSource = null;
      }
      
      // Get or load buffer
      let buffer = bufferCache[url];
      if (!buffer) {
        // Try to load on-demand
        const loaded = await preloadAudio(url);
        if (!loaded) throw new Error('Failed to load audio');
        buffer = bufferCache[url];
      }
      
      // Create a new source and play it
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      
      // Add volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start playback
      source.start(0);
      currentSource = source;
      
      console.log(`Playing audio: ${url} (using AudioContext)`);
      return true;
    } catch (e) {
      console.warn(`AudioContext playback failed for ${url}:`, e);
      // Fall through to fallback method
    }
  }
  
  // Fallback to HTMLAudioElement (less reliable on mobile)
  try {
    if (!globalAudioElement) {
      globalAudioElement = new Audio();
    }
    
    globalAudioElement.src = url;
    globalAudioElement.volume = volume;
    globalAudioElement.currentTime = 0;
    
    await globalAudioElement.play();
    console.log(`Playing audio: ${url} (using Audio element)`);
    return true;
  } catch (e) {
    console.warn(`Audio playback failed completely for ${url}:`, e);
    return false;
  }
};

/**
 * Wait for a specified duration
 */
export const waitDuration = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Preload multiple audio files
 */
export const preloadAudios = async (urls: string[]): Promise<void> => {
  if (!initialized) {
    // Try to initialize audio system if not already done
    try {
      await initAudio();
    } catch (e) {
      console.warn('Audio initialization failed during preload:', e);
    }
  }
  
  // Preload all audio files in parallel
  await Promise.all(urls.map(url => preloadAudio(url).catch(() => false)));
  console.log(`Preloaded ${urls.length} audio files`);
};

/**
 * Clean up audio resources
 */
export const cleanupAudio = (): void => {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch (e) {
      console.warn('Failed to stop current audio source:', e);
      // Ignore errors
    }
    currentSource = null;
  }
  
  if (globalAudioElement) {
    try {
      globalAudioElement.pause();
      globalAudioElement.currentTime = 0;
    } catch (e) {
      console.warn('Failed to stop global audio element:', e);
      // Ignore errors
    }
  }
};