'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, useDraggable, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';
import { getCharacterGameConfig, HYGIENE_GAME_CONFIG } from './config';
import { createGameAudio } from '../../../utils/gameAudio';

interface Step5Props {
  character: Character;
  onStepComplete: (isCorrect: boolean) => void;
}

interface DraggableTowelProps {
  id: string;
  image: string;
  alt: string;
  isDragging: boolean;
}

const DraggableTowel: React.FC<DraggableTowelProps> = ({ id, image, alt, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        WebkitTouchCallout: 'none' as const,
        WebkitUserSelect: 'none' as const,
      }
    : {
        WebkitTouchCallout: 'none' as const,
        WebkitUserSelect: 'none' as const,
      };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`cursor-grab active:cursor-grabbing touch-none z-50 ${isDragging ? 'opacity-50' : ''}`}
      onContextMenu={handleContextMenu}
    >
      <div className="relative w-40 h-40 md:w-56 md:h-56">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain pointer-events-none"
          priority
          draggable={false}
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
          }}
          onContextMenu={handleContextMenu}
        />
      </div>
    </div>
  );
};

export default function Step5({ character, onStepComplete }: Step5Props) {
  const [titlePlayed, setTitlePlayed] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [towelDropped, setTowelDropped] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const config = getCharacterGameConfig(character!);
  const stepData = config.steps[4]; // step5 = index 4

  const correctId = character === 'cris' ? 'cris_towel' : 'dani_towel';

  const characterImage = character === 'cris'
    ? '/image/actividad_4/juego1/secar/cris-secar.png'
    : '/image/actividad_4/juego1/secar/dani-secar.png';

  const towels = [
    {
      id: 'cris_towel',
      image: '/image/actividad_4/juego1/secar/toalla-cris.png',
      alt: 'Toalla de Cris',
    },
    {
      id: 'dani_towel',
      image: '/image/actividad_4/juego1/secar/toalla-dani.png',
      alt: 'Toalla de Dani',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const audio = createGameAudio(stepData.audio.title, 0.7, 'Step5 Title Audio');
      setCurrentAudio(audio);
      audio.play().then(() => {
        setTimeout(() => {
          setTitlePlayed(true);
          setShowElements(true);
          setCurrentAudio(null);
        }, stepData.audio.duration);
      }).catch(() => {
        setTitlePlayed(true);
        setShowElements(true);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [stepData]);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    setIsDragging(false);

    if (towelDropped) return;

    const correct = active.id === correctId;
    setTowelDropped(true);
    setIsCorrect(correct);
    setShowFeedback(true);

    const feedbackAudio = createGameAudio(
      correct ? stepData.feedback.correct.audio : stepData.feedback.incorrect.audio,
      0.7,
      `Step5 ${correct ? 'Correct' : 'Incorrect'} Feedback`
    );
    setCurrentAudio(feedbackAudio);

    feedbackAudio.addEventListener('loadedmetadata', () => {
      feedbackAudio.play().then(() => {
        setTimeout(() => {
          setCurrentAudio(null);
          if (correct) {
            onStepComplete(true);
          } else {
            setTowelDropped(false);
            setShowFeedback(false);
          }
        }, Math.ceil(feedbackAudio.duration * 1000));
      });
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {!titlePlayed && (
        <motion.div
          className="text-center text-white text-2xl font-bold bg-orange-500 backdrop-blur-sm rounded-lg px-8 py-6 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {stepData.title}
        </motion.div>
      )}

      {showElements && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex items-center justify-center w-full h-full gap-6">
            <div className="relative w-72 h-96 md:w-80 md:h-[28rem]">
              <Image src={characterImage} alt="Personaje secando" fill className="object-contain" />
            </div>
            <div className="flex gap-4">
              {towels.map((towel) => (
                <DraggableTowel
                  key={towel.id}
                  id={towel.id}
                  image={towel.image}
                  alt={towel.alt}
                  isDragging={isDragging}
                />
              ))}
            </div>
          </div>
        </DndContext>
      )}

      {showFeedback && (
        <motion.div
          className={`absolute top-1/2 transform -translate-y-1/2 z-50 ${
            isCorrect ? 'right-8' : 'left-8'
          }`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src={
                isCorrect
                  ? HYGIENE_GAME_CONFIG.feedbackImages.correct
                  : HYGIENE_GAME_CONFIG.feedbackImages.incorrect
              }
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
