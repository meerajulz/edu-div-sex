'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import BodyPartDisplay from './BodyPartDisplay';
import YesNoButtons from './YesNoButtons';
import FeedbackOverlay from './FeedbackOverlay';
// Update import to use the central CongratsOverlay component
import CongratsOverlay from '@/app/components/CongratsOverlay/CongratsOverlay';

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

  // State for congratulations overlay
  const [showCongrats, setShowCongrats] = useState(false);

  const { currentSession, startSession, endSession } = useGameSession();
  const { recordAttempt } = useGameTracking();
  const { playButtonSound, playTitleAudio, playSubtitleAudio, playFeedbackAudio, playCorrectAudio, playIncorrectAudio, stopAudio } = useAudioManager();

  const currentBodyPart = shuffledBodyParts[currentBodyPartIndex] || null;

  useEffect(() => {
    if (isVisible) {
      resetGame();
      setShowCongrats(false);
    }
  }, [isVisible, resetGame]);

  const startGameSequence = useCallback(async (bodyPartIndex: number) => {
    const bodyPart = shuffledBodyParts[bodyPartIndex];
    if (!bodyPart) return;
    setGamePhase('showing');
    setTimeout(() => {
      setGamePhase('question');
    }, GAME_CONFIG.timing.buttonDelay);
  }, [shuffledBodyParts, setGamePhase]);

  useEffect(() => {
    if (isVisible && gameInitialized && shuffledBodyParts.length > 0) {
      const bodyPartsOrder = shuffledBodyParts.map(bp => bp.id);
      startSession(userId, bodyPartsOrder);
      setTimeout(async () => {
        await playTitleAudio();
        setTimeout(async () => {
          await playSubtitleAudio();
          setTimeout(() => {
            startGameSequence(0);
          }, GAME_CONFIG.timing.imageAnimation);
        }, GAME_CONFIG.timing.subtitleAudioDelay);
      }, GAME_CONFIG.timing.titleAudioDelay);
    } else if (!isVisible) {
      stopAudio();
    }
  }, [isVisible, gameInitialized, shuffledBodyParts.length, userId, startSession, playTitleAudio, playSubtitleAudio, startGameSequence, stopAudio]);

  const handleAnswerSelect = async (answer: 'YES' | 'NO') => {
    if (!currentBodyPart) return;
    await playButtonSound();
    const correct = answer === currentBodyPart.correctAnswer;
    if (correct) await playCorrectAudio();
    else await playIncorrectAudio();

    setSelectedAnswer(answer);
    setGamePhase('feedback');
    setIsCorrect(correct);

    recordAttempt(
      currentBodyPart.id,
      answer,
      currentBodyPart.correctAnswer,
      currentBodyPart.isPrivate,
      userId,
      currentSession?.sessionId
    );

    if (correct) setScore(prev => prev + 1);

    setTimeout(async () => {
      await playFeedbackAudio(currentBodyPart.feedback.audio);
    }, 1500);
  };

  const handleFeedbackComplete = () => {
    if (isCorrect) {
      if (currentBodyPartIndex < shuffledBodyParts.length - 1) {
        setTimeout(() => {
          const nextIndex = currentBodyPartIndex + 1;
          nextBodyPart();
          setTimeout(() => {
            startGameSequence(nextIndex);
          }, GAME_CONFIG.timing.imageAnimation);
        }, 500);
      } else {
        // Game completed - wait for feedback audio to finish before showing congratulations overlay
        // Feedback audio starts after 1500ms delay + feedback duration (4000ms) = 5500ms total
        setTimeout(() => {
          setShowCongrats(true);
        }, GAME_CONFIG.timing.feedbackDuration + 1500);
      }
    } else {
      setTimeout(() => {
        setGamePhase('question');
        setSelectedAnswer(null);
      }, 500);
    }
  };

  const handleCelebrationComplete = () => {
    // End session as successful
    endSession(true, score);
    
    // Notify parent component that game is complete
    if (onGameComplete) {
      onGameComplete();
    }
    
    // Close the game
    onClose();
  };

  const handleClose = () => {
    stopAudio();
    endSession(false, score);
    resetGame();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4">
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
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
        >
          Salir juego
        </button>

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

        {gamePhase === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-800 text-xl font-bold text-center">
              <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        {gamePhase === 'showing' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
        )}

        {currentBodyPart && (gamePhase === 'showing' || gamePhase === 'question') && (
          <BodyPartDisplay
            image={currentBodyPart.image}
            name={currentBodyPart.name}
            isVisible={gamePhase === 'showing' || gamePhase === 'question'}
          />
        )}

        <YesNoButtons
          isVisible={gamePhase === 'question'}
          onSelect={handleAnswerSelect}
          disabled={gamePhase !== 'question'}
        />

        {gamePhase === 'feedback' && currentBodyPart && (
          <FeedbackOverlay
            isVisible={true}
            isCorrect={isCorrect}
            message={isCorrect ? currentBodyPart.feedback.correctText : currentBodyPart.feedback.incorrectText}
            onComplete={handleFeedbackComplete}
            duration={GAME_CONFIG.timing.feedbackDuration}
          />
        )}

        {/* Enhanced Congratulations Overlay */}
        <CongratsOverlay 
          isVisible={showCongrats}
          onComplete={handleCelebrationComplete}
          title="¡Fantástico!"
          subtitle={`Has identificado correctamente ${score} de ${shuffledBodyParts.length} partes del cuerpo`}
          emoji="🌟"
          bgColor="bg-blue-500/30"
          textColor="text-blue-900"
          autoCloseDelay={GAME_CONFIG.timing.congratsDuration || 3000}
        />
      </motion.div>
    </div>
  );
};

export default JuegoDosActividad2;