'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, useDraggable, useSensor, useSensors, useDroppable, MouseSensor, TouchSensor } from '@dnd-kit/core';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';
import { getCharacterGameConfig, HYGIENE_GAME_CONFIG } from './config';

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

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`cursor-grab active:cursor-grabbing touch-none z-50 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="relative w-28 h-28 md:w-36 md:h-36">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain"
          priority
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
      const audio = new Audio(stepData.audio.title);
      audio.volume = 0.7;
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

    const feedbackAudio = new Audio(
      correct ? stepData.feedback.correct.audio : stepData.feedback.incorrect.audio
    );
    feedbackAudio.volume = 0.7;
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
          className="text-center text-white text-lg font-bold bg-black/30 rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {stepData.title}
        </motion.div>
      )}

      {showElements && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex items-center justify-center w-full h-full gap-6">
            <div className="relative w-52 h-80">
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
          className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20">
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
