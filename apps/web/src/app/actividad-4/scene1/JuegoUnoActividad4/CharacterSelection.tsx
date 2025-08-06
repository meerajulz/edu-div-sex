'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void;
  isAnimating: boolean;
}

export default function CharacterSelection({ onCharacterSelect, isAnimating }: CharacterSelectionProps) {
  const [showCharacters, setShowCharacters] = useState(true);

  const handleCharacterClick = (character: Character) => {
    if (isAnimating) return;
    
    // Hide characters with animation
    setShowCharacters(false);
    
    // Delay the callback to allow exit animation
    setTimeout(() => {
      onCharacterSelect(character);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center space-x-12 mt-10">
      <AnimatePresence>
        {showCharacters && (
          <>
            {/* Dani (Male) */}
            <motion.div
              className="text-center cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              onClick={() => handleCharacterClick('dani')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-48 h-80 relative">
                <Image
                  src="/image/actividad_4/juego1/dani.png"
                  alt="Dani"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-blue-800 font-bold text-lg bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-200">
                Dani (Chico)
              </div>
            </motion.div>

            {/* Cris (Female) */}
            <motion.div
              className="text-center cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => handleCharacterClick('cris')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-48 h-80 relative">
                <Image
                  src="/image/actividad_4/juego1/cris.png"
                  alt="Cris"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-pink-500 text-xl font-bold bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-pink-200">
                Cris (Chica)
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}