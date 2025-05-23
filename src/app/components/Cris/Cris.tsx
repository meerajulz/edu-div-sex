'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface CrisProps {
  isVisible: boolean;
  position?: {
    bottom?: string;
    left?: string;
    right?: string;
    top?: string;
  };
}

const Cris: React.FC<CrisProps> = ({
  isVisible,
  position = { bottom: '0', left: '0%' }
}) => {
  const [isTalking, setIsTalking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        // Start talking
        const audio = new Audio('/audio/actividad-1/escena_1/juego_1_cris.mp3');
        audioRef.current = audio;
        setIsTalking(true);
        audio.play();

        audio.onended = () => {
          setIsTalking(false);
        };
      }, 3000); // wait 3s after showing

      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const positionStyles: React.CSSProperties = {
    position: 'absolute',
    ...position,
  };

  if (!isVisible) return null;

  return (
    <div
        className="z-40"
        style={{
          ...positionStyles,
          width: '100%',         // Full width of parent
          height: '100%',        // Full height of parent
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
      <Image
        src={
          isTalking
            ? '/image/escena_1/cris_talking.gif'
            : '/image/escena_1/cris_static.gif'
        }
        alt="Cris"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Cris;