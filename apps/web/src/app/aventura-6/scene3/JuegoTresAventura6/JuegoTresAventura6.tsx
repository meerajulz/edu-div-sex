'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { questions, alexImages, crisImages, OptionId } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

enum GameState {
  INTRO,
  REVEALING,
  SELECTING,
  FEEDBACK,
  COMPLETED,
}

const TITLE_AUDIO = '/audio/advance--aventura-6/juego3/title.mp3';
const SUBTITLE_AUDIO = '/audio/advance--aventura-6/juego3/subtitle.mp3';

export default function JuegoTresAventura6({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [roundIndex, setRoundIndex] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<OptionId | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [characterPairs, setCharacterPairs] = useState<Array<{ alex: string; cris: string }>>([]);
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
      setRoundIndex(0);
      setRevealedCount(0);
      setSelectedOption(null);
      setCanContinue(false);
      setCharacterPairs(
        questions.map(() => ({
          alex: alexImages[Math.floor(Math.random() * alexImages.length)],
          cris: crisImages[Math.floor(Math.random() * crisImages.length)],
        }))
      );
      playAudio(TITLE_AUDIO).then(() => playAudio(SUBTITLE_AUDIO));
    } else {
      stopAudio();
    }
  }, [isVisible]);

  const startQuestion = async (qIndex: number) => {
    setRevealedCount(0);
    setSelectedOption(null);
    setCanContinue(false);
    setGameState(GameState.REVEALING);
    const q = questions[qIndex];
    await playAudio(q.questionAudio);
    setRevealedCount(1);
    await playAudio(q.options[0].audio);
    setRevealedCount(2);
    await playAudio(q.options[1].audio);
    setRevealedCount(3);
    await playAudio(q.options[2].audio);
    setGameState(GameState.SELECTING);
  };

  const handleStartGame = () => {
    stopAudio();
    setRoundIndex(0);
    startQuestion(0);
  };

  const handleSelectOption = async (optionId: OptionId) => {
    if (gameState !== GameState.SELECTING) return;
    const question = questions[roundIndex];
    const option = question.options.find(o => o.id === optionId)!;
    const correct = optionId === question.correctAnswer;
    setSelectedOption(optionId);
    setIsCorrect(correct);
    setCanContinue(false);
    setGameState(GameState.FEEDBACK);
    await playAudio(option.audio);
    await playAudio(correct ? '/audio/YES.mp3' : '/audio/NO.mp3');
    await playAudio(correct ? question.correctFeedbackAudio : question.wrongFeedbackAudio);
    setCanContinue(true);
  };

  const handleNext = () => {
    const nextIndex = roundIndex + 1;
    if (nextIndex >= questions.length) {
      setGameState(GameState.COMPLETED);
    } else {
      setRoundIndex(nextIndex);
      startQuestion(nextIndex);
    }
  };

  if (!isVisible) return null;

  const currentQuestion = questions[roundIndex];
  const currentPair = characterPairs[roundIndex] ?? { alex: alexImages[0], cris: crisImages[0] };
  const isPlaying = gameState === GameState.REVEALING || gameState === GameState.SELECTING;

  return (
    <AnimatePresence>
      <motion.div
        key="juego3-av6-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {gameState !== GameState.COMPLETED && (
          <motion.div
            className="relative bg-gradient-to-br from-indigo-100 via-violet-50 to-purple-100 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden min-h-[700px]"
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
                  onPlayInstructions={() => playAudio(SUBTITLE_AUDIO)}
                  position="top-right"
                />
                <motion.h2
                  className="text-5xl font-bold text-indigo-700 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ¿Cómo cortar con tu pareja?
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Escucha cada pregunta y elige la respuesta correcta entre las tres opciones.
                </motion.p>
                <motion.button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
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

            {/* REVEALING / SELECTING */}
            {isPlaying && (
              <div className="flex flex-col p-5 gap-3 min-h-[700px]">
                {/* Progress bar */}
                <div className="flex items-center justify-center gap-2">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        i < roundIndex ? 'bg-indigo-400 w-8'
                        : i === roundIndex ? 'bg-indigo-600 w-12'
                        : 'bg-indigo-200 w-8'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {roundIndex + 1} / {questions.length}
                  </span>
                </div>

                {/* Options */}
                <div className="flex items-stretch justify-center gap-4 px-2">
                  {currentQuestion.options.map((option, i) => {
                    const revealed = revealedCount > i;
                    const canClick = gameState === GameState.SELECTING;
                    return (
                      <motion.div
                        key={option.id}
                        className="relative flex flex-col items-center rounded-2xl overflow-hidden shadow-lg flex-1 max-w-[320px]"
                        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Image area — click to replay audio */}
                        <div
                          onClick={() => canClick && playAudio(option.audio)}
                          className={`relative w-full bg-white ${canClick ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}`}
                          style={{ height: '220px' }}
                        >
                          <Image
                            src={option.image}
                            alt={`Opción ${option.id}`}
                            fill
                            className="object-contain p-2"
                            style={{ objectPosition: 'center' }}
                            unoptimized
                          />
                        </div>
                        {/* Letter button — click to submit answer */}
                        <button
                          onClick={() => handleSelectOption(option.id)}
                          disabled={!canClick}
                          className={`w-full py-2 font-bold text-xl text-center transition-all duration-200 ${
                            canClick
                              ? 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white cursor-pointer'
                              : 'bg-indigo-300 text-white cursor-default'
                          }`}
                        >
                          {option.id}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Replay subtitle */}
                <div className="flex justify-center mt-1">
                  <button
                    onClick={() => playAudio(SUBTITLE_AUDIO)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold"
                  >
                    🔊 Escuchar instrucciones
                  </button>
                </div>

                {/* Characters touching the bottom */}
                <div className="flex items-end justify-center gap-3 mt-auto -mx-5 -mb-5">
                  <motion.div
                    className="relative flex-shrink-0"
                    style={{ width: '291px', height: '255px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={currentPair.alex}
                      alt="Alex"
                      fill
                      className="object-contain object-bottom"
                      unoptimized
                    />
                  </motion.div>
                  <motion.div
                    className="relative flex-shrink-0"
                    style={{ width: '291px', height: '255px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Image
                      src={currentPair.cris}
                      alt="Cris"
                      fill
                      className="object-contain object-bottom"
                      unoptimized
                    />
                  </motion.div>
                </div>
              </div>
            )}

            {/* FEEDBACK */}
            {gameState === GameState.FEEDBACK && selectedOption !== null && (
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
                    src={isCorrect ? '/image/avanzado/aventura6/ok-hover.png' : '/image/avanzado/aventura6/no-hover.png'}
                    alt={isCorrect ? 'Correcto' : 'Incorrecto'}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </motion.div>

                {!canContinue && (
                  <motion.div
                    className="flex items-center gap-2 text-indigo-500"
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
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {roundIndex + 1 >= questions.length ? '¡Terminar!' : 'Siguiente →'}
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
          bgColor="bg-indigo-500/20"
          textColor="text-indigo-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
