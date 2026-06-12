'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';
import {
  CIRCLES, PEOPLE, PART2_QUESTIONS, shuffleArray, ELEMENTS,
  INTRO_VO_AUDIO, PART2_TITLE_AUDIO,
  CircleId,
} from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

enum Phase {
  INTRO,
  PART1,
  PART1_FEEDBACK,
  PART1_COMPLETE,
  PART2,
  PART2_FEEDBACK,
  COMPLETED,
}

export default function JuegoSeisActividad2({ isVisible, onClose, onGameComplete }: Props) {
  const [phase, setPhase] = useState<Phase>(Phase.INTRO);
  const [part1Index, setPart1Index] = useState(0);
  const [placements, setPlacements] = useState<Record<string, CircleId>>({});
  const [part1Correct, setPart1Correct] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [dragKey, setDragKey] = useState(0);
  const [activeCircle, setActiveCircle] = useState<CircleId | null>(null);

  const shuffledQuestions = useMemo(() => shuffleArray(PART2_QUESTIONS), []);
  const [part2Index, setPart2Index] = useState(0);
  const [part2Correct, setPart2Correct] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<CircleId | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const circleRefs = useRef<Partial<Record<CircleId, HTMLDivElement | null>>>({});
  const dragControls = useAnimation();

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

  const playIntroAudio = () => {
    playAudio(INTRO_VO_AUDIO);
  };

  useEffect(() => {
    if (isVisible) {
      setPhase(Phase.INTRO);
      setPart1Index(0);
      setPlacements({});
      setPart2Index(0);
      setSelectedCircle(null);
      setCanNext(false);
      setDragKey(0);
      playIntroAudio();
    } else {
      stopAudio();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || phase !== Phase.PART1) return;
    playAudio(PEOPLE[part1Index].audio);
  }, [isVisible, phase, part1Index]);

  useEffect(() => {
    if (!isVisible || phase !== Phase.PART2) return;
    if (part2Index === 0) {
      playAudio(PART2_TITLE_AUDIO).then(() => playAudio(shuffledQuestions[0].audio));
    } else {
      playAudio(shuffledQuestions[part2Index].audio);
    }
  }, [isVisible, phase, part2Index]);

  if (!isVisible) return null;

  const currentPerson = PEOPLE[part1Index];
  const currentQ = shuffledQuestions[part2Index];

  const getDroppedCircle = (pointX: number, pointY: number): CircleId | null => {
    for (const [id, el] of Object.entries(circleRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const padding = 20;
      if (
        pointX >= rect.left - padding && pointX <= rect.right + padding &&
        pointY >= rect.top - padding && pointY <= rect.bottom + padding
      ) {
        return id as CircleId;
      }
    }
    return null;
  };

  const handleDragEnd = async (_: unknown, info: { point: { x: number; y: number } }) => {
    if (phase !== Phase.PART1) return;
    const dropped = getDroppedCircle(info.point.x, info.point.y);

    if (!dropped) {
      dragControls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
      return;
    }

    const isCorrect = dropped === currentPerson.correctCircle;
    setPlacements(prev => ({ ...prev, [currentPerson.id]: dropped }));
    setPart1Correct(isCorrect);
    setCanNext(false);
    setPhase(Phase.PART1_FEEDBACK);
    setDragKey(k => k + 1);
    setActiveCircle(null);

    const circle = CIRCLES.find(c => c.id === currentPerson.correctCircle)!;
    await playAudio(isCorrect ? circle.correctAudio : circle.incorrectAudio);
    setCanNext(true);
  };

  const handleDragMove = (_: unknown, info: { point: { x: number; y: number } }) => {
    const hovered = getDroppedCircle(info.point.x, info.point.y);
    setActiveCircle(hovered);
  };

  const handlePart1Next = () => {
    if (!canNext) return;
    stopAudio();
    const next = part1Index + 1;
    if (next >= PEOPLE.length) {
      setPhase(Phase.PART1_COMPLETE);
    } else {
      setPart1Index(next);
      setDragKey(k => k + 1);
      setCanNext(false);
      setPhase(Phase.PART1);
    }
  };

  const handlePart2Select = async (circleId: CircleId) => {
    if (phase !== Phase.PART2) return;
    stopAudio();
    const isCorrect = circleId === currentQ.correctCircle;
    setSelectedCircle(circleId);
    setPart2Correct(isCorrect);
    setCanNext(false);
    setPhase(Phase.PART2_FEEDBACK);
    await playAudio(isCorrect ? currentQ.feedbackCorrectAudio : currentQ.feedbackIncorrectAudio);
    setCanNext(true);
  };

  const handlePart2Next = () => {
    if (!canNext) return;
    stopAudio();
    const next = part2Index + 1;
    if (next >= shuffledQuestions.length) {
      setPhase(Phase.COMPLETED);
    } else {
      setPart2Index(next);
      setSelectedCircle(null);
      setCanNext(false);
      setPhase(Phase.PART2);
    }
  };

  // Circle component used in both parts
  const CircleZone = ({
    circleId,
    isDropTarget,
    showPeople,
    onClick,
    clickable,
    highlight,
  }: {
    circleId: CircleId;
    isDropTarget?: boolean;
    showPeople?: boolean;
    onClick?: () => void;
    clickable?: boolean;
    highlight?: 'correct' | 'incorrect' | null;
  }) => {
    const circle = CIRCLES.find(c => c.id === circleId)!;
    const placedPeople = showPeople
      ? Object.entries(placements).filter(([, cId]) => cId === circleId).map(([pid]) => PEOPLE.find(p => p.id === pid)!)
      : [];
    const isActive = activeCircle === circleId;

    return (
      <div
        ref={el => { circleRefs.current[circleId] = el; }}
        onClick={clickable ? onClick : undefined}
        className={`flex flex-col items-center gap-2 transition-all duration-200 ${clickable ? 'cursor-pointer' : ''}`}
      >
        <motion.div
          className={`relative flex items-center justify-center transition-all duration-200 ${
            highlight === 'correct' ? 'ring-4 ring-green-400 ring-offset-2 rounded-full' :
            highlight === 'incorrect' ? 'ring-4 ring-red-400 ring-offset-2 rounded-full' :
            isActive || isDropTarget ? 'ring-4 ring-white/60 ring-offset-2 rounded-full scale-110' : ''
          }`}
          style={{ width: 190, height: 190 }}
          whileHover={clickable ? { scale: 1.08 } : {}}
          whileTap={clickable ? { scale: 0.95 } : {}}
        >
          {/* Circle image */}
          <Image
            src={circle.circleImg}
            fill
            alt={circle.label}
            className="object-contain"
            unoptimized
          />

          {/* Mini people inside circle */}
          {placedPeople.length > 0 && (
            <div className="absolute inset-2 flex flex-wrap gap-1 justify-center items-center content-center z-10">
              {placedPeople.map(p => (
                <div key={p.id} className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-gray-100 shadow-md flex-shrink-0">
                  <Image src={p.image} fill alt={p.name} className="object-cover" unoptimized onError={() => {}} />
                  <span className="absolute text-[8px] font-black text-gray-600">{p.name[0]}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Label */}
        <span className="text-sm font-bold text-center text-gray-700 max-w-[130px] leading-tight">{circle.label}</span>


      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        key="juego6-act2-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {phase !== Phase.COMPLETED && (
          <motion.div
            className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{ minHeight: 560 }}
          >
            {/* Exit */}
            <button
              onClick={() => { stopAudio(); onClose(); }}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-105 font-semibold"
            >
              Salir juego
            </button>

            {/* INTRO */}
            {phase === Phase.INTRO && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[560px] gap-8">
                <EscucharInstruccionesButton onPlayInstructions={playIntroAudio} position="top-right" />
                <motion.h2
                  className="text-4xl font-bold text-purple-700 text-center"
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                >
                  El Círculo de Confianza
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                >
                  Arrastra a cada persona al círculo correcto según la confianza que Noa tiene con ella.
                </motion.p>
                <motion.button
                  onClick={() => { stopAudio(); setPhase(Phase.PART1); }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                >
                  ¡Jugar!
                </motion.button>
              </div>
            )}

            {/* PART 1 — Drag to circle */}
            {(phase === Phase.PART1 || phase === Phase.PART1_FEEDBACK) && (
              <div className="flex flex-col p-6 min-h-[560px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-600 font-bold text-sm uppercase tracking-wide">
                    Parte 1 — Persona {part1Index + 1} de {PEOPLE.length}
                  </span>
                  <div className="flex gap-1">
                    {PEOPLE.map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${i < part1Index ? 'bg-purple-400 border-purple-400' : i === part1Index ? 'bg-purple-600 border-purple-600' : 'bg-gray-200 border-gray-300'}`} />
                    ))}
                  </div>
                </div>

                {/* Main area: Noa + Circles */}
                <div className="flex items-start gap-6 mb-6">
                  {/* Noa placeholder */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="relative w-24 h-32 rounded-2xl overflow-hidden bg-purple-100 border-2 border-purple-200 flex items-center justify-center">
                      <span className="absolute text-4xl">🧒</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">Noa</span>
                  </div>

                  {/* 3 Circles as drop zones */}
                  <div className="flex gap-4 justify-center flex-1">
                    {CIRCLES.map(circle => (
                      <CircleZone
                        key={circle.id}
                        circleId={circle.id}
                        isDropTarget={activeCircle === circle.id}
                        showPeople={true}
                      />
                    ))}
                  </div>
                </div>

                {/* Draggable person card */}
                {phase === Phase.PART1 && (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-500 font-medium">Arrastra a la persona al círculo correcto</p>
                    <motion.div
                      key={`person-${dragKey}`}
                      drag
                      dragMomentum={false}
                      dragElastic={0.1}
                      animate={dragControls}
                      onDragEnd={handleDragEnd}
                      onDrag={handleDragMove}
                      whileDrag={{ scale: 1.15, zIndex: 50, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                      onDragStart={() => playAudio(currentPerson.audio)}
                      onClick={() => playAudio(currentPerson.audio)}
                      className="cursor-grab active:cursor-grabbing select-none"
                      style={{ touchAction: 'none' }}
                    >
                      <div className="flex flex-col items-center gap-0 rounded-3xl border-4 border-purple-400 bg-white shadow-2xl overflow-hidden">
                        <div className="relative w-40 h-40 bg-gray-100">
                          <Image src={currentPerson.image} fill alt={currentPerson.name} className="object-contain" unoptimized />
                        </div>
                        <div className="w-full bg-purple-400 py-2 flex items-center justify-center">
                          <span className="font-bold text-white text-sm tracking-wide px-3">
                            {currentPerson.name}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Feedback */}
                {phase === Phase.PART1_FEEDBACK && (
                  <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  >
                    <motion.p
                      className={`text-center font-semibold text-lg px-6 ${part1Correct ? 'text-green-700' : 'text-red-700'}`}
                    >
                      {CIRCLES.find(c => c.id === currentPerson.correctCircle)![part1Correct ? 'correctText' : 'incorrectText']}
                    </motion.p>

                    {!canNext && (
                      <div className="flex items-center gap-2 text-purple-500 animate-pulse">
                        <span>🔊</span><span className="text-sm font-medium">Escuchando...</span>
                      </div>
                    )}
                    {canNext && (
                      <motion.button
                        onClick={handlePart1Next}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-lg text-lg"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        {part1Index + 1 >= PEOPLE.length ? '¡Segunda parte!' : 'Siguiente →'}
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* PART 1 COMPLETE */}
            {phase === Phase.PART1_COMPLETE && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[560px] gap-8">
                <div className="text-7xl">🎉</div>
                <h3 className="text-3xl font-bold text-purple-700 text-center">¡Primera parte completada!</h3>
                <p className="text-lg text-gray-600 text-center max-w-md">
                  Ahora ayuda a Noa a decidir con qué personas haría las siguientes acciones.
                </p>
                <motion.button
                  onClick={() => { setSelectedCircle(null); setCanNext(false); setPhase(Phase.PART2); }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-lg text-xl"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  ¡Seguir!
                </motion.button>
              </div>
            )}

            {/* PART 2 — Click circle */}
            {(phase === Phase.PART2 || phase === Phase.PART2_FEEDBACK) && (
              <div className="flex flex-col p-6 min-h-[560px] gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 font-bold text-sm uppercase tracking-wide">
                    Parte 2 — Pregunta {part2Index + 1} de {shuffledQuestions.length}
                  </span>
                  <div className="flex gap-1">
                    {shuffledQuestions.map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${i < part2Index ? 'bg-purple-400 border-purple-400' : i === part2Index ? 'bg-purple-600 border-purple-600' : 'bg-gray-200 border-gray-300'}`} />
                    ))}
                  </div>
                </div>

                {/* Question */}
                <motion.div
                  key={currentQ.id}
                  className="bg-white rounded-2xl shadow-lg p-5 text-center"
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-2xl font-bold text-gray-800">{currentQ.question}</p>
                </motion.div>

                {/* 3 Circles with people inside — clickable */}
                <div className="flex gap-6 justify-center flex-1 items-center">
                  {CIRCLES.map(circle => {
                    const isChosen = selectedCircle === circle.id;
                    const isCorrectCircle = phase === Phase.PART2_FEEDBACK && circle.id === currentQ.correctCircle;
                    const highlight = isChosen
                      ? (phase === Phase.PART2_FEEDBACK ? (part2Correct ? 'correct' : 'incorrect') : null)
                      : null;
                    return (
                      <div key={circle.id} className="relative">
                        <CircleZone
                          circleId={circle.id}
                          showPeople={true}
                          clickable={phase === Phase.PART2}
                          onClick={() => handlePart2Select(circle.id)}
                          highlight={highlight as 'correct' | 'incorrect' | null}
                        />
                        {isCorrectCircle && !part2Correct && phase === Phase.PART2_FEEDBACK && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Feedback */}
                {phase === Phase.PART2_FEEDBACK && (
                  <motion.div className="flex items-center gap-4 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <Image src={part2Correct ? ELEMENTS.yes : ELEMENTS.no} fill alt="" className="object-contain" unoptimized />
                    </div>
                    <p className={`text-left font-semibold text-lg ${part2Correct ? 'text-green-700' : 'text-red-700'}`}>
                      {part2Correct ? currentQ.feedbackCorrect : currentQ.feedbackIncorrect}
                    </p>
                  </motion.div>
                )}

                {!canNext && phase === Phase.PART2_FEEDBACK && (
                  <div className="flex items-center justify-center gap-2 text-purple-500 animate-pulse">
                    <span>🔊</span><span className="text-sm font-medium">Escuchando...</span>
                  </div>
                )}
                {canNext && phase === Phase.PART2_FEEDBACK && (
                  <motion.button
                    onClick={handlePart2Next}
                    className="self-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-lg text-lg"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  >
                    {part2Index + 1 >= shuffledQuestions.length ? '¡Terminar!' : 'Siguiente →'}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        )}

        <CongratsOverlay
          isVisible={phase === Phase.COMPLETED}
          title="¡Muy bien!"
          subtitle="Has completado El Círculo de Confianza"
          bgColor="bg-purple-500/20"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
