// Game Logic Hooks for JuegoTresActividad3

import { useState, useRef, useCallback } from 'react';
import { GAME_CONFIG, SituationAttempt, GameSession, getCurrentGameConfig } from './config';
import { createGameAudio } from '../../../utils/gameAudio';

export const useGameState = (userGender: 'male' | 'female') => {
  const gameConfig = getCurrentGameConfig(userGender);
  
  const [currentSituation, setCurrentSituation] = useState(0);
  const [gamePhase, setGamePhase] = useState<'title' | 'situation' | 'options' | 'waiting_for_click' | 'feedback' | 'complete'>('title');
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [situationsCorrect, setSituationsCorrect] = useState<boolean[]>(
    new Array(gameConfig.situations.length).fill(false)
  );

  const resetGame = useCallback(() => {
    setCurrentSituation(0);
    setGamePhase('title');
    setCurrentOptionIndex(0);
    setSelectedOption(null);
    setIsCorrect(false);
    setScore(0);
    setSituationsCorrect(new Array(gameConfig.situations.length).fill(false));
  }, [gameConfig.situations.length]);

  const nextSituation = useCallback(() => {
    if (currentSituation < gameConfig.situations.length - 1) {
      setCurrentSituation(prev => prev + 1);
      setCurrentOptionIndex(0);
      setSelectedOption(null);
      setIsCorrect(false);
      console.log('Moving to next situation:', currentSituation + 1);
    } else {
      // All situations completed
      setGamePhase('complete');
    }
  }, [currentSituation, gameConfig.situations.length]);

  const markSituationCorrect = useCallback((situationIndex: number) => {
    setSituationsCorrect(prev => {
      const newCorrect = [...prev];
      newCorrect[situationIndex] = true;
      return newCorrect;
    });
  }, []);

  const isGameComplete = useCallback(() => {
    return situationsCorrect.every(correct => correct);
  }, [situationsCorrect]);

  return {
    currentSituation,
    setCurrentSituation,
    gamePhase,
    setGamePhase,
    currentOptionIndex,
    setCurrentOptionIndex,
    selectedOption,
    setSelectedOption,
    isCorrect,
    setIsCorrect,
    score,
    setScore,
    situationsCorrect,
    resetGame,
    nextSituation,
    markSituationCorrect,
    isGameComplete,
    gameConfig
  };
};

export const useGameSession = (userGender: 'male' | 'female') => {
  const sessionRef = useRef<GameSession | null>(null);
  const gameConfig = getCurrentGameConfig(userGender);

  const startSession = useCallback((userId?: string) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    sessionRef.current = {
      gameId: GAME_CONFIG.id,
      userId,
      sessionId,
      userGender,
      startTime: new Date(),
      completed: false,
      totalSituations: gameConfig.situations.length,
      correctAnswers: 0,
      situationsCorrect: new Array(gameConfig.situations.length).fill(false),
      finalScore: 0
    };

    return sessionRef.current;
  }, [userGender, gameConfig.situations.length]);

  const endSession = useCallback((completed: boolean, correctAnswers: number, situationsCorrect: boolean[]) => {
    if (sessionRef.current) {
      sessionRef.current.endTime = new Date();
      sessionRef.current.completed = completed;
      sessionRef.current.correctAnswers = correctAnswers;
      sessionRef.current.situationsCorrect = situationsCorrect;
      sessionRef.current.finalScore = Math.round((correctAnswers / gameConfig.situations.length) * 100);
    }
    return sessionRef.current;
  }, [gameConfig.situations.length]);

  return {
    currentSession: sessionRef.current,
    startSession,
    endSession
  };
};

export const useGameTracking = (userGender: 'male' | 'female') => {
  const attemptsRef = useRef<SituationAttempt[]>([]);

  const recordAttempt = useCallback((
    situationId: string,
    optionId: string,
    selectedOption: string,
    isCorrect: boolean,
    userId?: string,
    sessionId?: string
  ) => {
    const attempt: SituationAttempt = {
      gameId: GAME_CONFIG.id,
      situationId,
      optionId,
      userId,
      sessionId,
      selectedOption,
      isCorrect,
      userGender,
      timestamp: new Date()
    };

    attemptsRef.current.push(attempt);
    
    console.log('🎮 Situation Attempt Recorded:', attempt);
    
    return attempt;
  }, [userGender]);

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

// AUDIO MANAGER - Enhanced for sequential option playback
export const useAudioManager = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioRef = useRef<string>('');
  const callbackRef = useRef<(() => void) | null>(null);

  const stopAudio = useCallback(() => {
    console.log('🔇 Stopping audio...');
    
    if (audioRef.current) {
      // Remove event listeners to prevent callback from firing
      if (callbackRef.current) {
        audioRef.current.removeEventListener('ended', callbackRef.current);
        callbackRef.current = null;
      }
      
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
    
    currentAudioRef.current = '';
    console.log('🔇 Audio stopped and cleared');
  }, []);

  const playAudio = useCallback(async (audioPath: string, volume = 0.7): Promise<void> => {
    try {
      console.log('🎵 Playing audio (simple):', audioPath);
      
      // Stop any current audio first
      stopAudio();

      const audio = createGameAudio(audioPath, volume, 'JuegoTresActividad3');
      audioRef.current = audio;
      currentAudioRef.current = audioPath;
      
      await audio.play();
      console.log('🎵 Audio playing successfully:', audioPath);
    } catch (err) {
      console.warn('❌ Error playing audio:', audioPath, err);
    }
  }, [stopAudio]);

  const playAudioWithCallback = useCallback(async (
    audioPath: string,
    onComplete: () => void,
    volume = 0.7
  ): Promise<void> => {
    try {
      console.log('🎵 Playing audio with callback:', audioPath);
      
      // Stop any current audio first
      stopAudio();
      
      // Wait a moment to ensure everything is cleared
      await new Promise(resolve => setTimeout(resolve, 100));

      const audio = createGameAudio(audioPath, volume, 'JuegoTresActividad3 callback');
      audioRef.current = audio;
      currentAudioRef.current = audioPath;
      
      // Create callback wrapper
      const handleEnd = () => {
        console.log('🎵 Audio finished with callback:', audioPath);
        // Clear the callback reference
        callbackRef.current = null;
        onComplete();
      };
      
      // Store callback reference for cleanup
      callbackRef.current = handleEnd;
      
      // Add event listener
      audio.addEventListener('ended', handleEnd);
      
      await audio.play();
      console.log('🎵 Audio with callback playing successfully:', audioPath);
    } catch (err) {
      console.warn('❌ Error playing audio with callback:', audioPath, err);
      callbackRef.current = null;
      onComplete(); // Still call callback even if audio fails
    }
  }, [stopAudio]);

  return {
    playAudio,
    playAudioWithCallback,
    stopAudio,
    getCurrentAudio: () => currentAudioRef.current
  };
};