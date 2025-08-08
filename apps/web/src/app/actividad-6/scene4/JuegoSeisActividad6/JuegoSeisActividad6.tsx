'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface JuegoSeisActividad6Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoSeisActividad6({ isVisible, onClose, onGameComplete }: JuegoSeisActividad6Props) {
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
    }, 500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
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
            <div className="bg-gradient-to-br from-orange-300 via-red-200 to-pink-300 rounded-xl shadow-2xl w-[80vw] h-[80vh] overflow-y-auto relative border-4 border-orange-300">
              
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
              <motion.button
                onClick={handleSalirJuego}
                className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                Salir Juego
              </motion.button>

              {/* Game Content - Placeholder */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
                <motion.div
                  className="text-6xl mb-6"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  🏆
                </motion.div>
                
                <h2 className="text-3xl font-bold text-orange-800 mb-4">
                  Juego Seis - ¡FINAL!
                </h2>
                
                <p className="text-lg text-orange-700 mb-8 max-w-md">
                  ¡Este es el momento! El sexto y último juego de tu aventura. 
                  ¡Prepárate para el gran final!
                </p>

                <div className="bg-white/50 rounded-lg p-6 mb-8">
                  <div className="text-orange-600 font-semibold mb-2">Estado: En desarrollo</div>
                  <div className="w-full bg-orange-200 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full w-0 animate-pulse"></div>
                  </div>
                </div>

                <div className="bg-orange-100/70 rounded-lg p-4 mb-6 border-2 border-orange-300">
                  <div className="text-orange-800 font-medium mb-2">🎯 Juego 6 de 6 - ¡FINAL!</div>
                  <div className="text-orange-700 text-sm">
                    ¡El gran momento ha llegado! Este último desafío coronará 
                    tu increíble aventura educativa. ¡Vamos!
                  </div>
                </div>

                {/* Temporary Complete Button */}
                <motion.button
                  onClick={handleCompleteGame}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isAnimating}
                >
                  🏆 ¡Completar Gran Final! (Temporal)
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}