'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { juego1Config } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { createGameAudio } from '../../../utils/gameAudio';

interface JuegoUnoActividad6Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

enum GameState {
  INTRO,     // Show closed baúl + title
  READY,     // Show open baúl
  PLAYING,   // Show dolls + open baúl background
  FEEDBACK,  // Show feedback overlay
  COMPLETED  // All private parts found
}

export default function JuegoUnoActividad6({ isVisible, onClose, onGameComplete }: JuegoUnoActividad6Props) {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [foundParts, setFoundParts] = useState<Set<string>>(new Set());
  const [currentFeedback, setCurrentFeedback] = useState<{
    isCorrect: boolean;
    dollIndex: number;
    highlightImage?: string;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlayingFeedbackAudio, setIsPlayingFeedbackAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset game when modal opens
  useEffect(() => {
    if (isVisible) {
      setGameState(GameState.INTRO);
      setFoundParts(new Set());
      setCurrentFeedback(null);
      setIsAnimating(false);
      setIsPlayingFeedbackAudio(false);
    }
  }, [isVisible]);

  // Auto-progress from INTRO to READY after title audio (6 seconds)
  useEffect(() => {
    if (gameState === GameState.INTRO && isVisible) {
      playAudio(juego1Config.titleAudio);
      const timer = setTimeout(() => {
        setGameState(GameState.READY);
      }, 6000); // 6 seconds for title
      return () => clearTimeout(timer);
    }
  }, [gameState, isVisible]);

  // Auto-progress from READY to PLAYING
  useEffect(() => {
    if (gameState === GameState.READY) {
      const timer = setTimeout(() => {
        setGameState(GameState.PLAYING);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Check for game completion
  useEffect(() => {
    const requiredParts = ['vulva', 'culo', 'penis-testiculos', 'pechos-doll1', 'pechos-doll3']; // ALL private parts needed to win
    const hasAllRequired = requiredParts.every(part => foundParts.has(part));
    
    if (hasAllRequired && gameState === GameState.PLAYING && !currentFeedback && !isPlayingFeedbackAudio) {
      // Only proceed if no feedback is showing AND no feedback audio is playing
      setGameState(GameState.COMPLETED);
      playAudio(juego1Config.completionAudio);
      
      setTimeout(() => {
        onGameComplete();
      }, 3000);
    }
  }, [foundParts, gameState, onGameComplete, currentFeedback, isPlayingFeedbackAudio]);

  const playAudio = (audioPath: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = createGameAudio(audioPath, 0.7, 'game-audio');

      // Track when feedback audio ends
      if (audioPath.includes('fb-')) {
        setIsPlayingFeedbackAudio(true);
        audioRef.current.onended = () => {
          setIsPlayingFeedbackAudio(false);
        };
      }

      audioRef.current.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play audio:', error);
    }
  };

  const handleSalirJuego = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  const handleListenInstructions = () => {
    playAudio(juego1Config.titleAudio);
  };

  const handleDollClick = (event: React.MouseEvent, dollIndex: number) => {
    if (gameState !== GameState.PLAYING || currentFeedback) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Debug mode - log coordinates
    if (juego1Config.settings.debugMode) {
      console.log(`🎯 Clicked on doll ${dollIndex} at: x: ${x.toFixed(1)}%, y: ${y.toFixed(1)}%`);
    }

    // Check if clicked on a private part
    const clickedPart = juego1Config.privateParts.find(part => {
      const coords = part.coordinates;
      return (
        part.dollIndex === dollIndex &&
        x >= coords.x && x <= coords.x + coords.width &&
        y >= coords.y && y <= coords.y + coords.height
      );
    });

    if (clickedPart && !foundParts.has(clickedPart.id)) {
      // Correct click on private part
      playAudio(juego1Config.correctFeedback.clickAudio);
      
      setTimeout(() => {
        playAudio(clickedPart.clickAudio);
      }, 500);
      
      setTimeout(() => {
        playAudio(clickedPart.feedbackAudio);
      }, 1000);

      setCurrentFeedback({
        isCorrect: true,
        dollIndex,
        highlightImage: clickedPart.highlightImage
      });

      setFoundParts(prev => new Set([...prev, clickedPart.id]));

      // Clear feedback after duration
      setTimeout(() => {
        setCurrentFeedback(null);
      }, juego1Config.settings.feedbackDuration);

    } else {
      // Incorrect click (non-private area)
      playAudio(juego1Config.incorrectFeedback.clickAudio);
      
      setTimeout(() => {
        playAudio(juego1Config.incorrectFeedback.feedbackAudio);
      }, 500);

      setCurrentFeedback({
        isCorrect: false,
        dollIndex
      });

      // Clear feedback after duration
      setTimeout(() => {
        setCurrentFeedback(null);
      }, juego1Config.settings.feedbackDuration);
    }
  };

  const renderGameContent = () => {
    switch (gameState) {
      case GameState.INTRO:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <img 
              src={juego1Config.images.baulClosed} 
              alt="Baúl cerrado"
              className="w-96 h-auto"
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold text-orange-800 mt-4 text-center"
            >
              {juego1Config.title}
            </motion.h2>
          </motion.div>
        );

      case GameState.READY:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <motion.img 
              src={juego1Config.images.baulOpen} 
              alt="Baúl abierto"
              className="w-96 h-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>
        );

      case GameState.PLAYING:
      case GameState.COMPLETED:
        return (
          <div className="relative h-full">
            {/* Background baúl with opacity */}
            <div className="absolute inset-0  flex items-center justify-center opacity-30">
              <img 
                src={juego1Config.images.baulOpen} 
                alt="Baúl abierto background"
                className="w-72 h-auto"
              />
            </div>

            {/* Dolls in horizontal layout */}
            <div className="relative z-10 flex flex-row items-center justify-center h-full space-x-8 p-4">
              {juego1Config.images.dolls.map((dollImage, index) => (
                <div key={index} className="relative">
                  {/* Base doll image */}
                  <img
                    src={dollImage}
                    alt={`Doll ${index + 1}`}
                    className="w-40 h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={(e) => handleDollClick(e, index)}
                    style={{ imageRendering: 'crisp-edges' }}
                  />

                  {/* Debug: Show clickable areas */}
                  {juego1Config.settings.showClickableAreas && (
                    <div className="absolute inset-0">
                      {juego1Config.privateParts
                        .filter(part => part.dollIndex === index)
                        .map(part => (
                          <div
                            key={part.id}
                            className="absolute border-2 border-red-500 bg-red-200/30"
                            style={{
                              left: `${part.coordinates.x}%`,
                              top: `${part.coordinates.y}%`,
                              width: `${part.coordinates.width}%`,
                              height: `${part.coordinates.height}%`,
                            }}
                            title={`${part.name} - Click area`}
                          >
                            <span className="text-xs text-red-800 font-bold bg-white/80 px-1 rounded">
                              {part.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                  {/* Feedback overlay for this doll */}
                  {currentFeedback && currentFeedback.dollIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      {currentFeedback.isCorrect ? (
                        // Show highlighted private part
                        currentFeedback.highlightImage && (
                          <img
                            src={currentFeedback.highlightImage}
                            alt="Private part highlighted"
                            className="w-full h-full object-contain"
                          />
                        )
                      ) : (
                        // Show non-private highlight
                        <img
                          src={juego1Config.images.nonPrivateHighlights[index]}
                          alt="Non-private area highlighted"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Central feedback icon - positioned higher */}
            {currentFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                style={{ top: '-40%' }} // Move up 40% from center
              >
                <img
                  src={
                    currentFeedback.isCorrect 
                      ? juego1Config.images.feedbackIcons.correct
                      : juego1Config.images.feedbackIcons.incorrect
                  }
                  alt={currentFeedback.isCorrect ? "Correct" : "Incorrect"}
                  className="w-32 h-32"
                />
              </motion.div>
            )}

            {/* Game completed overlay */}
            <CongratsOverlay
              isVisible={gameState === GameState.COMPLETED}
              title="¡Muy Bien!"
              subtitle="Has encontrado todas las partes privadas"
              emoji="🎉"
              bgColor="bg-green-500/80"
              textColor="text-white"
              onComplete={onGameComplete}
              autoCloseDelay={3000}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm z-50"
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
            <div 
              className="bg-gradient-to-br from-orange-200 via-coral-100 to-red-300 rounded-xl shadow-2xl w-full h-[80vh] overflow-y-auto relative border-4 border-orange-300"
              style={{ maxWidth: juego1Config.settings.modalMaxWidth }}
            >
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
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
              {/* Listen Instructions Button */}
              <EscucharInstruccionesButton
                onPlayInstructions={handleListenInstructions}
                position="top-right"
              />

              <motion.button
                onClick={handleSalirJuego}
                className="absolute top-4 right-48 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                Salir Juego
              </motion.button>

              {/* Game Content */}
              <div className="relative z-10 h-full">
                {renderGameContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}