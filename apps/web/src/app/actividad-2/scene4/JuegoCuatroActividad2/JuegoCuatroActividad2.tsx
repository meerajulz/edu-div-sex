'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJuegoCuatroGame } from './hooks';
import CongratsOverlay from './CongratsOverlay';

interface JuegoCuatroActividad2Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function JuegoCuatroActividad2({ isOpen, onClose }: JuegoCuatroActividad2Props) {
  const {
    gameState,
    getCurrentSituation,
    startGame,
    handleAnswerClick,
    resetGame,
    config
  } = useJuegoCuatroGame();

  // Auto-start game when modal opens
  React.useEffect(() => {
    if (isOpen && gameState.phase === 'intro') {
      startGame();
    }
  }, [isOpen, gameState.phase, startGame]);

  if (!isOpen) return null;

  const currentSituation = getCurrentSituation();

  const handleClose = () => {
    resetGame();
    onClose();
  };

  const handleCongratsComplete = () => {
    handleClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <motion.div
        className="relative w-full max-w-[1000px] max-h-[800px] h-full bg-gradient-to-b from-[#fffad3] to-[#f3ffae] rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
        >
          Salir juego
        </button>

        {/* Feedback Images - Fixed position on the left - REMOVED since we moved it to center */}

        {/* Game Content */}
        <div className="w-full h-full p-6 pt-16 flex flex-col">
          {/* Intro Phase - Show loading or title display */}
          {gameState.phase === 'intro' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {config.title}
                </h2>
                <div className="text-lg text-gray-600">
                  Preparando el juego...
                </div>
              </div>
            </div>
          )}

          {/* Situation Phase */}
          {gameState.phase === 'situation' && currentSituation && (
            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence>
                <motion.div
                  key={`situation-${gameState.currentSituationIndex}`}
                  className="text-center"
                  {...config.animations.situationImage}
                >
                  <img
                    src={currentSituation.images.situation}
                    alt={currentSituation.title}
                    className="max-w-full max-h-[500px] object-contain mx-auto"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Options Phase */}
          {gameState.phase === 'options' && currentSituation && (
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <AnimatePresence>
                  <motion.div
                    key={`correct-${gameState.currentSituationIndex}`}
                    className="cursor-pointer"
                    {...config.animations.optionImages}
                    transition={{ ...config.animations.optionImages.transition, delay: 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswerClick('correct')}
                  >
                    <img
                      src={currentSituation.images.correct}
                      alt="Opción correcta"
                      className="w-full max-h-[300px] object-contain  duration-200"
                    />
                  </motion.div>

                  <motion.div
                    key={`incorrect-${gameState.currentSituationIndex}`}
                    className="cursor-pointer"
                    {...config.animations.optionImages}
                    transition={{ ...config.animations.optionImages.transition, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswerClick('incorrect')}
                  >
                    <img
                      src={currentSituation.images.incorrect}
                      alt="Opción incorrecta"
                      className="w-full max-h-[300px] object-contain duration-200"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Feedback Phase */}
          {gameState.phase === 'feedback' && currentSituation && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                  <div className={`${gameState.selectedAnswer === 'correct' ? 'ring-4 ring-green-400 rounded-lg' : 'opacity-50'}`}>
                    <img
                      src={currentSituation.images.correct}
                      alt="Opción correcta"
                      className="w-full max-h-[300px] object-contain rounded-lg"
                    />
                  </div>

                  <div className={`${gameState.selectedAnswer === 'incorrect' ? 'ring-4 ring-red-400 rounded-lg' : 'opacity-50'}`}>
                    <img
                      src={currentSituation.images.incorrect}
                      alt="Opción incorrecta"
                      className="w-full max-h-[300px] object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback Image - Centered horizontally like progress indicator */}
              <AnimatePresence>
                {gameState.showFeedbackImage && gameState.isCorrect !== null && (
                  <div className="flex justify-center mb-4">
                    <motion.div
                      className="z-20"
                      {...config.animations.feedbackImage}
                    >
                      <img
                        src={gameState.isCorrect ? config.feedbackImages.correct : config.feedbackImages.incorrect}
                        alt={gameState.isCorrect ? "Correcto" : "Incorrecto"}
                        className="w-24 h-24 object-contain"
                      />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Progress Indicator */}
          {gameState.phase !== 'intro' && gameState.phase !== 'completed' && (
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
                {config.situations.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index < gameState.currentSituationIndex
                        ? 'bg-green-500'
                        : index === gameState.currentSituationIndex
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Congratulations Overlay */}
        {gameState.gameCompleted && (
          <CongratsOverlay onComplete={handleCongratsComplete} />
        )}
      </motion.div>
    </motion.div>
  );
}