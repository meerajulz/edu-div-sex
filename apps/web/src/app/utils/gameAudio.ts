/**
 * Game Audio Utility Functions
 * Provides standardized audio playback with volume control for games
 */

/**
 * Play audio with volume control from localStorage
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
    const audio = new Audio(audioPath);

    // Get saved volume from localStorage
    const savedVolume = localStorage.getItem('video-volume');
    audio.volume = savedVolume ? parseFloat(savedVolume) : fallbackVolume;

    const logLabel = label ? ` (${label})` : '';
    console.log(`🎵 GameAudio${logLabel}: Playing ${audioPath} with volume ${audio.volume}`);

    await audio.play();
    return true;
  } catch (error) {
    console.warn(`🎵 GameAudio: Error playing ${audioPath}:`, error);
    return false;
  }
};

/**
 * Create an audio element with volume control
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
  const audio = new Audio(audioPath);

  // Get saved volume from localStorage
  const savedVolume = localStorage.getItem('video-volume');
  audio.volume = savedVolume ? parseFloat(savedVolume) : fallbackVolume;

  const logLabel = label ? ` (${label})` : '';
  console.log(`🎵 GameAudio${logLabel}: Created ${audioPath} with volume ${audio.volume}`);

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