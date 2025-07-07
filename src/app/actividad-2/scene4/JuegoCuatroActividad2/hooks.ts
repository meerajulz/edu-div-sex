import { useState, useCallback, useRef, useEffect } from 'react';
import { GAME_CONFIG } from './config';
import type { GameSession } from './config';

type GamePhase = 'intro' | 'situation' | 'options' | 'feedback' | 'completed';
type AnswerType = 'correct' | 'incorrect';

interface GameState {
  currentSituationIndex: number;
  phase: GamePhase;
  selectedAnswer: AnswerType | null;
  isCorrect: boolean | null;
  attempts: number;
  showFeedbackImage: boolean;
  gameCompleted: boolean;
}

export const useJuegoCuatroGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentSituationIndex: 0,
    phase: 'intro',
    selectedAnswer: null,
    isCorrect: null,
    attempts: 0,
    showFeedbackImage: false,
    gameCompleted: false
  });

  const [sessionData, setSessionData] = useState<GameSession>({
    gameId: GAME_CONFIG.id,
    sessionId: `session_${Date.now()}`,
    startTime: new Date(),
    completed: false,
    totalSituations: GAME_CONFIG.situations.length,
    correctAnswersFirstTry: 0,
    totalAttempts: 0,
    finalScore: 0
  });

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Audio management
  const playAudio = useCallback((audioPath: string): Promise<void> => {
    return new Promise((resolve) => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const audio = new Audio(audioPath);
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        currentAudioRef.current = null;
        resolve();
      };
      
      audio.onerror = () => {
        console.warn('Audio failed to load:', audioPath);
        currentAudioRef.current = null;
        resolve();
      };

      audio.play().catch(() => {
        console.warn('Audio failed to play:', audioPath);
        currentAudioRef.current = null;
        resolve();
      });
    });
  }, []);

  const playSound = useCallback((soundPath: string) => {
    try {
      const audio = new Audio(soundPath);
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }, []);

  // Game flow management
  const startGame = useCallback(async () => {
    setSessionData(prev => ({ ...prev, startTime: new Date() }));
    
    // Play title audio first
    await playAudio(GAME_CONFIG.globalAudio.title);
    
    // Wait a bit then start first situation
    const timeout = setTimeout(() => {
      setGameState(prev => ({ ...prev, phase: 'situation' }));
    }, GAME_CONFIG.timing.titleAudioDelay);
    timeoutRefs.current.push(timeout);
  }, [playAudio]);

  const showSituation = useCallback(async () => {
    const currentSituation = GAME_CONFIG.situations[gameState.currentSituationIndex];
    
    // Play animation sound
    playSound(GAME_CONFIG.globalAudio.animationSound);
    
    // Play situation audio
    await playAudio(currentSituation.audio.situation);
    
    // Show options after audio finishes
    const timeout = setTimeout(() => {
      setGameState(prev => ({ ...prev, phase: 'options' }));
    }, GAME_CONFIG.timing.optionsDelay);
    timeoutRefs.current.push(timeout);
  }, [gameState.currentSituationIndex, playAudio, playSound]);

  const handleAnswerClick = useCallback(async (answerType: AnswerType) => {
    const currentSituation = GAME_CONFIG.situations[gameState.currentSituationIndex];
    const isCorrect = answerType === 'correct';
    
    // Update attempts
    const newAttempts = gameState.attempts + 1;
    setGameState(prev => ({ 
      ...prev, 
      selectedAnswer: answerType,
      isCorrect,
      attempts: newAttempts,
      phase: 'feedback'
    }));

    setSessionData(prev => ({ 
      ...prev, 
      totalAttempts: prev.totalAttempts + 1,
      correctAnswersFirstTry: isCorrect && newAttempts === 1 ? 
        prev.correctAnswersFirstTry + 1 : prev.correctAnswersFirstTry
    }));

    // Play answer audio first
    const answerAudio = isCorrect ? 
      currentSituation.audio.correct : 
      currentSituation.audio.incorrect;
    
    await playAudio(answerAudio);

    // Show feedback image
    setGameState(prev => ({ ...prev, showFeedbackImage: true }));
    playSound(GAME_CONFIG.globalAudio.animationSound);

    // Wait then play feedback audio
    const timeout1 = setTimeout(async () => {
      const feedbackAudio = isCorrect ? 
        currentSituation.audio.correctFeedback : 
        currentSituation.audio.incorrectFeedback;
      
      await playAudio(feedbackAudio);

      if (isCorrect) {
        // Move to next situation or complete game
        const timeout2 = setTimeout(() => {
          if (gameState.currentSituationIndex < GAME_CONFIG.situations.length - 1) {
            // Next situation
            setGameState(prev => ({
              currentSituationIndex: prev.currentSituationIndex + 1,
              phase: 'situation',
              selectedAnswer: null,
              isCorrect: null,
              attempts: 0,
              showFeedbackImage: false,
              gameCompleted: false
            }));
          } else {
            // Game completed
            setGameState(prev => ({ ...prev, gameCompleted: true, phase: 'completed' }));
            setSessionData(prev => ({ 
              ...prev, 
              completed: true, 
              endTime: new Date(),
              finalScore: Math.round((prev.correctAnswersFirstTry / prev.totalSituations) * 100)
            }));
          }
        }, GAME_CONFIG.timing.nextSituationDelay);
        timeoutRefs.current.push(timeout2);
      } else {
        // Allow retry
        const timeout3 = setTimeout(() => {
          setGameState(prev => ({ 
            ...prev, 
            phase: 'options',
            selectedAnswer: null,
            isCorrect: null,
            showFeedbackImage: false
          }));
        }, GAME_CONFIG.timing.retryDelay);
        timeoutRefs.current.push(timeout3);
      }
    }, GAME_CONFIG.timing.feedbackImageDelay);
    timeoutRefs.current.push(timeout1);

  }, [gameState.currentSituationIndex, gameState.attempts, playAudio, playSound]);

  // Effect to handle situation showing
  useEffect(() => {
    if (gameState.phase === 'situation') {
      showSituation();
    }
  }, [gameState.phase, showSituation]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = [];
    };
  }, []);

  // Get current situation data
  const getCurrentSituation = useCallback(() => {
    return GAME_CONFIG.situations[gameState.currentSituationIndex];
  }, [gameState.currentSituationIndex]);

  const resetGame = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];

    setGameState({
      currentSituationIndex: 0,
      phase: 'intro',
      selectedAnswer: null,
      isCorrect: null,
      attempts: 0,
      showFeedbackImage: false,
      gameCompleted: false
    });

    setSessionData({
      gameId: GAME_CONFIG.id,
      sessionId: `session_${Date.now()}`,
      startTime: new Date(),
      completed: false,
      totalSituations: GAME_CONFIG.situations.length,
      correctAnswersFirstTry: 0,
      totalAttempts: 0,
      finalScore: 0
    });
  }, []);

  return {
    gameState,
    sessionData,
    getCurrentSituation,
    startGame,
    handleAnswerClick,
    resetGame,
    config: GAME_CONFIG
  };
};