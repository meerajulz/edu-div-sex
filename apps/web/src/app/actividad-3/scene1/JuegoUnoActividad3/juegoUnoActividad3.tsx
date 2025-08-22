'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GAME_CONFIG } from './config';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import BodyPartDisplay from './BodyPartDisplay';
import YesNoButtons from './YesNoButtons';
import FeedbackOverlay from './FeedbackOverlay';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';

interface JuegoUnoActividad3Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete?: () => void;
  userId?: string;
}

const JuegoUnoActividad3: React.FC<JuegoUnoActividad3Props> = ({ 
  isVisible, 
  onClose, 
  onGameComplete,
  userId 
}) => {
  // Game state management
  const {
    currentSituation,
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
    isGameComplete,
    setCurrentSituation
  } = useGameState();

  // Session tracking
  const { currentSession, startSession, endSession } = useGameSession();
  
  // Attempt tracking
  const { recordAttempt } = useGameTracking();
  
  // Audio management
  const { playAudio, playAudioWithCallback, stopAudio } = useAudioManager();

  const currentSituationData = GAME_CONFIG.situations[currentSituation];

  // Start title sequence
  const startTitleSequence = useCallback(() => {
    console.log('🎮 Starting title sequence...');
    setGamePhase('title');

    // Play title audio and wait for it to finish + delay
    playAudioWithCallback(
      GAME_CONFIG.titleAudio.path,
      () => {
        console.log('🎮 Title audio finished, showing scene after delay...');
        setTimeout(() => {
          setGamePhase('scene');
          // Start with first situation (0)
          setTimeout(() => {
            setCurrentSituation(0);
            setGamePhase('situation');
            startSituationSequence(0);
          }, GAME_CONFIG.timing.situationDelay);
        }, GAME_CONFIG.timing.titleDelay);
      }
    );
  }, [playAudioWithCallback]);

  // Start situation sequence
  const startSituationSequence = useCallback((situationIndex: number) => {
    const situationData = GAME_CONFIG.situations[situationIndex];
    if (!situationData) return;

    console.log(`🎮 Starting situation ${situationIndex + 1}:`, situationData.id);

    // Play situation description audio
    setTimeout(() => {
      playAudio(situationData.audio.description);
      
      // Show buttons after a short delay (user can click before audio ends)
      setTimeout(() => {
        setGamePhase('question');
      }, GAME_CONFIG.timing.buttonDelay);
    }, 500);
  }, [playAudio]);

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
  }, [isVisible, userId]); // Removed other dependencies to prevent loops

  // Handle answer selection
  const handleAnswerSelect = async (answer: 'YES' | 'NO') => {
    if (!currentSituationData) return;

    console.log('🎮 Answer selected:', answer, 'for situation:', currentSituationData.id);
    setSelectedAnswer(answer);
    setGamePhase('feedback');
    
    const correct = answer === currentSituationData.correctAnswer;
    setIsCorrect(correct);

    // Record attempt
    recordAttempt(
      currentSituationData.id,
      answer,
      currentSituationData.correctAnswer,
      userId,
      currentSession?.sessionId
    );

    // Update score and mark situation as correct if answer is right
    if (correct) {
      setScore(prev => prev + 1);
      markSituationCorrect(currentSituation);
    }

    // Play feedback audio
    setTimeout(async () => {
      console.log('🎵 Playing feedback audio:', currentSituationData.feedback.audio);
      await playAudio(currentSituationData.feedback.audio);
    }, 500);
  };

  // Handle feedback completion
  const handleFeedbackComplete = () => {
    console.log('🎮 Feedback completed. isCorrect:', isCorrect, 'currentSituation:', currentSituation);
    
    if (isCorrect) {
      // Check if game is complete (all situations answered correctly)
      if (isGameComplete()) {
        console.log('🎮 Game completed!');
        setGamePhase('complete');
      } else {
        // Move to next incorrect situation
        console.log('🎮 Moving to next situation...');
        const newSituation = findNextSituation();
        if (newSituation !== -1) {
          setTimeout(() => {
            setCurrentSituation(newSituation);
            setGamePhase('situation');
            startSituationSequence(newSituation);
          }, GAME_CONFIG.timing.situationDelay);
        } else {
          setGamePhase('complete');
        }
      }
    } else {
      // Wrong answer - retry same situation
      console.log('🎮 Wrong answer, retrying same situation...');
      setTimeout(() => {
        setGamePhase('question');
        setSelectedAnswer(null);
      }, 500);
    }
  };

  // Helper function to find next situation
  const findNextSituation = () => {
    // Find next situation that hasn't been answered correctly
    const nextIndex = situationsCorrect.findIndex((correct, index) => 
      index > currentSituation && !correct
    );
    
    if (nextIndex !== -1) {
      return nextIndex;
    }
    
    // Look for any situation from the beginning that hasn't been answered correctly
    const restartIndex = situationsCorrect.findIndex(correct => !correct);
    return restartIndex;
  };

  // Handle game completion
  const handleGameComplete = () => {
    console.log('🎮 Game completion sequence finished');
    endSession(true, score, situationsCorrect);
    
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
    
    setTimeout(() => {
      onClose();
      if (onGameComplete) {
        onGameComplete();
      }
    }, 1000);
  };

  const handleClose = () => {
    console.log('🎮 Closing modal...');
    stopAudio();
    endSession(false, score, situationsCorrect);
    resetGame();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4">
      {/* Modal with gradient background - 800x500 responsive */}
      <div 
        className="relative w-full h-full max-w-[800px] max-h-[500px] rounded-xl shadow-xl pointer-events-auto overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600"
        style={{ 
          aspectRatio: '800/500'
        }}
      >

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
        >
          Salir juego
        </button>

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 left-4 z-10 text-xs text-white bg-black/50 p-2 rounded">
            Situación: {currentSituation + 1}/{GAME_CONFIG.situations.length} | 
            Fase: {gamePhase} | 
            Score: {score} | 
            Answer: {selectedAnswer || 'None'} |
            Correct: {situationsCorrect.filter(Boolean).length}/{situationsCorrect.length} |
            SituationId: {currentSituationData?.id || 'None'}
          </div>
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
                🎯
              </motion.div>
              <div className="text-2xl font-bold mb-4">
                Respuestas Corporales
              </div>
              <div className="text-lg opacity-80 mb-6">
                Escuchando instrucciones...
              </div>
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        {/* Scene Phase - Show love scene */}
        {gamePhase === 'scene' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-96 h-72">
              <Image
                src={GAME_CONFIG.sceneImage}
                alt="Escena de caricias"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        )}

        {/* Situation and Question Phases */}
        {currentSituationData && (gamePhase === 'situation' || gamePhase === 'question') && (
          <>
            {/* Scene image in background */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
              <div className="relative w-96 h-72">
                <Image
                  src={GAME_CONFIG.sceneImage}
                  alt="Escena de fondo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Body part display */}
            <BodyPartDisplay
              image={currentSituationData.image}
              alt={currentSituationData.title}
              isVisible={true}
            />
          </>
        )}

        {/* Yes/No Buttons */}
        <YesNoButtons
          isVisible={gamePhase === 'question'}
          onSelect={handleAnswerSelect}
          disabled={gamePhase !== 'question'}
        />

        {/* Feedback Overlay */}
        {gamePhase === 'feedback' && currentSituationData && (
          <FeedbackOverlay
            isVisible={true}
            isCorrect={isCorrect}
            message={isCorrect ? currentSituationData.feedback.correctText : currentSituationData.feedback.incorrectText}
            onComplete={handleFeedbackComplete}
            duration={GAME_CONFIG.timing.feedbackDuration}
          />
        )}

        {/* Congratulations Overlay using CongratsOverlay component */}
        <CongratsOverlay
          isVisible={gamePhase === 'complete'}
          title="¡Excelente!"
          subtitle="Has aprendido sobre las respuestas corporales normales"
          emoji="🎯"
          bgColor="bg-purple-500/20"
          textColor="text-purple-800"
          onComplete={handleGameComplete}
          autoCloseDelay={3000}
        />

      </div>
    </div>
  );
};

export default JuegoUnoActividad3;