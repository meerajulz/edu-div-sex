'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverEvent, useDraggable, useDroppable, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';
import { getCharacterGameConfig, HYGIENE_GAME_CONFIG } from './config';
import { playGameAudio, createGameAudio } from '../../../utils/gameAudio';

interface Step6Props {
  character: Character;
  onStepComplete: (isCorrect: boolean) => void;
}

interface DraggableClothesProps {
  id: string;
  image: string;
  alt: string;
  isDragging: boolean;
}

interface DropZoneProps {
  isOver: boolean;
}

const DraggableClothes: React.FC<DraggableClothesProps> = ({ id, image, alt, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
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
      className={`relative w-40 h-40 md:w-56 md:h-56 cursor-grab active:cursor-grabbing touch-none z-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="object-contain pointer-events-none"
        priority
      />
    </div>
  );
};

const CharacterDropZone: React.FC<DropZoneProps> = ({ isOver }) => {
  const { setNodeRef } = useDroppable({
    id: 'character-dropzone',
  });

  return (
    <motion.div
      ref={setNodeRef}
      className={`relative w-[240px] h-[400px] transition-all duration-200 ${
        isOver ? 'scale-105 opacity-80' : ''
      }`}
      animate={{ scale: isOver ? 1.05 : 1 }}
    >
      {/* Character Image is provided by parent component */}
    </motion.div>
  );
};

export default function Step6({ character, onStepComplete }: Step6Props) {
  const config = getCharacterGameConfig(character as 'dani' | 'cris');
  const stepData = config.steps[5]; // Step 6 is at index 5 in the array
  
  // Override the dressed image paths to ensure they're correct
  const dressedImagePath = character === 'cris' 
    ? '/image/actividad_4/juego1/poner-ropa-limpia/cris/cris-vestido.png'
    : '/image/actividad_4/juego1/poner-ropa-limpia/dani/dani-vestido.png';
    
  // Extended feedback durations to ensure audio completes
  const feedbackDurations = {
    correct: 5000, // Increased from config default
    incorrect: 6000 // Increased from config default
  };

  const [titlePlayed, setTitlePlayed] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [clothesDropped, setClothesDropped] = useState(false);
  const [showDressed, setShowDressed] = useState(false);

  // Touch and mouse sensors for iPad support
  const mouseSensor = useSensor(MouseSensor, {
    // Reduced activation constraints for easier dragging
    activationConstraint: { distance: 2 },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Minimal constraints for better touch sensitivity
    activationConstraint: { delay: 50, tolerance: 10 },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

  // Play title audio when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const audio = createGameAudio(stepData.audio.title, 0.7, 'Step6 Title Audio');
        setCurrentAudio(audio);

        audio.play().then(() => {
          setTimeout(() => {
            setTitlePlayed(true);
            setShowElements(true);
            setCurrentAudio(null);
          }, stepData.audio.duration);
        }).catch(error => {
          console.warn('Could not play title audio:', error);
          setTitlePlayed(true);
          setShowElements(true);
        });
      } catch (error) {
        console.warn('Could not create audio:', error);
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
        `Step6 ${correct ? 'Correct' : 'Incorrect'} Feedback`
      );

      // Play descriptive feedback after a short delay
      setTimeout(() => {
        const descriptionAudio = createGameAudio(
          correct ? stepData.feedback.correct.audio : stepData.feedback.incorrect.audio,
          0.7,
          `Step6 ${correct ? 'Correct' : 'Incorrect'} Description`
        );
        setCurrentAudio(descriptionAudio);
        
        // Use the actual audio duration with a buffer, or fallback to extended durations
        descriptionAudio.addEventListener('loadedmetadata', () => {
          const audioDuration = Math.ceil(descriptionAudio.duration * 1000); // Convert to milliseconds
          // Add extra buffer time to ensure full playback
          const totalDuration = audioDuration + 1500; 
          
          descriptionAudio.play().then(() => {
            // Set a timer to handle completion after audio finishes
            setTimeout(() => {
              setCurrentAudio(null);
              
              // If correct, show dressed image and complete the step
              if (correct) {
                setShowDressed(true);
                console.log("Showing dressed character:", dressedImagePath);
                // Add extra delay before completing step
                setTimeout(() => {
                  onStepComplete(true);
                }, 2000); // Increased delay to ensure image is visible
              } else {
                // Reset for another attempt - wait for full feedback
                setClothesDropped(false);
                setShowFeedback(false);
              }
            }, totalDuration);
          }).catch(console.warn);
        });

        // Fallback if metadata doesn't load - use extended durations
        setTimeout(() => {
          if (currentAudio === descriptionAudio) {
            setCurrentAudio(null);
            if (correct) {
              setShowDressed(true);
              console.log("Fallback: Showing dressed character:", dressedImagePath);
              setTimeout(() => {
                onStepComplete(true);
              }, 2000);
            } else {
              setClothesDropped(false);
              setShowFeedback(false);
            }
          }
        }, correct ? feedbackDurations.correct : feedbackDurations.incorrect);
        
      }, 1000);
    } catch (error) {
      console.warn('Could not play feedback audio:', error);
      setTimeout(() => {
        if (correct) {
          setShowDressed(true);
          console.log("Error recovery: Showing dressed character:", dressedImagePath);
          setTimeout(() => {
            onStepComplete(true);
          }, 2000);
        } else {
          // Reset for another attempt
          setClothesDropped(false);
          setShowFeedback(false);
        }
      }, correct ? feedbackDurations.correct : feedbackDurations.incorrect);
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
    const { active, over } = event;
    setIsDragging(false);
    setActiveDropZone(null);

    // If no valid drop or already dropped, ignore
    if (!over || clothesDropped) return;
    
    // Only process drops on character-dropzone
    if (over.id === 'character-dropzone') {
      setClothesDropped(true);
      
      // Check if the selected clothes are correct
      const correct = active.id === stepData.elements.correctId;
      setIsCorrect(correct);
      setShowFeedback(true);
      
      // Play feedback and complete step if correct
      playFeedbackAudio(correct);
    }
  };

  // Get clothing items from config
  const leftClothes = stepData.elements.draggable.left || [];
  const rightClothes = stepData.elements.draggable.right || [];

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
          <div className="flex flex-col items-center justify-center w-full h-full mt-12">
            {/* Character in the middle (drop zone) */}
            <div className={`relative ${showDressed ? 'w-[420px] h-[700px]' : 'w-[240px] h-[400px]'} transition-all duration-500`}>
              <CharacterDropZone isOver={activeDropZone === 'character-dropzone'} />
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={showDressed ? dressedImagePath : stepData.elements.characterImage}
                  alt={`${character} ${showDressed ? 'vestido' : 'sin vestir'}`}
                  fill
                  className="object-contain pointer-events-none"
                  priority
                />
              </div>
              {!clothesDropped && (
                <motion.div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 px-3 py-1 rounded-full text-sm font-medium shadow-md"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                
                </motion.div>
              )}
            </div>

            {/* Clothes options */}
            <div className="flex absolute justify-between w-full px-16">
              {/* Left clothing option */}
              <div className="flex flex-col items-center">
                {!clothesDropped && leftClothes.map(item => (
                  <motion.div
                    key={item.id}
                    className="mb-4 touch-none" // Added touch-none to prevent touch scrolling interference
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <DraggableClothes
                      id={item.id}
                      image={item.image}
                      alt={item.alt}
                      isDragging={isDragging}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Right clothing option */}
              <div className="flex flex-col items-center">
                {!clothesDropped && rightClothes.map(item => (
                  <motion.div
                    key={item.id}
                    className="mb-4 touch-none" // Added touch-none to prevent touch scrolling interference
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <DraggableClothes
                      id={item.id}
                      image={item.image}
                      alt={item.alt}
                      isDragging={isDragging}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </DndContext>
      )}

      {/* Feedback icon */}
      {showFeedback && (
        <motion.div
          className={`absolute top-1/2 transform -translate-y-1/2 z-50 ${
            isCorrect ? 'right-8' : 'left-8'
          }`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
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
      )}

    </div>
  );
}