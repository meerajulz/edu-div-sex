'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import DropZones from './DropZones';
import SituationItems from './SituationItems';
// Update import to use the central CongratsOverlay component
import CongratsOverlay from '@/app/components/CongratsOverlay/CongratsOverlay';
import JugarButton from '../../../components/JugarButton/JugarButton';
import EscucharInstruccionesButton from '@/app/components/EscucharInstruccionesButton/EscucharInstruccionesButton';

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

  // State for congratulations overlay
  const [showCongrats, setShowCongrats] = useState(false);

  // Session tracking
  const { currentSession, startSession, endSession } = useGameSession();
  
  // Attempt tracking
  const { recordAttempt } = useGameTracking();
  
  // Audio management
  const {
    playTitleAudio,
    playSubtitleAudio,
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
      setShowCongrats(false);
    }
  }, [isVisible, resetGame]);

  // Initialize game when modal opens
  useEffect(() => {
    if (isVisible && gameInitialized && shuffledSituations.length > 0) {
      console.log('🎮 Starting drag & drop game with situations:', shuffledSituations.map(s => s.id));
      
      // Start session
      const situationsOrder = shuffledSituations.map(s => s.id);
      startSession(userId, situationsOrder);
      
      // Play title audio first, then subtitle audio, then start game
      setTimeout(async () => {
        await playTitleAudio();

        // Play subtitle audio after title
        setTimeout(async () => {
          await playSubtitleAudio();

          // Start game after subtitle completes
          setTimeout(() => {
            setGamePhase('playing');
          }, 1000);
        }, 1000); // Delay between title and subtitle
      }, GAME_CONFIG.timing.titleAudioDelay);
    } else if (!isVisible) {
      stopAudio();
    }
  }, [isVisible, gameInitialized, shuffledSituations.length, userId, startSession, playTitleAudio, playSubtitleAudio, setGamePhase, stopAudio]);

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
      // Correct answer - add to dropped items and complete situation immediately
      addDroppedItem(zoneId, situation);
      completeSituation(situationId);
      setScore(prev => prev + 1);

      // Wait for drag audio to finish, then play correct audio and feedback
      setTimeout(async () => {
        await playCorrectAudio();

        // Wait 1 second, then play feedback audio and wait for it to complete
        setTimeout(async () => {
          // Check if game is complete before playing feedback
          const currentCompletedCount = completedSituations.size;
          const isLastSituation = currentCompletedCount + 1 >= GAME_CONFIG.situations.length;

          console.log(`🎮 Current completed: ${currentCompletedCount}, Total situations: ${GAME_CONFIG.situations.length}`);

          // Play feedback audio and wait for it to finish
          await playFeedbackAudio(situation.feedback.audio);

          // If this was the last situation, show congrats after feedback completes
          if (isLastSituation) {
            console.log('🎮 All situations completed! Showing celebration after feedback...');
            setTimeout(() => {
              setShowCongrats(true);
            }, 500); // Small delay after feedback completes
          }
        }, 1000);
      }, 2000); // Wait 2 seconds for drag audio to finish
    } else {
      // Incorrect answer - wait for drag audio, then play feedback
      setTimeout(async () => {
        await playIncorrectAudio();

        // Wait 1 second, then play feedback audio
        setTimeout(async () => {
          await playFeedbackAudio(situation.feedback.audio);

          // After feedback audio completes, play try again audio
          setTimeout(async () => {
            await playTryAgainAudio();
          }, 500); // Small delay between feedback and try again
        }, 1000);
      }, 2000); // Wait 2 seconds for drag audio to finish
    }

    // Reset dragged item
    setDraggedItem(null);
  };

  // Watch for completion state changes to trigger celebration
  useEffect(() => {
    if (gamePhase === 'playing' && completedSituations.size >= GAME_CONFIG.situations.length) {
      console.log('🎮 Game completed via effect! Showing celebration...');
      setTimeout(() => {
        setShowCongrats(true);
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

  const handleListenInstructions = async () => {
    // Play title audio, then subtitle audio
    await playTitleAudio();
    setTimeout(async () => {
      await playSubtitleAudio();
    }, 1000); // Small delay between title and subtitle
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" style={{ backgroundColor: 'transparent' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full h-full max-w-[1024px] max-h-[95vh] rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
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
        
        {/* Listen Instructions Button */}
        <EscucharInstruccionesButton
          onPlayInstructions={handleListenInstructions}
          position="top-right"
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
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

        {/* Progress Badge - Centered at top of modal */}
        {gamePhase === 'playing' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="px-3 py-2 bg-orange-500 text-white rounded-full shadow-lg text-center font-bold text-sm whitespace-nowrap">
              Completado {completedSituations.size}/{GAME_CONFIG.situations.length}
            </div>
          </div>
        )}

        {/* Main Game Area */}
        {gamePhase === 'playing' && (
          <div className="relative h-full flex flex-col pt-4">
            {/* Grid Layout: Drop Zones Left (30%), Situation Items Right (70%) */}
            <div className="grid grid-cols-[30%_70%] gap-4 flex-1 overflow-hidden">
              {/* Left Column - Drop Zones (stacked vertically) */}
              <div className="flex items-center justify-center pl-12">
                <div className="w-full h-full">
                  <DropZones
                    onDrop={handleDrop}
                    disabled={gamePhase !== 'playing'}
                    droppedItems={droppedItems}
                    situations={shuffledSituations}
                  />
                </div>
              </div>

              {/* Right Column - Situation Items (3-column grid) */}
              <div className="flex items-center justify-center">
                <div className="w-full h-full">
                  <SituationItems
                    situations={shuffledSituations}
                    completedSituations={completedSituations}
                    onDragStart={handleDragStart}
                    disabled={gamePhase !== 'playing'}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Congratulations Overlay */}
        <CongratsOverlay 
          isVisible={showCongrats}
          onComplete={handleCelebrationComplete}
          title="¡Excelente trabajo!"
          subtitle={`Has clasificado correctamente ${score} de ${GAME_CONFIG.situations.length} situaciones`}
          emoji="🏆"
          bgColor="bg-gradient-to-r from-teal-400/30 to-yellow-300/30"
          textColor="text-teal-800"
          autoCloseDelay={GAME_CONFIG.timing.congratsDuration || 3000}
        />

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