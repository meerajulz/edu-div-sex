'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverEvent, useDraggable, useDroppable, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';
import { getCharacterGameConfig, HYGIENE_GAME_CONFIG } from './config';

interface Step3Props {
  character: Character;
  onStepComplete: (isCorrect: boolean) => void;
}

interface DraggableSoapProps {
  isDragging: boolean;
}

interface DropZoneProps {
  id: string;
  image: string;
  alt: string;
  position: 'left' | 'right';
  isOver: boolean;
}

interface FeedbackOverlayProps {
  isVisible: boolean;
  isCorrect: boolean;
  onComplete: () => void;
}

const DraggableSoap: React.FC<DraggableSoapProps> = ({ isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'soap',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing touch-none z-50 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <Image
          src="/image/actividad_4/juego1/enjabonarse/jabon.png"
          alt="Jabón"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};

const DropZone: React.FC<DropZoneProps> = ({ id, image, alt, isOver }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative w-48 h-40 md:w-48 md:h-48 transition-all duration-200 ${
        isOver ? 'scale-110' : ''
      }`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ isVisible, isCorrect, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // Show feedback for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <Image
          src={isCorrect ? HYGIENE_GAME_CONFIG.feedbackImages.correct : HYGIENE_GAME_CONFIG.feedbackImages.incorrect}
          alt={isCorrect ? 'Correcto' : 'Incorrecto'}
          fill
          className="object-contain"
        />
      </div>
    </motion.div>
  );
};

export default function Step3({ character, onStepComplete }: Step3Props) {
  const [titlePlayed, setTitlePlayed] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [soapDropped, setSoapDropped] = useState(false);

  // Touch and mouse sensors for iPad support
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const config = getCharacterGameConfig(character!);
  const stepData = config?.steps?.[2]; // Step 3 data

  // Play title audio when component mounts - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    if (!stepData) return;

    const timer = setTimeout(() => {
      try {
        const audio = new Audio(stepData.audio.title);
        audio.volume = 0.7;
        setCurrentAudio(audio);
        
        audio.play().then(() => {
          setTimeout(() => {
            setTitlePlayed(true);
            setShowElements(true);
            setCurrentAudio(null);
          }, stepData.audio.duration);
        }).catch(console.warn);
      } catch (error) {
        console.warn('Could not play title audio:', error);
        setTimeout(() => {
          setTitlePlayed(true);
          setShowElements(true);
        }, 2000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [stepData]);

  // Cleanup audio on unmount - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  // Early return AFTER hooks
  if (!stepData) {
    console.error('Step 3 data not found in config');
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-white text-lg">Error: Step 3 configuration not found</div>
      </div>
    );
  }

  const playFeedbackAudio = (correct: boolean) => {
    try {
      // Play immediate feedback sound
      const feedbackSound = new Audio(
        correct ? HYGIENE_GAME_CONFIG.feedbackSounds.correct : HYGIENE_GAME_CONFIG.feedbackSounds.incorrect
      );
      feedbackSound.volume = 0.7;
      feedbackSound.play().catch(console.warn);

      // Play descriptive feedback after a short delay
      setTimeout(() => {
        const descriptionAudio = new Audio(
          correct ? stepData.feedback.correct.audio : stepData.feedback.incorrect.audio
        );
        descriptionAudio.volume = 0.7;
        setCurrentAudio(descriptionAudio);
        
        // Use the actual audio duration, not config duration
        descriptionAudio.addEventListener('loadedmetadata', () => {
          const audioDuration = Math.ceil(descriptionAudio.duration * 1000);
          
          descriptionAudio.play().then(() => {
            setTimeout(() => {
              setCurrentAudio(null);
              
              if (correct) {
                onStepComplete(true);
              } else {
                // Reset for another attempt - wait for full feedback
                setSoapDropped(false);
                setShowFeedback(false);
              }
            }, audioDuration + 500);
          }).catch(console.warn);
        });

        // Fallback if metadata doesn't load - use config duration
        setTimeout(() => {
          if (currentAudio === descriptionAudio) {
            setCurrentAudio(null);
            if (correct) {
              onStepComplete(true);
            } else {
              setSoapDropped(false);
              setShowFeedback(false);
            }
          }
        }, (correct ? stepData.feedback.correct.duration : stepData.feedback.incorrect.duration) + 1000);
        
      }, 1000);
    } catch (error) {
      console.warn('Could not play feedback audio:', error);
      setTimeout(() => {
        if (correct) {
          onStepComplete(true);
        } else {
          setSoapDropped(false);
          setShowFeedback(false);
        }
      }, correct ? stepData.feedback.correct.duration : stepData.feedback.incorrect.duration);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setActiveDropZone(over?.id?.toString() || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    setIsDragging(false);
    setActiveDropZone(null);

    if (!over || soapDropped) return;

    const dropZone = stepData.elements.dropZones.find(zone => zone.id === over.id?.toString());
    if (!dropZone) return;

    setSoapDropped(true);
    const correct = dropZone.isCorrect;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Play feedback audio and complete step
    playFeedbackAudio(correct);
  };

  const handleFeedbackComplete = () => {
    setShowFeedback(false);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Title display */}
      {!titlePlayed && (
        <motion.div
          className="text-center text-white text-lg font-bold bg-black/30 backdrop-blur-sm rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {stepData.title}
        </motion.div>
      )}

      {/* Game elements */}
      {showElements && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col items-center justify-center w-full h-full px-4 py-8">
            {/* Center: Draggable soap */}
            {!soapDropped && (
              <motion.div
                className="flex flex-col items-center space-y-3 mb-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <DraggableSoap isDragging={isDragging} />
              </motion.div>
            )}
            
            {/* Bottom: Drop zones */}
            <div className="flex items-end justify-between w-full max-w-lg mt-auto mb-6">
              {/* Left: Correct area */}
              <div className="flex flex-col items-center space-y-2">
                <DropZone
                  id="correct_area"
                  image={stepData.elements.dropZones[0].image}
                  alt={stepData.elements.dropZones[0].alt}
                  position="left"
                  isOver={activeDropZone === 'correct_area'}
                />
              </div>

              {/* Right: Incorrect area */}
              <div className="flex flex-col items-center space-y-2">
                <DropZone
                  id="incorrect_area"
                  image={stepData.elements.dropZones[1].image}
                  alt={stepData.elements.dropZones[1].alt}
                  position="right"
                  isOver={activeDropZone === 'incorrect_area'}
                />
              </div>
            </div>
          </div>
        </DndContext>
      )}

      {/* Feedback overlay */}
      <FeedbackOverlay
        isVisible={showFeedback}
        isCorrect={isCorrect}
        onComplete={handleFeedbackComplete}
      />
    </div>
  );
}