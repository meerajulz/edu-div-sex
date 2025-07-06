'use client';

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import BodyPartDisplay from './BodyPartDisplay';
import YesNoButtons from './YesNoButtons';
import FeedbackOverlay from './FeedbackOverlay';
import CongratsOverlay from './CongratsOverlay';
import JugarButton from '../../../components/JugarButton/JugarButton';

interface JuegoDosActividad2Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete?: () => void;
  userId?: string;
}

const JuegoDosActividad2: React.FC<JuegoDosActividad2Props> = ({ 
  isVisible, 
  onClose, 
  onGameComplete,
  userId 
}) => {
  // Game state management
  const {
    currentBodyPartIndex,
    gamePhase,
    setGamePhase,
    selectedAnswer,
    setSelectedAnswer,
    isCorrect,
    setIsCorrect,
    score,
    setScore,
    shuffledBodyParts,
    gameInitialized,
    resetGame,
    nextBodyPart
  } = useGameState();

  // Session tracking
  const { currentSession, startSession, endSession } = useGameSession();
  
  // Attempt tracking
  const { recordAttempt } = useGameTracking();
  
  // Audio management
  const { playButtonSound, playTitleAudio, playFeedbackAudio, playCorrectAudio, playIncorrectAudio, stopAudio } = useAudioManager();

  // Get current body part - this was the missing piece!
  const currentBodyPart = shuffledBodyParts[currentBodyPartIndex] || null;

  // Reset game when modal opens
  useEffect(() => {
    if (isVisible) {
      resetGame();
    }
  }, [isVisible, resetGame]);

  // Start game sequence
  const startGameSequence = useCallback(async (bodyPartIndex: number) => {
    const bodyPart = shuffledBodyParts[bodyPartIndex];
    if (!bodyPart) return;

    console.log(`🎮 Starting sequence for body part ${bodyPartIndex + 1}:`, bodyPart.id);
    
    setGamePhase('showing');

    // Show image with animation, then show question after delay
    setTimeout(() => {
      setGamePhase('question');
    }, GAME_CONFIG.timing.buttonDelay);
  }, [shuffledBodyParts, setGamePhase]);

  // Initialize game when modal opens
  useEffect(() => {
    if (isVisible && gameInitialized && shuffledBodyParts.length > 0) {
      console.log('🎮 Starting game with shuffled body parts:', shuffledBodyParts.map(bp => bp.id));
      
      // Start session
      const bodyPartsOrder = shuffledBodyParts.map(bp => bp.id);
      startSession(userId, bodyPartsOrder);
      
      // Play title audio first, then start game
      setTimeout(async () => {
        await playTitleAudio();
        
        // Start first body part sequence
        setTimeout(() => {
          startGameSequence(0);
        }, GAME_CONFIG.timing.imageAnimation);
      }, GAME_CONFIG.timing.titleAudioDelay);
    } else if (!isVisible) {
      stopAudio();
    }
  }, [isVisible, gameInitialized, shuffledBodyParts.length, userId, startSession, playTitleAudio, startGameSequence, stopAudio]);

  // Handle answer selection
  const handleAnswerSelect = async (answer: 'YES' | 'NO') => {
    if (!currentBodyPart) return;

    console.log('🎮 Answer selected:', answer, 'for body part:', currentBodyPart.id);
    
    // Play button sound
    await playButtonSound();
    
    const correct = answer === currentBodyPart.correctAnswer;
    
    // Play immediate feedback audio based on correctness
    if (correct) {
      await playCorrectAudio(); // Play "correcto.mp3" immediately
    } else {
      await playIncorrectAudio(); // Play "incorrecto.mp3" immediately
    }
    
    setSelectedAnswer(answer);
    setGamePhase('feedback');
    setIsCorrect(correct);

    // Record attempt
    recordAttempt(
      currentBodyPart.id,
      answer,
      currentBodyPart.correctAnswer,
      currentBodyPart.isPrivate,
      userId,
      currentSession?.sessionId
    );

    // Update score
    if (correct) {
      setScore(prev => prev + 1);
    }

    // Play specific feedback audio after a delay
    setTimeout(async () => {
      await playFeedbackAudio(currentBodyPart.feedback.audio);
    }, 1500); // Same delay for both correct and incorrect to let the initial audio finish
  };

  // Handle feedback completion
  const handleFeedbackComplete = () => {
    console.log('🎮 Feedback completed. isCorrect:', isCorrect, 'currentIndex:', currentBodyPartIndex);
    
    if (isCorrect) {
      // Correct answer - check if there are more body parts
      if (currentBodyPartIndex < shuffledBodyParts.length - 1) {
        // More body parts to go - advance to next
        console.log('🎮 Moving to next body part...');
        setTimeout(() => {
          const nextIndex = currentBodyPartIndex + 1;
          nextBodyPart();
          setTimeout(() => {
            startGameSequence(nextIndex);
          }, GAME_CONFIG.timing.imageAnimation);
        }, 500);
      } else {
        // All body parts completed - show celebration first
        console.log('🎮 Game completed! Showing celebration...');
        setGamePhase('celebrating');
      }
    } else {
      // Wrong answer - retry same body part
      console.log('🎮 Wrong answer, retrying same body part...');
      setTimeout(() => {
        setGamePhase('question');
        setSelectedAnswer(null);
      }, 500);
    }
  };

  const handleCelebrationComplete = () => {
    console.log('🎮 Celebration completed! Showing final congratulations...');
    setGamePhase('complete');
  };

  const handleGameComplete = () => {
    console.log('🎮 Handling final game completion...');
    endSession(true, score + 1); // +1 because score update happens after this
    setTimeout(() => {
      if (onGameComplete) {
        onGameComplete();
      }
      onClose();
    }, 1000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full h-full max-w-[800px] max-h-[500px] rounded-xl shadow-xl pointer-events-auto overflow-hidden"
        style={{ 
          backgroundColor: '#fffad4',
          border: '4px solid #4dcff6',
          aspectRatio: '800/500',
          backgroundImage: `url('${GAME_CONFIG.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
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
            Parte: {currentBodyPartIndex + 1}/{shuffledBodyParts.length} | 
            Fase: {gamePhase} | 
            Score: {score} | 
            Answer: {selectedAnswer || 'None'} |
            BodyPart: {currentBodyPart?.id || 'None'} |
            Private: {currentBodyPart?.isPrivate ? 'Yes' : 'No'}
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

        {/* Game Title and Instructions */}
        {gamePhase === 'showing' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-white/90 p-6 rounded-lg text-center text-gray-800 max-w-md border-2 border-blue-300">
              <div className="text-2xl font-bold mb-4 text-blue-600">
                🎯 Mi cuerpo y mi espacio
              </div>
              <p className="text-lg mb-3">
                Señala cuáles son las partes íntimas o privadas
              </p>
              <div className="text-sm text-gray-600">
                🎵 Preparando imagen...
              </div>
            </div>
          </div>
        )}

        {/* Body Part Display */}
        {currentBodyPart && (gamePhase === 'showing' || gamePhase === 'question') && (
          <BodyPartDisplay
            image={currentBodyPart.image}
            name={currentBodyPart.name}
            isVisible={gamePhase === 'showing' || gamePhase === 'question'}
          />
        )}

        {/* Yes/No Buttons */}
        <YesNoButtons
          isVisible={gamePhase === 'question'}
          onSelect={handleAnswerSelect}
          disabled={gamePhase !== 'question'}
        />

        {/* Feedback Overlay */}
        {gamePhase === 'feedback' && currentBodyPart && (
          <FeedbackOverlay
            isVisible={true}
            isCorrect={isCorrect}
            message={isCorrect ? currentBodyPart.feedback.correctText : currentBodyPart.feedback.incorrectText}
            onComplete={handleFeedbackComplete}
            duration={GAME_CONFIG.timing.feedbackDuration}
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
              <JugarButton text="Continuar la próxima aventura..." onClick={handleGameComplete} disabled={false} />
            </motion.div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default JuegoDosActividad2;