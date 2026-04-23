'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { questions, introAudio, OptionConfig } from './config';
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

export default function JuegoDosAventura5({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionConfig | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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
      setQuestionIndex(0);
      setOptionsVisible(false);
      setSelectedOption(null);
      setIsCorrect(null);
      setCanContinue(false);
      playAudio(introAudio);
    } else {
      stopAudio();
    }
  }, [isVisible]);

  const startQuestion = async (index: number) => {
    setOptionsVisible(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setCanContinue(false);
    setQuestionIndex(index);
    setGameState(GameState.PLAYING);
    await playAudio(questions[index].situationAudio);
    setOptionsVisible(true);
  };

  const handleStartGame = () => {
    stopAudio();
    startQuestion(0);
  };

  const handlePlayInstructions = () => {
    playAudio(introAudio);
  };

  const handlePlayOptionAudio = (option: OptionConfig) => {
    if (!optionsVisible || gameState !== GameState.PLAYING) return;
    playAudio(option.audio);
  };

  const handleSelectOption = async (option: OptionConfig) => {
    if (!optionsVisible || gameState !== GameState.PLAYING) return;
    stopAudio();
    setSelectedOption(option);
    setIsCorrect(option.isCorrect);
    setCanContinue(false);
    setGameState(GameState.FEEDBACK);
    await playAudio(option.feedbackAudio);
    setCanContinue(true);
  };

  const handleNext = () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex >= questions.length) {
      setGameState(GameState.COMPLETED);
    } else {
      startQuestion(nextIndex);
    }
  };

  if (!isVisible) return null;

  const currentQuestion = questions[questionIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="juego2-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {gameState !== GameState.COMPLETED && (
          <motion.div
            className="relative bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 rounded-3xl shadow-2xl w-full max-w-6xl mx-4 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Salir button */}
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
                  className="text-5xl font-bold text-orange-600 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ¿Qué harías?
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Verás situaciones sobre diversidad sexual. Elige la respuesta que muestra respeto y aceptación.
                </motion.p>
                <motion.button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
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
            {gameState === GameState.PLAYING && currentQuestion && (
              <div className="flex flex-col p-6 gap-4">
                {/* Header */}
                <div className="flex items-center justify-between w-full px-2">
                  <span className="text-base font-semibold text-gray-500 bg-white/60 px-4 py-1.5 rounded-full">
                    {questionIndex + 1} / {questions.length}
                  </span>
                  <EscucharInstruccionesButton
                    onPlayInstructions={handlePlayInstructions}
                    position="top-right"
                  />
                </div>

                {/* 3-column: left option | situation | right option */}
                <div className="flex items-center gap-4 w-full">
                  {/* Left option */}
                  <AnimatePresence>
                    {optionsVisible ? (
                      <motion.div
                        className="flex flex-col items-center gap-3 w-[22%] shrink-0"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.button
                          onClick={() => handlePlayOptionAudio(currentQuestion.options[0])}
                          className="relative w-full"
                          style={{ height: '180px' }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          <Image
                            src={currentQuestion.options[0].image}
                            alt="Opción 1"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </motion.button>
                        <motion.button
                          onClick={() => handleSelectOption(currentQuestion.options[0])}
                          className="relative w-20 h-20"
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Image
                            src={currentQuestion.options[0].isCorrect
                              ? '/image/avanzado/positivo.png'
                              : '/image/avanzado/negativo.png'}
                            alt={currentQuestion.options[0].isCorrect ? 'Sí' : 'No'}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </motion.button>
                      </motion.div>
                    ) : <div className="w-[22%] shrink-0" />}
                  </AnimatePresence>

                  {/* Center: situation image */}
                  <motion.div
                    key={`situation-${currentQuestion.id}`}
                    className="relative flex-1"
                    style={{ height: '460px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={currentQuestion.situationImage}
                      alt={`Situación ${currentQuestion.id}`}
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                    />
                    {!optionsVisible && (
                      <motion.div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-orange-500 bg-white/70 px-4 py-2 rounded-full"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        <span className="text-lg">🔊</span>
                        <span className="text-sm font-medium">Escucha la situación...</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Right option */}
                  <AnimatePresence>
                    {optionsVisible ? (
                      <motion.div
                        className="flex flex-col items-center gap-3 w-[22%] shrink-0"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.button
                          onClick={() => handlePlayOptionAudio(currentQuestion.options[1])}
                          className="relative w-full"
                          style={{ height: '180px' }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          <Image
                            src={currentQuestion.options[1].image}
                            alt="Opción 2"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </motion.button>
                        <motion.button
                          onClick={() => handleSelectOption(currentQuestion.options[1])}
                          className="relative w-20 h-20"
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Image
                            src={currentQuestion.options[1].isCorrect
                              ? '/image/avanzado/positivo.png'
                              : '/image/avanzado/negativo.png'}
                            alt={currentQuestion.options[1].isCorrect ? 'Sí' : 'No'}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </motion.button>
                      </motion.div>
                    ) : <div className="w-[22%] shrink-0" />}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* FEEDBACK */}
            {gameState === GameState.FEEDBACK && selectedOption && (
              <motion.div
                className="flex flex-col items-center justify-center p-8 min-h-[520px] gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Correct / Incorrect indicator */}
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                >
                  <span className="text-6xl">{isCorrect ? '✅' : '❌'}</span>
                  <h3 className={`text-3xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? '¡Correcto!' : '¡Inténtalo de nuevo!'}
                  </h3>
                  {/* Selected option image */}
                  <div className="relative w-64 h-40">
                    <Image
                      src={selectedOption.image}
                      alt="Opción seleccionada"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </motion.div>

                {/* Audio indicator */}
                {!canContinue && (
                  <motion.div
                    className="flex items-center gap-2 text-orange-500"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <span className="text-xl">🔊</span>
                    <span className="text-sm font-medium">Escuchando...</span>
                  </motion.div>
                )}

                {/* Next button */}
                {canContinue && (
                  <motion.button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {questionIndex + 1 >= questions.length ? '¡Terminar!' : 'Siguiente →'}
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
          subtitle="Has aprendido sobre respeto y aceptación"
          bgColor="bg-orange-500/20"
          textColor="text-orange-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
