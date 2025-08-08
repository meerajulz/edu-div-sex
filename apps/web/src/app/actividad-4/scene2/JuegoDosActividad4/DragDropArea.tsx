// DragDropArea Component - Main game area with @dnd-kit drag and drop functionality

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, useDraggable, useDroppable, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import Image from 'next/image';
import { GAME_CONFIG } from './config';

interface DragDropAreaProps {
  onCorrectDrop: (imageId: string, position: number) => void;
  onIncorrectDrop: (imageId: string, position: number) => void;
  currentSequence: (string | null)[];
}

interface DragItem {
  id: string;
  path: string;
  alt: string;
  order: number;
}

interface DraggableImageProps {
  id: string;
  image: string;
  alt: string;
  isDragging: boolean;
}

interface DropZoneProps {
  position: number;
  isOver: boolean;
  currentImage: string | null;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ id, image, alt, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 9999, // High z-index when dragging
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative w-28 h-28 bg-blue-100 rounded-lg cursor-grab active:cursor-grabbing touch-none shadow-lg transition-all duration-200 ${
        isDragging ? 'opacity-80 scale-95 z-[9999]' : 'hover:scale-105 z-10'
      }`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="object-contain rounded p-2 pointer-events-none"
        draggable={false}
      />
    </div>
  );
};

const DropZone: React.FC<DropZoneProps> = ({ position, isOver, currentImage }) => {
  const { setNodeRef } = useDroppable({
    id: `dropzone-${position}`,
  });

  return (
    <motion.div
      ref={setNodeRef}
      className={`w-24 h-24 border-4 rounded-lg flex items-center justify-center shadow-lg transition-all duration-200 z-0 ${
        currentImage 
          ? 'bg-green-200 border-green-400' 
          : isOver 
            ? 'bg-yellow-300 border-yellow-500 scale-105' 
            : 'bg-yellow-200 border-yellow-400'
      }`}
      whileHover={{ scale: currentImage ? 1 : 1.02 }}
      style={{
        minHeight: '96px',
        minWidth: '96px',
        zIndex: 1 // Low z-index for drop zones
      }}
    >
      {currentImage && (
        <div className="relative w-20 h-20 z-0">
          <Image
            src={GAME_CONFIG.images.find(img => img.id === currentImage)?.path || ''}
            alt={GAME_CONFIG.images.find(img => img.id === currentImage)?.alt || ''}
            fill
            className="object-contain rounded"
          />
        </div>
      )}
      {!currentImage && (
        <div className="text-2xl font-bold text-yellow-600 z-0">
          {position + 1}
        </div>
      )}
    </motion.div>
  );
};

const DragDropArea: React.FC<DragDropAreaProps> = ({
  onCorrectDrop,
  onIncorrectDrop,
  currentSequence
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);

  // Touch and mouse sensors for iPad support
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 2 },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 50, tolerance: 10 },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

  // Get used image IDs from currentSequence
  const usedImages = useMemo(() => {
    return currentSequence.filter(id => id !== null) as string[];
  }, [currentSequence]);

  // Get shuffled images for initial display (memoized to prevent re-shuffling)
  const { leftSideImages, rightSideImages } = useMemo(() => {
    const shuffled = [...GAME_CONFIG.images].sort(() => Math.random() - 0.5);
    return {
      leftSideImages: shuffled.slice(0, 4),
      rightSideImages: shuffled.slice(4, 7)
    };
  }, []); // Empty dependency array to shuffle only once
  
  // Filter out already used images
  const availableLeftImages = leftSideImages.filter(img => !usedImages.includes(img.id));
  const availableRightImages = rightSideImages.filter(img => !usedImages.includes(img.id));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = (event: any) => {
    const draggedId = event.active.id.toString();
    console.log('🎮 Drag started:', draggedId);
    setIsDragging(true);
    
    // Play the audio for the item being dragged immediately
    const imageData = GAME_CONFIG.images.find(img => img.id === draggedId);
    if (imageData) {
      console.log('🎵 Playing drag audio:', imageData.audio);
      try {
        const audio = new Audio(imageData.audio);
        audio.volume = 0.7;
        audio.play().catch(console.warn);
      } catch (error) {
        console.warn('Could not play drag audio:', error);
      }
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (event: any) => {
    const { over } = event;
    setActiveDropZone(over?.id || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('🎮 Drag ended:', active?.id, 'over:', over?.id);
    
    setIsDragging(false);
    setActiveDropZone(null);

    if (!over || !active) return;
    
    // Extract position from dropzone id (format: "dropzone-{position}")
    const dropzoneMatch = over.id.toString().match(/^dropzone-(\d+)$/);
    if (!dropzoneMatch) return;
    
    const position = parseInt(dropzoneMatch[1]);
    const draggedId = active.id.toString();

    // Check if position is already occupied
    if (currentSequence[position] !== null) {
      console.log('🎮 Position already occupied');
      return;
    }

    const expectedImageId = GAME_CONFIG.images.find(img => img.order === position + 1)?.id;
    const isCorrect = draggedId === expectedImageId;

    console.log('🎮 Expected:', expectedImageId, 'Got:', draggedId, 'Correct:', isCorrect);

    if (isCorrect) {
      onCorrectDrop(draggedId, position);
    } else {
      onIncorrectDrop(draggedId, position);
    }
  };

  // Render drop zones in the specified layout
  const renderDropZones = () => {
    return GAME_CONFIG.dropZones.layout.map((row, rowIndex) => (
      <div 
        key={`row-${rowIndex}`}
        className={`flex justify-center gap-4 ${
          row.positions.length === 2 ? 'mb-4' : 
          row.positions.length === 3 ? 'mb-4' : 'mb-0'
        }`}
      >
        {row.positions.map(position => (
          <DropZone
            key={`dropzone-${position}`}
            position={position}
            isOver={activeDropZone === `dropzone-${position}`}
            currentImage={currentSequence[position]}
          />
        ))}
      </div>
    ));
  };

  // Render draggable images
  const renderDraggableImage = (item: DragItem, side: 'left' | 'right') => (
    <motion.div
      key={`${side}-${item.id}`}
      className="mb-3 touch-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DraggableImage
        id={item.id}
        image={item.path}
        alt={item.alt}
        isDragging={isDragging}
      />
    </motion.div>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="absolute inset-0 flex p-6 z-0">
        
        {/* Left Side Images */}
        <div className="w-1/3 flex flex-col items-center justify-center gap-3 z-10">
          <div className="bg-blue-50 border-4 border-blue-300 rounded-lg p-5 min-h-[450px] w-full flex flex-col items-center gap-3 z-10">
            
            {availableLeftImages.map(item => renderDraggableImage(item, 'left'))}
          </div>
        </div>

        {/* Center Drop Zone */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 z-0">
          <div className="bg-yellow-50 border-4 border-yellow-300 rounded-lg p-6 min-h-[450px] flex flex-col justify-center z-0">
            <div className="text-xl font-bold text-yellow-700 mb-6 text-center">
              Orden Correcto
            </div>
            <div className="flex flex-col items-center gap-4 z-0">
              {renderDropZones()}
            </div>
          </div>
        </div>

        {/* Right Side Images */}
        <div className="w-1/3 flex flex-col items-center justify-center gap-3 z-10">
          <div className="bg-blue-50 border-4 border-blue-300 rounded-lg p-5 min-h-[450px] w-full flex flex-col items-center gap-3 z-10">
            
            {availableRightImages.map(item => renderDraggableImage(item, 'right'))}
          </div>
        </div>

      </div>
    </DndContext>
  );
};

export default DragDropArea;