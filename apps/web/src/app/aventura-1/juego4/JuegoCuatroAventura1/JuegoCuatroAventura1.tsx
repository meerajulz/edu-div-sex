'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  QUESTIONS, TITLE_AUDIO, SUBTITLE_AUDIO,
  CORRECT_SOUND, INCORRECT_SOUND, YES_SOUND, NO_SOUND,
  YES_IMAGE, NO_IMAGE,
} from './config';
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

export default function JuegoCuatroAventura1({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<'correct' | 'incorrect' | null>(null);
  const [scoreJustAdded, setScoreJustAdded] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const shuffledAnswers = useMemo(() =>
    QUESTIONS.map(q => {
      const pair = [
        { type: 'correct' as const, image: q.correct.image, audio: q.correct.audio },
        { type: 'incorrect' as const, image: q.incorrect.image, audio: q.incorrect.audio },
      ];
      return Math.random() > 0.5 ? pair : [pair[1], pair[0]];
    }), []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const playAudio = (src: string): Promise<void> =>
    new Promise(resolve => {
      stopAudio();
      const a = new Audio(src);
      a.volume = 0.8;
      audioRef.current = a;
      a.onended = () => resolve();
      a.onerror = () => resolve();
      a.play().catch(() => resolve());
    });

  const playIntroAudio = () => {
    playAudio(TITLE_AUDIO).then(() => playAudio(SUBTITLE_AUDIO));
  };

  useEffect(() => {
    if (isVisible) {
      setGameState(GameState.INTRO);
      setCurrentIndex(0);
      setScore(0);
      setSelected(null);
      setCanNext(false);
      setIsPlayingPreview(false);
      playIntroAudio();
    } else {
      stopAudio();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || gameState !== GameState.PLAYING) return;
    playAudio(QUESTIONS[currentIndex].audio);
  }, [isVisible, gameState, currentIndex]);

  if (!isVisible) return null;

  const handleStartGame = () => {
    stopAudio();
    setCurrentIndex(0);
    setSelected(null);
    setCanNext(false);
    setGameState(GameState.PLAYING);
  };

  const handlePreviewClick = async (audio: string) => {
    if (selected || isPlayingPreview) return;
    setIsPlayingPreview(true);
    await playAudio(audio);
    setIsPlayingPreview(false);
  };

  const handleSelectAnswer = async (type: 'correct' | 'incorrect') => {
    if (selected) return;
    stopAudio();
    setSelected(type);
    setCanNext(false);
    setGameState(GameState.FEEDBACK);

    const isCorrect = type === 'correct';
    const q = QUESTIONS[currentIndex];

    await playAudio(isCorrect ? YES_SOUND : NO_SOUND);
    await playAudio(isCorrect ? q.correct.audio : q.incorrect.audio);
    await playAudio(isCorrect ? CORRECT_SOUND : INCORRECT_SOUND);

    if (isCorrect) {
      setScore(s => s + 1);
      setScoreJustAdded(true);
      setTimeout(() => setScoreJustAdded(false), 800);
    }
    setCanNext(true);
  };

  const handleNext = () => {
    if (!canNext) return;
    stopAudio();
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setCanNext(false);
      setIsPlayingPreview(false);
      setGameState(GameState.PLAYING);
    } else {
      setGameState(GameState.COMPLETED);
    }
  };

  const q = QUESTIONS[currentIndex];
  const answers = shuffledAnswers[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="juego4-av1-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {gameState !== GameState.COMPLETED && (
          <motion.div
            className="relative bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Exit button */}
            <button
              onClick={() => { stopAudio(); onClose(); }}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105 font-semibold"
            >
              Salir juego
            </button>

            {/* Basketball scoreboard */}
            {(gameState === GameState.PLAYING || gameState === GameState.FEEDBACK) && (
              <motion.div
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1 select-none"
                animate={scoreJustAdded ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, type: 'spring' }}
              >
                <div className="text-4xl">🏀</div>
                <motion.div
                  className="bg-orange-500 text-white font-black text-3xl w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-orange-300"
                  animate={scoreJustAdded ? { backgroundColor: ['#f97316', '#facc15', '#f97316'] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {score}
                </motion.div>
                <div className="text-gray-600 font-bold text-sm">de {QUESTIONS.length}</div>
                <div className="flex flex-col gap-1 mt-1">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full border-2 border-orange-300 transition-colors duration-300 ${i < score ? 'bg-yellow-400' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* INTRO */}
            {gameState === GameState.INTRO && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[520px] gap-8">
                <EscucharInstruccionesButton
                  onPlayInstructions={playIntroAudio}
                  position="top-right"
                />
                <motion.h2
                  className="text-5xl font-bold text-purple-700 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  🏆 ¡Concurso!
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Responde a las preguntas. Por cada respuesta correcta ganas un punto.
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
                  ¡Jugar!
                </motion.button>
              </div>
            )}

            {/* PLAYING */}
            {gameState === GameState.PLAYING && (
              <div className="flex flex-col items-center p-8 pl-28 min-h-[520px] gap-6">
                {/* Progress */}
                <div className="flex items-center gap-2">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        i < currentIndex ? 'bg-purple-400 w-8' : i === currentIndex ? 'bg-purple-600 w-12' : 'bg-purple-200 w-8'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {currentIndex + 1} / {QUESTIONS.length}
                  </span>
                </div>

                {/* Question image */}
                <motion.div
                  key={`q-${currentIndex}`}
                  className="relative w-full max-w-xs h-40"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Image src={q.image} fill alt={`Pregunta ${currentIndex + 1}`} className="object-contain drop-shadow-lg" unoptimized />
                </motion.div>

                {/* Answer cards — tap to hear */}
                <div className="flex gap-8 justify-center w-full">
                  {answers.map((answer, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3">
                      <motion.div
                        className="relative w-48 h-36 rounded-2xl overflow-hidden shadow-xl border-4 border-white/60 cursor-pointer hover:border-yellow-300 transition-all duration-200"
                        onClick={() => handlePreviewClick(answer.audio)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Image src={answer.image} fill alt={`Respuesta ${idx + 1}`} className="object-cover" unoptimized />
                      </motion.div>

                      {/* YES button to commit answer */}
                      <motion.button
                        onClick={() => handleSelectAnswer(answer.type)}
                        className="relative w-16 h-16"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Image src={YES_IMAGE} fill alt="Elegir" className="object-contain" unoptimized />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEEDBACK */}
            {gameState === GameState.FEEDBACK && (
              <motion.div
                className="flex flex-col items-center justify-center p-8 pl-28 min-h-[520px] gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="flex items-center gap-2">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        i < currentIndex ? 'bg-purple-400 w-8' : i === currentIndex ? 'bg-purple-600 w-12' : 'bg-purple-200 w-8'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {currentIndex + 1} / {QUESTIONS.length}
                  </span>
                </div>

                {/* Answer cards with YES/NO feedback */}
                <div className="flex gap-8 justify-center w-full">
                  {answers.map((answer, idx) => {
                    const isCorrect = answer.type === 'correct';
                    const borderColor = isCorrect ? 'border-green-400' : 'border-red-400';
                    return (
                      <div key={idx} className="flex flex-col items-center gap-3">
                        <div className={`relative w-48 h-36 rounded-2xl overflow-hidden shadow-xl border-4 ${borderColor} transition-all duration-300`}>
                          <Image src={answer.image} fill alt={`Respuesta ${idx + 1}`} className="object-cover" unoptimized />
                          <div className={`absolute inset-0 ${isCorrect ? 'bg-green-400/20' : 'bg-red-400/20'}`} />
                        </div>

                        {/* YES on correct, NO on incorrect */}
                        <motion.div
                          className="relative w-16 h-16"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', damping: 12 }}
                        >
                          <Image
                            src={isCorrect ? YES_IMAGE : NO_IMAGE}
                            fill alt=""
                            className="object-contain"
                            unoptimized
                          />
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                {/* Listening indicator / Next button */}
                {!canNext ? (
                  <motion.div
                    className="flex items-center gap-2 text-purple-500"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <span className="text-xl">🔊</span>
                    <span className="text-sm font-medium">Escuchando...</span>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {currentIndex + 1 >= QUESTIONS.length ? '¡Terminar!' : 'Siguiente →'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        <CongratsOverlay
          isVisible={gameState === GameState.COMPLETED}
          title="¡Muy bien!"
          subtitle={`Has conseguido ${score} de ${QUESTIONS.length} puntos`}
          bgColor="bg-purple-500/20"
          textColor="text-purple-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
