// Game Logic Hooks for JuegoUnoActividad3

import { useState, useRef, useCallback } from 'react';
import { GAME_CONFIG, SituationAttempt, GameSession } from './config';

export const useGameState = () => {
  const [currentSituation, setCurrentSituation] = useState(0);
  const [gamePhase, setGamePhase] = useState<'title' | 'scene' | 'situation' | 'question' | 'feedback' | 'complete'>('title');
  const [selectedAnswer, setSelectedAnswer] = useState<'YES' | 'NO' | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [situationsCorrect, setSituationsCorrect] = useState<boolean[]>(
    new Array(GAME_CONFIG.situations.length).fill(false)
  );

  const resetGame = useCallback(() => {
    setCurrentSituation(0);
    setGamePhase('title');
    setSelectedAnswer(null);
    setIsCorrect(false);
    setScore(0);
    setSituationsCorrect(new Array(GAME_CONFIG.situations.length).fill(false));
  }, []);

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nextSituation = useCallback(() => {
    // Find next situation that hasn't been answered correctly
    const nextIndex = situationsCorrect.findIndex((correct, index) => 
      index > currentSituation && !correct
    );
    
    if (nextIndex !== -1) {
      setCurrentSituation(nextIndex);
      setSelectedAnswer(null);
      setIsCorrect(false);
      console.log('Moving to next situation:', nextIndex);
    } else {
      // Look for any situation from the beginning that hasn't been answered correctly
      const restartIndex = situationsCorrect.findIndex(correct => !correct);
      if (restartIndex !== -1) {
        setCurrentSituation(restartIndex);
        setSelectedAnswer(null);
        setIsCorrect(false);
        console.log('Restarting from situation:', restartIndex);
      } else {
        // All situations answered correctly - game complete
        console.log('All situations completed!');
        setGamePhase('complete');
      }
    }
  }, [currentSituation, situationsCorrect]);

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
    markSituationCorrect,
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
      totalSituations: GAME_CONFIG.situations.length,
      correctAnswers: 0,
      situationsCorrect: new Array(GAME_CONFIG.situations.length).fill(false),
      finalScore: 0
    };

    return sessionRef.current;
  }, []);

  const endSession = useCallback((completed: boolean, correctAnswers: number, situationsCorrect: boolean[]) => {
    if (sessionRef.current) {
      sessionRef.current.endTime = new Date();
      sessionRef.current.completed = completed;
      sessionRef.current.correctAnswers = correctAnswers;
      sessionRef.current.situationsCorrect = situationsCorrect;
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