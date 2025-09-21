'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG, Situation } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';

interface JuegoSeisActividad6Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoSeisActividad6({ 
  isVisible, 
  onClose, 
  onGameComplete 
}: JuegoSeisActividad6Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSituationIndex, setCurrentSituationIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showOption1, setShowOption1] = useState(false);
  const [showOption2, setShowOption2] = useState(false);
  const [canSelect, setCanSelect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<1 | 2 | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGameCompleting, setIsGameCompleting] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const feedbackAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentSituation: Situation | null = !showIntro && currentSituationIndex < GAME_CONFIG.situations.length 
    ? GAME_CONFIG.situations[currentSituationIndex] 
    : null;

  // Reset game state when modal closes
  useEffect(() => {
    if (!isVisible && !showIntro) {
      // Reset all states when modal is closed
      setCurrentSituationIndex(0);
      setShowIntro(true);
      setShowOption1(false);
      setShowOption2(false);
      setCanSelect(false);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setShowCongrats(false);
      setIsGameCompleting(false);
      setIsPlayingAudio(false);
    }
  }, [isVisible]);

  // Play intro audio when game starts
  useEffect(() => {
    if (isVisible && showIntro) {
      playAudio(GAME_CONFIG.introAudio, () => {
        setTimeout(() => setShowIntro(false), 500);
      });
    }
  }, [isVisible, showIntro]);

  // Sequential presentation of situation and options
  useEffect(() => {
    if (currentSituation && !showFeedback && !showCongrats && !isGameCompleting) {
      // Reset option states
      setShowOption1(false);
      setShowOption2(false);
      setCanSelect(false);
      
      // Play main card audio first
      playAudio(currentSituation.mainCard.audioUrl, () => {
        // After main card audio, show and play option 1
        setTimeout(() => {
          setShowOption1(true);
          playAudio(currentSituation.option1.audioUrl, () => {
            // After option 1 audio, show and play option 2
            setTimeout(() => {
              setShowOption2(true);
              playAudio(currentSituation.option2.audioUrl, () => {
                // After option 2 audio, enable selection
                setTimeout(() => {
                  setCanSelect(true);
                }, 500);
              });
            }, 500);
          });
        }, 500);
      });
    }
  }, [currentSituation, showFeedback, showCongrats, isGameCompleting]);

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
      audioRef.current = new Audio(src);
      audioRef.current.volume = 0.7;
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
      feedbackAudioRef.current = new Audio(src);
      feedbackAudioRef.current.volume = 0.7;
      
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
      const audio = new Audio(soundMap[type]);
      audio.volume = 0.5;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleOptionClick = (option: 1 | 2) => {
    if (!canSelect || isAnimating || showFeedback || !currentSituation) return;
    
    setIsAnimating(true);
    setSelectedOption(option);
    
    const selectedIsCorrect = option === 1 
      ? currentSituation.option1.isCorrect 
      : currentSituation.option2.isCorrect;
    
    setIsCorrect(selectedIsCorrect);
    
    // Play immediate sound effect
    playSound(selectedIsCorrect ? 'correct' : 'incorrect');
    
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Show feedback
    setShowFeedback(true);
    setCanSelect(false);
    
    // Play feedback audio
    const feedbackAudio = selectedIsCorrect 
      ? currentSituation.feedback.correctAudioUrl 
      : currentSituation.feedback.incorrectAudioUrl;
    
    playFeedbackAudio(feedbackAudio, () => {
      // After feedback audio ends
      setTimeout(() => {
        if (selectedIsCorrect) {
          // Check if this was the last situation
          if (currentSituationIndex === GAME_CONFIG.situations.length - 1) {
            // Last situation completed correctly - show congratulations
            setIsGameCompleting(true);
            setShowFeedback(false);
            setSelectedOption(null);
            setShowCongrats(true);
          } else {
            // Move to next situation
            nextSituation();
          }
        } else {
          // If incorrect, reset to try again with the same situation
          resetCurrentSituation();
        }
      }, 1000);
    });
    
    setIsAnimating(false);
  };

  const resetCurrentSituation = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setShowOption1(false);
    setShowOption2(false);
    setCanSelect(false);
    // The same situation will be shown again
  };

  const nextSituation = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setShowOption1(false);
    setShowOption2(false);
    setCanSelect(false);
    setCurrentSituationIndex(currentSituationIndex + 1);
  };

  const handleCongratsComplete = () => {
    setShowCongrats(false);
    onGameComplete();
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
            className="fixed inset-0  backdrop-blur-sm z-50"
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
            <div className="bg-gradient-to-br from-orange-300 via-red-200 to-pink-300 rounded-xl shadow-2xl w-full max-w-[1000px] h-[90vh] max-h-[700px] overflow-hidden relative border-4 border-orange-300">
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/30"
                    style={{
                      width: Math.random() * 40 + 15,
                      height: Math.random() * 40 + 15,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      x: [0, Math.random() * 15 - 7.5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Header */}
              <motion.button
                onClick={handleSalirJuego}
                className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                Salir Juego
              </motion.button>

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
                ) : currentSituation ? (
                  // Game Screen - Three Card Layout
                  <div className="flex items-center justify-center gap-8 px-8">
                    {/* Main Situation Card (Left) */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <img 
                        src={currentSituation.mainCard.imageUrl}
                        alt="Situation"
                        className="w-[400px] h-[350px] object-cover "
                      />
                    </motion.div>

                    {/* Options Cards (Right) */}
                    <div className="flex flex-col gap-6">
                      {/* Option 1 (Top) */}
                      <AnimatePresence>
                        {showOption1 && (
                          <motion.button
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => handleOptionClick(1)}
                            disabled={!canSelect || showFeedback}
                            className={`relative transition-all duration-300 ${
                              !canSelect ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-105'
                            } ${
                              showFeedback && selectedOption !== 1 ? 'opacity-30' : ''
                            }`}
                            whileHover={canSelect && !showFeedback ? { scale: 1.05 } : {}}
                            whileTap={canSelect && !showFeedback ? { scale: 0.95 } : {}}
                          >
                            <img 
                              src={currentSituation.option1.imageUrl}
                              alt="Option 1"
                              className="w-[280px] h-[160px] object-fit  "
                            />
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Option 2 (Bottom) */}
                      <AnimatePresence>
                        {showOption2 && (
                          <motion.button
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => handleOptionClick(2)}
                            disabled={!canSelect || showFeedback}
                            className={`relative transition-all duration-300 ${
                              !canSelect ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-105'
                            } ${
                              showFeedback && selectedOption !== 2 ? 'opacity-30' : ''
                            }`}
                            whileHover={canSelect && !showFeedback ? { scale: 1.05 } : {}}
                            whileTap={canSelect && !showFeedback ? { scale: 0.95 } : {}}
                          >
                            <img 
                              src={currentSituation.option2.imageUrl}
                              alt="Option 2"
                              className="w-[280px] h-[160px] object-fit "
                            />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Feedback Indicator (Center Overlay) */}
                    <AnimatePresence>
                      {showFeedback && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <motion.img
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{ 
                              duration: 0.5,
                              repeat: 2
                            }}
                            src={
                              isCorrect 
                                ? GAME_CONFIG.feedbackImages.correct
                                : GAME_CONFIG.feedbackImages.incorrect
                            }
                            alt={isCorrect ? "Correct" : "Incorrect"}
                            className="w-32 h-32"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>

          {/* Congratulations Overlay */}
          <CongratsOverlay
            isVisible={showCongrats}
            title="¡Excelente trabajo!"
            subtitle="Has completado el juego ¿Qué hacer si sucede?"
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