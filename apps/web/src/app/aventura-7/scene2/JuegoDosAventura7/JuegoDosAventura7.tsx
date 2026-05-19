'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  DndContext, DragEndEvent, DragOverEvent,
  useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { titleAudio, subtitleAudio, s1, s2, s3, s4 } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

type Step = 'intro' | 's1' | 's2' | 's3' | 's4' | 'completed';
type StepState = 'playing' | 'feedback-correct' | 'feedback-wrong' | 'done';

// ── audio helper ──────────────────────────────────────────────────────────────
function useAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const stop = useCallback(() => {
    if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; ref.current = null; }
  }, []);
  const play = useCallback((src: string): Promise<void> => new Promise((resolve) => {
    stop();
    const a = new Audio(src);
    a.volume = 0.8;
    ref.current = a;
    a.onended = () => resolve();
    a.onerror = () => resolve();
    a.play().catch(() => resolve());
  }), [stop]);
  return { play, stop };
}

// ── S1 / S2: pick correct image ───────────────────────────────────────────────
function PickStep({
  config, onDone, play,
}: {
  config: typeof s1;
  onDone: () => void;
  play: (s: string) => Promise<void>;
}) {
  const [stepState, setStepState] = useState<StepState>('playing');
  const [feedbackSymbol, setFeedbackSymbol] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => { play(config.questionAudio); }, []);

  const handleClick = async (opt: typeof config.options[number]) => {
    if (stepState !== 'playing') return;
    setStepState(opt.correct ? 'feedback-correct' : 'feedback-wrong');
    await play(opt.audio);
    await play(opt.correct ? '/audio/YES.mp3' : '/audio/NO.mp3');
    setFeedbackSymbol(opt.correct ? 'correct' : 'wrong');
    await play(opt.feedbackAudio);
    setFeedbackSymbol(null);
    if (opt.correct) {
      setStepState('done');
    } else {
      setStepState('playing');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 flex-1">
      <div className="flex justify-start w-full">
        <button
          onClick={() => play(config.questionAudio)}
          className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold text-sm"
        >
          🔊 Escuchar instrucciones
        </button>
      </div>
      <div className="flex items-center justify-center gap-8 flex-1">
        {config.options.map((opt) => {
          return (
            <motion.button
              key={opt.id}
              onClick={() => handleClick(opt)}
              disabled={stepState !== 'playing'}
              className={`relative overflow-hidden transition-all duration-200 ${stepState === 'playing' ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
              style={{ width: '400px', height: '370px' }}
              whileTap={{ scale: 0.97 }}
            >
              <Image src={opt.image} alt={`Opción ${opt.id}`} fill className="object-contain p-2" unoptimized />
            </motion.button>
          );
        })}
      </div>

      {feedbackSymbol && (
        <motion.div
          className={`relative w-28 h-28 rounded-full p-3 ${feedbackSymbol === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          <Image
            src={feedbackSymbol === 'correct' ? '/image/avanzado/aventura6/ok-hover.png' : '/image/avanzado/aventura6/no-hover.png'}
            alt={feedbackSymbol === 'correct' ? 'Correcto' : 'Incorrecto'}
            fill className="object-contain p-1" unoptimized
          />
        </motion.div>
      )}

      {stepState === 'done' && !feedbackSymbol && (
        <motion.button
          onClick={onDone}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-3 px-10 rounded-full shadow-lg text-lg hover:shadow-xl transition-all duration-200"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          Siguiente →
        </motion.button>
      )}
    </div>
  );
}

// ── S3: drag down right side ──────────────────────────────────────────────────
function DragRevealStep({ onDone, play }: { onDone: () => void; play: (s: string) => Promise<void> }) {
  const [revealed, setRevealed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lineTop, setLineTop] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const imgRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);

  useEffect(() => { play(s3.questionAudio); }, []);

  const showError = (msg: string) => {
    setIsDragging(false);
    setLineHeight(0);
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 1800);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (revealed) return;
    const rect = imgRef.current!.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    if (relX < 0.5) { showError('Arrastra por el lado derecho'); return; }
    if (relY > 0.3) { showError('Empieza desde arriba'); return; }
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartY.current = e.clientY - rect.top;
    setLineTop(dragStartY.current);
    setLineHeight(0);
    setErrorMsg('');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = imgRef.current!.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    if (relX < 0.4) { showError('Mantente en el lado derecho'); return; }
    const currentY = e.clientY - rect.top;
    setLineHeight(Math.max(0, currentY - dragStartY.current));
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const rect = imgRef.current!.getBoundingClientRect();
    const dragDist = lineHeight;
    setIsDragging(false);
    if (dragDist > rect.height * 0.55) {
      setRevealed(true);
      setLineHeight(0);
    } else {
      showError('Arrastra más hacia abajo');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 flex-1">
      {!revealed ? (
        <>
          <p className="text-sm text-gray-500 font-medium">Arrastra hacia abajo por el lado derecho de la imagen</p>
          <div
            ref={imgRef}
            className="relative rounded-2xl overflow-hidden select-none touch-none"
            style={{ width: '340px', height: '320px', cursor: isDragging ? 'ns-resize' : 'crosshair' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <Image src={s3.imageInitial} alt="Situación 3" fill className="object-contain pointer-events-none" unoptimized />
            {isDragging && (
              <div
                className="absolute pointer-events-none"
                style={{
                  right: '15%',
                  width: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#ef4444',
                  top: lineTop,
                  height: lineHeight,
                }}
              />
            )}
          </div>
          {errorMsg && (
            <motion.p
              className="text-red-500 font-semibold text-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {errorMsg}
            </motion.p>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            {[s3.imageReveal1, s3.imageReveal2].map((src, i) => (
              <motion.div
                key={i}
                className="relative rounded-2xl overflow-hidden"
                style={{ width: '260px', height: '280px' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, type: 'spring', damping: 15 }}
              >
                <Image src={src} alt={`Revelado ${i + 1}`} fill className="object-contain" unoptimized />
              </motion.div>
            ))}
          </div>
          <motion.button
            onClick={onDone}
            className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-3 px-10 rounded-full shadow-lg text-lg hover:shadow-xl transition-all duration-200"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            Siguiente →
          </motion.button>
        </>
      )}
    </div>
  );
}

// ── S4: drag to order ─────────────────────────────────────────────────────────
type ItemId = '1' | '2' | '3' | '4';
type SlotId = 'slot-1' | 'slot-2' | 'slot-3' | 'slot-4';

function DraggableCard({ id, image, audio, play, locked }: {
  id: ItemId; image: string; audio: string;
  play: (s: string) => Promise<void>; locked: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled: locked });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, zIndex: 9999 } : {};
  return (
    <div
      ref={setNodeRef}
      style={{ width: '220px', height: '220px', position: 'relative', ...style }}
      {...listeners} {...attributes}
      className={`overflow-hidden touch-none select-none transition-all duration-200 ${
        locked ? 'cursor-default' : isDragging ? 'opacity-70' : 'cursor-grab hover:scale-105'
      }`}
      onClick={() => !locked && play(audio)}
    >
      <Image src={image} alt={`Paso ${id}`} fill className="object-contain p-1" unoptimized />
    </div>
  );
}

function DropSlot({ slotId, slotNum, content, isOver }: {
  slotId: SlotId; slotNum: number; content: typeof s4.items[number] | null; isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: slotId });
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-bold text-gray-500">Paso {slotNum}</span>
      <div
        ref={setNodeRef}
        className={`rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
          content ? 'border-green-500 bg-green-50' : isOver ? 'border-sky-400 bg-sky-50 scale-105' : 'border-dashed border-gray-300 bg-gray-50'
        }`}
        style={{ width: '220px', height: '220px' }}
      >
        {content ? (
          <div className="relative w-full h-full">
            <Image src={content.image} alt={`Paso ${content.id}`} fill className="object-contain p-1" unoptimized />
          </div>
        ) : (
          <span className="text-3xl font-bold text-gray-300">{slotNum}</span>
        )}
      </div>
    </div>
  );
}

function OrderStep({ onDone, play }: { onDone: () => void; play: (s: string) => Promise<void> }) {
  const [slotContents, setSlotContents] = useState<Record<SlotId, typeof s4.items[number] | null>>({
    'slot-1': null, 'slot-2': null, 'slot-3': null, 'slot-4': null,
  });
  const [overSlot, setOverSlot] = useState<SlotId | null>(null);
  const [shuffled] = useState(() => [...s4.items].sort(() => Math.random() - 0.5));
  const [allDone, setAllDone] = useState(false);

  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } });
  const sensors = useSensors(pointerSensor, touchSensor);

  useEffect(() => { play(s4.questionAudio); }, []);

  const placedIds = new Set(Object.values(slotContents).filter(Boolean).map(i => i!.id));
  const trayItems = shuffled.filter(item => !placedIds.has(item.id));

  const handleDragOver = (e: DragOverEvent) => setOverSlot((e.over?.id as SlotId) ?? null);

  const handleDragEnd = (e: DragEndEvent) => {
    setOverSlot(null);
    if (!e.over) return;
    const slotId = e.over.id as SlotId;
    const itemId = e.active.id as ItemId;
    const slotNum = parseInt(slotId.replace('slot-', ''), 10);
    const item = s4.items.find(i => i.id === itemId)!;
    if (item.correctSlot === slotNum) {
      setSlotContents(prev => {
        const next = { ...prev, [slotId]: item };
        const done = Object.values(next).every(v => v !== null);
        if (done) setAllDone(true);
        return next;
      });
    }
  };

  return (
    <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center gap-5 flex-1">
        {/* Target slots */}
        <div className="flex items-end gap-2 mt-6">
          {(['slot-1', 'slot-2', 'slot-3', 'slot-4'] as SlotId[]).map((slotId, i) => (
            <DropSlot
              key={slotId}
              slotId={slotId}
              slotNum={i + 1}
              content={slotContents[slotId]}
              isOver={overSlot === slotId}
            />
          ))}
        </div>

        {/* Tray */}
        <div className="flex items-center gap-2 min-h-[230px]">
          {trayItems.map(item => (
            <DraggableCard
              key={item.id}
              id={item.id as ItemId}
              image={item.image}
              audio={item.audio}
              play={play}
              locked={placedIds.has(item.id)}
            />
          ))}
          {trayItems.length === 0 && !allDone && (
            <p className="text-gray-400 text-sm">Todas las tarjetas están colocadas</p>
          )}
        </div>

        {allDone && (
          <motion.button
            onClick={onDone}
            className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-3 px-10 rounded-full shadow-lg text-lg hover:shadow-xl transition-all duration-200"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            ¡Terminar!
          </motion.button>
        )}
      </div>
    </DndContext>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function JuegoDosAventura7({ isVisible, onClose, onGameComplete }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const { play, stop } = useAudio();

  useEffect(() => {
    if (isVisible) {
      setStep('intro');
      play(titleAudio).then(() => play(subtitleAudio));
    } else {
      stop();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const stepLabels: Record<Exclude<Step, 'intro' | 'completed'>, string> = {
    s1: '1. Elige la imagen correcta',
    s2: '2. Elige la imagen correcta',
    s3: '3. Desliza para abrir',
    s4: '4. Ordena los pasos',
  };

  const steps: Exclude<Step, 'intro' | 'completed'>[] = ['s1', 's2', 's3', 's4'];

  return (
    <AnimatePresence>
      <motion.div
        key="juego2-av7-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {step !== 'completed' && (
          <motion.div
            className="relative bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden min-h-[700px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <button
              onClick={() => { stop(); onClose(); }}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105 font-semibold"
            >
              Salir juego
            </button>

            {/* INTRO */}
            {step === 'intro' && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[700px] gap-8">
                <EscucharInstruccionesButton onPlayInstructions={() => play(subtitleAudio)} position="top-right" />
                <motion.h2 className="text-5xl font-bold text-sky-700 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                  Cómo colocar el preservativo
                </motion.h2>
                <motion.p className="text-xl text-gray-600 text-center max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  Aprende los pasos correctos para colocar un preservativo.
                </motion.p>
                <motion.button
                  onClick={() => { stop(); setStep('s1'); }}
                  className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                >
                  ¡Empezar!
                </motion.button>
              </div>
            )}

            {/* STEPS */}
            {step !== 'intro' && (
              <div className="flex flex-col p-6 gap-4 min-h-[700px]">
                {/* Progress */}
                <div className="flex items-center justify-center gap-2">
                  {steps.map((s, i) => (
                    <div key={s} className={`h-3 rounded-full transition-all duration-300 ${
                      steps.indexOf(step as typeof steps[number]) > i ? 'bg-sky-400 w-8'
                      : s === step ? 'bg-sky-600 w-12'
                      : 'bg-sky-200 w-8'
                    }`} />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {steps.indexOf(step as typeof steps[number]) + 1} / {steps.length}
                  </span>
                </div>

                <p className="text-center text-lg font-bold text-sky-700">
                  {stepLabels[step as keyof typeof stepLabels]}
                </p>

                {step === 's1' && <PickStep config={s1} onDone={() => setStep('s2')} play={play} />}
                {step === 's2' && <PickStep config={s2} onDone={() => setStep('s3')} play={play} />}
                {step === 's3' && <DragRevealStep onDone={() => setStep('s4')} play={play} />}
                {step === 's4' && <OrderStep onDone={() => setStep('completed')} play={play} />}
              </div>
            )}
          </motion.div>
        )}

        <CongratsOverlay
          isVisible={step === 'completed'}
          title="¡Muy bien!"
          subtitle="Has completado el juego"
          bgColor="bg-sky-500/20"
          textColor="text-sky-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
