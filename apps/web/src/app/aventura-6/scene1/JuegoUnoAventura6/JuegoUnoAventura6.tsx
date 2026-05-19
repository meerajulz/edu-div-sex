'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { situations, titleAudio, subtitleAudio, yesButtonSound, noButtonSound } from './config';
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

interface ThumbButtonProps {
  type: 'yes' | 'no';
  onClick: () => void;
}

function ThumbButton({ type, onClick }: ThumbButtonProps) {
  const [hovered, setHovered] = useState(false);
  const normalSrc = type === 'yes' ? '/image/avanzado/aventura6/ok.png' : '/image/avanzado/aventura6/no.png';
  const hoverSrc = type === 'yes' ? '/image/avanzado/aventura6/ok-hover.png' : '/image/avanzado/aventura6/no-hover.png';

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      className="relative flex-shrink-0"
    >
      <div className="relative w-32 h-32">
        <Image
          src={hovered ? hoverSrc : normalSrc}
          alt={type === 'yes' ? 'Sí, está bien' : 'No está bien'}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
    </motion.button>
  );
}

export default function JuegoUnoAventura6({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
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

  const playIntroAudio = () => {
    playAudio(titleAudio).then(() => playAudio(subtitleAudio));
  };

  useEffect(() => {
    if (isVisible) {
      setGameState(GameState.INTRO);
      setRoundIndex(0);
      setSelectedAnswer(null);
      setCanContinue(false);
      playIntroAudio();
    } else {
      stopAudio();
    }
  }, [isVisible]);

  const handleStartGame = () => {
    stopAudio();
    setRoundIndex(0);
    setGameState(GameState.PLAYING);
    playAudio(situations[0].questionAudio);
  };

  const handlePlaySituationAudio = () => {
    playAudio(situations[roundIndex].questionAudio);
  };

  const handleAnswer = async (answer: 'yes' | 'no') => {
    if (gameState !== GameState.PLAYING) return;
    const situation = situations[roundIndex];
    const correct = answer === situation.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setCanContinue(false);
    setGameState(GameState.FEEDBACK);
    await playAudio(answer === 'yes' ? yesButtonSound : noButtonSound);
    await playAudio(correct ? situation.correctFeedbackAudio : situation.wrongFeedbackAudio);
    setCanContinue(true);
  };

  const handleNext = () => {
    const nextIndex = roundIndex + 1;
    if (nextIndex >= situations.length) {
      setGameState(GameState.COMPLETED);
    } else {
      setRoundIndex(nextIndex);
      setSelectedAnswer(null);
      setCanContinue(false);
      setGameState(GameState.PLAYING);
      playAudio(situations[nextIndex].questionAudio);
    }
  };

  if (!isVisible) return null;

  const currentSituation = situations[roundIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="juego1-av6-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {gameState !== GameState.COMPLETED && (
          <motion.div
            className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden"
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
              <div className="flex flex-col items-center justify-center p-12 min-h-[520px] gap-8">
                <EscucharInstruccionesButton
                  onPlayInstructions={playIntroAudio}
                  position="top-right"
                />
                <motion.h2
                  className="text-5xl font-bold text-rose-700 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Nos queremos y nos respetamos
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Verás situaciones de pareja. Indica si la acción está bien o mal usando el pulgar arriba o abajo.
                </motion.p>
                <motion.button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
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
            {gameState === GameState.PLAYING && currentSituation && (
              <div className="flex flex-col p-6 gap-4">
                {/* Progress bar */}
                <div className="flex items-center justify-center gap-2">
                  {situations.map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        i < roundIndex
                          ? 'bg-rose-400 w-8'
                          : i === roundIndex
                          ? 'bg-rose-600 w-12'
                          : 'bg-rose-200 w-8'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {roundIndex + 1} / {situations.length}
                  </span>
                </div>

                {/* Thumbs + image */}
                <div className="flex items-center justify-between gap-6 px-4">
                  <ThumbButton type="no" onClick={() => handleAnswer('no')} />

                  <motion.div
                    key={`situation-${currentSituation.id}`}
                    className="relative flex-1 rounded-2xl overflow-hidden shadow-lg"
                    style={{ height: '380px' }}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={currentSituation.image}
                      alt={`Situación ${currentSituation.id}`}
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </motion.div>

                  <ThumbButton type="yes" onClick={() => handleAnswer('yes')} />
                </div>

                {/* Replay situation audio */}
                <div className="flex justify-center">
                  <button
                    onClick={handlePlaySituationAudio}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold"
                  >
                    🔊 Escuchar situación
                  </button>
                </div>
              </div>
            )}

            {/* FEEDBACK */}
            {gameState === GameState.FEEDBACK && selectedAnswer !== null && (
              <motion.div
                className="flex flex-col items-center justify-center p-8 min-h-[520px] gap-8"
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
                    src={
                      selectedAnswer === 'yes'
                        ? '/image/avanzado/aventura6/ok-hover.png'
                        : '/image/avanzado/aventura6/no-hover.png'
                    }
                    alt={selectedAnswer === 'yes' ? 'Sí' : 'No'}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </motion.div>

                {!canContinue && (
                  <motion.div
                    className="flex items-center gap-2 text-rose-500"
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
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
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
          bgColor="bg-rose-500/20"
          textColor="text-rose-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
