'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_CONFIG } from './config';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import DragDropArea from './DragDropArea';
import FeedbackDisplay from './FeedbackDisplay';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { playGameAudio } from '../../../utils/gameAudio';

interface JuegoDosActividad4Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete?: () => void;
  userId?: string;
}

const JuegoDosActividad4: React.FC<JuegoDosActividad4Props> = ({ 
  isVisible, 
  onClose, 
  onGameComplete,
  userId 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Game state management
  const {
    gamePhase,
    setGamePhase,
    currentSequence,
    setCurrentSequence,
    score,
    setScore,
    resetGame,
    isGameComplete,
    lastDropResult,
    setLastDropResult
  } = useGameState();

  // Session tracking
  const { currentSession, startSession, endSession } = useGameSession();
  
  // Attempt tracking
  const { recordAttempt } = useGameTracking();
  
  // Audio management
  const { playAudio, playAudioWithCallback, stopAudio } = useAudioManager();

  // Start title sequence
  const startTitleSequence = useCallback(() => {
    console.log('🎮 Starting title sequence...');
    setGamePhase('title');

    // Play title audio and wait for it to finish
    playAudioWithCallback(
      GAME_CONFIG.titleAudio.path,
      () => {
        console.log('🎮 Title audio finished, starting game...');
        setTimeout(() => {
          setGamePhase('playing');
        }, GAME_CONFIG.timing.titleDelay);
      }
    );
  }, [playAudioWithCallback, setGamePhase]);

  // Initialize game when modal opens
  useEffect(() => {
    if (isVisible) {
      console.log('🎮 Modal opened, starting game...');
      resetGame();
      startSession(userId);
      
      // Start title sequence with a small delay
      const titleTimeout = setTimeout(() => {
        startTitleSequence();
      }, 1000);

      return () => {
        clearTimeout(titleTimeout);
      };
    } else {
      stopAudio();
    }
  }, [isVisible, userId, resetGame, startSession, startTitleSequence, stopAudio]);

  // Handle correct drop
  const handleCorrectDrop = useCallback((imageId: string, position: number) => {
    console.log('🎮 Correct drop:', imageId, 'at position:', position);
    
    // Play correct sound
    playAudio(GAME_CONFIG.sounds.correct);
    
    // Show feedback
    setLastDropResult({ isCorrect: true, imageId, position });
    
    // Update sequence
    const newSequence = [...currentSequence];
    newSequence[position] = imageId;
    setCurrentSequence(newSequence);
    
    // Update score
    setScore(prev => prev + 1);

    // Record attempt
    recordAttempt(
      imageId,
      position,
      true,
      userId,
      currentSession?.sessionId
    );

    // Check if game is complete
    setTimeout(() => {
      if (isGameComplete(newSequence)) {
        setGamePhase('complete');
      }
    }, 2500);
  }, [playAudio, setLastDropResult, currentSequence, setCurrentSequence, setScore, recordAttempt, userId, currentSession, isGameComplete, setGamePhase]);

  // Handle incorrect drop
  const handleIncorrectDrop = useCallback((imageId: string, position: number) => {
    console.log('🎮 Incorrect drop:', imageId, 'at position:', position);
    
    // Play incorrect sound
    playAudio(GAME_CONFIG.sounds.incorrect);
    
    // Show feedback
    setLastDropResult({ isCorrect: false, imageId, position });

    // Record attempt
    recordAttempt(
      imageId,
      position,
      false,
      userId,
      currentSession?.sessionId
    );
  }, [playAudio, setLastDropResult, recordAttempt, userId, currentSession]);

  // Handle feedback completion
  const handleFeedbackComplete = useCallback(() => {
    if (lastDropResult?.isCorrect) {
      // Play correct feedback audio
      playAudio(GAME_CONFIG.feedbackAudio.correct);
    } else {
      // Play incorrect feedback audio
      playAudio(GAME_CONFIG.feedbackAudio.incorrect);
    }
    
    // Clear feedback after a delay
    setTimeout(() => {
      setLastDropResult(null);
    }, 2000);
  }, [lastDropResult, playAudio, setLastDropResult]);

  // Handle game completion
  const handleGameComplete = useCallback(() => {
    console.log('🎮 Game completion sequence finished');
    endSession(true, score, currentSequence);
    setIsAnimating(true);
    
    // Play completion sound
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Game Completion Sound');
    
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
      if (onGameComplete) {
        onGameComplete();
      }
    }, 1000);
  }, [endSession, score, currentSequence, onClose, onGameComplete]);

  // Handle close
  const handleClose = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    console.log('🎮 Closing modal...');
    stopAudio();
    endSession(false, score, currentSequence);
    resetGame();
    
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  }, [isAnimating, stopAudio, endSession, score, currentSequence, resetGame, onClose]);

  const playButtonSound = () => {
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoDos Button Sound');
  };

  const handleListenInstructions = () => {
    playAudio(GAME_CONFIG.titleAudio.path);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] bg-gradient-to-br from-pink-200 via-rose-100 to-pink-300 rounded-xl shadow-xl border-4 border-pink-400 overflow-hidden">

          {/* Listen Instructions Button */}
          <EscucharInstruccionesButton
            onPlayInstructions={handleListenInstructions}
            position="side-by-side"
          />

          {/* Close Button */}
          <motion.button
            onClick={() => {
              playButtonSound();
              handleClose();
            }}
            className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isAnimating}
          >
            Salir Juego
          </motion.button>

          {/* Progress Badge - Top left */}
          {gamePhase === 'playing' && (
            <div className="absolute top-4 left-4 z-10">
              <div className="px-3 py-2 bg-orange-500 text-white rounded-full shadow-lg text-center font-bold text-sm">
                Paso {currentSequence.filter(Boolean).length}/7
              </div>
            </div>
          )}

          {/* Debug Info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-16 left-4 z-10 text-xs text-white bg-black/50 p-2 rounded">
              Phase: {gamePhase} | Score: {score} | Complete: {currentSequence.filter(Boolean).length}/7
            </div>
          )}

          {/* Feedback Display */}
          {lastDropResult && (
            <FeedbackDisplay
              isCorrect={lastDropResult.isCorrect}
              onComplete={handleFeedbackComplete}
            />
          )}

          {/* Title Phase */}
          {gamePhase === 'title' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <motion.div
                  className="text-4xl mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  🩸
                </motion.div>
                <div className="text-2xl font-bold mb-4 text-purple-800">
                  Higiene Menstrual
                </div>
                <div className="text-lg opacity-80 mb-6 text-purple-700">
                  Escuchando instrucciones...
                </div>
                <div className="w-16 h-16 border-4 border-purple-800/30 border-t-purple-800 rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          )}

          {/* Playing Phase */}
          {gamePhase === 'playing' && (
            <DragDropArea
              onCorrectDrop={handleCorrectDrop}
              onIncorrectDrop={handleIncorrectDrop}
              currentSequence={currentSequence}
            />
          )}

          {/* Congratulations Overlay using CongratsOverlay component */}
          <CongratsOverlay
            isVisible={gamePhase === 'complete'}
            title="¡Muy Bien!"
            subtitle="Has aprendido sobre la higiene menstrual correctamente"
            emoji="🩸"
            bgColor="bg-pink-500/20"
            textColor="text-purple-900"
            onComplete={handleGameComplete}
            autoCloseDelay={3000}
          />

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JuegoDosActividad4;