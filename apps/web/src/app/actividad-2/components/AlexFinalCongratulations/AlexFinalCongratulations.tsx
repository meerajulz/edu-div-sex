'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AlexFinalCongratulationsProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

const AlexFinalCongratulations: React.FC<AlexFinalCongratulationsProps> = ({
  isVisible,
  onAnimationComplete
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alexTalkEnded, setAlexTalkEnded] = useState(false);
  const alexAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isVisible && !alexAudioRef.current) {
      // Play Alex's audio exactly like in the original Scene 4
      const audio = new Audio('/audio/actividad-2/juego5/Alex-final.mp3');
      alexAudioRef.current = audio;
      
      audio.onended = () => {
        setAlexTalkEnded(true);
        alexAudioRef.current = null;
        // Call completion after audio ends
        setTimeout(() => {
          onAnimationComplete?.();
        }, 1000);
      };
      
      audio.onerror = () => {
        console.warn('Alex audio failed to load');
        setAlexTalkEnded(true);
        alexAudioRef.current = null;
        onAnimationComplete?.();
      };

      audio.play().catch(() => {
        console.warn('Alex audio failed to play');
        setAlexTalkEnded(true);
        alexAudioRef.current = null;
        onAnimationComplete?.();
      });
    }
  }, [isVisible, onAnimationComplete]);

  // Cleanup audio on unmount or when not visible
  useEffect(() => {
    return () => {
      if (alexAudioRef.current) {
        alexAudioRef.current.pause();
        alexAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setAlexTalkEnded(false);
      if (alexAudioRef.current) {
        alexAudioRef.current.pause();
        alexAudioRef.current = null;
      }
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[90] min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        backgroundImage: `url('/image/actividad_2/bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Alex talking - exactly like in original Scene 4 */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          key="alex-talking"
          className="flex flex-col items-center justify-end min-h-screen pb-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div 
            className="w-full flex justify-center items-end"
            style={{ height: '70vh', minHeight: '400px' }}
          >
            <img
              src="/image/alex-talk.gif"
              alt="Alex hablando"
              className="object-contain object-bottom"
              style={{ 
                height: '80%',
                width: 'auto',
                transform: 'scale(2)',
                transformOrigin: 'bottom center'
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AlexFinalCongratulations;