// components/AudioPreloader/AudioPreloader.tsx
'use client';

import { useEffect } from 'react';
import { preloadAudiosWithProgress } from '../../utils/audioHandler';

const ALL_AUDIO_FILES = [
  '/audio/alex/intro/1-alex.mp3',
  '/audio/alex/intro/2-alex.mp3',
  '/audio/alex/intro/3-alex.mp3',
  '/audio/alex/intro/4-alex.mp3',
  '/audio/alex/intro/5-alex.mp3',
  '/audio/alex/intro/6-alex.mp3',
  '/audio/alex/intro/7-alex.mp3',
  '/audio/alex/intro/8-alex.mp3',
  '/audio/alex/intro/9-alex.mp3',
  '/audio/alex/intro/10-alex.mp3',
  '/audio/alex/intro/11-alex.mp3',
  '/audio/cris/intro/1-cris.mp3',
  '/audio/cris/intro/2-cris.mp3',
  '/audio/cris/intro/3-cris.mp3',
  '/audio/dani/hola.mp3',
  '/audio/dani/dani-2.mp3',
  '/audio/dani/dani-3.mp3',
  '/audio/noa/hola.mp3',
  '/audio/noa/noa-2.mp3',
  '/audio/noa/noa-3.mp3',
  '/ui-sound/cabinet-door-open.mp3',
  '/ui-sound/whoosh.mp3',
];

interface AudioPreloaderProps {
  isInitialized: boolean;
  onProgress?: (progress: number) => void;
}

const AudioPreloader: React.FC<AudioPreloaderProps> = ({ isInitialized, onProgress }) => {
  useEffect(() => {
    if (isInitialized) {
      preloadAudiosWithProgress(ALL_AUDIO_FILES, onProgress || (() => {}));
    }
  }, [isInitialized, onProgress]);

  return null;
};

export default AudioPreloader;
