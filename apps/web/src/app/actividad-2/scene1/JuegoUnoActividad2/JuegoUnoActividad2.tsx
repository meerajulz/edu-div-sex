'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { GAME_CONFIG } from './config';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import SituationDisplay from './SituationDisplay';
import YesNoButtons from './YesNoButtons';
import FeedbackOverlay from './FeedbackOverlay';
import CongratsOverlay from '@/app/components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '@/app/components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { useProgressSaver } from '../../../hooks/useProgressSaver';

interface JuegoUnoActividad2Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete?: () => void;
  userId?: string;
}

const JuegoUnoActividad2: React.FC<JuegoUnoActividad2Props> = ({ 
  isVisible, 
  onClose, 
  onGameComplete,
  userId 
}) => {
  // Game state management
  const { saveProgress } = useProgressSaver();
  
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
    resetGame,
    nextSituation
  } = useGameState();

  // State for congratulations overlay
  const [showCongrats, setShowCongrats] = useState(false);

  // State for showing situation card again
  const [showSituationCard, setShowSituationCard] = useState(false);

  // Session tracking
  const { currentSession, startSession, endSession } = useGameSession();
  
  // Attempt tracking
  const { recordAttempt } = useGameTracking();
  
  // Audio management
  const { playAudio, playAudioSequence, stopAudio } = useAudioManager();

  const currentSituationData = GAME_CONFIG.situations[currentSituation];

  // Start situation sequence - FIXED: Pass situation index explicitly
  const startGameSequence = useCallback(async (situationIndex: number) => {
    const situationData = GAME_CONFIG.situations[situationIndex];
    if (!situationData) return;

    console.log(`🎮 Starting game sequence for situation ${situationIndex + 1}:`, situationData.id);
    console.log('🎵 Audio files:', {
      situation: situationData.audio.situation,
      text: situationData.audio.text,
      question: GAME_CONFIG.globalAudio.question
    });
    
    setGamePhase('situation');

    // Play audio sequence: situation -> text -> question -> show buttons
    await playAudioSequence(
      situationData.audio.situation,
      situationData.audio.text,
      GAME_CONFIG.globalAudio.question,
      () => {
        console.log('🎮 Audio sequence completed, showing question phase');
        setGamePhase('question');
      }
    );
  }, [playAudioSequence, setGamePhase]);

  // Initialize game when modal opens
  useEffect(() => {
    if (isVisible) {
      console.log('🎮 Modal opened, starting game...');
      resetGame();
      startSession(userId);
      setShowCongrats(false);
      
      // Start game sequence for first situation
      setTimeout(() => {
        startGameSequence(0);
      }, GAME_CONFIG.timing.situationDelay);
    } else {
      stopAudio();
    }
  }, [isVisible, resetGame, startSession, userId, startGameSequence, stopAudio]);

  // Handle answer selection - UPDATED with privacy-based feedback
  const handleAnswerSelect = async (answer: 'YES' | 'NO') => {
    if (!currentSituationData) return;

    console.log('🎮 Answer selected:', answer, 'for situation:', currentSituationData.id);
    setSelectedAnswer(answer);
    setGamePhase('feedback');
    
    const correct = answer === currentSituationData.correctAnswer;
    setIsCorrect(correct);

    // Record attempt (now includes privacy info)
    recordAttempt(
      currentSituationData.id,
      answer,
      currentSituationData.correctAnswer,
      currentSituationData.isPrivate,
      userId,
      currentSession?.sessionId
    );

    // Update score
    if (correct) {
      setScore(prev => prev + 1);
    }

    // Play appropriate feedback audio after button audio - UPDATED
    setTimeout(async () => {
      if (correct) {
        // Play correct feedback audio based on privacy type
        const correctAudioKey = currentSituationData.feedback.correctAudio;
        const feedbackAudioPath = GAME_CONFIG.feedbackAudio[correctAudioKey];
        console.log('🎵 Playing correct feedback audio:', feedbackAudioPath);
        await playAudio(feedbackAudioPath);
      } else {
        // Play incorrect feedback audio (same as correct for this situation)
        const incorrectAudioKey = currentSituationData.feedback.incorrectAudio;
        const feedbackAudioPath = GAME_CONFIG.feedbackAudio[incorrectAudioKey];
        console.log('🎵 Playing incorrect feedback audio:', feedbackAudioPath);
        await playAudio(feedbackAudioPath);
      }
    }, 1000);
  };

  // Handle feedback completion
  const handleFeedbackComplete = () => {
    console.log('🎮 Feedback completed. isCorrect:', isCorrect, 'currentSituation:', currentSituation);

    if (isCorrect) {
      // Correct answer - check if there are more situations
      if (currentSituation < GAME_CONFIG.situations.length - 1) {
        // More situations to go - advance to next
        console.log('🎮 Moving to next situation...');
        setTimeout(() => {
          const nextSituationIndex = currentSituation + 1;
          nextSituation();
          setTimeout(() => {
            startGameSequence(nextSituationIndex);
          }, GAME_CONFIG.timing.situationDelay);
        }, 1000);
      } else {
        // All situations completed - show congrats before ending game
        console.log('🎮 Game completed! Showing congrats overlay');
        setShowCongrats(true);

        // Automatically end game after congrats duration
        setTimeout(async () => {
          endSession(true, score);

          // Save progress before completing
          await saveProgress('actividad-2', 'scene1', 'completed', 100, {
            game: 'JuegoUnoActividad2',
            final_score: score,
            total_situations: score,
            completed_at: new Date().toISOString()
          });

          setShowCongrats(false);
          onClose();
          if (onGameComplete) {
            onGameComplete();
          }
        }, GAME_CONFIG.timing.congratsDuration || 3000);
      }
    } else {
      // Wrong answer - restart the same situation from the beginning
      console.log('🎮 Wrong answer, restarting situation from the beginning...');
      setTimeout(() => {
        setGamePhase('loading');
        setSelectedAnswer(null);
        // Restart the audio sequence for the same situation
        setTimeout(() => {
          startGameSequence(currentSituation);
        }, GAME_CONFIG.timing.situationDelay);
      }, 500);
    }
  };

  const handleClose = () => {
    console.log('🎮 Closing modal...');
    stopAudio();
    endSession(false, score);
    resetGame();
    onClose();
  };

  const handleListenInstructions = () => {
    // Play the game's question audio
    playAudio('/audio/actividad-2/juego1/t.mp3');
  };

  const handleListenSituation = async () => {
    if (!currentSituationData) return;

    // Show the situation card
    setShowSituationCard(true);

    // Play situation audio, then text, then question
    await playAudioSequence(
      currentSituationData.audio.situation,
      currentSituationData.audio.text,
      GAME_CONFIG.globalAudio.question,
      () => {
        // Hide the card after audio sequence completes
        setTimeout(() => {
          setShowSituationCard(false);
        }, 1000);
      }
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4">
      {/* Modal with background image - 1120x700 responsive */}
      <div
        className="relative w-full h-full max-w-[1120px] max-h-[700px] rounded-xl shadow-xl pointer-events-auto overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/image/actividad_2/juego_1/bg.png')",
          aspectRatio: '1120/700'
        }}
      >

        {/* Listen Instructions Button */}
        <EscucharInstruccionesButton
          onPlayInstructions={handleListenInstructions}
          position="top-right"
        />

        {/* Situation Progress Badge - Always visible */}
        <div className="absolute top-4 left-4 z-10 flex flex-row items-center gap-3">
          <div className="px-3 py-2 bg-orange-500 text-white rounded-full shadow-lg text-center font-bold text-sm">
            Situación {currentSituation + 1}/{GAME_CONFIG.situations.length}
          </div>
          {/* Listen Situation Button - Only show during question phase */}
          {gamePhase === 'question' && (
            <button
              onClick={handleListenSituation}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
            >
              🔊 Escuchar situación {currentSituation + 1}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
        >
          Salir juego
        </button>

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-16 left-4 z-10 text-xs text-white bg-black/50 p-2 rounded">
            Situación: {currentSituation + 1}/{GAME_CONFIG.situations.length} | 
            Fase: {gamePhase} | 
            Score: {score} | 
            Answer: {selectedAnswer || 'None'} |
            Private: {currentSituationData?.isPrivate ? 'Yes' : 'No'} |
            SituationId: {currentSituationData?.id || 'None'}
          </div>
        )}

        {/* Game Content */}
        {gamePhase === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <div className="text-white text-xl font-bold text-center">
              <div className="text-2xl mb-4">🎮 Cargando situación...</div>
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            </div> */}
          </div>
        )}

        {/* Situation Display */}
        {currentSituationData && (gamePhase === 'situation' || gamePhase === 'question') && (
          <>
            <SituationDisplay
              image={currentSituationData.image}
              position={currentSituationData.imagePosition}
              alt={currentSituationData.title}
              isVisible={true}
            />
            
            {gamePhase === 'situation' && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-white/95 p-6 rounded-lg text-center max-w-md border-2 border-blue-400 shadow-lg">
                  <div className="text-lg font-bold mb-2 text-blue-800">
                    🎯 {currentSituationData.title}
                  </div>
                  <p className="text-sm leading-relaxed mb-3 font-semibold text-blue-700">
                    {currentSituationData.description}
                  </p>
                  <div className="text-xs text-orange-600 font-medium">
                    🎵 Escuchando explicación...
                  </div>
                </div>
              </div>
            )}

            {gamePhase === 'question' && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20">
                <div className="text-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-4 border-2 border-blue-400 shadow-lg">
                    <div className="text-xl font-bold text-blue-800 mb-4">
                      ¿Está bien que se lo cuente a todos los amigos?
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Situation Card - Show when user clicks green button */}
            {showSituationCard && currentSituationData && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30">
                <div className="bg-white/95 p-6 rounded-lg text-center max-w-md border-2 border-green-400 shadow-lg">
                  <div className="text-lg font-bold mb-2 text-blue-800">
                    🎯 {currentSituationData.title}
                  </div>
                  <p className="text-sm leading-relaxed mb-3 font-semibold text-blue-700">
                    {currentSituationData.description}
                  </p>
                  <div className="text-xs text-orange-600 font-medium">
                    🎵 Escuchando explicación completa...
                  </div>
                </div>
              </div>
            )}
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
        
        {/* Congratulations Overlay - Added for game completion */}
        <CongratsOverlay 
          isVisible={showCongrats}
          onComplete={async () => {
            // Save progress before completing
            await saveProgress('actividad-2', 'scene1', 'completed', 100, {
              game: 'JuegoUnoActividad2',
              final_score: score,
              total_situations: score,
              completed_at: new Date().toISOString()
            });
            
            setShowCongrats(false);
            endSession(true, score);
            onClose();
            if (onGameComplete) {
              onGameComplete();
            }
          }}
          title="¡Felicidades!"
          subtitle={`¡Has completado todas las situaciones con ${score} puntos!`}
          bgColor="bg-fuchsia-500/50"
          textColor="text-white"
          emoji="🏆"
          autoCloseDelay={GAME_CONFIG.timing.congratsDuration || 3000}
        />
      </div>
    </div>
  );
};

export default JuegoUnoActividad2;