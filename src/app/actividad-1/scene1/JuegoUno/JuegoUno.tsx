'use client';

import React, { useState } from 'react';
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import Image from 'next/image';
import { bodyParts } from './config';

interface JuegoUnoProps {
  isVisible: boolean;
  onClose: () => void;
}

const DropZone = ({ id, position, isMatched }: any) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`absolute w-16 h-16 rounded-full transition-all duration-300 ${
        isMatched ? 'bg-green-400/50 border-2 border-white' : 'bg-white/20 border border-white/30'
      }`}
      style={{ top: position.top, left: position.left }}
    />
  );
};

const DraggablePart = ({ id, image }: any) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
      }}
      className="cursor-grab"
    >
      <Image
        src={image}
        alt={id}
        width={60}
        height={60}
        className="object-contain"
        style={{ height: 'auto' }}
      />
    </div>
  );
};

const JuegoUno: React.FC<JuegoUnoProps> = ({ isVisible, onClose }) => {
  const [matchedParts, setMatchedParts] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'ok' | 'wrong' | null>(null);

  const handleDragEnd = (event: any) => {
    const { over, active } = event;
    if (!over) return;

    if (over.id === active.id) {
      setMatchedParts((prev) => [...prev, active.id]);
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
    <DndContext onDragEnd={handleDragEnd}>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
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
                <DraggablePart key={part.id} id={part.id} image={part.image} />
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
      </div>
    </DndContext>
  );
};

export default JuegoUno;
