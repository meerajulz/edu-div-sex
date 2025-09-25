/**
 * Game Audio Utility Functions
 * Provides standardized audio playback with volume control for games
 * Includes iOS-specific handling for volume control limitations
 */

/**
 * Detect if the current device is iOS (iPhone, iPad, iPod)
 */
const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};

/**
 * Detect if the current device is specifically an iPhone
 */
const isIPhone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPhone/.test(navigator.userAgent);
};

/**
 * Detect if the current device is specifically an iPad
 */
const isIPad = (): boolean => {
  if (typeof window === 'undefined') return false;
  // Modern iPad detection includes both explicit iPad and Mac with touch
  return /iPad/.test(navigator.userAgent) ||
         (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};

/**
 * Detect if the current browser is Safari
 */
const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

/**
 * Global audio context for iOS Web Audio API fallback
 */
let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;

/**
 * Initialize Web Audio API for iOS (fallback for volume control)
 */
const initializeWebAudio = (): void => {
  if (typeof window === 'undefined' || audioContext) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
    // Store globally for use by video elements
    window.globalAudioContext = audioContext;
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    // Get saved volume and apply to gain node
    const savedVolume = localStorage.getItem('video-volume');
    const volume = savedVolume ? parseFloat(savedVolume) : 1.0;
    if (gainNode) {
      gainNode.gain.value = volume;
    }

    console.log('🎵 WebAudio initialized for iOS volume control');
  } catch (error) {
    console.warn('🎵 WebAudio initialization failed:', error);
  }
};

/**
 * Resume audio context if suspended (iOS requirement)
 */
const resumeAudioContext = async (): Promise<void> => {
  if (audioContext && audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      console.log('🎵 AudioContext resumed');
    } catch (error) {
      console.warn('🎵 Failed to resume AudioContext:', error);
    }
  }
};

/**
 * Play audio with volume control from localStorage
 * Includes iOS-specific handling for volume control
 * @param audioPath - Path to the audio file
 * @param fallbackVolume - Default volume if no saved volume (default: 1.0)
 * @param label - Optional label for console logging
 * @returns Promise<boolean> - Success status
 */
export const playGameAudio = async (
  audioPath: string,
  fallbackVolume: number = 1.0,
  label?: string
): Promise<boolean> => {
  try {
    const deviceIsIOS = isIOS();
    const deviceIsIPad = isIPad();
    const deviceIsIPhone = isIPhone();
    const logLabel = label ? ` (${label})` : '';

    console.log(`🎵 GameAudio${logLabel}: Playing ${audioPath} on ${deviceIsIPhone ? 'iPhone' : deviceIsIPad ? 'iPad' : 'non-iOS'} device`);

    if (deviceIsIOS) {
      // Initialize Web Audio API on first use (iOS)
      if (!audioContext) {
        initializeWebAudio();
      }
      await resumeAudioContext();
    }

    const audio = new Audio(audioPath);

    // Get saved volume from localStorage
    const savedVolume = localStorage.getItem('video-volume');
    const targetVolume = savedVolume ? parseFloat(savedVolume) : fallbackVolume;

    if (deviceIsIPhone) {
      // iPhone-specific: Use Web Audio API gain control
      audio.volume = 1.0;
      if (gainNode) {
        gainNode.gain.value = targetVolume;
        console.log(`📱 GameAudio${logLabel}: iPhone volume set via WebAudio gainNode: ${targetVolume}`);
      } else {
        console.warn(`📱 GameAudio${logLabel}: WebAudio gainNode not available, iPhone volume control may not work`);
      }
    } else if (deviceIsIPad) {
      // iPad-specific: Direct volume control (iPad Safari handles this better than iPhone)
      audio.volume = targetVolume;
      console.log(`🔲 GameAudio${logLabel}: iPad direct volume control: ${targetVolume}`);
    } else {
      // Standard volume control for non-iOS devices
      audio.volume = targetVolume;
      console.log(`🖥️ GameAudio${logLabel}: Standard volume control: ${targetVolume}`);
    }

    // Additional iOS-specific audio setup
    if (deviceIsIOS) {
      audio.setAttribute('playsinline', 'true');
      audio.preload = 'auto';
    }

    await audio.play();

    // Log success with device-specific info
    console.log(`🎵 GameAudio${logLabel}: Successfully playing on ${deviceIsIPhone ? 'iPhone' : deviceIsIPad ? 'iPad' : 'non-iOS'} device`);
    return true;
  } catch (error) {
    console.warn(`🎵 GameAudio: Error playing ${audioPath}:`, error);

    // iOS-specific error handling
    if (isIOS()) {
      console.warn(`🎵 GameAudio: iOS audio playback failed. This may be due to autoplay restrictions or audio context issues.`);
    }
    return false;
  }
};

