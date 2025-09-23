'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import SituationDisplay from './SituationDisplay';
import OptionsList from './OptionsList';
import FeedbackOverlay from './FeedbackOverlay';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { playGameAudio } from '../../../utils/gameAudio';

interface JuegoTresActividad3Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
  userId?: string;
}

const JuegoTresActividad3: React.FC<JuegoTresActividad3Props> = ({
  isVisible,
  onClose,
  onGameComplete,
  userId
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
    
    // Default fallback
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
    setCurrentSituation, // Added this line
    gamePhase,
    setGamePhase,
    currentOptionIndex,
    setCurrentOptionIndex,
    selectedOption,
    setSelectedOption,
    //isCorrect,
    setIsCorrect,
    score,
    setScore,
    situationsCorrect,
    resetGame,
   // nextSituation,
    markSituationCorrect,
   // isGameComplete,
    gameConfig
  } = useGameState(userGender);

  const { currentSession, startSession, endSession } = useGameSession(userGender);
  const { recordAttempt } = useGameTracking(userGender);
  const { playAudio, playAudioWithCallback, stopAudio } = useAudioManager();

  // Local state for feedback control
  const [showFeedback, setShowFeedback] = useState(false);
  //const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isFeedbackCorrect, setIsFeedbackCorrect] = useState(false);

  // Initialize game when modal opens
  useEffect(() => {
    if (isVisible) {
      console.log('🎮 Game modal opened, starting game...');
      resetGame();
      startSession(userId);
      startTitlePhase();
    } else {
      stopAudio();
    }
  }, [isVisible, userId, resetGame, startSession, stopAudio]);

  // Start the title phase
  const startTitlePhase = useCallback(async () => {
    console.log('🎵 Starting title phase...');
    setGamePhase('title');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      playAudioWithCallback(
        gameConfig.title.audio,
        () => {
          console.log('🎵 Title audio finished, moving to first situation');
          setTimeout(() => {
            startSituationPhase(0);
          }, 500);
        }
      );
    } catch (error) {
      console.error('Error in title phase:', error);
      startSituationPhase(0);
    }
  }, [gameConfig.title.audio, playAudioWithCallback]);

  // Start situation phase - FIXED VERSION
  const startSituationPhase = useCallback(async (situationIndex: number) => {
    // Ensure we don't go out of bounds
    if (situationIndex >= gameConfig.situations.length) {
      console.log('🎉 All situations completed, ending game');
      setGamePhase('complete');
      return;
    }

    const situation = gameConfig.situations[situationIndex];
    console.log(`🎮 Starting situation ${situationIndex + 1}:`, situation.title);
    console.log('🎮 Situation data:', situation);
    
    // Update current situation index to match
    setCurrentSituation(situationIndex);
    setGamePhase('situation'); // Set to 'situation' phase - this will hide options
    setCurrentOptionIndex(0);
    setSelectedOption(null);
    
    // Stop any current audio before playing new one
    stopAudio();
    
    try {
      // Small delay to ensure audio is stopped and UI updates
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Play situation description audio
      console.log('🎵 Playing situation audio:', situation.description.audio);
      playAudioWithCallback(
        situation.description.audio,
        () => {
          console.log('🎵 Situation audio finished, starting options sequence');
          setTimeout(() => {
            startOptionsSequence(situationIndex);
          }, 500);
        }
      );
    } catch (error) {
      console.error('Error playing situation audio:', error);
      startOptionsSequence(situationIndex);
    }
  }, [gameConfig.situations, playAudioWithCallback, stopAudio, setCurrentSituation, setGamePhase, setCurrentOptionIndex, setSelectedOption]);

  // Start options sequence (play each option audio sequentially)
  const startOptionsSequence = useCallback(async (situationIndex: number) => {
    const situation = gameConfig.situations[situationIndex];
    console.log(`🎮 Starting options sequence for situation ${situationIndex + 1}`);
    
    setGamePhase('options');
    
    // Play all option audios sequentially
    const playOptionAudio = async (optionIndex: number): Promise<void> => {
      if (optionIndex >= situation.options.length) {
        // All options played, now allow user to click
        console.log('🎵 All options played, waiting for user click');
        setGamePhase('waiting_for_click');
        return;
      }

      const option = situation.options[optionIndex];
      setCurrentOptionIndex(optionIndex);
      
      console.log(`🎵 Playing option ${optionIndex + 1} audio:`, option.audio);
      
      return new Promise(resolve => {
        playAudioWithCallback(
          option.audio,
          () => {
            console.log(`🎵 Option ${optionIndex + 1} audio finished`);
            setTimeout(() => {
              playOptionAudio(optionIndex + 1).then(resolve);
            }, 500); // Small delay between options
          }
        );
      });
    };

    await playOptionAudio(0);
  }, [gameConfig.situations, playAudioWithCallback, setGamePhase, setCurrentOptionIndex]);

  // Handle option selection - FIXED VERSION
  const handleOptionSelect = useCallback(async (optionId: string) => {
    const situation = gameConfig.situations[currentSituation];
    const selectedOptionData = situation.options.find(opt => opt.id === optionId);
    
    if (!selectedOptionData || gamePhase !== 'waiting_for_click') return;

    console.log(`🎮 Option selected: ${optionId} for situation ${currentSituation + 1}`);
    console.log('🎮 Selected option data:', selectedOptionData);
    
    setSelectedOption(optionId);
    const correct = selectedOptionData.isCorrect;
    setIsCorrect(correct);
    setIsFeedbackCorrect(correct);

    console.log('🎮 Is answer correct?', correct);

    // Record the attempt
    recordAttempt(
      situation.id,
      optionId,
      optionId,
      correct,
      userId,
      currentSession?.sessionId
    );

    // Update score and mark as correct if needed
    if (correct) {
      console.log('🎮 Updating score and marking situation as correct');
      setScore(prev => prev + 1);
      markSituationCorrect(currentSituation);
    }

    // Set feedback and show overlay
    setShowFeedback(true);
    console.log('🎮 About to play feedback audio:', selectedOptionData.feedback.audio);

    // Play feedback audio with callback
    try {
      playAudioWithCallback(
        selectedOptionData.feedback.audio,
        () => {
          console.log('🎵 Feedback audio completed - proceeding with next steps');
          // Add 1 second delay after audio completes before proceeding
          setTimeout(() => {
            console.log('🎵 Processing feedback completion...');
            
            // Hide feedback first
            setShowFeedback(false);
            stopAudio();
            
            if (correct) {
              // Correct answer - move to next situation
              if (currentSituation >= gameConfig.situations.length - 1) {
                // Game complete
                console.log('🎉 Game completed!');
                const finalScore = score + 1;
                const finalCorrect = [...situationsCorrect];
                finalCorrect[currentSituation] = true;
                
                endSession(true, finalScore, finalCorrect);
                setGamePhase('complete');
              } else {
                // Move to next situation - FIXED: Don't update currentSituation here
                console.log('➡️ Moving to next situation...');
                const nextSituationIndex = currentSituation + 1;
                console.log('🎮 Next situation index:', nextSituationIndex);
                
                // IMPORTANT: Don't update currentSituation here, let startSituationPhase do it
                // This prevents the brief flash of options
                
                setTimeout(() => {
                  console.log('🎮 Starting next situation:', nextSituationIndex);
                  startSituationPhase(nextSituationIndex);
                }, 1000);
              }
            } else {
              // Wrong answer - retry same situation
              console.log('❌ Wrong answer, staying on same situation');
              setTimeout(() => {
                setGamePhase('waiting_for_click');
                setSelectedOption(null);
              }, 500);
            }
          }, 1000);
        }
      );
    } catch (error) {
      console.warn('Could not play feedback audio:', error);
      // If audio fails, still proceed after delay
      setTimeout(() => {
        console.log('🎵 Audio failed - proceeding anyway');
        setShowFeedback(false);
        if (correct && currentSituation < gameConfig.situations.length - 1) {
          const nextSituationIndex = currentSituation + 1;
          setTimeout(() => {
            startSituationPhase(nextSituationIndex);
          }, 1000);
        }
      }, 3000);
    }

  }, [
    gameConfig.situations,
    currentSituation,
    gamePhase,
    recordAttempt,
    markSituationCorrect,
    playAudioWithCallback,
    userId,
    currentSession,
    setSelectedOption,
    setIsCorrect,
    setIsFeedbackCorrect,
    setScore,
    setShowFeedback,
    score,
    situationsCorrect,
    endSession,
    setGamePhase,
    startSituationPhase,
    stopAudio
  ]);

  // Handle game completion
  const handleGameComplete = useCallback(() => {
    console.log('🎮 Game completion sequence finished');
    
    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoTresActividad3 completion');
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
    
    setTimeout(() => {
      onGameComplete();
      onClose();
    }, 500);
  }, [onGameComplete, onClose]);
  
  // Handle close button
  const handleClose = useCallback(() => {
    stopAudio();
    endSession(false, score, situationsCorrect);
    resetGame();
    onClose();
  }, [stopAudio, endSession, score, situationsCorrect, resetGame, onClose]);

  // Handle listen instructions button
  const handleListenInstructions = useCallback(() => {
    // Play the gender-specific title audio
    playAudio(gameConfig.title.audio);
  }, [playAudio, gameConfig.title.audio]);

  if (!isVisible) return null;

  const currentSituationData = gameConfig.situations[currentSituation];
  const showSituation = gamePhase === 'situation' || gamePhase === 'options' || gamePhase === 'waiting_for_click';

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4">
      {/* Modal with gradient background - 800x500 responsive */}
      <div 
        className="relative w-full h-full max-w-[800px] max-h-[500px] rounded-xl shadow-xl pointer-events-auto overflow-hidden bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500"
        style={{ 
          aspectRatio: '800/500'
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

        {/* Progress Indicator */}
        <div className="absolute top-4 left-4 z-10 bg-white/20 rounded-full px-4 py-2">
          <span className="text-white font-bold">
            {currentSituation + 1} / {gameConfig.situations.length}
          </span>
        </div>

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-16 left-4 z-10 text-xs text-white bg-black/50 p-2 rounded max-w-md">
            <div>Gender: {userGender}</div>
            <div>Situación: {currentSituation + 1}/{gameConfig.situations.length}</div>
            <div>Fase: {gamePhase}</div>
            <div>Score: {score}</div>
            <div>Option Index: {currentOptionIndex}</div>
            {currentSituationData && (
              <>
                <div>ID: {currentSituationData.id}</div>
                <div>Título: {currentSituationData.title}</div>
                <div>Options: {currentSituationData.options.length}</div>
                <div>Selected: {selectedOption || 'None'}</div>
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
                La masturbación
              </div>
              <div className="text-lg opacity-80 mb-2">
                Elige qué debería hacer {userGender === 'male' ? 'Dani' : 'Cris'}  en cada situación
              </div>
              <div className="text-sm opacity-60 mb-6">
                Escuchando instrucciones...
              </div>
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        {/* Situation Display */}
        {showSituation && currentSituationData && (
          <SituationDisplay
            image={currentSituationData.description.image}
            alt={currentSituationData.title}
            isVisible={true}
          />
        )}

        {/* Options List */}
        {showSituation && currentSituationData && (
          <OptionsList
            options={currentSituationData.options}
            currentOptionIndex={currentOptionIndex}
            gamePhase={gamePhase}
            onOptionSelect={handleOptionSelect}
            selectedOption={selectedOption}
          />
        )}

        {/* Feedback Overlay */}
        {showFeedback && (
          <FeedbackOverlay
            isVisible={true}
            isCorrect={isFeedbackCorrect}
            onComplete={() => {}} // Empty function - we handle completion via audio callback now
            duration={10000} // Longer duration as fallback, but audio callback controls timing
          />
        )}

        {/* Congratulations Overlay using CongratsOverlay component with proper props */}
        <CongratsOverlay
          isVisible={gamePhase === 'complete'}
          title="¡Excelente!"
          subtitle="Has completado exitosamente todas las situaciones"
          emoji="🎯"
          bgColor="bg-emerald-500/20"
          textColor="text-emerald-900"
          onComplete={handleGameComplete}
          autoCloseDelay={3000}
        />

      </div>
    </div>
  );
};

export default JuegoTresActividad3;