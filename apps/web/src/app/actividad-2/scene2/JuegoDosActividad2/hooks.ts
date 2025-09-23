import { useState, useRef, useCallback } from 'react';
import { GAME_CONFIG, BodyPartAttempt, GameSession, shuffleArray } from './config';
import { createGameAudio } from '../../../utils/gameAudio';

export const useGameState = () => {
  const [currentBodyPartIndex, setCurrentBodyPartIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<'loading' | 'showing' | 'question' | 'feedback' | 'celebrating' | 'complete'>('loading');
  const [selectedAnswer, setSelectedAnswer] = useState<'YES' | 'NO' | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledBodyParts, setShuffledBodyParts] = useState<Array<typeof GAME_CONFIG.bodyParts[number]>>([]);
  const [gameInitialized, setGameInitialized] = useState(false);

  const resetGame = useCallback(() => {
    console.log('🔄 Resetting game...');
    setCurrentBodyPartIndex(0);
    setGamePhase('loading');
    setSelectedAnswer(null);
    setIsCorrect(false);
    setScore(0);
    setGameInitialized(false);
    // Shuffle the body parts for random order only once
    const shuffled = shuffleArray(GAME_CONFIG.bodyParts);
    setShuffledBodyParts(shuffled);
    setGameInitialized(true);
    console.log('🔄 Game reset complete. Shuffled order:', shuffled.map(bp => bp.id));
  }, []);

  const nextBodyPart = useCallback(() => {
    if (currentBodyPartIndex < shuffledBodyParts.length - 1) {
      setCurrentBodyPartIndex(prev => prev + 1);
      setGamePhase('loading');
      setSelectedAnswer(null);
      setIsCorrect(false);
      console.log('Moving to next body part:', currentBodyPartIndex + 1);
    } else {
      setGamePhase('complete');
    }
  }, [currentBodyPartIndex, shuffledBodyParts.length]);

  return {
    currentBodyPartIndex,
    setCurrentBodyPartIndex,
    gamePhase,
    setGamePhase,
    selectedAnswer,
    setSelectedAnswer,
    isCorrect,
    setIsCorrect,
    score,
    setScore,
    shuffledBodyParts,
    setShuffledBodyParts,
    gameInitialized,
    resetGame,
    nextBodyPart
  };
};

export const useGameSession = () => {
  const sessionRef = useRef<GameSession | null>(null);

  const startSession = useCallback((userId?: string, bodyPartsOrder?: string[]) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    sessionRef.current = {
      gameId: GAME_CONFIG.id,
      userId,
      sessionId,
      startTime: new Date(),
      completed: false,
      totalBodyParts: GAME_CONFIG.bodyParts.length,
      correctAnswers: 0,
      finalScore: 0,
      bodyPartsOrder: bodyPartsOrder || GAME_CONFIG.bodyParts.map(bp => bp.id)
    };

    return sessionRef.current;
  }, []);

  const endSession = useCallback((completed: boolean, correctAnswers: number) => {
    if (sessionRef.current) {
      sessionRef.current.endTime = new Date();
      sessionRef.current.completed = completed;
      sessionRef.current.correctAnswers = correctAnswers;
      sessionRef.current.finalScore = Math.round((correctAnswers / GAME_CONFIG.bodyParts.length) * 100);
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
  const attemptsRef = useRef<BodyPartAttempt[]>([]);

  const recordAttempt = useCallback((
    bodyPartId: string,
    selectedAnswer: 'YES' | 'NO',
    correctAnswer: 'YES' | 'NO',
    isPrivate: boolean,
    userId?: string,
    sessionId?: string
  ) => {
    const attempt: BodyPartAttempt = {
      gameId: GAME_CONFIG.id,
      bodyPartId,
      userId,
      sessionId,
      selectedAnswer,
      correctAnswer,
      isCorrect: selectedAnswer === correctAnswer,
      isPrivate,
      timestamp: new Date()
    };

    attemptsRef.current.push(attempt);
    
    console.log('🎮 Body Part Attempt Recorded:', attempt);
    
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
      
      const audio = createGameAudio(audioPath, volume, 'Game Audio');
      audioRef.current = audio;
      
      await audio.play();
      console.log('🎵 Audio playing successfully:', audioPath);
    } catch (err) {
      console.warn('❌ Error playing audio:', audioPath, err);
    }
  }, []);

  const playButtonSound = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.buttonClick, 0.5);
  }, [playAudio]);

  const playTitleAudio = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.titleGame);
  }, [playAudio]);

  // NEW: Play subtitle audio
  const playSubtitleAudio = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.subtitle);
  }, [playAudio]);

  const playCorrectAudio = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.correct);
  }, [playAudio]);

  const playIncorrectAudio = useCallback(async () => {
    await playAudio(GAME_CONFIG.globalAudio.incorrect);
  }, [playAudio]);

  const playFeedbackAudio = useCallback(async (audioPath: string) => {
    await playAudio(audioPath);
  }, [playAudio]);

  const playIncorrectSequence = useCallback(async (bodyPartAudioPath: string) => {
    // First play the general "incorrect" audio
    await playIncorrectAudio();
    
    // Wait for the delay, then play the specific body part feedback
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        await playFeedbackAudio(bodyPartAudioPath);
        resolve();
      }, GAME_CONFIG.timing.incorrectAudioDelay);
    });
  }, [playIncorrectAudio, playFeedbackAudio]);

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
    playSubtitleAudio, // NEW: Export subtitle audio function
    playFeedbackAudio,
    playCorrectAudio,
    playIncorrectAudio,
    playIncorrectSequence,
    stopAudio
  };
};