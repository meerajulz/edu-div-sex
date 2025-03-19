// Cache audio instances to avoid repeated loading
const audioCache: Record<string, HTMLAudioElement> = {};

// Keep track of which audio is currently playing
let currentlyPlaying: HTMLAudioElement | null = null;

/**
 * Safely loads and plays audio with proper error handling
 * @param src Audio file path
 * @param volume Optional volume (0-1)
 * @returns Promise that resolves when audio begins playing or rejects on error
 */
export const playAudio = (src: string, volume = 1.0): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Stop any currently playing audio first
      if (currentlyPlaying) {
        try {
          currentlyPlaying.pause();
          currentlyPlaying.currentTime = 0;
        } catch (e) {
          console.log(e, 'Error stopping previous audio');
        }
      }

      // Get or create audio element
      let audio = audioCache[src];
      if (!audio) {
        audio = new Audio(src);
        audio.preload = 'auto';
        audioCache[src] = audio;
      }

      // Reset and set volume
      audio.currentTime = 0;
      audio.volume = volume;
      
      // Set as currently playing
      currentlyPlaying = audio;

      // Use interaction state to determine playback approach
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Successfully started playing
            resolve();
          })
          .catch((error) => {
            console.error(`Failed to play audio (${src}):`, error);
            
            // Common error in browsers - try a different approach
            if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
              // Consider the audio as "played" for animation purposes
              console.log(`Audio ${src} blocked by browser policy, continuing animation`);
              resolve();
            } else {
              reject(error);
            }
          });
      } else {
        // For older browsers that don't return a promise
        resolve();
      }
    } catch (error) {
      console.error('Error setting up audio:', error);
      // Continue the flow even if audio fails
      resolve();
    }
  });
};

/**
 * Waits for the specified duration, useful for simulating audio playback
 * when actual audio can't be played
 * @param duration Time to wait in milliseconds
 */
export const waitDuration = (duration: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

/**
 * Plays audio and returns a promise that completes after the audio finishes
 * or after the specified duration if audio fails to play
 * @param src Audio file path
 * @param duration Fallback duration in milliseconds
 * @param volume Optional volume (0-1)
 */
export const playAudioAndWait = async (src: string, duration: number, volume = 1.0): Promise<void> => {
  try {
    // Try to play the audio
    const audio = audioCache[src] || new Audio(src);
    
    if (!audioCache[src]) {
      audio.preload = 'auto';
      audioCache[src] = audio;
    }
    
    // Stop any currently playing audio
    if (currentlyPlaying) {
      try {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
      } catch (e) {
        console.log(e, 'Error stopping previous audio');
        // Ignore errors when stopping
      }
    }
    
    // Set up the audio
    audio.currentTime = 0;
    audio.volume = volume;
    currentlyPlaying = audio;
    
    // Create a promise that resolves when audio ends
    const playbackPromise = new Promise<void>((resolve) => {
      const onEnded = () => {
        audio.removeEventListener('ended', onEnded);
        resolve();
      };
      
      audio.addEventListener('ended', onEnded);
      
      // Also resolve after the duration as a fallback
      setTimeout(() => {
        audio.removeEventListener('ended', onEnded);
        resolve();
      }, duration + 200); // Add small buffer
    });
    
    // Try to play
    try {
      await audio.play();
    } catch (error) {
      console.error(`Failed to play audio (${src}):`, error);
      // Continue with the duration wait even if audio fails
    }
    
    // Wait for either the audio to finish or the duration
    return playbackPromise;
  } catch (error) {
    console.error('Audio playback error:', error);
    // Wait for the specified duration as fallback
    return waitDuration(duration);
  }
};

/**
 * Preloads multiple audio files
 * @param sources List of audio file paths
 */
export const preloadAudios = (sources: string[]): void => {
  if (typeof window === 'undefined') return;
  
  sources.forEach(src => {
    if (!audioCache[src]) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = src;
      audioCache[src] = audio;
    }
  });
};

/**
 * Cleanup all audio resources
 */
export const cleanupAudio = (): void => {
  if (currentlyPlaying) {
    try {
      currentlyPlaying.pause();
      currentlyPlaying.currentTime = 0;
    } catch (e) {
      // Ignore errors
      console.log(e, 'Error stopping previous audio');
    }
    currentlyPlaying = null;
  }
};