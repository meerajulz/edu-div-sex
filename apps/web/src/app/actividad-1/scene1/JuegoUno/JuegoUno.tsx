'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../../hooks/useProgressSaver';
import { playGameAudio } from '../../../utils/gameAudio';
import { 
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent
 } from '@dnd-kit/core';
import Image from 'next/image';
import { boyBodyParts, girlBodyParts } from './config';
import DraggablePart from './DraggablePart';
import DropZone from './DropZone';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface JuegoUnoProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const JuegoUno: React.FC<JuegoUnoProps> = ({ isVisible, onClose, onComplete }) => {

  const router = useRouter();
  const { saveProgress } = useProgressSaver();

  const [matchedParts, setMatchedParts] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'ok' | 'wrong' | null>(null);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [showCongrats, setShowCongrats] = useState(false);

  //GENDER GAME
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');

  const bodyParts = gender === 'boy' ? boyBodyParts : girlBodyParts;
  const characterImage = gender === 'boy'
    ? '/image/escena_1/juego/BOY.png'
    : '/image/escena_1/juego/GIRL.png';


  // Detect when all parts are matched
  useEffect(() => {
    console.log(`🎮 JuegoUno: Matched ${matchedParts.length}/${bodyParts.length} parts for ${gender}`);
    if (matchedParts.length === bodyParts.length) {
      console.log(`🎉 JuegoUno: All parts matched for ${gender}, showing congrats!`);
      console.log(`🔔 JuegoUno: setShowCongrats(true) called - CongratsOverlay should appear`);
      setShowCongrats(true);
    }
  }, [matchedParts, bodyParts.length, gender]);

  // Handle congratulations completion
  const handleCongratsComplete = async () => {
    console.log(`🎯 JuegoUno: handleCongratsComplete called for ${gender}`);
    console.log(`🔔 JuegoUno: CongratsOverlay callback triggered after autoCloseDelay`);
    setShowCongrats(false);

    // Switch to the next level
    if (gender === 'boy') {
      // Save progress as in_progress since only boy part is done
      await saveProgress('actividad-1', 'scene1', 'in_progress', 50, {
        game: 'JuegoUno',
        gender_completed: 'boy',
        completed_at: new Date().toISOString()
      });
      setGender('girl');
      setMatchedParts([]);
    } else {
      // Game complete - save as completed before navigating
      await saveProgress('actividad-1', 'scene1', 'completed', 100, {
        game: 'JuegoUno',
        gender_completed: 'both',
        completed_at: new Date().toISOString()
      });
      
      if (onComplete) {
        onComplete();
      } else {
        // Fallback to direct navigation if no onComplete callback
        onClose();
        setTimeout(() => {
          router.push('/actividad-1');
        }, 200);
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      console.log(`🎯 JuegoUno: Game opened, initializing...`);
      setGender('boy');
      setMatchedParts([]);
      setFeedback(null);
      setShowCongrats(false);
    }
  }, [isVisible]);

  // Debug gender changes and body parts count
  useEffect(() => {
    console.log(`🎮 JuegoUno: Gender changed to ${gender}, bodyParts.length = ${bodyParts.length}`);
    console.log(`🎮 JuegoUno: Body parts for ${gender}:`, bodyParts.map(p => p.id));
  }, [gender, bodyParts]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    if (over.id === active.id) {
      console.log(`🎯 JuegoUno: Correct match! Adding ${active.id} to matched parts`);
      setMatchedParts((prev) => {
        const newMatchedParts = [...prev, String(active.id)];
        console.log(`🎮 JuegoUno: Total matched parts now: ${newMatchedParts.length}/${bodyParts.length}`);
        return newMatchedParts;
      });
      setFeedback('ok');

      // Play success sound with saved volume
      playGameAudio('/audio/actividad-1/escena_1/Game_Score.mp3', 1.0, 'JuegoUno-Success');
    } else {
      setFeedback('wrong');

      // Play failure sound with saved volume
      playGameAudio('/audio/actividad-1/escena_1/Game_No_Score.mp3', 1.0, 'JuegoUno-Failure');
    }

    setTimeout(() => setFeedback(null), 1000);
  };

  const handleClose = () => {
    setMatchedParts([]);
    setFeedback(null);
    onClose();
  };

  const handleListenInstructions = () => {
    // Play Cris's introduction audio for the game
    playGameAudio('/audio/actividad-1/escena_1/juego_1_cris.mp3', 1.0, 'JuegoUno-Cris-Instructions');
  };

  if (!isVisible) return null;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="fixed inset-0 z-50 flex items-center backdrop-blur-sm justify-center pointer-events-auto">
        <div className="relative w-[90%] h-[90%] max-w-3xl bg-white/10 border-2 border-white/30 backdrop-blur-md rounded-xl shadow-xl pointer-events-auto overflow-hidden">

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
          >
            Salir juego
          </button>

          {/* Listen Instructions Button */}
          <EscucharInstruccionesButton
            onPlayInstructions={handleListenInstructions}
            position="below-exit"
          />

          {/* Baby image */}
          <div className="absolute inset-0 z-0 lex items-center justify-center">
 
            <div className="relative w-full max-w-md mx-auto aspect-[3/4]">
              <Image
                src={characterImage}
                alt={gender === 'boy' ? 'Boy' : 'Girl'}
                fill
                className="object-contain"
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

          </div>

          {/* Sidebar with draggable parts */}
          <div className="absolute left-0 top-0 z-10 h-full w-24 flex flex-col items-center justify-center space-y-4 bg-black/10 p-2">
            {bodyParts.map((part) =>
              !matchedParts.includes(part.id) && (
                <DraggablePart key={part.id} id={part.id} image={part.image} sound={part.sound}/>
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

        {/* Congratulations Overlay using new CongratsOverlay component */}
        <CongratsOverlay
          isVisible={showCongrats}
          title={gender === 'boy' ? "¡Muy Bien!" : "¡Excelente!"}
          subtitle={gender === 'boy' ? "Ahora vamos con la niña" : "Has completado el juego de las partes del cuerpo"}
          emoji="🎉"
          bgColor="bg-blue-500/50"
          textColor="text-white"
          onComplete={handleCongratsComplete}
          autoCloseDelay={2500}
        />
      </div>
    </DndContext>
  );
};

export default JuegoUno;