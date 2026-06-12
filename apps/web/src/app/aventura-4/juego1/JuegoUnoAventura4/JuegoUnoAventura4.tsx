'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  SITUATIONS, OPTION_ORDER, OPTION_IMGS,
  TITLE_AUDIO, YES_SOUND, NO_SOUND,
  NOA_GIF, ALEX_FACES, YES_IMG, NO_IMG,
  Emotion,
} from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

type Phase = 'intro' | 'reading' | 'choosing' | 'feedback' | 'completed';

export default function JuegoUnoAventura4({ isVisible, onClose, onGameComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [situationIndex, setSituationIndex] = useState(0);
  const [selected, setSelected] = useState<Emotion | null>(null);
  const [canNext, setCanNext] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null; }
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

  const playIntroAudio = () => { playAudio(TITLE_AUDIO); };

  useEffect(() => {
    if (isVisible) {
      setPhase('intro');
      setSituationIndex(0);
      setSelected(null);
      setCanNext(false);
      playIntroAudio();
    } else {
      stopAudio();
    }
  }, [isVisible]);

  // Auto-play sentence audio when reading phase starts
  useEffect(() => {
    if (!isVisible || phase !== 'reading') return;
    const sit = SITUATIONS[situationIndex];
    playAudio(sit.sentenceAudio).then(() => {
      // After sentence → show Alex face + options
      setPhase('choosing');
    });
  }, [isVisible, phase, situationIndex]);

  if (!isVisible) return null;

  const sit = SITUATIONS[situationIndex];

  const handleStart = () => {
    stopAudio();
    setPhase('reading');
  };

  const handleOptionClick = async (emotion: Emotion) => {
    if (phase !== 'choosing' || selected) return;
    setSelected(emotion);
    setCanNext(false);
    setPhase('feedback');

    const isCorrect = emotion === sit.correctOption;
    await playAudio(isCorrect ? YES_SOUND : NO_SOUND);
    await playAudio(sit.feedbackAudio[emotion]);
    setCanNext(true);
  };

  const handleNext = () => {
    if (!canNext) return;
    stopAudio();
    const next = situationIndex + 1;
    if (next >= SITUATIONS.length) {
      setPhase('completed');
    } else {
      setSituationIndex(next);
      setSelected(null);
      setCanNext(false);
      setPhase('reading');
    }
  };

  const isCorrectAnswer = selected === sit.correctOption;

  return (
    <AnimatePresence>
      <motion.div
        key="juego1-av4"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {phase !== 'completed' && (
          <motion.div
            className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden flex flex-col"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{ height: '85vh' }}
          >
            {/* Exit */}
            <button
              onClick={() => { stopAudio(); onClose(); }}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-105 font-semibold"
            >
              Salir juego
            </button>

            {/* Listen instructions — aligned top-left, same row as Salir juego */}
            {(phase === 'reading' || phase === 'choosing' || phase === 'feedback') && (
              <EscucharInstruccionesButton
                onPlayInstructions={playIntroAudio}
                position="top-left"
              />
            )}

            {/* INTRO */}
            {phase === 'intro' && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[540px] gap-8">
                <EscucharInstruccionesButton onPlayInstructions={playIntroAudio} position="top-right" />
                <motion.h2
                  className="text-4xl font-bold text-orange-700 text-center"
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                >
                  ¿Qué dicen mi cara y mi tono de voz?
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                >
                  Mira la cara y clica en el tono y los gestos correctos: Sonriente, triste y enfadado.
                </motion.p>
                <motion.button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                >
                  ¡Jugar!
                </motion.button>
              </div>
            )}

            {/* READING / CHOOSING / FEEDBACK */}
            {(phase === 'reading' || phase === 'choosing' || phase === 'feedback') && (
              <motion.div
                key={`sit-${situationIndex}`}
                className="flex items-stretch flex-1 min-h-0"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* LEFT — Noa or Alex face */}
                <div className="flex flex-col items-center justify-center w-1/2 h-full p-4 pt-14 gap-3 border-r border-orange-100">
                  {/* Progress */}
                  <div className="flex items-center gap-2 self-start">
                    {SITUATIONS.map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${i < situationIndex ? 'bg-orange-400 border-orange-400' : i === situationIndex ? 'bg-orange-600 border-orange-600' : 'bg-gray-200 border-gray-300'}`} />
                    ))}
                    <span className="text-sm font-semibold text-gray-500 ml-1">
                      {situationIndex + 1} / {SITUATIONS.length}
                    </span>
                  </div>

                  {/* Character image */}
                  <AnimatePresence mode="wait">
                    {phase === 'reading' ? (
                      <motion.div
                        key="noa"
                        className="relative w-72 h-80"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Image src={NOA_GIF} fill alt="Noa" className="object-contain" unoptimized />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="alex"
                        className="relative w-72 h-80"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      >
                        <Image src={ALEX_FACES[sit.alexEmotion]} fill alt="Alex" className="object-contain" unoptimized />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sentence text */}
                  <div className="bg-white/80 rounded-2xl px-4 py-2 shadow text-center text-gray-600 text-sm font-medium max-w-sm">
                    {sit.sentence}
                  </div>

                  {/* Reading indicator */}
                  {phase === 'reading' && (
                    <div className="flex items-center gap-2 text-orange-500 animate-pulse text-sm font-medium">
                      <span>🔊</span><span>Escuchando...</span>
                    </div>
                  )}

                  {/* Feedback result */}
                  {phase === 'feedback' && selected && (
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={isCorrectAnswer ? YES_IMG : NO_IMG}
                          fill alt=""
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <p className={`text-sm font-semibold ${isCorrectAnswer ? 'text-green-700' : 'text-red-600'}`}>
                        {sit.feedbackText[selected]}
                      </p>
                    </motion.div>
                  )}

                  {/* Listening indicator in feedback */}
                  {phase === 'feedback' && !canNext && (
                    <div className="flex items-center gap-2 text-orange-500 animate-pulse text-sm font-medium">
                      <span>🔊</span><span>Escuchando...</span>
                    </div>
                  )}

                  {/* Next button */}
                  {phase === 'feedback' && canNext && (
                    <motion.button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-8 rounded-full shadow-lg"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      {situationIndex + 1 >= SITUATIONS.length ? '¡Terminar!' : 'Siguiente →'}
                    </motion.button>
                  )}
                </div>

                {/* RIGHT — 3 option buttons (top to bottom) */}
                <div className="flex flex-col items-center justify-end w-1/2 h-full p-4 pb-8 gap-4">
                  <p className="text-orange-700 font-bold text-base text-center">
                    ¿Qué tono y gestos debería usar Alex?
                  </p>

                  <div className="flex flex-col gap-4 w-full max-w-sm">
                    {OPTION_ORDER.map(emotion => {
                      const imgs = OPTION_IMGS[emotion];
                      const isSelected = selected === emotion;
                      const isCorrect = emotion === sit.correctOption;
                      let src = imgs.neutral;
                      if (phase === 'feedback' && isSelected) {
                        src = isCorrect ? imgs.acierto : imgs.error;
                      }
                      const clickable = phase === 'choosing' && !selected;

                      return (
                        <motion.button
                          key={emotion}
                          onClick={() => handleOptionClick(emotion)}
                          disabled={!clickable}
                          className={`relative w-full h-36 rounded-2xl overflow-hidden shadow-lg transition-all ${clickable ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'cursor-default'} ${phase === 'feedback' && isSelected && isCorrect ? 'ring-4 ring-green-400' : ''} ${phase === 'feedback' && isSelected && !isCorrect ? 'ring-4 ring-red-400' : ''}`}
                          whileTap={clickable ? { scale: 0.96 } : {}}
                        >
                          <Image src={src} fill alt={emotion} className="object-contain" unoptimized />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        <CongratsOverlay
          isVisible={phase === 'completed'}
          title="¡Muy bien!"
          subtitle="Has completado el juego"
          bgColor="bg-orange-500/20"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
