'use client';

import React, { useEffect, useState } from 'react';
import { 
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent
 } from '@dnd-kit/core';
import Image from 'next/image';
import { bodyParts } from './config';
import DraggablePart from './DraggablePart';
import DropZone from './DropZone';
import CongratsOverlay from './CongratsOverlay';

interface JuegoDosProps {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete?: () => void; // Add callback for game completion
}

const JuegoDos: React.FC<JuegoDosProps> = ({ isVisible, onClose, onGameComplete }) => {



  const [matchedParts, setMatchedParts] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'ok' | 'wrong' | null>(null);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [showCongrats, setShowCongrats] = useState(false);

  // Detect when all parts are matched
  useEffect(() => {
    if (matchedParts.length === bodyParts.length) {
      setShowCongrats(true);

      setTimeout(() => {
        setShowCongrats(false);
        // Game complete - close and trigger completion callback
        onClose();
        if (onGameComplete) {
          onGameComplete();
        }
      }, 2500);
    }
  }, [matchedParts, onClose, onGameComplete]);

  useEffect(() => {
    if (isVisible) {
      setMatchedParts([]);
      setFeedback(null);
      setShowCongrats(false);
    }
  }, [isVisible]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    if (over.id === active.id) {
      setMatchedParts((prev) => [...prev, String(active.id)]);
      setFeedback('ok');
      new Audio('/audio/actividad-1/escena_1/Game_Score.mp3').play();
    } else {
      setFeedback('wrong');
      new Audio('/audio/actividad-1/escena_1/Game_No_Score.mp3').play();
    }

    setTimeout(() => setFeedback(null), 1000);
  };

  const handleClose = () => {
    setMatchedParts([]);
    setFeedback(null);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
        <div className="relative w-[90%] h-[90%] max-w-3xl bg-white/10 border-2 border-white/30 backdrop-blur-md rounded-xl shadow-xl pointer-events-auto overflow-hidden">

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
          >
            Salir juego
          </button>

          {/* Center image - Full responsive */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pl-24 pr-4 py-4">
            <div className="relative w-full h-full">
              <Image
                src="/image/juego_2/nenas.png"
                alt="Nenas"
                fill
                className="object-contain"
                priority
              />
              {bodyParts.map((part) => (
                <DropZone
                  key={part.id}
                  id={part.id}
                  position={part.position}
                  isMatched={matchedParts.includes(part.id)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar with draggable parts */}
          <div className="absolute left-0 top-0 z-10 h-full w-24 flex flex-col items-center justify-center space-y-4 bg-black/10 p-2">
            {bodyParts.map((part) =>
              !matchedParts.includes(part.id) && (
                <DraggablePart key={part.id} id={part.id} image={part.image} sound={part.sound}/>
              )
            )}
          </div>

          {/* Feedback */}
          {feedback === 'ok' && (
            <div className="absolute top-1/2 -translate-y-1/2 left-[20%] z-20">
              <Image
                src="/image/escena_1/juego/correct.png"
                alt="Correcto"
                width={80}
                height={80}
              />
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="absolute top-1/2 -translate-y-1/2 right-[20%] z-20">
              <Image
                src="/image/escena_1/juego/incorrect.png"
                alt="Incorrecto"
                width={80}
                height={80}
              />
            </div>
          )}
        </div>
        
        {showCongrats && (
          <CongratsOverlay onComplete={() => setShowCongrats(false)} />
        )}
      </div>
    </DndContext>
  );
};

export default JuegoDos;