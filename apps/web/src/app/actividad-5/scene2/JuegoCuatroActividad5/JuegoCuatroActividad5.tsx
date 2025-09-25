'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { JUEGO_CUATRO_CONFIG, GamePhase, getOptionById } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { playGameAudio, createGameAudio } from '../../../utils/gameAudio';

interface JuegoCuatroActividad5Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoCuatroActividad5({ isVisible, onClose, onGameComplete }: JuegoCuatroActividad5Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Initialize game when it becomes visible
  useEffect(() => {
    if (isVisible) {
      resetGame();
    } else {
      // Clean up any audio when component is hidden
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
    }
  }, [isVisible]);

  // Handle game phase transitions
  useEffect(() => {
    if (!isVisible) return;
    
    if (gamePhase === 'intro') {
      // Play title audio and transition to selection
      const timer = setTimeout(() => {
        playAudio(JUEGO_CUATRO_CONFIG.audio.title, () => {
          setGamePhase('selection');
        });
      }, JUEGO_CUATRO_CONFIG.timing.titleDelay);
      
      return () => clearTimeout(timer);
    }
  }, [gamePhase, isVisible]);

  // Reset game to initial state
  const resetGame = () => {
    setGamePhase('intro');
    setSelectedOption(null);
    setShowFeedback(false);
    setIsAnimating(false);
  };

  // Play audio helper
  const playAudio = (src: string, onEnded?: () => void) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = createGameAudio(src, 0.7, 'JuegoCuatro playAudio');
      setCurrentAudio(audio);

      if (onEnded) {
        audio.onended = onEnded;
      }

      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play audio:', error);
      if (onEnded) onEnded();
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionId: number) => {
    if (isAnimating || gamePhase !== 'selection') return;
    
    const option = getOptionById(optionId);
    if (!option) return;
    
    setIsAnimating(true);
    setSelectedOption(optionId);
    
    // Play option selection sound
    playAudio(option.clickSound, () => {
      // Show feedback after option sound
      setGamePhase('feedback');
      setShowFeedback(true);
      
      // Play feedback sound (correct/incorrect)
      const feedbackSound = option.isCorrect 
        ? JUEGO_CUATRO_CONFIG.audio.correct 
        : JUEGO_CUATRO_CONFIG.audio.incorrect;
      
      playAudio(feedbackSound, () => {
        // Play feedback message
        playAudio(option.feedbackAudio, () => {
          setTimeout(() => {
            setShowFeedback(false);
            
            if (option.isCorrect) {
              // Correct answer - complete game
              setGamePhase('completed');
              setTimeout(() => {
                playAudio(JUEGO_CUATRO_CONFIG.audio.completion);
              }, JUEGO_CUATRO_CONFIG.timing.feedbackDelay);
            } else {
              // Wrong answer - allow retry
              setGamePhase('selection');
              setSelectedOption(null);
              setIsAnimating(false);
            }
          }, JUEGO_CUATRO_CONFIG.timing.feedbackDelay);
        });
      });
    });
  };

  // Handle exit game
  const handleSalirJuego = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Stop any current audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }

    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoCuatro exit button');
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  // Handle game completion
  const handleCompleteGame = () => {
    setIsAnimating(true);

    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoCuatro complete button');
    } catch (error) {
      console.warn('Could not play sound:', error);
    }

    setTimeout(() => {
      setIsAnimating(false);
      onGameComplete();
      onClose();
    }, JUEGO_CUATRO_CONFIG.timing.exitDelay);
  };

  // Handle listen instructions
  const handleListenInstructions = () => {
    playAudio(JUEGO_CUATRO_CONFIG.audio.title);
  };

  // Get feedback image based on selected option
  const getFeedbackImage = () => {
    if (!selectedOption) return null;
    const option = getOptionById(selectedOption);
    return option?.feedbackImage || null;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Modal Container with background image */}
            <div 
              className="relative rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: `min(${JUEGO_CUATRO_CONFIG.modal.width}px, ${JUEGO_CUATRO_CONFIG.modal.maxWidth})`,
                height: `min(${JUEGO_CUATRO_CONFIG.modal.height}px, ${JUEGO_CUATRO_CONFIG.modal.maxHeight})`,
                backgroundImage: `url(${JUEGO_CUATRO_CONFIG.images.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Listen Instructions Button */}
              <EscucharInstruccionesButton
                onPlayInstructions={handleListenInstructions}
                position="top-right"
              />

              {/* Exit button */}
              <motion.button
                onClick={handleSalirJuego}
                className="absolute top-4 right-48 z-50 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition-colors duration-200 shadow-lg text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                Salir
              </motion.button>
              
              {/* Feedback overlay at top */}
              <AnimatePresence>
                {showFeedback && selectedOption && (
                  <motion.div
                    className="absolute inset-x-0 top-[22%] z-50 flex justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <div className="w-16 h-16">
                      <Image
                        src={getOptionById(selectedOption)?.isCorrect 
                          ? JUEGO_CUATRO_CONFIG.images.feedback.correct 
                          : JUEGO_CUATRO_CONFIG.images.feedback.incorrect}
                        alt={getOptionById(selectedOption)?.isCorrect ? "Correcto" : "Incorrecto"}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game Content */}
              <div className="relative w-full h-full flex flex-col">
                
                {/* Intro State */}
                {gamePhase === 'intro' && (
                  <motion.div
                    className="h-full flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Initial scene image at bottom */}
                    <div className="h-80 absolute bottom-0 left-0 right-0 overflow-hidden">
                      <Image
                        src={JUEGO_CUATRO_CONFIG.images.introScene}
                        alt="Escena inicial"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Selection Phase */}
                {gamePhase === 'selection' && (
                  <motion.div
                    className="h-full flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Spacer to push buttons to bottom */}
                    <div className="flex-1"></div>
                    
                    {/* Three option buttons at bottom */}
                    <div className="flex h-80 justify-center items-end">
                      {JUEGO_CUATRO_CONFIG.options.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleOptionSelect(option.id)}
                          className="flex-1 flex justify-center items-end"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isAnimating}
                        >
                          <Image
                            src={option.image}
                            alt={`Opción ${option.id}`}
                            width={option.size.width}
                            height={option.size.height}
                            className="object-contain"
                          />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Feedback Phase */}
                {gamePhase === 'feedback' && selectedOption && (
                  <motion.div
                    className="absolute left-0 right-0 bottom-0 z-40 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Sized container for the card */}
                    <div className="h-64 w-80 flex items-end">
                      {/* 80% box anchored to the bottom */}
                      <div className="relative w-[80%] h-[80%]">
                        <Image
                          src={getFeedbackImage()!}
                          alt="Feedback"
                          fill
                          className="object-contain object-bottom"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Congratulations Overlay using CongratsOverlay component */}
                <CongratsOverlay
                  isVisible={gamePhase === 'completed'}
                  title="¡Felicidades!"
                  subtitle="Has completado el juego correctamente"
                  emoji="🎉"
                  bgColor="bg-blue-500/20"
                  textColor="text-blue-900"
                  onComplete={handleCompleteGame}
                  autoCloseDelay={3000}
                />

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}