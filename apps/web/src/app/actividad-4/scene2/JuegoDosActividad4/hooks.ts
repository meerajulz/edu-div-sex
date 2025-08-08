// Game Logic Hooks for JuegoDosActividad4

import { useState, useRef, useCallback } from 'react';
import { GAME_CONFIG, DropAttempt, GameSession } from './config';

export const useGameState = () => {
  const [gamePhase, setGamePhase] = useState<'title' | 'playing' | 'complete'>('title');
  const [currentSequence, setCurrentSequence] = useState<(string | null)[]>(
    new Array(GAME_CONFIG.dropZones.total).fill(null)
  );
  const [score, setScore] = useState(0);
  const [lastDropResult, setLastDropResult] = useState<{
    isCorrect: boolean;
    imageId: string;
    position: number;
  } | null>(null);

  const resetGame = useCallback(() => {
    setGamePhase('title');
    setCurrentSequence(new Array(GAME_CONFIG.dropZones.total).fill(null));
    setScore(0);
    setLastDropResult(null);
  }, []);

  const isGameComplete = useCallback((sequence: (string | null)[]) => {
    // Check if all positions are filled with correct images
    return sequence.every((imageId, index) => {
      if (!imageId) return false;
      const expectedImage = GAME_CONFIG.images.find(img => img.order === index + 1);
      return expectedImage && expectedImage.id === imageId;
    });
  }, []);

  return {
    gamePhase,
    setGamePhase,
    currentSequence,
    setCurrentSequence,
    score,
    setScore,
    lastDropResult,
    setLastDropResult,
    resetGame,
    isGameComplete
  };
};

export const useGameSession = () => {
  const sessionRef = useRef<GameSession | null>(null);

  const startSession = useCallback((userId?: string) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    sessionRef.current = {
      gameId: GAME_CONFIG.id,
      userId,
      sessionId,
      startTime: new Date(),
      completed: false,
      totalImages: GAME_CONFIG.images.length,
      correctPlacements: 0,
      finalSequence: new Array(GAME_CONFIG.dropZones.total).fill(null),
      finalScore: 0
    };

    console.log('🎮 Started new session:', sessionRef.current);
    return sessionRef.current;
  }, []);

  const endSession = useCallback((completed: boolean, correctPlacements: number, finalSequence: (string | null)[]) => {
    if (sessionRef.current) {
      sessionRef.current.endTime = new Date();
      sessionRef.current.completed = completed;
      sessionRef.current.correctPlacements = correctPlacements;
      sessionRef.current.finalSequence = finalSequence;
      sessionRef.current.finalScore = Math.round((correctPlacements / GAME_CONFIG.images.length) * 100);
      
      console.log('🎮 Ended session:', sessionRef.current);
    }
    return sessionRef.current;
  }, []);

  return {
    currentSession: sessionRef.current,
    startSession,
    endSession
  };
};

export const useGameTracking = () => {
  const attemptsRef = useRef<DropAttempt[]>([]);

  const recordAttempt = useCallback((
    imageId: string,
    position: number,
    isCorrect: boolean,
    userId?: string,
    sessionId?: string
  ) => {
    const attempt: DropAttempt = {
      gameId: GAME_CONFIG.id,
      imageId,
      position,
      isCorrect,
      userId,
      sessionId,
      timestamp: new Date()
    };

    attemptsRef.current.push(attempt);
    
    console.log('🎮 Drop Attempt Recorded:', attempt);
    
    return attempt;
  }, []);

  const getAttempts = useCallback(() => {
    return attemptsRef.current;
  }, []);

  const clearAttempts = useCallback(() => {
    attemptsRef.current = [];
  }, []);

  return {
    recordAttempt,
    getAttempts,
    clearAttempts
  };
};

export const useAudioManager = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioRef = useRef<string>('');

  const playAudio = useCallback(async (audioPath: string, volume = 0.7): Promise<void> => {
    try {
      console.log('🎵 Attempting to play audio:', audioPath);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = volume;
      audioRef.current = audio;
      currentAudioRef.current = audioPath;
      
      await audio.play();
      console.log('🎵 Audio playing successfully:', audioPath);
    } catch (err) {
      console.warn('❌ Error playing audio:', audioPath, err);
    }
  }, []);

  const playAudioWithCallback = useCallback(async (
    audioPath: string,
    onComplete: () => void,
    volume = 0.7
  ): Promise<void> => {
    try {
      console.log('🎵 Playing audio with callback:', audioPath);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = volume;
      audioRef.current = audio;
      currentAudioRef.current = audioPath;
      
      // Set up event listener for when audio ends
      const handleEnd = () => {
        console.log('🎵 Audio finished:', audioPath);
        audio.removeEventListener('ended', handleEnd);
        onComplete();
      };
      
      audio.addEventListener('ended', handleEnd);
      
      await audio.play();
      console.log('🎵 Audio playing with callback successfully:', audioPath);
    } catch (err) {
      console.warn('❌ Error playing audio with callback:', audioPath, err);
      onComplete(); // Still call callback even if audio fails
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    currentAudioRef.current = '';
  }, []);

  return {
    playAudio,
    playAudioWithCallback,
    stopAudio,
    getCurrentAudio: () => currentAudioRef.current
  };
};