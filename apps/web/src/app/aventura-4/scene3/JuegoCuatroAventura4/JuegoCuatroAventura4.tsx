'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

const IMG = '/image/avanzado/aventura4/juego4';
const AUD = '/audio/advance-actividad-4/juego4';

const ROUNDS = [
  {
    image: `${IMG}/foto1.png`,
    audio: `${AUD}/q1.mp3`,
    feedbackAudio: `${AUD}/fb-1yes.mp3`,
    correctAnswer: 'yes' as const,
    feedbackCorrect:   '¡Muy bien! Está bien preguntarle a la persona que nos gusta si quiere ser nuestra pareja.',
    feedbackIncorrect: 'No, la otra persona no puede saber que te gusta si no se lo dices directamente.',
  },
  {
    image: `${IMG}/foto2.png`,
    audio: `${AUD}/q2.mp3`,
    feedbackAudio: `${AUD}/fb2-no.mp3`,
    correctAnswer: 'no' as const,
    feedbackCorrect:   '¡Muy bien! No podemos coger la mano de alguien esperando que entienda lo que sentimos.',
    feedbackIncorrect: 'No, la otra persona no puede saber que quieres ser su novio/a si no se lo dices.',
  },
  {
    image: `${IMG}/foto3.png`,
    audio: `${AUD}/q3.mp3`,
    feedbackAudio: `${AUD}/fb3-no.mp3`,
    correctAnswer: 'no' as const,
    feedbackCorrect:   '¡Muy bien! No puedes obligar a la otra persona a ser tu pareja, debes preguntarle siempre.',
    feedbackIncorrect: 'No puedes obligar a la otra persona a ser tu pareja, debes preguntarle siempre.',
  },
  {
    image: `${IMG}/foto4.png`,
    audio: `${AUD}/q4.mp3`,
    feedbackAudio: `${AUD}/fb4-yes.mp3`,
    correctAnswer: 'yes' as const,
    feedbackCorrect:   '¡Muy bien! Escribir una carta es otra forma de decirle a la persona que nos gusta lo que sentimos.',
    feedbackIncorrect: 'No, escribir una carta es una buena forma de expresar tus sentimientos.',
  },
];

type Phase = 'intro' | 'question' | 'feedback' | 'completed';

