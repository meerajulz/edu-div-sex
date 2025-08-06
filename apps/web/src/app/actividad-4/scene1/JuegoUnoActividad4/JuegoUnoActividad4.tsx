'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import CharacterSelection from './CharacterSelection';
import GameContent from './GameContent';

interface JuegoUnoActividad4Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export type Character = 'dani' | 'cris' | null;
export type GameState = 'intro' | 'character-selection' | 'game';

export default function JuegoUnoActividad4({ isVisible, onClose, onGameComplete }: JuegoUnoActividad4Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameState, setGameState] = useState<GameState>('intro');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Play intro audio when modal opens
  useEffect(() => {
    if (isVisible && gameState === 'intro') {
      const timer = setTimeout(() => {
        try {
          const audio = new Audio('/audio/actividad-4/juego1/t.mp3');
          audio.volume = 0.7;
          setCurrentAudio(audio); // Store reference to current audio
          
          audio.play().then(() => {
            // After audio finishes, move to character selection
            setTimeout(() => {
              setGameState('character-selection');
              setCurrentAudio(null); // Clear audio reference
            }, 3000); // Adjust timing based on audio length
          }).catch(console.warn);
        } catch (error) {
          console.warn('Could not play intro sound:', error);
          // Fallback: move to character selection after delay
          setTimeout(() => {
            setGameState('character-selection');
          }, 2000);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, gameState]);

  // Reset state when modal opens
  useEffect(() => {
    if (isVisible) {
      setGameState('intro');
      setSelectedCharacter(null);
    }
  }, [isVisible]);

  // Cleanup audio when modal closes
  useEffect(() => {
    if (!isVisible && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  }, [isVisible, currentAudio]);

  const playBrightSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleCharacterSelect = (character: Character) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    playBrightSound();
    setSelectedCharacter(character);
    
    setTimeout(() => {
      setGameState('game');
      setIsAnimating(false);
    }, 800);
  };

  const handleSalirJuego = () => {
    if (isAnimating) return;
    
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    setIsAnimating(true);
    playBrightSound();

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
            className="fixed inset-0  z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSalirJuego}
          />

          {/* Modal - 70% of screen */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div 
              className="relative w-[80vw] h-[80vh] rounded-xl shadow-2xl overflow-hidden"
              style={{
                backgroundImage: 'url(/image/actividad_4/juego1/fondo.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Close Button */}
              <motion.button
                onClick={handleSalirJuego}
                className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                Salir Juego
              </motion.button>

              {/* Game Content */}
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Intro State */}
                {gameState === 'intro' && (
                  <motion.div
                    className="text-center text-blue-800 font-bold bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-2xl font-bold mb-4">
                      🧼 Ayuda a Cris o Dani en su higiene
                    </div>
                    <div className="text-lg">
                      Escuchando instrucciones...
                    </div>
                  </motion.div>
                )}

                {/* Character Selection State */}
                {gameState === 'character-selection' && (
                  <CharacterSelection 
                    onCharacterSelect={handleCharacterSelect}
                    isAnimating={isAnimating}
                  />
                )}

                {/* Game State */}
                {gameState === 'game' && selectedCharacter && (
                  <GameContent 
                    selectedCharacter={selectedCharacter}
                    onGameComplete={onGameComplete}
                    onClose={onClose}
                  />
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}