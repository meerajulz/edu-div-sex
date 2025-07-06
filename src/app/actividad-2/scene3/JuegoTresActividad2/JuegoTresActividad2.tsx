'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import DropZones from './DropZones';
import SituationItems from './SituationItems';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import JugarButton from '../../../components/JugarButton/JugarButton';

interface JuegoTresActividad2Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete?: () => void;
  userId?: string;
}

const JuegoTresActividad2: React.FC<JuegoTresActividad2Props> = ({ 
  isVisible, 
  onClose, 
  onGameComplete,
  userId 
}) => {
  // Game state management
  const {
    gamePhase,
    setGamePhase,
    draggedItem,
    setDraggedItem,
    score,
    setScore,
    completedSituations,
    shuffledSituations,
    gameInitialized,
    droppedItems,
    resetGame,
    completeSituation,
    addDroppedItem
  } = useGameState();

  // Session tracking
  const { currentSession, startSession, endSession } = useGameSession();
  
  // Attempt tracking
  const { recordAttempt } = useGameTracking();
  
  // Audio management
  const { 
    playTitleAudio, 
    playCorrectAudio, 
    playIncorrectAudio, 
    playTryAgainAudio,
    playDragAudio,
    playFeedbackAudio, 
    stopAudio 
  } = useAudioManager();

  // Reset game when modal opens
  useEffect(() => {
    if (isVisible) {
      resetGame();
    }
  }, [isVisible, resetGame]);

  // Initialize game when modal opens
  useEffect(() => {
    if (isVisible && gameInitialized && shuffledSituations.length > 0) {
      console.log('🎮 Starting drag & drop game with situations:', shuffledSituations.map(s => s.id));
      
      // Start session
      const situationsOrder = shuffledSituations.map(s => s.id);
      startSession(userId, situationsOrder);
      
      // Play title audio first, then start game
      setTimeout(async () => {
        await playTitleAudio();
        
        // Start game
        setTimeout(() => {
          setGamePhase('playing');
        }, 1000);
      }, GAME_CONFIG.timing.titleAudioDelay);
    } else if (!isVisible) {
      stopAudio();
    }
  }, [isVisible, gameInitialized, shuffledSituations.length, userId, startSession, playTitleAudio, setGamePhase, stopAudio]);

  // Handle drag start
  const handleDragStart = async (situationId: string) => {
    if (gamePhase !== 'playing') return;
    
    setDraggedItem(situationId);
    
    // Find the situation and play its drag audio
    const situation = shuffledSituations.find(s => s.id === situationId);
    if (situation) {
      console.log('🎮 Dragging situation:', situation.name);
      setTimeout(async () => {
        await playDragAudio(situation.dragAudio);
      }, GAME_CONFIG.timing.dragAudioDelay);
    }
  };

  // Handle drop on zone
  const handleDrop = async (zoneId: 'PRIVATE' | 'PUBLIC', situationId: string) => {
    if (gamePhase !== 'playing') return;
    
    const situation = shuffledSituations.find(s => s.id === situationId);
    if (!situation) return;

    console.log(`🎮 Dropped ${situation.name} on ${zoneId} zone`);
    
    const correct = zoneId === situation.correctAnswer;

    // Record attempt
    recordAttempt(
      situation.id,
      zoneId,
      situation.correctAnswer,
      situation.isPrivate,
      userId,
      currentSession?.sessionId
    );

    if (correct) {
      // Correct answer - add to dropped items and complete situation
      addDroppedItem(zoneId, situation);
      completeSituation(situationId);
      setScore(prev => prev + 1);
      
      // Play audio feedback sequence
      await playCorrectAudio();
      
      // Wait 1 second, then play feedback audio and wait for it to complete
      setTimeout(async () => {
        await playFeedbackAudio(situation.feedback.audio);
        
        // Check if game is complete after feedback audio finishes
        // Use the current completedSituations size + 1 for the new completion
        const currentCompletedCount = completedSituations.size;
        console.log(`🎮 Current completed: ${currentCompletedCount}, Total situations: ${GAME_CONFIG.situations.length}`);
        
        if (currentCompletedCount + 1 >= GAME_CONFIG.situations.length) {
          console.log('🎮 All situations completed! Showing celebration...');
          setTimeout(() => {
            setGamePhase('celebrating');
          }, 1000); // Small delay after feedback completes
        }
      }, 1000);
    } else {
      // Incorrect answer - play feedback but don't add to zone
      await playIncorrectAudio();
      
      // Wait 1 second, then play feedback audio
      setTimeout(async () => {
        await playFeedbackAudio(situation.feedback.audio);
        
        // After feedback audio completes, play try again audio
        setTimeout(async () => {
          await playTryAgainAudio();
        }, 500); // Small delay between feedback and try again
      }, 1000);
    }

    // Reset dragged item
    setDraggedItem(null);
  };

  // Watch for completion state changes to trigger celebration
  useEffect(() => {
    if (gamePhase === 'playing' && completedSituations.size >= GAME_CONFIG.situations.length) {
      console.log('🎮 Game completed via effect! Showing celebration...');
      setTimeout(() => {
        setGamePhase('celebrating');
      }, 2000); // Give time for any ongoing audio
    }
  }, [completedSituations.size, gamePhase]);

  const handleCelebrationComplete = () => {
    console.log('🎮 Celebration completed! Closing modal and going to scene...');
    endSession(true, score);
    if (onGameComplete) {
      onGameComplete();
    }
    onClose();
  };

  const handleGameComplete = () => {
    console.log('🎮 Handling final game completion...');
    endSession(true, score);
    if (onGameComplete) {
      onGameComplete();
    }
    onClose();
  };

  const handleClose = () => {
    console.log('🎮 Closing modal...');
    stopAudio();
    endSession(false, score);
    resetGame();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'transparent' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full h-full max-w-[1024px] max-h-[720px] rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
        style={{
          background: 'linear-gradient(to right, #fdfad6, #d4fff7)'
        }}
      >
        {/* Background decorative image */}
        <div 
          className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat opacity-1"
          style={{
            backgroundImage: "url('/image/actividad_2/juego_3/bg.png')"
          }}
        />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-white text-sm bg-red-600/80 hover:bg-red-700 px-4 py-2 rounded-full shadow-lg transition-colors"
        >
          Salir juego
        </button>

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 left-4 z-10 text-xs text-gray-700 bg-white/50 p-2 rounded">
            Fase: {gamePhase} | 
            Score: {score} | 
            Completed: {completedSituations.size}/{GAME_CONFIG.situations.length} |
            Dragged: {draggedItem || 'None'}
          </div>
        )}

        {/* Loading State */}
        {gamePhase === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-800 text-xl font-bold text-center">
              <div className="text-2xl mb-4">🎮 {GAME_CONFIG.title}</div>
              <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        {gamePhase === 'playing' && (
          <div className="relative h-full p-8 pb-32">
            {/* Game Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                ¿Qué es privado y qué es público?
              </h2>
              <p className="text-lg text-gray-600">
                Arrastra las situaciones a la categoría correcta
              </p>
            </div>

            {/* Drop Zones */}
            <DropZones
              onDrop={handleDrop}
              disabled={gamePhase !== 'playing'}
              droppedItems={droppedItems}
              situations={shuffledSituations}
            />

            {/* Instructions */}
            <div className="text-center mb-4" style={{display: 'none' }}>
              <p className="text-md text-gray-700 bg-white/70 px-4 py-2 rounded-full inline-block">
                🔒 Privado: cosas que hacemos en espacios privados | 🌍 Público: cosas que hacemos en espacios públicos
              </p>
            </div>
          </div>
        )}

        {/* Situation Items - Always visible during playing phase */}
        {gamePhase === 'playing' && (
          <SituationItems
            situations={shuffledSituations}
            completedSituations={completedSituations}
            onDragStart={handleDragStart}
            disabled={gamePhase !== 'playing'}
          />
        )}

        {/* Celebration Overlay - ¡Muy bien! with sparkles */}
        {gamePhase === 'celebrating' && (
          <CongratsOverlay onComplete={handleCelebrationComplete} />
        )}

        {/* Game Complete - Simple JugarButton */}
        {gamePhase === 'complete' && (
          <div className="absolute inset-0 flex items-center justify-center z-40">
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, -360] }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <JugarButton onClick={handleGameComplete} disabled={false} />
            </motion.div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default JuegoTresActividad2;