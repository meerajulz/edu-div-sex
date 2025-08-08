'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, useDraggable, useDroppable, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';
import { getCharacterGameConfig, HYGIENE_GAME_CONFIG } from './config';

interface Step4Props {
  character: Character;
  onStepComplete: (isCorrect: boolean) => void;
}

interface DraggableShowerProps {
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

interface CounterProps {
  current: number;
  total: number;
}

const Counter: React.FC<CounterProps> = ({ current, total }) => {
  return (
    <motion.div
      className="absolute top-4 left-0 transform -translate-x-1/2 z-40"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      key={current} // Re-animate when count changes
      transition={{ duration: 0.3 }}
    >
      <div className="bg-blue-500/80 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
        {current}/{total}
      </div>
    </motion.div>
  );
};

const DraggableShower: React.FC<DraggableShowerProps> = ({ isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'shower',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // Use different image when dragging
  const showerImage = isDragging 
    ? '/image/actividad_4/juego1/enjugarse/ducha_2.png'
    : '/image/actividad_4/juego1/enjugarse/ducha_1.png';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing touch-none z-50 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="relative w-24 h-32 md:w-32 md:h-40">
        <Image
          src={showerImage}
          alt="Ducha"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};

const DropZone: React.FC<DropZoneProps> = ({ id, image, alt, position, isOver }) => {
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

export default function Step4({ character, onStepComplete }: Step4Props) {
  const [titlePlayed, setTitlePlayed] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [showerDropped, setShowerDropped] = useState(false);
  
  // For Cris: track multiple drops
  const [dropCount, setDropCount] = useState(0);
  const requiredDrops = character === 'cris' ? 3 : 1;

  // Touch and mouse sensors for iPad support
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const config = getCharacterGameConfig(character!);
  const stepData = config.steps[3]; // Step 4 data (index 3)

  // Early return if step data doesn't exist
  if (!stepData) {
    console.error('Step 4 data not found in config');
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-white text-lg">Error: Step 4 configuration not found</div>
      </div>
    );
  }

  // Play title audio when component mounts
  useEffect(() => {
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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  const playFeedbackAudio = (correct: boolean, isPartial: boolean = false) => {
    try {
      // Play immediate feedback sound
      const feedbackSound = new Audio(
        correct ? HYGIENE_GAME_CONFIG.feedbackSounds.correct : HYGIENE_GAME_CONFIG.feedbackSounds.incorrect
      );
      feedbackSound.volume = 0.7;
      feedbackSound.play().catch(console.warn);

      // Play descriptive feedback after a short delay
      setTimeout(() => {
        let descriptionAudio: HTMLAudioElement;
        
        if (character === 'cris') {
          if (isPartial) {
            // 1-2 drops: wrong feedback
            descriptionAudio = new Audio('/audio/actividad-4/juego1/enjugarse/cris/fb-i-step4.mp3');
          } else if (correct) {
            // 3 drops: correct feedback
            descriptionAudio = new Audio('/audio/actividad-4/juego1/enjugarse/fb-step4.mp3');
          } else {
            // Error case
            descriptionAudio = new Audio('/audio/actividad-4/juego1/enjugarse/cris/fb-i-step4.mp3');
          }
        } else {
          // Dani: use correct or incorrect audio based on choice
          descriptionAudio = new Audio(
            correct 
              ? '/audio/actividad-4/juego1/enjugarse/fb-step4.mp3'
              : '/audio/actividad-4/juego1/enjugarse/dani/fb-i-step4.mp3'
          );
        }

        descriptionAudio.volume = 0.7;
        setCurrentAudio(descriptionAudio);
        
        // Use the actual audio duration
        descriptionAudio.addEventListener('loadedmetadata', () => {
          const audioDuration = Math.ceil(descriptionAudio.duration * 1000);
          
          descriptionAudio.play().then(() => {
            setTimeout(() => {
              setCurrentAudio(null);
              
              if (correct && !isPartial) {
                // Step completed successfully
                onStepComplete(true);
              } else {
                // Reset for another attempt
                if (character === 'cris' && isPartial) {
                  // Don't reset shower for partial - allow continuing
                  setShowFeedback(false);
                } else {
                  // Full reset for wrong answers
                  setShowerDropped(false);
                  setShowFeedback(false);
                  if (character === 'cris') {
                    setDropCount(0);
                  }
                }
              }
            }, audioDuration + 500);
          }).catch(console.warn);
        });

        // Fallback timing
        setTimeout(() => {
          if (currentAudio === descriptionAudio) {
            setCurrentAudio(null);
            if (correct && !isPartial) {
              onStepComplete(true);
            } else {
              if (character === 'cris' && isPartial) {
                setShowFeedback(false);
              } else {
                setShowerDropped(false);
                setShowFeedback(false);
                if (character === 'cris') {
                  setDropCount(0);
                }
              }
            }
          }
        }, 5000); // 5 second fallback
        
      }, 1000);
    } catch (error) {
      console.warn('Could not play feedback audio:', error);
      setTimeout(() => {
        if (correct && !isPartial) {
          onStepComplete(true);
        } else {
          setShowerDropped(false);
          setShowFeedback(false);
          if (character === 'cris') {
            setDropCount(0);
          }
        }
      }, 3000);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragOver = (event: any) => {
    const { over } = event;
    setActiveDropZone(over?.id || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    setIsDragging(false);
    setActiveDropZone(null);

    if (!over) return;

    // For Cris: 3x drop requirement on vulva area
    if (character === 'cris' && over.id === 'vulva_area') {
      const newCount = dropCount + 1;
      setDropCount(newCount);
      
      if (newCount < requiredDrops) {
        // Not enough drops yet - show partial feedback (1-2 drops = wrong)
        setIsCorrect(false);
        setShowFeedback(true);
        playFeedbackAudio(false, true); // isPartial = true
      } else {
        // 3 drops completed - success!
        setShowerDropped(true);
        setIsCorrect(true);
        setShowFeedback(true);
        playFeedbackAudio(true, false); // complete success
      }
      return;
    }

    // For Dani: simple correct/incorrect choice
    if (character === 'dani') {
      const dropZone = stepData.elements.dropZones.find(zone => zone.id === over.id);
      if (!dropZone || showerDropped) return;

      setShowerDropped(true);
      const correct = dropZone.isCorrect;
      setIsCorrect(correct);
      setShowFeedback(true);

      playFeedbackAudio(correct);
    }
  };

  const handleFeedbackComplete = () => {
    setShowFeedback(false);
  };

  const renderCrisLayout = () => (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 py-8">
      {/* Counter for Cris - shows 0/3, 1/3, 2/3, 3/3 */}
      {showElements && (
        <Counter current={dropCount} total={requiredDrops} />
      )}
      
      {/* Center: Draggable shower */}
      {!showerDropped && (
        <motion.div
          className="flex flex-col items-center space-y-3 "
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DraggableShower isDragging={isDragging} />
        </motion.div>
      )}
      
      {/* Right side: Vulva area */}
      <div className="flex justify-end w-full mt-auto mb-6 pr-8">
        <div className="flex flex-col items-center space-y-2">
          <DropZone
            id="vulva_area"
            image="/image/actividad_4/juego1/enjugarse/vulva.png"
            alt="Vulva"
            position="right"
            isOver={activeDropZone === 'vulva_area'}
          />
        </div>
      </div>
    </div>
  );

  const renderDaniLayout = () => (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 py-8">
      {/* Center: Draggable shower */}
      {!showerDropped && (
        <motion.div
          className="flex flex-col items-center space-y-3 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DraggableShower isDragging={isDragging} />
        </motion.div>
      )}
      
      {/* Bottom: Drop zones */}
      <div className="flex items-end justify-between w-full max-w-lg mt-auto mb-6">
        {/* Left: Correct area */}
        <div className="flex flex-col items-center space-y-2">
          <DropZone
            id="correct_area"
            image="/image/actividad_4/juego1/enjugarse/pene-ok.png"
            alt="Pene (correcto)"
            position="left"
            isOver={activeDropZone === 'correct_area'}
          />
        </div>

        {/* Right: Incorrect area */}
        <div className="flex flex-col items-center space-y-2">
          <DropZone
            id="incorrect_area"
            image="/image/actividad_4/juego1/enjugarse/pene-jabon.png"
            alt="Pene con jabón (incorrecto)"
            position="right"
            isOver={activeDropZone === 'incorrect_area'}
          />
        </div>
      </div>
    </div>
  );

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
          {character === 'cris' ? renderCrisLayout() : renderDaniLayout()}
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