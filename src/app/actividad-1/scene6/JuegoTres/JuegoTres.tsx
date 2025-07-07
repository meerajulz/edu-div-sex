'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { GAME_CONFIG } from './config';
import { useGameState, useGameSession, useGameTracking, useAudioManager } from './hooks';
import CongratsOverlay from './CongratsOverlay';

interface JuegoTresProps {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete?: () => void;
  userId?: string; // For database tracking
}

const JuegoTres: React.FC<JuegoTresProps> = ({ 
  isVisible, 
  onClose, 
  onGameComplete,
  userId 
}) => {
  // Game state management
  
  const {
    gameStarted,
    setGameStarted,
    selectedOption,
    setSelectedOption,
    showFeedback,
    setShowFeedback,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isCorrect,
    setIsCorrect,
    showCongrats,
    setShowCongrats,
    attempts,
    setAttempts,
    resetGame
  } = useGameState();

  // Session tracking
  const { currentSession, startSession, endSession } = useGameSession();
  
  // Attempt tracking
  const { recordAttempt } = useGameTracking();
  
  // Audio management
  const { playAudio, playInitialAudio, resetAudioState } = useAudioManager();

  // Initialize game when modal opens
  useEffect(() => {
    if (isVisible) {
      resetGame();
      resetAudioState();
      
      // Start tracking session
      startSession(userId);
      
      // Start audio sequence
      setTimeout(() => {
        playInitialAudio(() => {
          setGameStarted(true);
        });
      }, GAME_CONFIG.timing.audioDelay);
    }
  }, [isVisible, resetGame, resetAudioState, startSession, playInitialAudio, setGameStarted, userId]);

  // Handle option selection
  const handleOptionClick = async (optionId: string) => {
    if (showFeedback) return;
    
    const option = GAME_CONFIG.options.find(opt => opt.id === optionId);
    if (!option) return;

    const newAttempts = attempts + 1;
    const correct = option.type === 'correct';
    
    // Update game state
    setSelectedOption(optionId);
    setShowFeedback(true);
    setIsCorrect(correct);
    setAttempts(newAttempts);
    
    // Record attempt for database
    recordAttempt(
      optionId,
      correct,
      newAttempts,
      userId,
      currentSession?.sessionId
    );

    if (correct) {
      // Correct answer flow
      await playAudio(GAME_CONFIG.audio.correct);
      
      setTimeout(() => {
        setShowCongrats(true);
        
        setTimeout(() => {
          // End session as successful
          endSession(true, newAttempts);
          
          setShowCongrats(false);
          onClose();
          if (onGameComplete) {
            onGameComplete();
          }
        }, GAME_CONFIG.timing.congratsDuration);
      }, GAME_CONFIG.timing.feedbackDuration);
      
    } else {
      // Incorrect answer flow
      await playAudio(GAME_CONFIG.audio.incorrect);
      
      setTimeout(() => {
        // Reset for retry
        setShowFeedback(false);
        setSelectedOption(null);
      }, GAME_CONFIG.timing.feedbackDuration);
    }
  };

  const handleClose = () => {
    // End session as abandoned
    endSession(false, attempts);
    resetGame();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div className="relative w-[80%] h-[50%] max-w-3xl bg-white/10 border-2 border-white/30 backdrop-blur-md rounded-xl shadow-xl pointer-events-auto overflow-hidden">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
        >
          Salir juego
        </button>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 left-2 z-10 text-xs text-white bg-black/50 p-2 rounded">
            Intentos: {attempts} | Session: {currentSession?.sessionId?.slice(-8)}
          </div>
        )}

        {/* Decorative Images */}
        {/* Left decoration */}
        <div className="absolute left-[55px] top-1/2 transform -translate-y-1/2 z-5">
          <Image
            src="/image/escena_1/juego_3/punto-1.png"
            alt="Decoration left"
            width={100}
            height={100}
            className="object-contain opacity-80"
          />
        </div>

        {/* Right decoration */}
        <div className="absolute right-[50px] top-1/2 transform -translate-y-1/2 z-5">
          <Image
            src="/image/escena_1/juego_3/punto2.png"
            alt="Decoration right"
            width={100}
            height={100}
            className="object-contain opacity-80"
          />
        </div>

        {/* Bottom decoration */}
        <div className="absolute top-[120px] left-1/2 transform -translate-x-1/2 z-5">
          <Image
            src="/image/escena_1/juego_3/starts.png"
            alt="Stars decoration"
            width={120}
            height={60}
            className="object-contain opacity-90"
          />
        </div>

        {/* Game Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          
          {!gameStarted ? (
            // Loading/Audio playing state with Dani GIF
              <div className="">
                <Image
                  src="/image/escena_1/juego_3/dani.gif"
                  alt="Dani talking"
                  width={800}
                  height={800}
                  className="mx-auto rounded-full"
                  unoptimized
                />
              </div>
          ) : (
            // Game interface
            <div className="w-full h-full flex flex-col">
              
              {/* Question */}
              <div className="text-center pt-8">
                <h2 className="text-3xl font-bold text-fuchsia-400 mb-2">{GAME_CONFIG.title}</h2>
                <p className="text-xl text-fuchsia-300">{GAME_CONFIG.question}</p>
              </div>

              {/* Options - Touch bottom */}
              <div className="flex-1 flex justify-center items-end">
                <div className="flex justify-center items-end space-x-12">
                  {GAME_CONFIG.options.map((option) => (
                    <div key={option.id} className="relative">
                      <button
                        onClick={() => handleOptionClick(option.id)}
                        disabled={showFeedback}
                        className={`relative block transition-all duration-300 ${
                          showFeedback ? 'cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
                        }`}
                      >
                        <div className="w-72 h-72 relative">
                          <Image
                            src={
                              showFeedback && selectedOption === option.id
                                ? option.images.feedback
                                : option.images.normal
                            }
                            alt={option.alt}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Congratulations Overlay */}
        {showCongrats && (
          <CongratsOverlay onComplete={() => setShowCongrats(false)} />
        )}
      </div>
    </div>
  );
};

export default JuegoTres;