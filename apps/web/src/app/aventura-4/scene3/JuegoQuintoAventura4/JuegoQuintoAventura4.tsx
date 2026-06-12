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

const IMG = '/image/avanzado/aventura4/juego5';
const AUD = '/audio/advance-actividad-4/juego5';

const ROUNDS = [
  {
    image: `${IMG}/Foto1.png`,
    audio: `${AUD}/dani1.mp3`,
    correctAnswer: 'no' as const,
    feedbackCorrectAudio:   null,
    feedbackIncorrectAudio: `${AUD}/fb1-incorrect.mp3`,
    feedbackCorrect:   '¡Muy bien! No podemos hablarle así a nadie, podemos hacerle daño.',
    feedbackIncorrect: 'No podemos hablarle así a nadie. Puedes hacerle daño.',
    noaResponseAudio: null,
  },
  {
    image: `${IMG}/Foto2.png`,
    audio: `${AUD}/dani2.mp3`,
    correctAnswer: 'yes' as const,
    feedbackCorrectAudio:   `${AUD}/fb2-correct.mp3`,
    feedbackIncorrectAudio: null,
    feedbackCorrect:   '¡Muy bien! Tenemos que ser sinceros y respetuosos. Decirle lo que sentimos está bien.',
    feedbackIncorrect: 'No, tenemos que ser sinceros y respetuosos con la otra persona.',
    noaResponseAudio: `${AUD}/noa.mp3`,
  },
  {
    image: `${IMG}/Foto3.png`,
    audio: `${AUD}/dani3.mp3`,
    correctAnswer: 'no' as const,
    feedbackCorrectAudio:   null,
    feedbackIncorrectAudio: `${AUD}/fb3-incorrecta.mp3`,
    feedbackCorrect:   '¡Muy bien! Debemos ser sinceros y decir nuestros verdaderos sentimientos.',
    feedbackIncorrect: 'No, tenemos que ser sinceros y decir nuestros sentimientos.',
    noaResponseAudio: null,
  },
];

const MAX_WRONG = 3;
type Phase = 'intro' | 'question' | 'feedback' | 'noa-response' | 'completed';
type Answer = 'yes' | 'no';

