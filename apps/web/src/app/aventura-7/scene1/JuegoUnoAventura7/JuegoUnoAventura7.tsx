'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { situations, titleAudio, subtitleAudio, yesButtonSound, noButtonSound, ThumbAnswer } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

enum GameState {
  INTRO,
  PLAYING,
  FEEDBACK,
  COMPLETED,
}

function ThumbButton({ type, onClick, disabled }: { type: ThumbAnswer; onClick: () => void; disabled: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isYes = type === 'yes';
  const base = isYes ? '/image/avanzado/aventura6/ok' : '/image/avanzado/aventura6/no';
  const src = hovered ? `${base}-hover.png` : `${base}.png`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col items-center gap-2 transition-all duration-200 ${disabled ? 'opacity-40 cursor-default' : 'hover:scale-110 cursor-pointer'}`}
    >
      <div className="relative w-28 h-28">
        <Image src={src} alt={isYes ? 'Sí' : 'No'} fill className="object-contain" unoptimized />
      </div>
      <span className={`text-lg font-bold ${isYes ? 'text-green-600' : 'text-red-600'}`}>
        {isYes ? '¡Sí!' : '¡No!'}
      </span>
    </button>
  );
}

export default function JuegoUnoAventura7({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<ThumbAnswer | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const playAudio = (src: string): Promise<void> => {
    return new Promise((resolve) => {
      stopAudio();
      const audio = new Audio(src);
      audio.volume = 0.8;
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  };

  const startSituation = (index: number) => {
    setSelectedAnswer(null);
    setCanContinue(false);
    setGameState(GameState.PLAYING);
    playAudio(situations[index].situationAudio);
  };

  useEffect(() => {
    if (isVisible) {
      setGameState(GameState.INTRO);
      setRoundIndex(0);
      setSelectedAnswer(null);
      setCanContinue(false);
      playAudio(titleAudio).then(() => playAudio(subtitleAudio));
    } else {
      stopAudio();
    }
  }, [isVisible]);

  const handleAnswer = async (answer: ThumbAnswer) => {
    if (gameState !== GameState.PLAYING) return;
    const situation = situations[roundIndex];
    const correct = answer === situation.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setCanContinue(false);
    setGameState(GameState.FEEDBACK);

    await playAudio(correct ? yesButtonSound : noButtonSound);
    await playAudio(correct ? situation.correctFeedbackAudio : situation.wrongFeedbackAudio);
    setCanContinue(true);
  };

  const handleNext = () => {
    const nextIndex = roundIndex + 1;
    if (nextIndex >= situations.length) {
      setGameState(GameState.COMPLETED);
    } else {
      setRoundIndex(nextIndex);
      startSituation(nextIndex);
    }
  };

  if (!isVisible) return null;

  const currentSituation = situations[roundIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="juego1-av7-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {gameState !== GameState.COMPLETED && (
          <motion.div
            className="relative bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 rounded-3xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden min-h-[700px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <button
              onClick={() => { stopAudio(); onClose(); }}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105 font-semibold"
            >
              Salir juego
            </button>

            {/* INTRO */}
            {gameState === GameState.INTRO && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[700px] gap-8">
                <EscucharInstruccionesButton
                  onPlayInstructions={() => playAudio(subtitleAudio)}
                  position="top-right"
                />
                <motion.h2
                  className="text-5xl font-bold text-violet-700 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Asertividad
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Escucha cada situación y pulsa el pulgar hacia arriba si está bien, o hacia abajo si está mal.
                </motion.p>
                <motion.button
                  onClick={() => { stopAudio(); setRoundIndex(0); startSituation(0); }}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  ¡Empezar!
                </motion.button>
              </div>
            )}

            {/* PLAYING */}
            {gameState === GameState.PLAYING && (
              <div className="flex flex-col p-6 gap-6 min-h-[700px]">
                {/* Progress bar */}
                <div className="flex items-center justify-center gap-2">
                  {situations.map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        i < roundIndex ? 'bg-violet-400 w-8'
                        : i === roundIndex ? 'bg-violet-600 w-12'
                        : 'bg-violet-200 w-8'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {roundIndex + 1} / {situations.length}
                  </span>
                </div>

                {/* Buttons row — top left */}
                <div className="flex justify-start gap-3">
                  <button
                    onClick={() => playAudio(currentSituation.situationAudio)}
                    className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold text-sm"
                  >
                    🔊 Escuchar situación
                  </button>
                  <button
                    onClick={() => playAudio(subtitleAudio)}
                    className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold text-sm"
                  >
                    🔊 Escuchar instrucciones
                  </button>
                </div>

                {/* Game area */}
                <div className="flex items-center justify-between gap-1 px-4 flex-1">
                  <ThumbButton type="no" onClick={() => handleAnswer('no')} disabled={false} />

                  <div className="relative rounded-2xl overflow-hidden" style={{ width: '450px', height: '360px' }}>
                    <Image
                      src={currentSituation.image}
                      alt="Situación"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  <ThumbButton type="yes" onClick={() => handleAnswer('yes')} disabled={false} />
                </div>

              </div>
            )}

            {/* FEEDBACK */}
            {gameState === GameState.FEEDBACK && selectedAnswer !== null && (
              <motion.div
                className="flex flex-col items-center justify-center p-8 min-h-[700px] gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`relative w-40 h-40 rounded-full p-4 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                >
                  <Image
                    src={isCorrect ? '/image/avanzado/aventura6/ok-hover.png' : '/image/avanzado/aventura6/no-hover.png'}
                    alt={isCorrect ? 'Correcto' : 'Incorrecto'}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </motion.div>

                {!canContinue && (
                  <motion.div
                    className="flex items-center gap-2 text-violet-500"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <span className="text-xl">🔊</span>
                    <span className="text-sm font-medium">Escuchando...</span>
                  </motion.div>
                )}

                {canContinue && (
                  <motion.button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {roundIndex + 1 >= situations.length ? '¡Terminar!' : 'Siguiente →'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        <CongratsOverlay
          isVisible={gameState === GameState.COMPLETED}
          title="¡Muy bien!"
          subtitle="Has completado el juego"
          bgColor="bg-violet-500/20"
          textColor="text-violet-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
