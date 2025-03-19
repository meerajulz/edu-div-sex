'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BirdAnimation: React.FC<{ flip?: boolean }> = ({ flip = false }) => {
  const [flap, setFlap] = useState(true);

  // Define paths to the SVG files - these are just strings, not objects with .src
  const Bird1 = '/svg/birds/bird-1.svg';
  const Bird2 = '/svg/birds/bird-2.svg';
  const Bird1Reversed = '/svg/birds/bird-1-reversed.svg';
  const Bird2Reversed = '/svg/birds/bird-2-reversed.svg';
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFlap((prev) => !prev);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Combined animation for smoother movement
  const containerVariants = {
    animate: {
      x: flip ? ['-10%', '110%'] : ['110%', '-10%'],
      y: ['30%', '31%', '32%', '31%', '30%'],
      rotate: flip ? [0, -1, -2, -1, 0] : [0, 1, 2, 1, 0],
    },
  };

  return (
    <motion.div
      className="absolute z-30"
      variants={containerVariants}
      animate="animate"
      transition={{
        x: {
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'reverse'
        },
        y: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1]
        },
        rotate: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1]
        }
      }}
    >
      <img
        src={flap ? (flip ? Bird1Reversed : Bird1) : (flip ? Bird2Reversed : Bird2)}
        alt="Flying Bird"
        className="w-16 h-auto"
      />
    </motion.div>
  );
};

export default BirdAnimation;