export default function JuegoQuintoAventura4({ isVisible, onClose, onGameComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<Answer | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [showNoaResponse, setShowNoaResponse] = useState(false);
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

  const playIntroAudio = () => { playAudio(`${AUD}/title.mp3`).then(() => playAudio(`${AUD}/sub.mp3`)); };

  useEffect(() => {
    if (isVisible) {
      setPhase('intro');
      setRoundIndex(0);
      setSelected(null);
      setWrongAttempts(0);
      setCanNext(false);
      setShowNoaResponse(false);
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

  const handleAnswer = async (answer: Answer) => {
    if (phase !== 'question') return;
    stopAudio();
    setSelected(answer);
    setPhase('feedback');
    setCanNext(false);

    const correct = answer === round.correctAnswer;

    if (correct) {
      await playAudio('/audio/YES.mp3');
      await playAudio(round.feedbackCorrectAudio ?? `${AUD}/correcto.mp3`);
      if (round.noaResponseAudio) {
        setShowNoaResponse(true);
        await playAudio(round.noaResponseAudio);
        setShowNoaResponse(false);
      }
    } else {
      await playAudio('/audio/NO.mp3');
      if (round.feedbackIncorrectAudio) await playAudio(round.feedbackIncorrectAudio);
    }

    setCanNext(true);
  };

  const handleNext = () => {
    if (!canNext) return;
    stopAudio();

    if (!isCorrect && wrongAttempts + 1 < MAX_WRONG) {
      // Wrong but can retry
      setWrongAttempts(w => w + 1);
      setSelected(null);
      setCanNext(false);
      setPhase('question');
      return;
    }

    // Correct OR max wrong attempts reached → advance
    const next = roundIndex + 1;
    if (next >= ROUNDS.length) {
      setPhase('completed');
    } else {
      setRoundIndex(next);
      setSelected(null);
      setWrongAttempts(0);
      setCanNext(false);
      setPhase('question');
    }
  };

  const attemptsLeft = MAX_WRONG - wrongAttempts;

  return (
    <AnimatePresence>
      <motion.div
        key="juego5-av4-scene3"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {phase !== 'completed' && (
          <motion.div
            className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col"
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
                  className="text-4xl font-bold text-purple-700 text-center"
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                >
                  ¿Cómo decir que no?
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                >
                  Noa le ha pedido a Dani si quiere ser su pareja. ¿Ayudamos a Dani a decirle que no quiere salir con Noa?
                </motion.p>
                <motion.button
                  onClick={() => { stopAudio(); setPhase('question'); }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl"
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
                {/* Progress + attempts */}
                <div className="flex items-center justify-between w-full max-w-xl">
                  <div className="flex items-center gap-2">
                    {ROUNDS.map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${i < roundIndex ? 'bg-purple-400 border-purple-400' : i === roundIndex ? 'bg-purple-600 border-purple-600' : 'bg-gray-200 border-gray-300'}`} />
                    ))}
                    <span className="text-sm font-semibold text-gray-500 ml-1">{roundIndex + 1} / {ROUNDS.length}</span>
                  </div>
                  {phase === 'feedback' && !isCorrect && attemptsLeft > 0 && (
                    <span className="text-sm font-semibold text-orange-500">
                      {attemptsLeft} {attemptsLeft === 1 ? 'intento' : 'intentos'} restante{attemptsLeft !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Image */}
                <motion.div
                  className="relative flex-1 w-full max-w-xl cursor-pointer min-h-0"
                  onClick={() => { if (phase === 'question') playAudio(round.audio); }}
                  whileHover={phase === 'question' ? { scale: 1.02 } : {}}
                  whileTap={phase === 'question' ? { scale: 0.98 } : {}}
                >
                  <Image src={round.image} fill alt={`Opción ${roundIndex + 1}`} className="object-contain" unoptimized />

                  {phase === 'question' && (
                    <div className="absolute bottom-3 right-3 bg-white/80 rounded-full px-3 py-1 text-xs text-gray-600 font-medium shadow">
                      🔊 Toca para escuchar
                    </div>
                  )}

                  {phase === 'feedback' && (
                    <motion.div
                      className={`absolute inset-0 ${isCorrect ? 'bg-green-400/20' : 'bg-red-400/20'}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    />
                  )}
                </motion.div>

                {/* Noa response — shows gif + speech bubble */}
                <AnimatePresence>
                  {showNoaResponse && (
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    >
                      <div className="relative w-20 h-24 flex-shrink-0">
                        <Image src="/image/avanzado/aventura4/juego1/Noa.gif" fill alt="Noa" className="object-contain" unoptimized />
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-md text-sm text-purple-700 font-medium max-w-xs relative">
                        <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white" />
                        &quot;Vale, lo entiendo. No te lo preguntaré más. Seguiremos siendo amigos.&quot;
                        <div className="flex items-center gap-1 mt-1 text-purple-400 animate-pulse">
                          <span className="text-xs">🔊</span><span className="text-xs">Escuchando...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* YES / NO buttons */}
                {phase === 'question' && (
                  <div className="flex gap-8 items-center justify-center">
                    <motion.button
                      onClick={() => handleAnswer('no')}
                      onMouseEnter={() => setNoHovered(true)}
                      onMouseLeave={() => setNoHovered(false)}
                      whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                      className="relative w-24 h-24"
                    >
                      <Image src={noHovered ? `${IMG}/no-hover.png` : `${IMG}/no.png`} fill alt="No" className="object-contain" unoptimized />
                    </motion.button>
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

                {/* Feedback */}
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
                      <div className="flex items-center gap-2 text-purple-500 animate-pulse text-sm">
                        <span>🔊</span><span>Escuchando...</span>
                      </div>
                    )}

                    {canNext && (
                      <motion.button
                        onClick={handleNext}
                        className={`font-bold py-3 px-8 rounded-full shadow-lg text-white ${!isCorrect && attemptsLeft > 0 ? 'bg-gradient-to-r from-orange-400 to-amber-400' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        {!isCorrect && attemptsLeft > 0
                          ? 'Inténtalo de nuevo →'
                          : roundIndex + 1 >= ROUNDS.length ? '¡Terminar!' : 'Siguiente →'}
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
          bgColor="bg-purple-500/20"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