/**
 * Create an audio element with volume control
 * Includes iOS-specific handling for volume control
 * @param audioPath - Path to the audio file
 * @param fallbackVolume - Default volume if no saved volume (default: 1.0)
 * @param label - Optional label for console logging
 * @returns HTMLAudioElement with volume applied
 */
export const createGameAudio = (
  audioPath: string,
  fallbackVolume: number = 1.0,
  label?: string
): HTMLAudioElement => {
  const deviceIsIPad = isIPad();
  const deviceIsIPhone = isIPhone();
  const logLabel = label ? ` (${label})` : '';

  console.log(`🎵 GameAudio${logLabel}: Creating audio element for ${audioPath} on ${deviceIsIPhone ? 'iPhone' : deviceIsIPad ? 'iPad' : 'non-iOS'} device`);

  const audio = new Audio(audioPath);

  // Get saved volume from localStorage
  const savedVolume = localStorage.getItem('video-volume');
  const targetVolume = savedVolume ? parseFloat(savedVolume) : fallbackVolume;

  if (deviceIsIPhone) {
    // iPhone-specific: Initialize Web Audio API and use gain control
    if (!audioContext) {
      initializeWebAudio();
    }

    audio.volume = 1.0;
    if (gainNode) {
      gainNode.gain.value = targetVolume;
      console.log(`📱 GameAudio${logLabel}: iPhone volume set via WebAudio gainNode: ${targetVolume}`);
    }

    // Additional iPhone-specific audio setup
    audio.setAttribute('playsinline', 'true');
    audio.preload = 'auto';

    // Add event listener to resume audio context on play (iPhone requirement)
    audio.addEventListener('play', async () => {
      await resumeAudioContext();
    });
  } else if (deviceIsIPad) {
    // iPad-specific: Direct volume control works better
    audio.volume = targetVolume;
    console.log(`🔲 GameAudio${logLabel}: iPad direct volume control: ${targetVolume}`);

    // iPad still needs these iOS-specific settings
    audio.setAttribute('playsinline', 'true');
    audio.preload = 'auto';
  } else {
    // Standard volume control for non-iOS devices
    audio.volume = targetVolume;
    console.log(`🖥️ GameAudio${logLabel}: Standard volume control: ${targetVolume}`);
  }

  return audio;
};

/**
 * Get current volume setting from localStorage
 * @param fallbackVolume - Default volume if no saved volume (default: 1.0)
 * @returns Current volume level (0.0 - 1.0)
 */
export const getCurrentVolume = (fallbackVolume: number = 1.0): number => {
  const savedVolume = localStorage.getItem('video-volume');
  return savedVolume ? parseFloat(savedVolume) : fallbackVolume;
};

/**
 * Check if iOS volume control is working
 * @returns boolean indicating if iOS volume control is functional
 */
export const isIOSVolumeControlAvailable = (): boolean => {
  return isIOS() && audioContext !== null && gainNode !== null;
};

/**
 * Get device and browser info for debugging
 */
export const getDeviceAudioInfo = (): {
  isIOS: boolean;
  isIPhone: boolean;
  isIPad: boolean;
  isSafari: boolean;
  hasWebAudio: boolean;
  hasGainNode: boolean;
  audioContextState?: string;
} => {
  return {
    isIOS: isIOS(),
    isIPhone: isIPhone(),
    isIPad: isIPad(),
    isSafari: isSafari(),
    hasWebAudio: audioContext !== null,
    hasGainNode: gainNode !== null,
    audioContextState: audioContext?.state
  };
};

/**
 * Export device detection functions for external use
 */
export { isIOS, isIPhone, isIPad, isSafari };

/**
 * Initialize audio for user interaction (call this on first user interaction)
 * This helps with iOS autoplay restrictions
 */
export const initializeAudioForUserInteraction = async (): Promise<void> => {
  if (isIOS()) {
    if (!audioContext) {
      initializeWebAudio();
    }
    await resumeAudioContext();

    // Play a silent sound to "unlock" audio on iOS
    try {
      const silentAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYgBSiG3+3LfDcB');
      silentAudio.volume = 0.01;
      await silentAudio.play();
      console.log('🎵 GameAudio: iOS audio unlocked with silent sound');
    } catch (error) {
      console.warn('🎵 GameAudio: Failed to unlock iOS audio:', error);
    }
  }
};

