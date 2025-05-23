'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface JuegoUnoProps {
  isVisible: boolean;
  onClose: () => void;
}

const JuegoUno: React.FC<JuegoUnoProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

    const handleClose = () => {
    const audio = new Audio('/ui-sound/Game_Close_W.mp3'); // use your sound
    audio.volume = 0.6;
    audio.play().catch(console.warn);

    onClose(); // let the parent handle state
  };


  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative w-[80%] max-w-[900px] h-[80%] bg-white/10 border-2 border-white/30 backdrop-blur-md rounded-xl shadow-xl pointer-events-auto p-4">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white text-sm bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full font-bold shadow"
        >
          SALIR
        </button>

        {/* Content placeholder */}
        <div className="flex items-center justify-center h-full text-white text-xl font-bold">
          Aquí va el juego uno 🎮
        </div>
      </div>
    </motion.div>
  );
};

export default JuegoUno;
