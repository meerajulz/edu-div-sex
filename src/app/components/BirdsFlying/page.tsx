'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BirdAnimation from '../BirdAnimation/page';

const BirdsFlying: React.FC<{ count?: number }> = ({ count = 5 }) => {
  const [birdPositions, setBirdPositions] = useState<
    { fromLeft: boolean; startX: string; endX: string; startY: string; endY: string; isDiagonal: boolean }[]
  >([]);

  useEffect(() => {
    const positions = Array.from({ length: count }).map(() => {
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? '-10%' : '110%';
      const endX = fromLeft ? '110%' : '-10%';
      const startY = `${Math.random() * 50}%`;
      const endY = `${Math.random() * 50}%`;
      const isDiagonal = Math.abs(parseFloat(startY) - parseFloat(endY)) > 10;

      return { fromLeft, startX, endX, startY, endY, isDiagonal };
    });

    setBirdPositions(positions);
  }, [count]);

  return (
    <div className="absolute w-full h-screen top-0 left-0 overflow-hidden pointer-events-none z-50 h-[50vh]">
      {birdPositions.map((bird, index) => (
        <motion.div
          key={index}
          className="absolute w-full h-full z-50 pointer-events-none"
          initial={{ x: bird.startX, y: bird.startY }}
          animate={{
            x: bird.endX,
            y: bird.endY,
            rotate: bird.fromLeft ? (bird.isDiagonal ? [-10, -5, 0] : 0) : (bird.isDiagonal ? [10, 5, 0] : 0),
          }}
          transition={{
            duration: Math.random() * 15 + 5,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        >
          <BirdAnimation flip={!bird.fromLeft} />
        </motion.div>
      ))}
    </div>
  );
};

export default BirdsFlying;
