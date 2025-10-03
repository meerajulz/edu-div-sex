'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, useDraggable, useDroppable, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';
import { getCharacterGameConfig, HYGIENE_GAME_CONFIG } from './config';
import { playGameAudio, createGameAudio } from '../../../utils/gameAudio';

interface Step1Props {
  character: Character;
  onStepComplete: (isCorrect: boolean) => void;
}

interface DraggableClothesProps {
  character: Character;
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

const DraggableClothes: React.FC<DraggableClothesProps> = ({ character, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'clothes',
  });

  const config = getCharacterGameConfig(character!);
  const clothesData = config.steps[0].elements.draggable;

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
      <div className="relative w-56 h-56 md:w-72 md:h-72 mt-10">
        <Image
          src={clothesData.image}
          alt={clothesData.alt}
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
      className={`relative w-40 h-40 md:w-48 md:h-48 transition-all duration-200 ${
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
      className={`absolute top-1/2 transform -translate-y-1/2 z-50 ${
        isCorrect ? 'right-8' : 'left-8'
      }`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-32 h-32 md:w-40 md:h-40">
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

export default function Step1({ character, onStepComplete }: Step1Props) {
  const [titlePlayed, setTitlePlayed] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [clothesDropped, setClothesDropped] = useState(false);

  // Touch and mouse sensors for iPad support
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const config = getCharacterGameConfig(character!);
  const stepData = config.steps[0];

  // Play title audio when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const audio = createGameAudio(stepData.audio.title, 0.7, 'Step1 Title Audio');
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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  const playFeedbackAudio = (correct: boolean) => {
    try {
      // Play immediate feedback sound
      playGameAudio(
        correct ? HYGIENE_GAME_CONFIG.feedbackSounds.correct : HYGIENE_GAME_CONFIG.feedbackSounds.incorrect,
        0.7,
        `Step1 ${correct ? 'Correct' : 'Incorrect'} Feedback`
      );

      // Play descriptive feedback after a short delay
      setTimeout(() => {
        const descriptionAudio = createGameAudio(
          correct ? stepData.feedback.correct.audio : stepData.feedback.incorrect.audio,
          0.7,
          `Step1 ${correct ? 'Correct' : 'Incorrect'} Description`
        );
        setCurrentAudio(descriptionAudio);
        
        // Use the actual audio duration, not config duration
        descriptionAudio.addEventListener('loadedmetadata', () => {
          const audioDuration = Math.ceil(descriptionAudio.duration * 1000); // Convert to milliseconds
          
          descriptionAudio.play().then(() => {
            setTimeout(() => {
              setCurrentAudio(null);
              
              // If correct, complete the step and move to next
              // If incorrect, reset and let them try again
              if (correct) {
                onStepComplete(true);
              } else {
                // Reset for another attempt - wait for full feedback
                setClothesDropped(false);
                setShowFeedback(false);
              }
            }, audioDuration + 500); // Add 500ms buffer
          }).catch(console.warn);
        });

        // Fallback if metadata doesn't load - use config duration
        setTimeout(() => {
          if (currentAudio === descriptionAudio) {
            setCurrentAudio(null);
            if (correct) {
              onStepComplete(true);
            } else {
              setClothesDropped(false);
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
          // Reset for another attempt
          setClothesDropped(false);
          setShowFeedback(false);
        }
      }, correct ? stepData.feedback.correct.duration : stepData.feedback.incorrect.duration);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (event: any) => {
    const { over } = event;
    setActiveDropZone(over?.id || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    setIsDragging(false);
    setActiveDropZone(null);

    if (!over || clothesDropped) return;

    const dropZone = stepData.elements.dropZones.find(zone => zone.id === over.id);
    if (!dropZone) return;

    setClothesDropped(true);
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
          className="text-center text-white text-2xl font-bold bg-orange-500 backdrop-blur-sm rounded-lg px-8 py-6 shadow-lg"
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
            {/* Center: Draggable clothes - moved down from top */}
            {!clothesDropped && (
              <motion.div
                className="flex flex-col items-center space-y-3 mb-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <DraggableClothes character={character} isDragging={isDragging} />
                <div className="text-black text-xl font-bold">
                  Arrastra la ropa
                </div>
              </motion.div>
            )}
            
            {/* Bottom: Drop zones */}
            <div className="flex items-end justify-between w-full px-8 mt-auto mb-12">
              {/* Left: Basket */}
              <div className="flex flex-col items-center space-y-2">
                <DropZone
                  id="basket"
                  image={stepData.elements.dropZones[0].image}
                  alt={stepData.elements.dropZones[0].alt}
                  position="left"
                  isOver={activeDropZone === 'basket'}
                />
              </div>

              {/* Right: WC */}
              <div className="flex flex-col items-center space-y-2">
                <DropZone
                  id="wc"
                  image={stepData.elements.dropZones[1].image}
                  alt={stepData.elements.dropZones[1].alt}
                  position="right"
                  isOver={activeDropZone === 'wc'}
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