/**
 * Background Music Management System
 * Allows global volume control for background music
 */

// Global storage for background music audio elements
const backgroundMusicElements = new Map<string, HTMLAudioElement>();

/**
 * Play background music with volume control support
 * @param audioPath - Path to the background music file
 * @param volume - Initial volume (0.0 to 1.0)
 * @param identifier - Unique identifier for this background music (e.g., 'activity-1-bg')
 * @returns Promise<boolean> - Success status
 */
export const playBackgroundMusic = async (
  audioPath: string,
  volume: number = 0.4,
  identifier: string = 'default'
): Promise<boolean> => {
  try {
    // Stop any existing background music with this identifier
    stopBackgroundMusic(identifier);

    // Create new audio element
    const audio = new Audio(audioPath);
    audio.loop = true; // Background music should loop
    audio.preload = 'auto';

    // Device detection
    const deviceIsIPhone = isIPhone();
    const deviceIsIPad = isIPad();
    const deviceIsIOS = deviceIsIPhone || deviceIsIPad;

    // Get current volume from localStorage
    const savedVolume = localStorage.getItem('video-volume');
    const currentVolume = savedVolume ? parseFloat(savedVolume) : volume;

    // Apply volume based on device type
    if (deviceIsIPhone) {
      // iPhone: Use Web Audio API if available
      audio.volume = 1.0;

      // Connect to Web Audio API for volume control if possible
      try {
        if (window.sharedAudioContext) {
          const source = window.sharedAudioContext.createMediaElementSource(audio);
          let gainNode = window.sharedGainNode;
          if (!gainNode) {
            gainNode = window.sharedAudioContext.createGain();
            gainNode.connect(window.sharedAudioContext.destination);
            window.sharedGainNode = gainNode;
          }
          source.connect(gainNode);
          gainNode.gain.value = currentVolume;
          console.log(`📱 BackgroundMusic: iPhone connected to Web Audio API, volume: ${currentVolume}`);
        } else {
          audio.volume = currentVolume;
        }
      } catch {
        console.warn('📱 BackgroundMusic: iPhone Web Audio setup failed, using direct volume');
        audio.volume = currentVolume;
      }
    } else {
      // iPad, Desktop, Android: Direct volume control
      audio.volume = currentVolume;
      console.log(`🎵 BackgroundMusic: Direct volume control applied: ${currentVolume}`);
    }

    // iOS-specific attributes
    if (deviceIsIOS) {
      audio.setAttribute('playsinline', 'true');
    }

    // Store the audio element for later volume control
    backgroundMusicElements.set(identifier, audio);

    // Start playing
    await audio.play();
    console.log(`🎵 BackgroundMusic: Playing ${audioPath} (${identifier}) at volume ${currentVolume}`);

    return true;
  } catch (error) {
    console.warn(`🎵 BackgroundMusic: Error playing ${audioPath}:`, error);
    return false;
  }
};

/**
 * Stop background music
 * @param identifier - Identifier of background music to stop
 */
export const stopBackgroundMusic = (identifier: string = 'default'): void => {
  const audio = backgroundMusicElements.get(identifier);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    backgroundMusicElements.delete(identifier);
    console.log(`🎵 BackgroundMusic: Stopped ${identifier}`);
  }
};

/**
 * Update volume for all background music
 * Called by FloatingMenu when user changes volume
 * @param newVolume - New volume level (0.0 to 1.0)
 */
export const updateBackgroundMusicVolume = (newVolume: number): void => {
  const deviceIsIPhone = isIPhone();

  backgroundMusicElements.forEach((audio, identifier) => {
    if (deviceIsIPhone) {
      // iPhone: Try to use Web Audio API gain node
      if (window.sharedGainNode) {
        window.sharedGainNode.gain.value = newVolume;
        console.log(`📱 BackgroundMusic: Updated iPhone volume via Web Audio for ${identifier}: ${newVolume}`);
      } else {
        audio.volume = newVolume;
        console.log(`📱 BackgroundMusic: Updated iPhone volume directly for ${identifier}: ${newVolume}`);
      }
    } else {
      // iPad, Desktop, Android: Direct volume control
      audio.volume = newVolume;
      console.log(`🎵 BackgroundMusic: Updated volume for ${identifier}: ${newVolume}`);
    }
  });
};

/**
 * Stop all background music
 */
export const stopAllBackgroundMusic = (): void => {
  backgroundMusicElements.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  backgroundMusicElements.clear();
  console.log('🎵 BackgroundMusic: Stopped all background music');
};