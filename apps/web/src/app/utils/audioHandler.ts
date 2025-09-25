import { getDeviceAudioInfo, initializeAudioForUserInteraction } from './gameAudio';

let audioContext: AudioContext | null = null;
let initialized = false;
const bufferCache: Record<string, AudioBuffer> = {};
let currentSource: AudioBufferSourceNode | null = null;
let globalGainNode: GainNode | null = null;

// Global audio element for fallback method
let globalAudioElement: HTMLAudioElement | null = null;

export const initAudio = async (): Promise<boolean> => {
  if (initialized) return true;

  const deviceInfo = getDeviceAudioInfo();
  console.log(`🎵 AudioHandler: Initializing audio system (iOS: ${deviceInfo.isIOS})`);

  try {
    // Initialize iOS audio if needed
    if (deviceInfo.isIOS) {
      await initializeAudioForUserInteraction();
    }

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (AudioContextClass) {
      audioContext = new AudioContextClass();

      // Create a global gain node for volume control
      globalGainNode = audioContext.createGain();

      // Get saved volume and apply to gain node
      const savedVolume = localStorage.getItem('video-volume');
      const volume = savedVolume ? parseFloat(savedVolume) : 0.9;
      globalGainNode.gain.value = volume;
      globalGainNode.connect(audioContext.destination);

      // Unlock right away
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(globalGainNode);
      source.start(0);

      initialized = true;
      console.log(`🎵 AudioHandler: Audio system initialized successfully (iOS: ${deviceInfo.isIOS})`);

      // Listen for global volume changes
      const handleVolumeChange = (event: CustomEvent) => {
        const { volume } = event.detail;
        if (globalGainNode) {
          globalGainNode.gain.value = volume;
          console.log(`🎵 AudioHandler: Updated volume via globalVolumeChange: ${volume}`);
        }
        // Also update global audio element volume
        if (globalAudioElement) {
          if (deviceInfo.isIOS) {
            globalAudioElement.volume = 1.0; // iOS: set to max, let WebAudio control
          } else {
            globalAudioElement.volume = volume;
          }
        }
      };

      window.addEventListener('globalVolumeChange', handleVolumeChange as EventListener);

      // Don't block here — run async audio element unlock *after*
      setTimeout(() => {
        try {
          globalAudioElement = new Audio();
          globalAudioElement.autoplay = false;
          globalAudioElement.src =
            'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

          // Apply volume settings
          if (deviceInfo.isIOS) {
            globalAudioElement.volume = 1.0; // iOS: set to max
            globalAudioElement.setAttribute('playsinline', 'true');
          } else {
            globalAudioElement.volume = volume;
          }

          globalAudioElement.play().then(() => {
            globalAudioElement?.pause();
            console.log(`🎵 AudioHandler: Global audio element initialized (iOS: ${deviceInfo.isIOS})`);
          });
        } catch (e) {
          console.warn('🎵 AudioHandler: Global audio element init failed (ignored):', e);
        }
      }, 0);

      return true;
    }
  } catch (e) {
    console.warn('🎵 AudioHandler: Failed to initialize audio system:', e);
  }

  return false;
};


export const preloadAudio = async (url: string): Promise<boolean> => {
  try {
    if (audioContext) {
      if (bufferCache[url]) return true;

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      bufferCache[url] = audioBuffer;
      return true;
    }

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

export const playAudio = async (url: string, volume = 1.0): Promise<boolean> => {
  if (!initialized) {
    try {
      await initAudio();
    } catch (e) {
      console.warn('🎵 AudioHandler: Audio initialization failed:', e);
    }
  }

  const deviceInfo = getDeviceAudioInfo();
  console.log(`🎵 AudioHandler: Playing ${url} (iOS: ${deviceInfo.isIOS}, volume: ${volume})`);

  if (audioContext && initialized && globalGainNode) {
    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      if (currentSource) {
        try {
          currentSource.stop();
          currentSource.disconnect();
        } catch (e) {
          console.warn('🎵 AudioHandler: Error stopping previous audio:', e);
        }
        currentSource = null;
      }

      let buffer = bufferCache[url];
      if (!buffer) {
        const loaded = await preloadAudio(url);
        if (!loaded) throw new Error('Failed to load audio');
        buffer = bufferCache[url];
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      // For iOS, use the global gain node; for others, create individual gain node
      if (deviceInfo.isIOS) {
        // iOS: Use global gain node (volume controlled by FloatingMenu)
        source.connect(globalGainNode);
        console.log(`🍎 AudioHandler: Connected to global gain node (iOS) for ${url}`);
      } else {
        // Non-iOS: Individual volume control
        const individualGainNode = audioContext.createGain();
        individualGainNode.gain.value = volume;
        source.connect(individualGainNode);
        individualGainNode.connect(globalGainNode);
        console.log(`🖥️ AudioHandler: Using individual gain node (non-iOS) for ${url}`);
      }

      source.start(0);
      currentSource = source;

      console.log(`🎵 AudioHandler: Playing audio: ${url} (using AudioContext, iOS: ${deviceInfo.isIOS})`);
      return true;
    } catch (e) {
      console.warn(`🎵 AudioHandler: AudioContext playback failed for ${url}:`, e);
    }
  }

  // Fallback to Audio element
  try {
    if (!globalAudioElement) {
      globalAudioElement = new Audio();

      if (deviceInfo.isIOS) {
        globalAudioElement.setAttribute('playsinline', 'true');
        globalAudioElement.preload = 'auto';
      }
    }

    globalAudioElement.src = url;
    globalAudioElement.currentTime = 0;

    // Apply volume based on device
    if (deviceInfo.isIOS) {
      // iOS: Set to max, let WebAudio control via global volume
      globalAudioElement.volume = 1.0;
      console.log(`🍎 AudioHandler: iOS fallback - audio element set to max volume`);
    } else {
      // Non-iOS: Direct volume control
      globalAudioElement.volume = volume;
      console.log(`🖥️ AudioHandler: Non-iOS fallback - direct volume control: ${volume}`);
    }

    await globalAudioElement.play();
    console.log(`🎵 AudioHandler: Playing audio: ${url} (using Audio element fallback, iOS: ${deviceInfo.isIOS})`);
    return true;
  } catch (e) {
    console.warn(`🎵 AudioHandler: Audio playback failed completely for ${url}:`, e);
    return false;
  }
};

export const waitDuration = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const preloadAudiosWithProgress = async (
  urls: string[],
  onProgress: (progress: number) => void
): Promise<void> => {
  if (!initialized) {
    try {
      await initAudio();
    } catch (e) {
      console.warn('Audio initialization failed during preload:', e);
    }
  }

  let loadedCount = 0;
  const total = urls.length;

  for (const url of urls) {
    await preloadAudio(url).catch(() => false);
    loadedCount++;
    onProgress(Math.round((loadedCount / total) * 100));
  }

  console.log(`Preloaded ${loadedCount}/${total} audio files`);
};

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

  if (globalAudioElement) {
    try {
      globalAudioElement.pause();
      globalAudioElement.currentTime = 0;
    } catch (e) {
      console.warn('Failed to stop global audio element:', e);
    }
  }
};