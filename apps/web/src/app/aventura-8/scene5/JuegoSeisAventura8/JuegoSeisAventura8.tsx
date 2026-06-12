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

const IMG = '/image/avanzado/aventura8/juego6';
const AUD = '/audio/advance-actividad8/juego6';

const SITUATIONS = [
  {
    id: 1,
    situationImage: `${IMG}/s1/s1.png`,
    situationAudio: `${AUD}/s1.mp3`,
    op1: { image: `${IMG}/s1/s1-OP1.png`, audio: `${AUD}/s1-op1.mp3`, feedbackAudio: `${AUD}/s1-op1-correcto.mp3`, isCorrect: true,  feedbackText: '¡Correcto! Tenemos que decir que no cuando no queremos hacer algo sin gritar ni enfadarnos.' },
    op2: { image: `${IMG}/s1/s1-OP2.png`, audio: `${AUD}/s1-op2.mp3`, feedbackAudio: `${AUD}/s1-op2-incorrecto.mp3`, isCorrect: false, feedbackText: '¡Incorrecto! No debemos hacer cosas que no nos gustan por miedo. Debemos decir que no con seguridad.' },
  },
  {
    id: 2,
    situationImage: `${IMG}/s2/s2.png`,
    situationAudio: `${AUD}/s2.mp3`,
    op1: { image: `${IMG}/s2/s2-OP1.png`, audio: `${AUD}/s2-op1.mp3`, feedbackAudio: `${AUD}/s2-op1-correcto.mp3`, isCorrect: true,  feedbackText: '¡Correcto! Cuando nos tocan y nos sentimos incómodos, debemos decirle que pare con tono correcto. También si es nuestra pareja.' },
    op2: { image: `${IMG}/s2/s2-OP2.png`, audio: `${AUD}/s2-op2.mp3`, feedbackAudio: `${AUD}/s2-op2-incorrect.mp3`, isCorrect: false, feedbackText: 'No!!! No tenemos que hacer lo que otros quieren. Cuando nos tocan y nos sentimos incómodos, debemos decirle que pare.' },
  },
  {
    id: 3,
    situationImage: `${IMG}/s3/s3.png`,
    situationAudio: `${AUD}/s3.mp3`,
    op1: { image: `${IMG}/s3/Sit3-OP1.png`, audio: `${AUD}/s3-op1.mp3`, feedbackAudio: `${AUD}/s3-op1-correcto.mp3`, isCorrect: true,  feedbackText: '¡Correcto! Debemos contarle a una persona de confianza si nos hemos sentido incómodos. Esto no debe ser un secreto.' },
    op2: { image: `${IMG}/s3/s3-OP2.png`,   audio: `${AUD}/s3-op2.mp3`, feedbackAudio: `${AUD}/s3-op2-incorrecto.mp3`, isCorrect: false, feedbackText: 'No, no está bien callarse. Es importante contarle a una persona de confianza si nos hemos sentido incómodos. Esto no debe ser un secreto.' },
  },
];

type Phase = 'intro' | 'situation' | 'choosing' | 'feedback' | 'completed';

