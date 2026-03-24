'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import SituationDisplay from './SituationDisplay';
import OkNoButtons from './OkNoButtons';
import FeedbackOverlay from './FeedbackOverlay';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { playGameAudio } from '../../../utils/gameAudio';

interface JuegoDosActividad3Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

const JuegoDosActividad3: React.FC<JuegoDosActividad3Props> = ({
  isVisible,
  onClose,
  onGameComplete
}) => {
  // Get the actual user session
  const { data: session } = useSession();
  
  // Convert session sex to the expected format and provide fallback
  const getUserGender = (): 'male' | 'female' => {
    const sessionSex = session?.user?.sex?.toLowerCase();
    
    // Handle various possible values from the session
    if (sessionSex === 'male' || sessionSex === 'm' || sessionSex === 'masculino') {
      return 'male';
    } else if (sessionSex === 'female' || sessionSex === 'f' || sessionSex === 'femenino') {
      return 'female';
    }
    
    // Default fallback - you can change this or implement additional logic
    console.warn('⚠️ No valid gender found in session, defaulting to female');
    return 'female';
  };

  const userGender = getUserGender();
  
  // Debug logging
  console.log('🎯 User gender from session:', session?.user?.sex);
  console.log('🎯 Parsed user gender:', userGender);
  console.log('🎯 Full session user data:', session?.user);

  // Game hooks
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
    nextSituation,
    markSituationCorrect,
   // isGameComplete,
    gameConfig
  } = useGameState(userGender);

  const { startSession, endSession } = useGameSession(userGender);
  const { recordAttempt } = useGameTracking(userGender);
  const { playAudio, playAudioWithCallback, stopAudio } = useAudioManager();

  // Local state for feedback control
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isFeedbackCorrect, setIsFeedbackCorrect] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // Initialize game when modal opens
  useEffect(() => {
    if (isVisible) {
      console.log('🎮 Game modal opened, starting game...');
      resetGame();
      startSession();
      startTitlePhase();
    } else {
      stopAudio();
    }
  }, [isVisible]);

  // Start the title phase
  const startTitlePhase = useCallback(async () => {
    console.log('🎵 Starting title phase...');
    setGamePhase('title');
    setShowButtons(false);
    setShowFeedback(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      playAudioWithCallback(
        gameConfig.title.audio,
        () => {
          console.log('🎵 Title audio finished, moving to first situation');
          setTimeout(() => {
            startSituationPhase();
          }, 500);
        }
      );
    } catch (error) {
      console.error('Error in title phase:', error);
      startSituationPhase();
    }
  }, [gameConfig.title.audio, playAudioWithCallback]);

  // Start situation phase - FIXED: Use situationIndex parameter
  const startSituationPhase = useCallback(async (situationIndex?: number) => {
    // Use the provided index or current situation
    const situationIdx = situationIndex !== undefined ? situationIndex : currentSituation;
    const situation = gameConfig.situations[situationIdx];
    
    console.log(`🎮 Starting situation ${situationIdx + 1}:`, situation.title);
    console.log('🖼️ Image path:', situation.image);
    console.log('🎵 Audio path:', situation.audio.description);
    
    setGamePhase('situation');
    setShowButtons(false);
    setShowFeedback(false);
    setButtonsDisabled(false);
    setSelectedAnswer(null);
    
    // IMPORTANT: Stop any current audio before playing new one
    stopAudio();
    
    try {
      // Small delay to ensure audio is stopped
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Play situation audio
      console.log('🎵 About to play audio:', situation.audio.description);
      playAudioWithCallback(
        situation.audio.description,
        () => {
          console.log('🎵 Situation audio finished, showing buttons');
          setTimeout(() => {
            setGamePhase('question');
            setShowButtons(true);
          }, 500);
        }
      );
    } catch (error) {
      console.error('Error playing situation audio:', error);
      setGamePhase('question');
      setShowButtons(true);
    }
  }, [gameConfig.situations, playAudioWithCallback, stopAudio]);

  // Handle answer selection
  const handleAnswerSelect = useCallback(async (answer: 'YES' | 'NO') => {
    if (buttonsDisabled || selectedAnswer) return;

    const situation = gameConfig.situations[currentSituation];
    console.log(`🎮 Answer selected: ${answer} for situation ${currentSituation + 1}`);
    
    setSelectedAnswer(answer);
    setButtonsDisabled(true);
    setShowButtons(false);

    // Determine if answer is correct
    const correct = answer === situation.correctAnswer;
    setIsCorrect(correct);
    setIsFeedbackCorrect(correct);

    // Record the attempt
    recordAttempt(
      situation.id,
      answer,
      situation.correctAnswer
    );

    // Update score and mark as correct if needed
    if (correct) {
      setScore(prev => prev + 1);
      markSituationCorrect(currentSituation);
    }

    // Set feedback message and show overlay
    setFeedbackMessage(situation.feedback.text);
    setShowFeedback(true);

    // Play feedback audio
    try {
      await playAudio(situation.feedback.audio);
    } catch (error) {
      console.warn('Could not play feedback audio:', error);
    }

  }, [
    buttonsDisabled,
    selectedAnswer,
    currentSituation,
    gameConfig.situations,
    recordAttempt,
    markSituationCorrect,
    playAudio
  ]);

  // Handle feedback completion - FIXED: Pass next situation index
  const handleFeedbackComplete = useCallback(() => {
    console.log('📝 Feedback completed for situation', currentSituation + 1);
    console.log('📝 Answer was correct:', isCorrect);
    
    setShowFeedback(false);
    
    // Stop any current audio before proceeding
    stopAudio();
    
    if (isCorrect) {
      // Correct answer - move to next situation
      if (currentSituation >= gameConfig.situations.length - 1) {
        // Game complete
        console.log('🎉 Game completed!');
        const finalScore = score;
        const finalCorrect = [...situationsCorrect];
        
        endSession(true, finalScore, finalCorrect);
        setGamePhase('complete');
      } else {
        // Move to next situation
        console.log('➡️ Moving to next situation...');
        const nextSituationIndex = currentSituation + 1;
        nextSituation(); // This updates the state
        setTimeout(() => {
          // Pass the next situation index to ensure correct audio plays
          startSituationPhase(nextSituationIndex);
        }, 1000);
      }
    } else {
      // Wrong answer - retry same situation (don't move to next)
      console.log('❌ Wrong answer, staying on same situation');
      setTimeout(() => {
        setGamePhase('question');
        setShowButtons(true);
        setSelectedAnswer(null);
        setButtonsDisabled(false);
      }, 500);
    }
  }, [
    currentSituation,
    gameConfig.situations.length,
    score,
    isCorrect,
    situationsCorrect,
    endSession,
    nextSituation,
    startSituationPhase,
    stopAudio
  ]);

  // Handle game completion
  const handleGameComplete = useCallback(() => {
    console.log('🎮 Game completion sequence finished');
    
    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoDosActividad3 completion');
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
    
    setTimeout(() => {
      onGameComplete();
      onClose();
    }, 1000);
  }, [onGameComplete, onClose]);

  // Handle close button
  const handleClose = useCallback(() => {
    stopAudio();
    resetGame();
    onClose();
  }, [stopAudio, resetGame, onClose]);

  // Handle listen instructions button
  const handleListenInstructions = useCallback(() => {
    // Play the gender-specific title audio
    playAudio(gameConfig.title.audio);
  }, [playAudio, gameConfig.title.audio]);

  // Handle image click to replay situation audio
  const handleImageClick = useCallback(() => {
    const situationData = gameConfig.situations[currentSituation];
    if (gamePhase === 'question' && situationData) {
      console.log('🔊 Replaying situation audio from image click');
      playAudio(situationData.audio.description);
    }
  }, [gamePhase, currentSituation, gameConfig.situations, playAudio]);

  if (!isVisible) return null;

  const currentSituationData = gameConfig.situations[currentSituation];
  const showSituation = gamePhase === 'situation' || gamePhase === 'question';

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-lg flex items-center justify-center pointer-events-auto p-2 sm:p-4">
      {/* Modal with gradient background - 30% bigger and responsive */}
      <div
        className="relative w-full h-full max-w-[1200px] max-h-[750px] rounded-xl shadow-xl pointer-events-auto overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600"
        style={{
          aspectRatio: '1200/750'
        }}
      >

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

        {/* Progress Badge - Top left */}
        {(gamePhase === 'situation' || gamePhase === 'question' || gamePhase === 'feedback') && (
          <div className="absolute top-4 left-4 z-10">
            <div className="px-3 py-2 bg-orange-500 text-white rounded-full shadow-lg text-center font-bold text-sm">
              Situación {currentSituation + 1}/{gameConfig.situations.length}
            </div>
          </div>
        )}

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-16 left-4 z-10 text-xs text-white bg-black/50 p-2 rounded max-w-md">
            <div>Gender: {userGender}</div>
            <div>Situación: {currentSituation + 1}/{gameConfig.situations.length}</div>
            <div>Fase: {gamePhase}</div>
            <div>Score: {score}</div>
            {currentSituationData && (
              <>
                <div>ID: {currentSituationData.id}</div>
                <div>Título: {currentSituationData.title}</div>
                <div>Imagen: {currentSituationData.image}</div>
                <div>Audio: {currentSituationData.audio.description}</div>
                <div>Respuesta correcta: {currentSituationData.correctAnswer}</div>
              </>
            )}
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
                {userGender === 'male' ? '¿Cuándo puede salir el semen?' : '¿Cuándo puedes tener ese gustito en la vulva tan, tan fuerte?'}
              </div>
              <div className="text-lg opacity-80 mb-6">
                Escuchando instrucciones...
              </div>
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        {/* Situation Display */}
        {showSituation && currentSituationData && (
          <SituationDisplay
            image={currentSituationData.image}
            alt={currentSituationData.title}
            isVisible={true}
            onClick={handleImageClick}
            clickable={gamePhase === 'question'}
          />
        )}

        {/* OK/NO Buttons */}
        <OkNoButtons
          isVisible={showButtons && gamePhase === 'question'}
          onSelect={handleAnswerSelect}
          disabled={buttonsDisabled}
        />

        {/* Feedback Overlay */}
        {showFeedback && (
          <FeedbackOverlay
            isVisible={true}
            isCorrect={isFeedbackCorrect}
            message={feedbackMessage}
            onComplete={handleFeedbackComplete}
            duration={5000}
          />
        )}

        {/* Congratulations Overlay using CongratsOverlay component */}
        <CongratsOverlay
          isVisible={gamePhase === 'complete'}
          title="¡Muy Bien!"
          subtitle={`Has completado todas las situaciones correctamente. Puntuación: ${score}/${gameConfig.situations.length}`}
          emoji="🎉"
          bgColor="bg-blue-500/20"
          textColor="text-blue-800"
          onComplete={handleGameComplete}
          autoCloseDelay={3000}
        />

      </div>
    </div>
  );
};

export default JuegoDosActividad3;