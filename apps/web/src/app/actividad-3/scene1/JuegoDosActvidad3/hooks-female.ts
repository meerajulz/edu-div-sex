// Game Logic Hooks for JuegoDosActividad3Female

import { useState, useRef, useCallback } from 'react';
import { GAME_CONFIG_FEMALE, SituationAttempt, GameSession } from './config-female';
import { createGameAudio } from '../../../utils/gameAudio';

export const useGameState = () => {
  const gameConfig = GAME_CONFIG_FEMALE;

  const [currentSituation, setCurrentSituation] = useState(0);
  const [gamePhase, setGamePhase] = useState<'title' | 'situation' | 'question' | 'feedback' | 'complete'>('title');
  const [selectedAnswer, setSelectedAnswer] = useState<'YES' | 'NO' | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [situationsCorrect, setSituationsCorrect] = useState<boolean[]>(
    new Array(gameConfig.situations.length).fill(false)
  );

  const resetGame = useCallback(() => {
    setCurrentSituation(0);
    setGamePhase('title');
    setSelectedAnswer(null);
    setIsCorrect(false);
    setScore(0);
    setSituationsCorrect(new Array(gameConfig.situations.length).fill(false));
  }, [gameConfig.situations.length]);

  const nextSituation = useCallback(() => {
    if (currentSituation < gameConfig.situations.length - 1) {
      setCurrentSituation(prev => prev + 1);
      setSelectedAnswer(null);
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
    selectedAnswer,
    setSelectedAnswer,
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

export const useGameSession = () => {
  const sessionRef = useRef<GameSession | null>(null);
  const gameConfig = GAME_CONFIG_FEMALE;

  const startSession = useCallback((userId?: string) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    sessionRef.current = {
      gameId: GAME_CONFIG_FEMALE.id,
      userId,
      sessionId,
      startTime: new Date(),
      completed: false,
      totalSituations: gameConfig.situations.length,
      correctAnswers: 0,
      situationsCorrect: new Array(gameConfig.situations.length).fill(false),
      finalScore: 0
    };

    return sessionRef.current;
  }, [gameConfig.situations.length]);

  const endSession = useCallback((completed: boolean, correctAnswers: number, situationsCorrect: boolean[]) => {
    if (sessionRef.current) {
      sessionRef.current.endTime = new Date();
      sessionRef.current.completed = completed;
      sessionRef.current.correctAnswers = correctAnswers;
      sessionRef.current.situationsCorrect = situationsCorrect;
      sessionRef.current.finalScore = correctAnswers;
    }
    return sessionRef.current;
  }, []);

  return {
    sessionRef,
    startSession,
    endSession
  };
};

export const useGameTracking = () => {
  const attemptsRef = useRef<SituationAttempt[]>([]);

  const recordAttempt = useCallback((
    situationId: string,
    selectedAnswer: 'YES' | 'NO',
    correctAnswer: 'YES' | 'NO',
    userId?: string
  ) => {
    const attempt: SituationAttempt = {
      gameId: GAME_CONFIG_FEMALE.id,
      situationId,
      userId,
      selectedAnswer,
      correctAnswer,
      isCorrect: selectedAnswer === correctAnswer,
      timestamp: new Date()
    };

    attemptsRef.current.push(attempt);
    console.log('📝 Recorded attempt:', attempt);

    return attempt;
  }, []);

  return {
    attemptsRef,
    recordAttempt
  };
};

// FIXED: Audio Manager Hook
export const useAudioManager = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioPath: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Stop any existing audio first
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        // Create new audio element
        const audio = createGameAudio(audioPath, 1.0, 'JuegoDosActividad3Female');
        audioRef.current = audio;

        const handleEnded = () => {
          console.log('🎵 Audio finished playing:', audioPath);
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
          resolve();
        };

        const handleError = (error: Event) => {
          console.error('🎵 Audio error:', error);
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
          reject(error);
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        audio.play().catch(reject);
      } catch (error) {
        console.error('🎵 Error creating audio:', error);
        reject(error);
      }
    });
  }, []);

  const playAudioWithCallback = useCallback((audioPath: string, callback: () => void) => {
    // Stop any existing audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = createGameAudio(audioPath, 1.0, 'JuegoDosActividad3Female');
    audioRef.current = audio;

    const handleEnded = () => {
      console.log('🎵 Audio finished (with callback):', audioPath);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      callback();
    };

    const handleError = (error: Event) => {
      console.error('🎵 Audio error (with callback):', error);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      callback(); // Still call callback on error to prevent getting stuck
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audio.play().catch((error) => {
      console.error('🎵 Play error:', error);
      callback(); // Call callback on play error too
    });
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log('🎵 Audio stopped');
    }
  }, []);

  return {
    playAudio,
    playAudioWithCallback,
    stopAudio
  };
};
