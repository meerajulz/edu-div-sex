'use client';

import React, { useEffect, useState } from 'react';
import { 
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  PointerSensor
 } from '@dnd-kit/core';
import Image from 'next/image';
import { bodyParts } from './config';
import DraggablePart from './DraggablePart';
import DropZone from './DropZone';
import CongratsOverlay from './CongratsOverlay';

interface JuegoUnoProps {
  isVisible: boolean;
  onClose: () => void;
}

const JuegoUno: React.FC<JuegoUnoProps> = ({ isVisible, onClose }) => {
  const [matchedParts, setMatchedParts] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'ok' | 'wrong' | null>(null);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);
  const pointerSensor = useSensor(PointerSensor);
  const [showCongrats, setShowCongrats] = useState(false);

  // Detect when all parts are matched
  useEffect(() => {
    if (matchedParts.length === bodyParts.length) {
      setShowCongrats(true);
    }
  }, [matchedParts]);


  const handleDragEnd = (event: any) => {
    const { over, active } = event;
    if (!over) return;

    if (over.id === active.id) {
      setMatchedParts((prev) => [...prev, active.id]);
      setFeedback('ok');
     // new Audio('/audio/actividad-1/escena_1/Game_Score.mp3').play();
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
        <div className="relative w-[90%] h-[90%] bg-white/10 border-2 border-white/30 backdrop-blur-md rounded-xl shadow-xl pointer-events-auto overflow-hidden">

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 text-white text-sm bg-red-600/80 hover:bg-red-700 px-4 py-2 rounded-full shadow"
          >
            Salir juego
          </button>

          {/* Baby image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/image/escena_1/juego/BOY.png"
              alt="Baby"
              layout="fill"
              objectFit="contain"
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

export default JuegoUno;