export default function JuegoSeisAventura8({ isVisible, onClose, onGameComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [sitIndex, setSitIndex] = useState(0);
  const [selected, setSelected] = useState<'op1' | 'op2' | null>(null);
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

  const playIntroAudio = () => { playAudio(`${AUD}/title.mp3`); };

  useEffect(() => {
    if (isVisible) {
      setPhase('intro');
      setSitIndex(0);
      setSelected(null);
      setCanNext(false);
      playIntroAudio();
    } else {
      stopAudio();
    }
  }, [isVisible]);

  // Auto-play situation audio
  useEffect(() => {
    if (!isVisible || phase !== 'situation') return;
    playAudio(SITUATIONS[sitIndex].situationAudio).then(() => setPhase('choosing'));
  }, [isVisible, phase, sitIndex]);

  if (!isVisible) return null;

  const sit = SITUATIONS[sitIndex];
  const selectedOp = selected ? sit[selected] : null;
  const isCorrect = selectedOp?.isCorrect ?? false;

  const handleOptionClick = async (op: 'op1' | 'op2') => {
    if (phase !== 'choosing' || selected) return;
    // First click = preview audio
    stopAudio();
    playAudio(sit[op].audio);
  };

  const handleSelectOption = async (op: 'op1' | 'op2') => {
    if (phase !== 'choosing') return;
    stopAudio();
    setSelected(op);
    setPhase('feedback');
    setCanNext(false);

    const option = sit[op];
    await playAudio(option.isCorrect ? '/audio/YES.mp3' : '/audio/NO.mp3');
    await playAudio(option.feedbackAudio);
    setCanNext(true);
  };

  const handleNext = () => {
    if (!canNext) return;
    stopAudio();
    const next = sitIndex + 1;
    if (next >= SITUATIONS.length) {
      setPhase('completed');
    } else {
      setSitIndex(next);
      setSelected(null);
      setCanNext(false);
      setPhase('situation');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="juego6-av8"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {phase !== 'completed' && (
          <motion.div
            className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden flex flex-col"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{ height: '85vh' }}
          >
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
                <motion.h2 className="text-4xl font-bold text-teal-700 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                  Aprendo a decir no
                </motion.h2>
                <motion.p className="text-lg text-gray-600 text-center max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  Elige qué debe hacer Nuria en cada situación.
                </motion.p>
                <motion.button
                  onClick={() => { stopAudio(); setPhase('situation'); }}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                >
                  ¡Jugar!
                </motion.button>
              </div>
            )}

            {/* SITUATION loading */}
            {phase === 'situation' && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 pt-14">
                <div className="relative w-full max-w-xl flex-1 min-h-0">
                  <Image src={sit.situationImage} fill alt={`Situación ${sitIndex + 1}`} className="object-contain" unoptimized />
                </div>
                <div className="flex items-center gap-2 text-teal-500 animate-pulse text-sm font-medium">
                  <span>🔊</span><span>Escuchando situación...</span>
                </div>
              </div>
            )}

            {/* CHOOSING / FEEDBACK */}
            {(phase === 'choosing' || phase === 'feedback') && (
              <motion.div
                key={`sit-${sitIndex}`}
                className="flex flex-col items-center flex-1 p-4 pt-14 gap-3 min-h-0"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
              >
                {/* Progress */}
                <div className="flex items-center gap-2">
                  {SITUATIONS.map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${i < sitIndex ? 'bg-teal-400 border-teal-400' : i === sitIndex ? 'bg-teal-600 border-teal-600' : 'bg-gray-200 border-gray-300'}`} />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-1">{sitIndex + 1} / {SITUATIONS.length}</span>
                </div>

                {/* Situation image small */}
                <div className="relative w-full max-w-xs h-28 flex-shrink-0">
                  <Image src={sit.situationImage} fill alt="" className="object-contain" unoptimized />
                </div>

                {/* Two option cards */}
                <div className="flex gap-4 justify-center w-full flex-1 min-h-0">
                  {(['op1', 'op2'] as const).map(op => {
                    const option = sit[op];
                    const isSelected = selected === op;
                    const showResult = phase === 'feedback' && isSelected;

                    return (
                      <div key={op} className="flex flex-col items-center gap-2 flex-1 max-w-xs">
                        {/* Option image — click to hear, hold area for confirm */}
                        <motion.div
                          className={`relative flex-1 w-full min-h-0 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                            showResult && option.isCorrect ? 'ring-4 ring-green-400' :
                            showResult && !option.isCorrect ? 'ring-4 ring-red-400' :
                            phase === 'choosing' ? 'hover:ring-4 hover:ring-teal-300' : ''
                          }`}
                          onClick={() => handleOptionClick(op)}
                          whileHover={phase === 'choosing' ? { scale: 1.02 } : {}}
                        >
                          <Image src={option.image} fill alt={`Opción ${op}`} className="object-contain" unoptimized />
                          {phase === 'choosing' && (
                            <div className="absolute bottom-2 right-2 bg-white/80 rounded-full px-2 py-0.5 text-xs text-gray-600 font-medium shadow">
                              🔊 Escuchar
                            </div>
                          )}
                          {showResult && (
                            <motion.div
                              className={`absolute inset-0 ${option.isCorrect ? 'bg-green-400/20' : 'bg-red-400/20'}`}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            />
                          )}
                        </motion.div>

                        {/* Select button */}
                        {phase === 'choosing' && (
                          <motion.button
                            onClick={() => handleSelectOption(op)}
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-2 px-6 rounded-full shadow text-sm w-full"
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          >
                            Elegir esta opción
                          </motion.button>
                        )}

                        {/* Feedback badge */}
                        {phase === 'feedback' && isSelected && (
                          <motion.div className="relative w-12 h-12" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12 }}>
                            <Image src={option.isCorrect ? `${IMG}/yes.png` : `${IMG}/no.png`} fill alt="" className="object-contain" unoptimized />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Feedback text + next */}
                {phase === 'feedback' && selectedOp && (
                  <motion.div className="flex flex-col items-center gap-2 w-full max-w-xl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className={`text-center font-semibold text-sm px-4 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {selectedOp.feedbackText}
                    </p>
                    {!canNext && (
                      <div className="flex items-center gap-2 text-teal-500 animate-pulse text-xs">
                        <span>🔊</span><span>Escuchando...</span>
                      </div>
                    )}
                    {canNext && (
                      <motion.button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-2 px-8 rounded-full shadow-lg"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        {sitIndex + 1 >= SITUATIONS.length ? '¡Terminar!' : 'Siguiente →'}
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
          bgColor="bg-teal-500/20"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
