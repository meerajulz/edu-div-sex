// Game Logic Hooks for JuegoUnoActividad2 - Updated with working logic

import { useState, useRef, useCallback } from 'react';
import { GAME_CONFIG, SituationAttempt, GameSession } from './config';

export const useGameState = () => {
  const [currentSituation, setCurrentSituation] = useState(0);
  const [gamePhase, setGamePhase] = useState<'loading' | 'situation' | 'question' | 'feedback' | 'complete'>('loading');
  const [selectedAnswer, setSelectedAnswer] = useState<'YES' | 'NO' | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const resetGame = useCallback(() => {
    setCurrentSituation(0);
    setGamePhase('loading');
    setSelectedAnswer(null);
    setIsCorrect(false);
    setScore(0);
  }, []);

  const nextSituation = useCallback(() => {
    if (currentSituation < GAME_CONFIG.situations.length - 1) {
      setCurrentSituation(prev => prev + 1);
      setGamePhase('loading');
      setSelectedAnswer(null);
      setIsCorrect(false);
      console.log('Moving to next situation:', currentSituation + 1);
    } else {
      setGamePhase('complete');
    }
  }, [currentSituation]);

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
    resetGame,
    nextSituation
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
      totalSituations: GAME_CONFIG.situations.length,
      correctAnswers: 0,
      finalScore: 0
    };

    return sessionRef.current;
  }, []);

  const endSession = useCallback((completed: boolean, correctAnswers: number) => {
    if (sessionRef.current) {
      sessionRef.current.endTime = new Date();
      sessionRef.current.completed = completed;
      sessionRef.current.correctAnswers = correctAnswers;
      sessionRef.current.finalScore = Math.round((correctAnswers / GAME_CONFIG.situations.length) * 100);
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
  const attemptsRef = useRef<SituationAttempt[]>([]);

  const recordAttempt = useCallback((
    situationId: string,
    selectedAnswer: 'YES' | 'NO',
    correctAnswer: 'YES' | 'NO',
    isPrivate: boolean,
    userId?: string,
    sessionId?: string
  ) => {
    const attempt: SituationAttempt = {
      gameId: GAME_CONFIG.id,
      situationId,
      userId,
      sessionId,
      selectedAnswer,
      correctAnswer,
      isCorrect: selectedAnswer === correctAnswer,
      isPrivate,
      timestamp: new Date()
    };

    attemptsRef.current.push(attempt);
    
    console.log('🎮 Situation Attempt Recorded:', attempt);
    
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

  const playAudio = useCallback(async (audioPath: string, volume = 0.7): Promise<void> => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioPath);
      audio.volume = volume;
      audioRef.current = audio;
      await audio.play();
    } catch (err) {
      console.warn('Error playing audio:', audioPath, err);
    }
  }, []);

  const playAudioSequence = useCallback(async (
    situationAudio: string,
    textAudio: string,
    questionAudio: string,
    onComplete: () => void
  ) => {
    try {
      // Play situation audio and wait for it to finish
      console.log('Playing situation audio...');
      await playAudio(situationAudio);
      
      // Create a promise that resolves when situation audio ends
      await new Promise<void>((resolve) => {
        if (audioRef.current) {
          audioRef.current.onended = () => {
            console.log('Situation audio finished');
            resolve();
          };
        } else {
          resolve();
        }
      });
      
      // Wait a short pause between audios
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Play text audio and wait for it to finish  
      console.log('Playing text audio...');
      await playAudio(textAudio);
      
      // Create a promise that resolves when text audio ends
      await new Promise<void>((resolve) => {
        if (audioRef.current) {
          audioRef.current.onended = () => {
            console.log('Text audio finished');
            resolve();
          };
        } else {
          resolve();
        }
      });
      
      // Wait a short pause before question
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Play question audio and wait for it to finish
      console.log('Playing question audio...');
      await playAudio(questionAudio);
      
      // Create a promise that resolves when question audio ends
      await new Promise<void>((resolve) => {
        if (audioRef.current) {
          audioRef.current.onended = () => {
            console.log('Question audio finished');
            resolve();
          };
        } else {
          resolve();
        }
      });
      
      // Wait a moment then show buttons
      setTimeout(() => {
        onComplete();
      }, GAME_CONFIG.timing.buttonDelay);
      
    } catch (err) {
      console.warn('Error in audio sequence:', err);
      onComplete();
    }
  }, [playAudio]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  return {
    playAudio,
    playAudioSequence,
    stopAudio
  };
};