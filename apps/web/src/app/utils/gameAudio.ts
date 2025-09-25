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
    const logLabel = label ? ` (${label})` : '';

    console.log(`🎵 GameAudio${logLabel}: Playing ${audioPath} on ${deviceIsIOS ? 'iOS' : 'non-iOS'} device`);

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

    if (deviceIsIOS) {
      // On iOS, set volume to maximum and rely on Web Audio API gain control
      audio.volume = 1.0;
      if (gainNode) {
        gainNode.gain.value = targetVolume;
        console.log(`🎵 GameAudio${logLabel}: iOS volume set via WebAudio gainNode: ${targetVolume}`);
      } else {
        console.warn(`🎵 GameAudio${logLabel}: WebAudio gainNode not available, iOS volume control may not work`);
      }
    } else {
      // Standard volume control for non-iOS devices
      audio.volume = targetVolume;
      console.log(`🎵 GameAudio${logLabel}: Standard volume control: ${targetVolume}`);
    }

    // Additional iOS-specific audio setup
    if (deviceIsIOS) {
      audio.setAttribute('playsinline', 'true');
      audio.preload = 'auto';
    }

    await audio.play();

    // Log success with device-specific info
    console.log(`🎵 GameAudio${logLabel}: Successfully playing on ${deviceIsIOS ? 'iOS' : 'non-iOS'} device`);
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
  const deviceIsIOS = isIOS();
  const logLabel = label ? ` (${label})` : '';

  console.log(`🎵 GameAudio${logLabel}: Creating audio element for ${audioPath} on ${deviceIsIOS ? 'iOS' : 'non-iOS'} device`);

  const audio = new Audio(audioPath);

  // Get saved volume from localStorage
  const savedVolume = localStorage.getItem('video-volume');
  const targetVolume = savedVolume ? parseFloat(savedVolume) : fallbackVolume;

  if (deviceIsIOS) {
    // Initialize Web Audio API if not already done (iOS)
    if (!audioContext) {
      initializeWebAudio();
    }

    // On iOS, set audio volume to maximum and rely on Web Audio API gain control
    audio.volume = 1.0;
    if (gainNode) {
      gainNode.gain.value = targetVolume;
      console.log(`🎵 GameAudio${logLabel}: iOS volume set via WebAudio gainNode: ${targetVolume}`);
    }

    // Additional iOS-specific audio setup
    audio.setAttribute('playsinline', 'true');
    audio.preload = 'auto';

    // Add event listener to resume audio context on play (iOS requirement)
    audio.addEventListener('play', async () => {
      await resumeAudioContext();
    });
  } else {
    // Standard volume control for non-iOS devices
    audio.volume = targetVolume;
    console.log(`🎵 GameAudio${logLabel}: Standard volume control: ${targetVolume}`);
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
  isSafari: boolean;
  hasWebAudio: boolean;
  hasGainNode: boolean;
  audioContextState?: string;
} => {
  return {
    isIOS: isIOS(),
    isSafari: isSafari(),
    hasWebAudio: audioContext !== null,
    hasGainNode: gainNode !== null,
    audioContextState: audioContext?.state
  };
};

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