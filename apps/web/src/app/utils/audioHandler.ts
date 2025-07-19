let audioContext: AudioContext | null = null;
let initialized = false;
const bufferCache: Record<string, AudioBuffer> = {};
let currentSource: AudioBufferSourceNode | null = null;

// Global audio element for fallback method
let globalAudioElement: HTMLAudioElement | null = null;

export const initAudio = async (): Promise<boolean> => {
  if (initialized) return true;

  try {
 
    const AudioContextClass =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.AudioContext || (window as any).webkitAudioContext;

    if (AudioContextClass) {
      audioContext = new AudioContextClass();

      // Unlock right away
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);

      initialized = true;
      console.log('Audio system initialized successfully');

      // Don't block here — run async audio element unlock *after*
      setTimeout(() => {
        try {
          globalAudioElement = new Audio();
          globalAudioElement.autoplay = false;
          globalAudioElement.src =
            'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          globalAudioElement.play().then(() => {
            globalAudioElement?.pause();
          });
        } catch (e) {
          console.warn('Global audio element init failed (ignored):', e);
        }
      }, 0);

      return true;
    }
  } catch (e) {
    console.warn('Failed to initialize audio system:', e);
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
      console.warn('Audio initialization failed:', e);
    }
  }

  if (audioContext && initialized) {
    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      if (currentSource) {
        try {
          currentSource.stop();
          currentSource.disconnect();
        } catch (e) {
          console.warn('Error stopping previous audio:', e);
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

      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.start(0);
      currentSource = source;

      console.log(`Playing audio: ${url} (using AudioContext)`);
      return true;
    } catch (e) {
      console.warn(`AudioContext playback failed for ${url}:`, e);
    }
  }

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