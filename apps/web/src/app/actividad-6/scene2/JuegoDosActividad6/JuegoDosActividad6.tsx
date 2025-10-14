'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG, Scenario } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { playGameAudio, createGameAudio } from '../../../utils/gameAudio';

interface JuegoDosActividad6Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoDosActividad6({ 
  isVisible, 
  onClose, 
  onGameComplete 
}: JuegoDosActividad6Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<'thumbsUp' | 'thumbsDown' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const feedbackAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentScenario: Scenario | null = !showIntro && currentScenarioIndex < GAME_CONFIG.scenarios.length 
    ? GAME_CONFIG.scenarios[currentScenarioIndex] 
    : null;

  // Play intro audio when game starts
  useEffect(() => {
    if (isVisible && showIntro) {
      playAudio(GAME_CONFIG.introAudio, () => {
        setTimeout(() => setShowIntro(false), 500);
      });
    }
  }, [isVisible, showIntro]);

  // Play scenario audio when new scenario loads or when retrying
  useEffect(() => {
    if (currentScenario && !showFeedback && !showCongrats) {
      playAudio(currentScenario.audioUrl);
    }
  }, [currentScenario, showFeedback, showCongrats]);

  // Reset game state when modal closes
  useEffect(() => {
    if (!isVisible && !showIntro) {
      // Reset all states when modal is closed
      setCurrentScenarioIndex(0);
      setShowIntro(true);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setShowCongrats(false);
      setIsPlayingAudio(false);
    }
  }, [isVisible]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (feedbackAudioRef.current) {
        feedbackAudioRef.current.pause();
        feedbackAudioRef.current = null;
      }
    };
  }, []);

  const playAudio = (src: string, onEnded?: () => void) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = createGameAudio(src, 0.7, 'JuegoDos-Actividad6');
      setIsPlayingAudio(true);
      
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
        if (onEnded) onEnded();
      };
      
      audioRef.current.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play audio:', error);
      setIsPlayingAudio(false);
      if (onEnded) onEnded();
    }
  };

  const playFeedbackAudio = (src: string, onEnded?: () => void) => {
    try {
      if (feedbackAudioRef.current) {
        feedbackAudioRef.current.pause();
      }
      feedbackAudioRef.current = createGameAudio(src, 0.7, 'JuegoDos-Feedback-Actividad6');
      
      feedbackAudioRef.current.onended = () => {
        if (onEnded) onEnded();
      };
      
      feedbackAudioRef.current.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play feedback audio:', error);
      if (onEnded) onEnded();
    }
  };

  const playSound = (type: 'correct' | 'incorrect' | 'button') => {
    try {
      const soundMap = {
        correct: GAME_CONFIG.soundEffects.correct,
        incorrect: GAME_CONFIG.soundEffects.incorrect,
        button: GAME_CONFIG.soundEffects.buttonClick
      };
      playGameAudio(soundMap[type], 0.5, `JuegoDos-${type}-Actividad6`);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleAnswer = (answer: 'thumbsUp' | 'thumbsDown') => {
    if (isAnimating || showFeedback || !currentScenario) return;
    
    setIsAnimating(true);
    setSelectedAnswer(answer);
    
    const correct = answer === currentScenario.correctAnswer;
    setIsCorrect(correct);
    
    // Play immediate sound effect
    playSound(correct ? 'correct' : 'incorrect');
    
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Show feedback
    setShowFeedback(true);
    
    // Play feedback audio
    const feedbackAudio = correct 
      ? currentScenario.feedbackCorrect.audioUrl 
      : currentScenario.feedbackIncorrect.audioUrl;
    
    playFeedbackAudio(feedbackAudio, () => {
      // After feedback audio ends (about 6 seconds)
      setTimeout(() => {
        if (correct) {
          // Check if this was the last scenario
          if (currentScenarioIndex === GAME_CONFIG.scenarios.length - 1) {
            // Last scenario completed correctly - show congratulations
            setShowFeedback(false);
            setSelectedAnswer(null);
            setShowCongrats(true);
          } else {
            // Move to next scenario
            nextScenario();
          }
        } else {
          // If incorrect, reset to try again with the same card
          resetCurrentScenario();
        }
      }, 1000);
    });
    
    setIsAnimating(false);
  };

  const resetCurrentScenario = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    // The same scenario will be shown again
  };

  const nextScenario = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setCurrentScenarioIndex(currentScenarioIndex + 1);
  };

  const handleCongratsComplete = () => {
    setShowCongrats(false);
    // Reset game state to prevent audio replay
    setCurrentScenarioIndex(0);
    setShowIntro(true);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setIsPlayingAudio(false);
    onGameComplete();
  };

  const handleListenInstructions = () => {
    // Play the intro audio
    playAudio(GAME_CONFIG.introAudio);
  };

  const handleSalirJuego = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound('button');
    
    // Stop all audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (feedbackAudioRef.current) {
      feedbackAudioRef.current.pause();
    }

    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="bg-gradient-to-br from-cyan-100 via-blue-50 to-cyan-200 rounded-xl shadow-2xl w-full max-w-[800px] h-[90vh] max-h-[600px] overflow-hidden relative border-4 border-cyan-300">

              {/* Header */}
              {/* Listen Instructions Button */}
              <EscucharInstruccionesButton
                onPlayInstructions={handleListenInstructions}
                position="side-by-side"
              />

              <motion.button
                onClick={handleSalirJuego}
                className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                Salir Juego
              </motion.button>

              {/* Progress Badge - Top left */}
              {!showIntro && currentScenario && (
                <div className="absolute top-4 left-4 z-50">
                  <div className="px-3 py-2 bg-orange-500 text-white rounded-full shadow-lg text-center font-bold text-sm">
                    Paso {currentScenarioIndex + 1}/{GAME_CONFIG.scenarios.length}
                  </div>
                </div>
              )}

              {/* Game Content */}
              <div className="relative h-full flex items-center justify-center pt-4 pb-4">
                {showIntro ? (
                  // Intro Screen
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center px-8 max-w-2xl"
                  >
                    <h3 className="text-3xl font-bold text-gray-800 mb-6">
                      {GAME_CONFIG.title}
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {GAME_CONFIG.introText}
                    </p>
                    {isPlayingAudio && (
                      <div className="mt-8">
                        <motion.div
                          animate={{ scale: [2.5, 1.8, 2.2] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block"
                        >
                          🔊
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ) : currentScenario ? (
                  // Game Screen
                  <div className="flex items-center justify-center space-x-8 px-8">
                    {/* Thumbs Down Button */}
                    <motion.button
                      onClick={() => handleAnswer('thumbsDown')}
                      disabled={showFeedback || isAnimating}
                      className={`relative transition-all duration-300 ${
                        showFeedback && selectedAnswer !== 'thumbsDown' ? 'opacity-30' : ''
                      }`}
                      whileHover={!showFeedback ? { scale: 1.1 } : {}}
                      whileTap={!showFeedback ? { scale: 0.95 } : {}}
                    >
                      <img 
                        src={
                          selectedAnswer === 'thumbsDown' && showFeedback
                            ? GAME_CONFIG.buttons.thumbsDown.active
                            : GAME_CONFIG.buttons.thumbsDown.normal
                        }
                        alt="Thumbs Down"
                        className="w-32 h-32"
                      />
                      {showFeedback && selectedAnswer === 'thumbsDown' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 0 }}
                          className={`absolute inset-0 rounded-full blur-xl`}
                        />
                      )}
                    </motion.button>

                    {/* Scenario Card */}
                    <div className="relative">
                      {/* Feedback Indicator */}
                      <AnimatePresence>
                        {showFeedback && (
                          <motion.img
                            initial={{ opacity: 0, y: 20, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.5 }}
                            src={
                              isCorrect 
                                ? GAME_CONFIG.feedbackImages.correct
                                : GAME_CONFIG.feedbackImages.alert
                            }
                            alt={isCorrect ? "Correct" : "Alert"}
                            className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-16 h-16 z-10"
                          />
                        )}
                      </AnimatePresence>

                      {/* Card */}
                      <motion.div
                        key={currentScenario.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="overflow-hidden"
                      >
                        <img 
                          src={currentScenario.imageUrl}
                          alt={currentScenario.text}
                          className="w-[460px] h-[420px] object-fit"
                        />
                      </motion.div>
                    </div>

                    {/* Thumbs Up Button */}
                    <motion.button
                      onClick={() => handleAnswer('thumbsUp')}
                      disabled={showFeedback || isAnimating}
                      className={`relative transition-all duration-300 ${
                        showFeedback && selectedAnswer !== 'thumbsUp' ? 'opacity-30' : ''
                      }`}
                      whileHover={!showFeedback ? { scale: 1.1 } : {}}
                      whileTap={!showFeedback ? { scale: 0.95 } : {}}
                    >
                      <img 
                        src={
                          selectedAnswer === 'thumbsUp' && showFeedback
                            ? GAME_CONFIG.buttons.thumbsUp.active
                            : GAME_CONFIG.buttons.thumbsUp.normal
                        }
                        alt="Thumbs Up"
                        className="w-32 h-32"
                      />
                      {showFeedback && selectedAnswer === 'thumbsUp' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 0 }}
                          className={`absolute inset-0 rounded-full blur-xl`}
                        />
                      )}
                    </motion.button>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>

          {/* Congratulations Overlay */}
          <CongratsOverlay
            isVisible={showCongrats}
            title="¡Excelente trabajo!"
            subtitle="Has completado el juego de Victimización"
            emoji="🎉"
            bgColor="bg-green-500/80"
            textColor="text-white"
            onComplete={handleCongratsComplete}
            autoCloseDelay={3000}
          />
        </>
      )}
    </AnimatePresence>
  );
}