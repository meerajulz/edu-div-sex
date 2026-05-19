'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  DndContext, DragEndEvent, DragOverEvent,
  useDraggable, useDroppable,
  PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { titleAudio, subtitleAudio, items } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

type ItemId = '1' | '2' | '3' | '4';
type SlotId = 'slot-1' | 'slot-2' | 'slot-3' | 'slot-4';
type GameState = 'intro' | 'playing' | 'completed';

function useAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const stop = () => {
    if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; ref.current = null; }
  };
  const play = (src: string): Promise<void> => new Promise((resolve) => {
    stop();
    const a = new Audio(src);
    a.volume = 0.8;
    ref.current = a;
    a.onended = () => resolve();
    a.onerror = () => resolve();
    a.play().catch(() => resolve());
  });
  return { play, stop };
}

function DraggableCard({ id, image, audio, play }: {
  id: ItemId; image: string; audio: string; play: (s: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, zIndex: 9999 } : {};

  return (
    <div
      ref={setNodeRef}
      style={{ width: '210px', height: '210px', position: 'relative', ...style }}
      className={`overflow-hidden touch-none select-none transition-all duration-200 ${
        isDragging ? 'opacity-70 scale-95' : 'cursor-grab hover:scale-105'
      }`}
      {...listeners} {...attributes}
      onClick={() => play(audio)}
    >
      <Image src={image} alt={`Paso ${id}`} fill className="object-contain" unoptimized />
    </div>
  );
}

function DropSlot({ slotId, slotNum, content, isOver }: {
  slotId: SlotId; slotNum: number; content: typeof items[number] | null; isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: slotId });

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm font-bold text-gray-500">{slotNum}</span>
      <div
        ref={setNodeRef}
        className={`transition-all duration-200 flex items-center justify-center rounded-xl border-2 ${
          content
            ? 'border-green-500 bg-green-50'
            : isOver
            ? 'border-sky-400 bg-sky-50 scale-105'
            : 'border-dashed border-gray-300 bg-gray-50'
        }`}
        style={{ width: '210px', height: '210px' }}
      >
        {content ? (
          <div className="relative w-full h-full">
            <Image src={content.image} alt={`Paso ${content.id}`} fill className="object-contain" unoptimized />
          </div>
        ) : (
          <span className="text-4xl font-bold text-gray-200">{slotNum}</span>
        )}
      </div>
    </div>
  );
}

export default function JuegoTresAventura7({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [slotContents, setSlotContents] = useState<Record<SlotId, typeof items[number] | null>>({
    'slot-1': null, 'slot-2': null, 'slot-3': null, 'slot-4': null,
  });
  const [overSlot, setOverSlot] = useState<SlotId | null>(null);
  const [shuffled] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const { play, stop } = useAudio();

  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } });
  const sensors = useSensors(pointerSensor, touchSensor);

  useEffect(() => {
    if (isVisible) {
      setGameState('intro');
      setSlotContents({ 'slot-1': null, 'slot-2': null, 'slot-3': null, 'slot-4': null });
      play(titleAudio).then(() => play(subtitleAudio));
    } else {
      stop();
    }
  }, [isVisible]);

  const placedIds = new Set(Object.values(slotContents).filter(Boolean).map(i => i!.id));
  const trayItems = shuffled.filter(item => !placedIds.has(item.id));

  const handleDragOver = (e: DragOverEvent) => setOverSlot((e.over?.id as SlotId) ?? null);

  const handleDragEnd = (e: DragEndEvent) => {
    setOverSlot(null);
    if (!e.over) return;
    const slotId = e.over.id as SlotId;
    const itemId = e.active.id as ItemId;
    const slotNum = parseInt(slotId.replace('slot-', ''), 10);
    const item = items.find(i => i.id === itemId)!;
    if (item.correctSlot === slotNum) {
      setSlotContents(prev => {
        const next = { ...prev, [slotId]: item };
        if (Object.values(next).every(v => v !== null)) {
          setTimeout(() => setGameState('completed'), 600);
        }
        return next;
      });
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="juego3-av7-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {gameState !== 'completed' && (
          <motion.div
            className="relative bg-gradient-to-br from-teal-100 via-cyan-50 to-emerald-100 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden min-h-[700px]"
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
            {gameState === 'intro' && (
              <div className="flex flex-col items-center justify-center p-12 min-h-[700px] gap-8">
                <EscucharInstruccionesButton onPlayInstructions={() => play(subtitleAudio)} position="top-right" />
                <motion.h2
                  className="text-5xl font-bold text-teal-700 text-center"
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                >
                  ¿Qué hacemos con el preservativo usado?
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                >
                  Escucha cada imagen y arrástralas para ordenarlas correctamente.
                </motion.p>
                <motion.button
                  onClick={() => { stop(); setGameState('playing'); }}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                >
                  ¡Empezar!
                </motion.button>
              </div>
            )}

            {/* PLAYING */}
            {gameState === 'playing' && (
              <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="flex flex-col p-6 gap-6 min-h-[700px]">
                  {/* Buttons row */}
                  <div className="flex justify-start gap-3">
                    <button
                      onClick={() => play(subtitleAudio)}
                      className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold text-sm"
                    >
                      🔊 Escuchar instrucciones
                    </button>
                  </div>

                  {/* Drop slots */}
                  <div className="flex items-end justify-center gap-3">
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
                  <div className="flex items-center justify-center gap-3 flex-1">
                    {trayItems.map(item => (
                      <DraggableCard
                        key={item.id}
                        id={item.id as ItemId}
                        image={item.image}
                        audio={item.audio}
                        play={play}
                      />
                    ))}
                    {trayItems.length === 0 && (
                      <p className="text-gray-400 text-sm">Todas las imágenes están colocadas</p>
                    )}
                  </div>
                </div>
              </DndContext>
            )}
          </motion.div>
        )}

        <CongratsOverlay
          isVisible={gameState === 'completed'}
          title="¡Muy bien!"
          subtitle="Has completado el juego"
          bgColor="bg-teal-500/20"
          textColor="text-teal-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
