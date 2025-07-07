'use client';

import { motion } from 'framer-motion';

interface JuegoCincoActividad2Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function JuegoCincoActividad2({ isOpen, onClose }: JuegoCincoActividad2Props) {
  if (!isOpen) return null;

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
        onClick={onClose}
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
          onClick={onClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
        >
          Salir juego
        </button>

        {/* Modal Content */}
        <div className="w-full h-full p-6 pt-16">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Juego Cinco - Actividad 2
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                ¡Próximamente el siguiente juego!
              </p>
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-gray-500">
                Este será el nuevo juego después de completar el Juego 4
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}