'use client';

import React, { useState} from 'react';
import { motion } from 'framer-motion';
import JugarButton from '../../components/JugarButton/JugarButton';
import Image from 'next/image';

interface ButtonGlobeProps {
  onButtonClick: () => void;
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  isVisible?: boolean;
  className?: string;
}

const ButtonGlobe: React.FC<ButtonGlobeProps> = ({
  onButtonClick,
  position = { top: '10%', left: '40%' },
  isVisible = true,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleButtonClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);
      onButtonClick();
    }, 800);
  };

  const positionStyles = {
    position: 'absolute' as const,
    ...position,
    // transform: position.top === '10%' && position.left === '30%'
    //   ? 'translate(-10%, -30%)'
    //   : undefined,
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={`z-50 ${className}`}
      style={positionStyles}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="relative">
        <Image
          src="/image/escena_1/GLOBO.png"
          alt="Globe Background"
          width={300}
          height={300}
          className="object-contain w-full h-full"
          priority
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            key={isAnimating ? 'animating' : 'idle'}
            animate={{
              scale: isAnimating ? [1, 1.3, 1] : 1,
              rotate: isAnimating ? [0, -360] : 0
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton
              onClick={handleButtonClick}
              text="JUGAR"
              size="medium"
              delay={0.5}
              disabled={isAnimating}
            />
          </motion.div>
        </div>

        {isAnimating && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-yellow-400 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 0.6,
                  delay: Math.random() * 0.3,
                  ease: 'easeOut'
                }}
              />
            ))}
          </>
        )}
      </div>

      {isAnimating && (
        <motion.div
          className="absolute inset-0 bg-orange-400/30 rounded-full blur-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.5, 0.8] }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
};

export default ButtonGlobe;
