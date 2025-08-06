'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface JuegoDosActividad4Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoDosActividad4({ isVisible, onClose, onGameComplete }: JuegoDosActividad4Props) {
  const [isAnimating, setIsAnimating] = useState(false);

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleSalirJuego = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  const handleCompleteGame = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      onGameComplete();
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSalirJuego}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  Juego Dos Actividad 4
                </h2>
                <motion.button
                  onClick={handleSalirJuego}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isAnimating}
                >
                  Salir Juego
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="text-center space-y-6">
                  <div className="text-gray-600 text-lg">
                    Placeholder para el segundo juego de la Actividad 4
                  </div>

                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                    <p className="text-pink-800 mb-4">
                      Aquí va el contenido del segundo juego...
                    </p>
                    <p className="text-pink-600 text-sm">
                      Este es un placeholder temporal para el juego de la Scene2.
                    </p>
                  </div>

                  {/* Temporary Complete Button for testing */}
                  <motion.button
                    onClick={handleCompleteGame}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isAnimating}
                  >
                    Completar Juego (Temporal)
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}