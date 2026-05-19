'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { scenes, Zone } from './config';
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

const TITLE_AUDIO = '/audio/advance--aventura-6/juego4/title.mp3';
const SUBTITLE_AUDIO = '/audio/advance--aventura-6/juego4/subtitle.mp3';

function DraggableScene({ image, sceneId }: { image: string; sceneId: number }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `scene-${sceneId}`,
  });

  const dragStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 9999 as number }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '320px',
        height: '280px',
        position: 'relative',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        ...dragStyle,
      }}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing touch-none rounded-2xl overflow-hidden transition-all duration-200 ${
        isDragging ? 'opacity-80 scale-95' : 'hover:scale-105'
      }`}
    >
      <Image
        src={image}
        alt="Escena"
        fill
        className="object-contain"
        draggable={false}
        unoptimized
      />
    </div>
  );
}

function DropZoneArea({ id, isOver }: { id: Zone; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id });
  const isRed = id === 'red';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <Image
          src={isRed ? '/image/avanzado/aventura6/no.png' : '/image/avanzado/aventura6/ok.png'}
          alt={isRed ? 'Mal' : 'Bien'}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div
        ref={setNodeRef}
        className={`flex items-center justify-center rounded-3xl border-4 transition-all duration-200 ${
          isRed
            ? isOver ? 'bg-red-300 border-red-600 scale-105 shadow-xl' : 'bg-red-100 border-red-400'
            : isOver ? 'bg-green-300 border-green-600 scale-105 shadow-xl' : 'bg-green-100 border-green-400'
        }`}
        style={{ width: '266px', height: '200px' }}
      >
        <span className={`text-xl font-bold ${isRed ? 'text-red-700' : 'text-green-700'}`}>
          {isRed ? 'No está bien' : 'Está bien'}
        </span>
      </div>
    </div>
  );
}

export default function JuegoCuatroAventura6({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } });
  const sensors = useSensors(pointerSensor, touchSensor);

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

  const startScene = (index: number) => {
    setActiveZone(null);
    setCanContinue(false);
    setGameState(GameState.PLAYING);
    playAudio(scenes[index].questionAudio);
  };

  useEffect(() => {
    if (isVisible) {
      setGameState(GameState.INTRO);
      setRoundIndex(0);
      setActiveZone(null);
      setCanContinue(false);
      playAudio(TITLE_AUDIO).then(() => playAudio(SUBTITLE_AUDIO));
    } else {
      stopAudio();
    }
  }, [isVisible]);

  const handleDragOver = (event: DragOverEvent) => {
    setActiveZone((event.over?.id as Zone) ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveZone(null);
    if (!event.over) return;

    const droppedZone = event.over.id as Zone;
    const scene = scenes[roundIndex];
    const correct = droppedZone === scene.correctZone;

    setIsCorrect(correct);
    setCanContinue(false);
    setGameState(GameState.FEEDBACK);

    await playAudio(correct ? '/audio/YES.mp3' : '/audio/NO.mp3');
    await playAudio(correct ? scene.correctFeedbackAudio : scene.wrongFeedbackAudio);
    setCanContinue(true);
  };

  const handleNext = () => {
    const nextIndex = roundIndex + 1;
    if (nextIndex >= scenes.length) {
      setGameState(GameState.COMPLETED);
    } else {
      setRoundIndex(nextIndex);
      startScene(nextIndex);
    }
  };

  if (!isVisible) return null;

  const currentScene = scenes[roundIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="juego4-av6-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {gameState !== GameState.COMPLETED && (
          <motion.div
            className="relative bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden min-h-[620px]"
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
              <div className="flex flex-col items-center justify-center p-12 min-h-[620px] gap-8">
                <EscucharInstruccionesButton
                  onPlayInstructions={() => playAudio(SUBTITLE_AUDIO)}
                  position="top-right"
                />
                <motion.h2
                  className="text-5xl font-bold text-violet-700 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ¿Qué hacemos cuando nos dejan?
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 text-center max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Escucha cada situación y arrastra la imagen al recuadro verde si está bien, o al rojo si está mal.
                </motion.p>
                <motion.button
                  onClick={() => { stopAudio(); setRoundIndex(0); startScene(0); }}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
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
            {gameState === GameState.PLAYING && (
              <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="flex flex-col p-6 gap-5 min-h-[620px]">
                  {/* Progress bar */}
                  <div className="flex items-center justify-center gap-2">
                    {scenes.map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          i < roundIndex ? 'bg-violet-400 w-8'
                          : i === roundIndex ? 'bg-violet-600 w-12'
                          : 'bg-violet-200 w-8'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold text-gray-500 ml-2">
                      {roundIndex + 1} / {scenes.length}
                    </span>
                  </div>

                  {/* Buttons row */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => playAudio(currentScene.questionAudio)}
                      className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold text-sm"
                    >
                      🔊 Escuchar situación
                    </button>
                    <button
                      onClick={() => playAudio(SUBTITLE_AUDIO)}
                      className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold text-sm"
                    >
                      🔊 Escuchar instrucciones
                    </button>
                  </div>

                  {/* Drop zones + draggable image */}
                  <div className="flex items-center justify-between gap-6 px-4 flex-1">
                    <DropZoneArea id="red" isOver={activeZone === 'red'} />
                    <DraggableScene image={currentScene.image} sceneId={currentScene.id} />
                    <DropZoneArea id="green" isOver={activeZone === 'green'} />
                  </div>
                </div>
              </DndContext>
            )}

            {/* FEEDBACK */}
            {gameState === GameState.FEEDBACK && (
              <motion.div
                className="flex flex-col items-center justify-center p-8 min-h-[620px] gap-8"
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
                    className="flex items-center gap-2 text-violet-500"
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
                    className="bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {roundIndex + 1 >= scenes.length ? '¡Terminar!' : 'Siguiente →'}
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
          bgColor="bg-violet-500/20"
          textColor="text-violet-800"
          onComplete={onGameComplete}
          autoCloseDelay={3000}
        />
      </motion.div>
    </AnimatePresence>
  );
}
