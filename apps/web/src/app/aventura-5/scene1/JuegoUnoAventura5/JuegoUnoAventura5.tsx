'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { scenes, emotions, instructionsAudio, EmotionConfig } from './config';
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

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function JuegoUnoAventura5({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [shuffledScenes, setShuffledScenes] = useState(scenes);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionConfig | null>(null);
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

  useEffect(() => {
    if (isVisible) {
      setGameState(GameState.INTRO);
      setShuffledScenes(shuffleArray(scenes));
      setRoundIndex(0);
      setSelectedEmotion(null);
      setCanContinue(false);
      playAudio(instructionsAudio);
    } else {
      stopAudio();
    }
  }, [isVisible]);

  const handlePlayInstructions = () => {
    playAudio(instructionsAudio);
  };

  const handleStartGame = () => {
    stopAudio();
    setGameState(GameState.PLAYING);
  };

  const handleSelectEmotion = async (emotion: EmotionConfig) => {
    if (gameState !== GameState.PLAYING) return;
    setSelectedEmotion(emotion);
    setCanContinue(false);
    setGameState(GameState.FEEDBACK);
    await playAudio(emotion.clickAudio);
    await playAudio(emotion.feedbackAudio);
    setCanContinue(true);
  };

  const handleNext = () => {
    const nextIndex = roundIndex + 1;
    if (nextIndex >= shuffledScenes.length) {
      setGameState(GameState.COMPLETED);
    } else {
      setRoundIndex(nextIndex);
      setSelectedEmotion(null);
      setCanContinue(false);
      setGameState(GameState.PLAYING);
    }
  };

  if (!isVisible) return null;

  const currentScene = shuffledScenes[roundIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="juego1-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {gameState !== GameState.COMPLETED && (
          <motion.div
            className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-3xl shadow-2xl w-full max-w-6xl mx-4 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={() => { stopAudio(); onClose(); }}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
            >
              Salir juego
            </button>

            {/* INTRO */}
            {gameState === GameState.INTRO && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[520px] gap-8">
                <EscucharInstruccionesButton
                  onPlayInstructions={handlePlayInstructions}
                  position="top-right"
                />
                <motion.h2
                  className="text-5xl font-bold text-purple-700 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ¿Cómo te sientes?
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Verás diferentes tipos de parejas. Elige la carita que mejor describe cómo te sientes al verlas.
                </motion.p>
                <motion.button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
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
            {gameState === GameState.PLAYING && currentScene && (
              <div className="flex flex-col items-center p-6 gap-5">
                {/* Header row */}
                <div className="flex items-center justify-between w-full px-2">
                  <span className="text-base font-semibold text-gray-500 bg-white/60 px-4 py-1.5 rounded-full">
                    {roundIndex + 1} / {shuffledScenes.length}
                  </span>
                  <EscucharInstruccionesButton
                    onPlayInstructions={handlePlayInstructions}
                    position="top-right"
                  />
                </div>

                {/* Couple image */}
                <motion.div
                  key={`scene-${currentScene.id}`}
                  className="relative w-full rounded-2xl overflow-hidden shadow-lg"
                  style={{ height: '490px' }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={currentScene.image}
                    alt="Pareja"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </motion.div>

                {/* Question */}
                <p className="text-lg font-semibold text-purple-700 text-center">
                  ¿Cómo te sientes al ver esta pareja?
                </p>

                {/* Emotions row */}
                <div className="flex items-center justify-center gap-4 w-full flex-wrap pb-2">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion.id}
                      onClick={() => handleSelectEmotion(emotion)}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/70 transition-all duration-200"
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="relative w-20 h-20">
                        <Image
                          src={emotion.image}
                          alt={emotion.label}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 text-center leading-tight w-20">
                        {emotion.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* FEEDBACK */}
            {gameState === GameState.FEEDBACK && selectedEmotion && (
              <motion.div
                className="flex flex-col items-center justify-center p-8 min-h-[520px] gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Selected emotion display */}
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                >
                  <div className="relative w-48 h-48">
                    <Image
                      src={selectedEmotion.image}
                      alt={selectedEmotion.label}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-purple-700">
                    {selectedEmotion.label}
                  </h3>
                </motion.div>

                {/* Audio playing indicator */}
                {!canContinue && (
                  <motion.div
                    className="flex items-center gap-2 text-purple-500"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <span className="text-xl">🔊</span>
                    <span className="text-sm font-medium">Escuchando...</span>
                  </motion.div>
                )}

                {/* Continue button */}
                {canContinue && (
                  <motion.button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {roundIndex + 1 >= shuffledScenes.length ? '¡Terminar!' : 'Siguiente →'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Congratulations */}
        <CongratsOverlay
          isVisible={gameState === GameState.COMPLETED}
          title="¡Muy bien!"
          subtitle="Has explorado diferentes tipos de parejas"
          bgColor="bg-purple-500/20"
          textColor="text-purple-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