export default function JuegoCuatroAventura4({ isVisible, onClose, onGameComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null);
  const [canNext, setCanNext] = useState(false);
  const [yesHovered, setYesHovered] = useState(false);
  const [noHovered, setNoHovered] = useState(false);
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

  const playIntroAudio = () => { playAudio(`${AUD}/title.mp3`); };

  useEffect(() => {
    if (isVisible) {
      setPhase('intro');
      setRoundIndex(0);
      setSelected(null);
      setCanNext(false);
      playIntroAudio();
    } else {
      stopAudio();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || phase !== 'question') return;
    playAudio(ROUNDS[roundIndex].audio);
  }, [isVisible, phase, roundIndex]);

  if (!isVisible) return null;

  const round = ROUNDS[roundIndex];
  const isCorrect = selected === round.correctAnswer;

  const handleAnswer = async (answer: 'yes' | 'no') => {
    if (phase !== 'question' || selected) return;
    stopAudio();
    setSelected(answer);
    setCanNext(false);
    setPhase('feedback');

    const correct = answer === round.correctAnswer;
    await playAudio(correct ? '/audio/YES.mp3' : '/audio/NO.mp3');
    await playAudio(correct ? round.feedbackAudio : `${AUD}/RI.mp3`);
    setCanNext(true);
  };

  const handleNext = () => {
    if (!canNext) return;
    stopAudio();
    const next = roundIndex + 1;
    if (next >= ROUNDS.length) {
      setPhase('completed');
    } else {
      setRoundIndex(next);
      setSelected(null);
      setCanNext(false);
      setPhase('question');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="juego4-av4-scene3"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {phase !== 'completed' && (
          <motion.div
            className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 rounded-3xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{ height: '85vh' }}
          >
            {/* Top bar */}
            <EscucharInstruccionesButton onPlayInstructions={playIntroAudio} position="top-left" />
            <button
              onClick={() => { stopAudio(); onClose(); }}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-105 font-semibold"
            >
              Salir juego
            </button>

            {/* INTRO */}
            {phase === 'intro' && (
              <div className="flex flex-col items-center justify-center flex-1 p-12 gap-8">
                <motion.h2
                  className="text-4xl font-bold text-rose-700 text-center"
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                >
                  ¿Cómo pedir salir?
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                >
                  ¿Ayudamos a Alex a pedirle salir a Cris? Elige qué frase o acción es la correcta.
                </motion.p>
                <motion.button
                  onClick={() => { stopAudio(); setPhase('question'); }}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                >
                  ¡Jugar!
                </motion.button>
              </div>
            )}

            {/* QUESTION / FEEDBACK */}
            {(phase === 'question' || phase === 'feedback') && (
              <motion.div
                key={`round-${roundIndex}`}
                className="flex flex-col items-center flex-1 p-6 pt-14 gap-4 min-h-0"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Progress */}
                <div className="flex items-center gap-2">
                  {ROUNDS.map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${i < roundIndex ? 'bg-rose-400 border-rose-400' : i === roundIndex ? 'bg-rose-600 border-rose-600' : 'bg-gray-200 border-gray-300'}`} />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-1">{roundIndex + 1} / {ROUNDS.length}</span>
                </div>

                {/* Image — click to replay audio */}
                <motion.div
                  className="relative flex-1 w-full max-w-xl cursor-pointer min-h-0"
                  onClick={() => { if (phase === 'question') playAudio(round.audio); }}
                  whileHover={phase === 'question' ? { scale: 1.02 } : {}}
                  whileTap={phase === 'question' ? { scale: 0.98 } : {}}
                >
                  <Image src={round.image} fill alt={`Situación ${roundIndex + 1}`} className="object-contain" unoptimized />

                  {/* Click hint */}
                  {phase === 'question' && (
                    <div className="absolute bottom-3 right-3 bg-white/80 rounded-full px-3 py-1 text-xs text-gray-600 font-medium shadow">
                      🔊 Toca para escuchar
                    </div>
                  )}

                  {/* Feedback result overlay */}
                  {phase === 'feedback' && (
                    <motion.div
                      className={`absolute inset-0 ${isCorrect ? 'bg-green-400/20' : 'bg-red-400/20'}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    />
                  )}
                </motion.div>

                {/* YES / NO buttons OR feedback */}
                {phase === 'question' && (
                  <div className="flex gap-8 items-center justify-center">
                    {/* NO button */}
                    <motion.button
                      onClick={() => handleAnswer('no')}
                      onMouseEnter={() => setNoHovered(true)}
                      onMouseLeave={() => setNoHovered(false)}
                      whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                      className="relative w-24 h-24"
                    >
                      <Image src={noHovered ? `${IMG}/no-hover.png` : `${IMG}/no.png`} fill alt="No" className="object-contain" unoptimized />
                    </motion.button>

                    {/* YES button */}
                    <motion.button
                      onClick={() => handleAnswer('yes')}
                      onMouseEnter={() => setYesHovered(true)}
                      onMouseLeave={() => setYesHovered(false)}
                      whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                      className="relative w-24 h-24"
                    >
                      <Image src={yesHovered ? `${IMG}/yes-hover.png` : `${IMG}/yes.png`} fill alt="Sí" className="object-contain" unoptimized />
                    </motion.button>
                  </div>
                )}

                {phase === 'feedback' && selected && (
                  <motion.div className="flex flex-col items-center gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <Image
                          src={isCorrect ? `${IMG}/yes.png` : `${IMG}/no.png`}
                          fill alt="" className="object-contain" unoptimized
                        />
                      </div>
                      <p className={`font-semibold text-base text-left max-w-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {isCorrect ? round.feedbackCorrect : round.feedbackIncorrect}
                      </p>
                    </div>

                    {!canNext && (
                      <div className="flex items-center gap-2 text-rose-500 animate-pulse text-sm">
                        <span>🔊</span><span>Escuchando...</span>
                      </div>
                    )}
                    {canNext && (
                      <motion.button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        {roundIndex + 1 >= ROUNDS.length ? '¡Terminar!' : 'Siguiente →'}
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        <CongratsOverlay
          isVisible={phase === 'completed'}
          title="¡Muy bien!"
          subtitle="Has completado el juego"
          bgColor="bg-rose-500/20"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
