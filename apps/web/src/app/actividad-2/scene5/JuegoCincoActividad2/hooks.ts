import { useState, useCallback, useRef, useEffect } from 'react';
import { GAME_CONFIG, getPrivateItemsCount } from './config';
import type { GameSession } from './config';

type GamePhase = 'intro' | 'playing' | 'feedback' | 'completed';

interface ItemState {
  id: string;
  isInChest: boolean;
  hasBeenTried: boolean;
  isDisabled: boolean;
  position: { x: number; y: number };
}

interface GameState {
  phase: GamePhase;
  cofreOpen: boolean;
  itemsVisible: boolean;
  currentFeedback: {
    show: boolean;
    isCorrect: boolean;
    itemId: string | null;
  };
  backgroundError: boolean;
  gameCompleted: boolean;
  itemStates: ItemState[];
}

export const useJuegoCincoGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'intro',
    cofreOpen: false,
    itemsVisible: false,
    currentFeedback: {
      show: false,
      isCorrect: false,
      itemId: null
    },
    backgroundError: false,
    gameCompleted: false,
    itemStates: GAME_CONFIG.items.map(item => ({
      id: item.id,
      isInChest: false,
      hasBeenTried: false,
      isDisabled: false,
      position: { x: 0, y: 0 }
    }))
  });

  const [sessionData, setSessionData] = useState<GameSession>({
    gameId: GAME_CONFIG.id,
    sessionId: `session_${Date.now()}`,
    startTime: new Date(),
    completed: false,
    totalItems: GAME_CONFIG.items.length,
    correctItems: 0,
    incorrectAttempts: 0,
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

  // Game flow management - FIXED: Keep chest closed during title
  const startGame = useCallback(async () => {
    console.log('Starting game - playing title audio, chest should stay closed');
    setSessionData(prev => ({ ...prev, startTime: new Date() }));
    
    // Make sure we're in the right state (chest closed, no items visible)
    setGameState(prev => ({ 
      ...prev, 
      phase: 'intro',
      cofreOpen: false,
      itemsVisible: false
    }));
    
    // Play title audio and wait for it to finish (chest stays closed during this)
    await playAudio(GAME_CONFIG.globalAudio.title);
    
    console.log('Title audio finished, now opening chest and showing items');
    // After title finishes, open cofre, change phase, and show items
    setGameState(prev => ({ 
      ...prev, 
      cofreOpen: true,
      phase: 'playing',
      itemsVisible: true
    }));
    
    // Play chest opening sound
    playSound(GAME_CONFIG.globalAudio.cofreOpen);
    
  }, [playAudio, playSound]);

  // Handle item click
  const handleItemClick = useCallback((itemId: string) => {
    const item = GAME_CONFIG.items.find(i => i.id === itemId);
    const itemState = gameState.itemStates.find(s => s.id === itemId);
    
    if (!item || !itemState || itemState.isDisabled || gameState.phase !== 'playing') {
      return;
    }

    // Play click audio
    playSound(item.audio.click);
  }, [gameState.itemStates, gameState.phase, playSound]);

  // Handle item drop in chest - FIXED: Better error handling
  const handleItemDrop = useCallback(async (itemId: string) => {
    const item = GAME_CONFIG.items.find(i => i.id === itemId);
    const itemState = gameState.itemStates.find(s => s.id === itemId);
    
    if (!item || !itemState || itemState.isDisabled || gameState.phase !== 'playing') {
      console.log('Cannot drop item:', { item: !!item, itemState: !!itemState, disabled: itemState?.isDisabled, phase: gameState.phase });
      return;
    }

    console.log('Dropping item:', itemId, 'isPrivate:', item.isPrivate);

    // Play drag drop sound
    playSound(GAME_CONFIG.globalAudio.dragDrop);
    
    setGameState(prev => ({ ...prev, phase: 'feedback' }));

    const isCorrect = item.isPrivate;

    // Update session data
    setSessionData(prev => ({
      ...prev,
      correctItems: isCorrect ? prev.correctItems + 1 : prev.correctItems,
      incorrectAttempts: !isCorrect ? prev.incorrectAttempts + 1 : prev.incorrectAttempts
    }));

    if (isCorrect) {
      // Correct item - stays in chest
      setGameState(prev => ({
        ...prev,
        itemStates: prev.itemStates.map(state =>
          state.id === itemId
            ? { ...state, isInChest: true, hasBeenTried: true, isDisabled: true }
            : state
        ),
        currentFeedback: {
          show: true,
          isCorrect: true,
          itemId
        }
      }));

      // Play correct feedback
      playSound(GAME_CONFIG.globalAudio.correctSound);
      await playAudio(item.audio.feedback);

    } else {
      // Incorrect item - return to position with red layer
      setGameState(prev => ({
        ...prev,
        itemStates: prev.itemStates.map(state =>
          state.id === itemId
            ? { ...state, hasBeenTried: true, isDisabled: true }
            : state
        ),
        currentFeedback: {
          show: true,
          isCorrect: false,
          itemId
        },
        backgroundError: true
      }));

      // Play incorrect feedback
      playSound(GAME_CONFIG.globalAudio.incorrectSound);
      await playAudio(item.audio.feedback);

      // Reset background after feedback
      const timeout = setTimeout(() => {
        setGameState(prev => ({ ...prev, backgroundError: false }));
      }, GAME_CONFIG.timing.errorBackgroundDuration);
      timeoutRefs.current.push(timeout);
    }

    // Hide feedback and check if game is complete
    const timeout2 = setTimeout(() => {
      setGameState(prev => {
        const newState = {
          ...prev,
          currentFeedback: {
            show: false,
            isCorrect: false,
            itemId: null
          },
          phase: 'playing' as GamePhase
        };

        // Check if all private items are in chest
        const privateItemsInChest = prev.itemStates.filter(
          state => state.isInChest && 
          GAME_CONFIG.items.find(item => item.id === state.id)?.isPrivate
        ).length;

        const totalPrivateItems = getPrivateItemsCount();

        if (privateItemsInChest === totalPrivateItems) {
          newState.gameCompleted = true;
          newState.phase = 'completed';
          
          // Update session data
          setSessionData(prevSession => ({
            ...prevSession,
            completed: true,
            endTime: new Date(),
            finalScore: Math.round((prevSession.correctItems / totalPrivateItems) * 100)
          }));
        }

        return newState;
      });
    }, GAME_CONFIG.timing.feedbackDuration);
    timeoutRefs.current.push(timeout2);

  }, [gameState.itemStates, gameState.phase, playAudio, playSound]);

  // Get item by id
  const getItemById = useCallback((itemId: string) => {
    return GAME_CONFIG.items.find(item => item.id === itemId);
  }, []);

  // Get item state by id
  const getItemStateById = useCallback((itemId: string) => {
    return gameState.itemStates.find(state => state.id === itemId);
  }, [gameState.itemStates]);

  // Check if item can be dragged - FIXED: More reliable check
  const canDragItem = useCallback((itemId: string) => {
    const itemState = getItemStateById(itemId);
    const canDrag = itemState && !itemState.isDisabled && !itemState.isInChest && gameState.phase === 'playing';
    console.log('Can drag item:', itemId, canDrag, { 
      hasState: !!itemState, 
      disabled: itemState?.isDisabled, 
      inChest: itemState?.isInChest, 
      phase: gameState.phase 
    });
    return canDrag;
  }, [getItemStateById, gameState.phase]);

  // Reset game
  const resetGame = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];

    setGameState({
      phase: 'intro',
      cofreOpen: false,
      itemsVisible: false,
      currentFeedback: {
        show: false,
        isCorrect: false,
        itemId: null
      },
      backgroundError: false,
      gameCompleted: false,
      itemStates: GAME_CONFIG.items.map(item => ({
        id: item.id,
        isInChest: false,
        hasBeenTried: false,
        isDisabled: false,
        position: { x: 0, y: 0 }
      }))
    });

    setSessionData({
      gameId: GAME_CONFIG.id,
      sessionId: `session_${Date.now()}`,
      startTime: new Date(),
      completed: false,
      totalItems: GAME_CONFIG.items.length,
      correctItems: 0,
      incorrectAttempts: 0,
      finalScore: 0
    });
  }, []);

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

  return {
    gameState,
    sessionData,
    startGame,
    handleItemClick,
    handleItemDrop,
    getItemById,
    getItemStateById,
    canDragItem,
    resetGame,
    config: GAME_CONFIG
  };
};