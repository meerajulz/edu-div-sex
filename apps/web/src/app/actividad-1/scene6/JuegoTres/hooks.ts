// Custom hooks for game logic - Easy to test and track

import { useState, useRef, useCallback } from 'react';
import { GAME_CONFIG, GameAttempt, GameSession } from './config';

export const useGameState = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const resetGame = useCallback(() => {
    setGameStarted(false);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowCongrats(false);
    setAttempts(0);
  }, []);

  return {
    gameStarted,
    setGameStarted,
    selectedOption,
    setSelectedOption,
    showFeedback,
    setShowFeedback,
    isCorrect,
    setIsCorrect,
    showCongrats,
    setShowCongrats,
    attempts,
    setAttempts,
    resetGame
  };
};

export const useGameSession = () => {
  const sessionRef = useRef<GameSession | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const startSession = useCallback((userId?: string) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    startTimeRef.current = new Date();
    
    sessionRef.current = {
      gameId: GAME_CONFIG.id,
      userId,
      sessionId,
      startTime: startTimeRef.current,
      completed: false,
      totalAttempts: 0,
      correctAnswer: 'erect_penis',
      finalResult: 'abandoned'
    };

    return sessionRef.current;
  }, []);

  const endSession = useCallback((completed: boolean, totalAttempts: number) => {
    if (sessionRef.current) {
      sessionRef.current.endTime = new Date();
      sessionRef.current.completed = completed;
      sessionRef.current.totalAttempts = totalAttempts;
      sessionRef.current.finalResult = completed ? 'success' : 'abandoned';
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
  const attemptsRef = useRef<GameAttempt[]>([]);

  const recordAttempt = useCallback((
    selectedOption: string,
    isCorrect: boolean,
    attemptNumber: number,
    userId?: string,
    sessionId?: string
  ) => {
    const attempt: GameAttempt = {
      gameId: GAME_CONFIG.id,
      userId,
      sessionId,
      selectedOption,
      isCorrect,
      attempts: attemptNumber,
      timestamp: new Date(),
      timeToComplete: undefined // Can be calculated later
    };

    attemptsRef.current.push(attempt);
    
    // Here you would send to database
    console.log('🎮 Game Attempt Recorded:', attempt);
    
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
  const audioPlayedRef = useRef(false);

  const playAudio = useCallback(async (audioPath: string, volume = 0.7) => {
    try {
      const audio = new Audio(audioPath);
      audio.volume = volume;
      await audio.play();
      return audio;
    } catch (err) {
      console.warn('Error playing audio:', audioPath, err);
      return null;
    }
  }, []);

  const playInitialAudio = useCallback(async (onComplete: () => void) => {
    if (audioPlayedRef.current) return;
    audioPlayedRef.current = true;

    try {
      // Play introduction audio
      const audio1 = await playAudio(GAME_CONFIG.audio.introduction);
      if (!audio1) {
        onComplete();
        return;
      }

      // Play instructions audio after introduction
      audio1.onended = async () => {
        const audio2 = await playAudio(GAME_CONFIG.audio.instructions);
        if (audio2) {
          audio2.onended = onComplete;
        } else {
          onComplete();
        }
      };
    } catch (err) {
      console.warn('Error in audio sequence:', err);
      onComplete();
    }
  }, [playAudio]);

  const resetAudioState = useCallback(() => {
    audioPlayedRef.current = false;
  }, []);

  return {
    playAudio,
    playInitialAudio,
    resetAudioState
  };
};