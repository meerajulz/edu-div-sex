'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BirdAnimation from '../BirdAnimation/page';

const BirdsSoaring: React.FC = () => {
  const [bird1StartY, setBird1StartY] = useState(0);
  const [bird2StartY, setBird2StartY] = useState(0);

  useEffect(() => {
    setBird1StartY(Math.random() * 30); // Randomized upper third of the screen
    setBird2StartY(Math.random() * 20); // More towards the top
  }, []);

  return (
    <div className="absolute w-full h-screen top-0 left-0 overflow-hidden pointer-events-none z-50">
      {/* Bird flying from top right to bottom left */}
      <motion.div
        className="absolute w-full h-full z-50 pointer-events-none"
        initial={{ x: '110%', y: `${bird1StartY}%`, scale: 0.5 }}
        animate={{ x: '-10%', y: '110%', scale: 1.5, rotate: [-10, -5, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
          delay: 3,
        }}
      >
        <BirdAnimation flip={true} />
      </motion.div>

      {/* New Bird flying from top left to right middle */}
      <motion.div
        className="absolute w-full h-full z-50 pointer-events-none"
        initial={{ x: '-40%', y: `${bird2StartY}%`, scale: 0.5 }}
        animate={{ x: '110%', y: '50%', scale: 1.5, rotate: [5, 2, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
          delay: 5,
        }}
      >
        <BirdAnimation flip={false} />
      </motion.div>
    </div>
  );
};

export default BirdsSoaring;