'use client';
import Image from 'next/image';
import { useDraggable } from '@dnd-kit/core';
import { playGameAudio } from '../../../utils/gameAudio';

interface DraggablePartProps {
  id: string;
  image: string;
  sound: string;
}

const DraggablePart: React.FC<DraggablePartProps> = ({ id, image, sound }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  

  const playSound = () => {
    playGameAudio(sound, 0.7, `DraggablePart-${id}`);
  };


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
    <div className="w-[60px] h-[60px] relative">

      {/* Transparent overlay to trigger sound */}
      <button
        className="absolute inset-0 z-10 bg-transparent"
        onTouchStart={playSound}
        onMouseDown={playSound}
        aria-label={`Play sound for ${id}`}
      >

      <Image
          src={image}
          alt={id}
          layout="fill"
          objectFit="contain"
          priority
        />
      </button>
      </div>

    </div>
  );
};

export default DraggablePart;
