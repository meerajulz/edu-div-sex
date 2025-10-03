'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import CharacterSelection from './CharacterSelection';
import GameContent from './GameContent';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { playGameAudio, createGameAudio } from '../../../utils/gameAudio';

interface JuegoUnoActividad4Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export type Character = 'dani' | 'cris' | null;
export type GameState = 'intro' | 'character-selection' | 'game' | 'completed';

export default function JuegoUnoActividad4({ isVisible, onClose, onGameComplete }: JuegoUnoActividad4Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameState, setGameState] = useState<GameState>('intro');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play intro audio when modal opens
  useEffect(() => {
    if (isVisible && gameState === 'intro') {
      const timer = setTimeout(() => {
        try {
          const audio = createGameAudio('/audio/actividad-4/juego1/t.mp3', 0.7, 'Juego Uno Intro');
          audio.id = 'intro-audio'; // Add ID for reference in CharacterSelection
          setCurrentAudio(audio);
          audioRef.current = audio;
          setIsAudioPlaying(true);

          audio.play().then(() => {
            // After audio finishes, move to character selection
            audio.addEventListener('ended', () => {
              setIsAudioPlaying(false);
              setTimeout(() => {
                setGameState('character-selection');
                setCurrentAudio(null);
                audioRef.current = null;
              }, 500);
            });
          }).catch(error => {
            console.warn('Could not play intro sound:', error);
            setIsAudioPlaying(false);
            // Fallback: move to character selection after delay
            setTimeout(() => {
              setGameState('character-selection');
            }, 2000);
          });
        } catch (error) {
          console.warn('Could not play intro sound:', error);
          setIsAudioPlaying(false);
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
      setIsAudioPlaying(false);
    }
  }, [isVisible]);

  // Cleanup audio when modal closes
  useEffect(() => {
    if (!isVisible && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      audioRef.current = null;
      setIsAudioPlaying(false);
    }
  }, [isVisible, currentAudio]);

  const playBrightSound = () => {
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Juego Uno Button Sound');
  };

  const handleCharacterSelect = (character: Character) => {
    if (isAnimating || isAudioPlaying) return;
    
    setIsAnimating(true);
    playBrightSound();
    setSelectedCharacter(character);
    
    setTimeout(() => {
      setGameState('game');
      setIsAnimating(false);
    }, 800);
  };

  const handleListenInstructions = () => {
    // Play the intro audio
    try {
      const audio = createGameAudio('/audio/actividad-4/juego1/t.mp3', 0.7, 'Juego Uno Instructions');
      audio.play();
    } catch (error) {
      console.warn('Could not play instructions audio:', error);
    }
  };

  const handleSalirJuego = () => {
    if (isAnimating) return;

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      audioRef.current = null;
    }
    
    setIsAnimating(true);
    playBrightSound();

    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  // Handle game completion from GameContent
  const handleGameContentComplete = () => {
    // Transition to completed state to show CongratsOverlay
    setGameState('completed');
  };

  // Handle final game completion
  const handleFinalGameComplete = () => {
    setIsAnimating(true);
    playBrightSound();
    
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
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSalirJuego}
          />

          {/* Modal - 70% of screen */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
              {/* Listen Instructions Button */}
              <EscucharInstruccionesButton
                onPlayInstructions={handleListenInstructions}
                position="side-by-side"
              />

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
                    <div className="text-lg flex items-center justify-center">
                      <span>Escuchando instrucciones</span>
                      {isAudioPlaying && (
                        <div className="flex space-x-1 ml-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Character Selection State */}
                {gameState === 'character-selection' && (
                  <>
                    {/* Character selection title */}
                    <motion.div
                      className="absolute top-10 left-0 right-0 mx-auto w-fit text-xl font-bold bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 text-blue-800 shadow-md"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Elige tu personaje
                    </motion.div>

                    <CharacterSelection
                      onCharacterSelect={handleCharacterSelect}
                      isAnimating={isAnimating}
                    />
                  </>
                )}

                {/* Game State */}
                {gameState === 'game' && selectedCharacter && (
                  <GameContent 
                    selectedCharacter={selectedCharacter}
                    onGameComplete={handleGameContentComplete}
                   // onClose={onClose}
                  />
                )}

                {/* Congratulations Overlay */}
                <CongratsOverlay
                  isVisible={gameState === 'completed'}
                  title="¡Excelente!"
                  subtitle="Has completado la actividad de higiene personal"
                  emoji="🧼"
                  bgColor="bg-blue-500/20"
                  textColor="text-blue-900"
                  onComplete={handleFinalGameComplete}
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