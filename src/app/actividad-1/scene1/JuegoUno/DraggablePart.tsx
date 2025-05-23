// 'use client';
import Image from 'next/image';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

interface DraggablePartProps {
  id: string;
  image: string;
}

const DraggablePart: React.FC<DraggablePartProps> = ({ id, image }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined
      }}
      className="cursor-grab"
    >
      <div className="w-[80px] h-[80px] relative">
        <Image
          src={image}
          alt={id}
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
    </div>
  );
};

export default DraggablePart;