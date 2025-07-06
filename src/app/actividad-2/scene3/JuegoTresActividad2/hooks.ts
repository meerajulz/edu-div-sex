import { useState, useRef, useCallback } from 'react';
import { GAME_CONFIG, SituationAttempt, GameSession, shuffleArray } from './config';

export const useGameState = () => {
  const [currentSituationIndex, setCurrentSituationIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<'loading' | 'playing' | 'feedback' | 'celebrating' | 'complete'>('loading');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completedSituations, setCompletedSituations] = useState<Set<string>>(new Set());
  const [shuffledSituations, setShuffledSituations] = useState<Array<typeof GAME_CONFIG.situations[number]>>([]);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [droppedItems, setDroppedItems] = useState<{ [key: string]: Array<typeof GAME_CONFIG.situations[number]> }>({
    PRIVATE: [],
    PUBLIC: []
  });

  const resetGame = useCallback(() => {
    console.log('🔄 Resetting Drag & Drop game...');
    setCurrentSituationIndex(0);
    setGamePhase('loading');
    setDraggedItem(null);
    setIsCorrect(false);
    setScore(0);
    setCompletedSituations(new Set());
    setGameInitialized(false);
    setDroppedItems({ PRIVATE: [], PUBLIC: [] });
    
    // Shuffle the situations for random order
    const shuffled = shuffleArray(GAME_CONFIG.situations);
    setShuffledSituations(shuffled);
    setGameInitialized(true);
    console.log('🔄 Game reset complete. Shuffled order:', shuffled.map(s => s.id));
  }, []);

  const nextSituation = useCallback(() => {
    if (completedSituations.size < GAME_CONFIG.situations.length) {
      setGamePhase('playing');
      setDraggedItem(null);
      setIsCorrect(false);
      console.log('Ready for next situation. Completed:', completedSituations.size);
    } else {
      setGamePhase('complete');
    }
  }, [completedSituations.size]);

  const completeSituation = useCallback((situationId: string) => {
    setCompletedSituations(prev => new Set([...prev, situationId]));
  }, []);

  const addDroppedItem = useCallback((zoneId: 'PRIVATE' | 'PUBLIC', situation: typeof GAME_CONFIG.situations[number]) => {
    setDroppedItems(prev => ({
      ...prev,
      [zoneId]: [...prev[zoneId], situation]
    }));
  }, []);

  const removeDroppedItem = useCallback((situationId: string) => {
    setDroppedItems(prev => ({
      PRIVATE: prev.PRIVATE.filter(item => item.id !== situationId),
      PUBLIC: prev.PUBLIC.filter(item => item.id !== situationId)
    }));
  }, []);

  return {
    currentSituationIndex,
    setCurrentSituationIndex,
    gamePhase,
    setGamePhase,
    draggedItem,
    setDraggedItem,
    isCorrect,
    setIsCorrect,
    score,
    setScore,
    completedSituations,
    shuffledSituations,
    gameInitialized,
    droppedItems,
    resetGame,
    nextSituation,
    completeSituation,
    addDroppedItem,
    removeDroppedItem
  };
};

export const useGameSession = () => {
  const sessionRef = useRef<GameSession | null>(null);

  const startSession = useCallback((userId?: string, situationsOrder?: string[]) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    sessionRef.current = {
      gameId: GAME_CONFIG.id,
      userId,
      sessionId,
      startTime: new Date(),
      completed: false,
      totalSituations: GAME_CONFIG.situations.length,
      correctAnswers: 0,
      finalScore: 0,
      situationsOrder: situationsOrder || GAME_CONFIG.situations.map(s => s.id)
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
    selectedZone: 'PRIVATE' | 'PUBLIC',
    correctZone: 'PRIVATE' | 'PUBLIC',
    isPrivate: boolean,
    userId?: string,
    sessionId?: string
  ) => {
    const attempt: SituationAttempt = {
      gameId: GAME_CONFIG.id,
      situationId,
      userId,
      sessionId,
      selectedZone,
      correctZone,
      isCorrect: selectedZone === correctZone,
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
      console.log('🎵 Playing audio:', audioPath);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = volume;
      audioRef.current = audio;
      
      // Return a promise that resolves when audio ends
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          console.log('🎵 Audio completed:', audioPath);
          resolve();
        };
        
        audio.onerror = (error) => {
          console.warn('❌ Audio error:', audioPath, error);
          reject(error);
        };
        
        audio.play().catch(reject);
      });
      
    } catch (err) {
      console.warn('❌ Error playing audio:', audioPath, err);
      throw err;
    }
  }, []);

  const playButtonSound = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.buttonClick, 0.5);
  }, [playAudio]);

  const playTitleAudio = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.titleGame);
  }, [playAudio]);

  const playCorrectAudio = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.correct);
  }, [playAudio]);

  const playIncorrectAudio = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.incorrect);
  }, [playAudio]);

  const playTryAgainAudio = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.tryAgain);
  }, [playAudio]);

  const playDragAudio = useCallback(async (audioPath: string) => {
    await playAudio(audioPath, 0.8);
  }, [playAudio]);

  const playFeedbackAudio = useCallback(async (audioPath: string) => {
    await playAudio(audioPath);
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
    playButtonSound,
    playTitleAudio,
    playCorrectAudio,
    playIncorrectAudio,
    playTryAgainAudio,
    playDragAudio,
    playFeedbackAudio,
    stopAudio
  };
};