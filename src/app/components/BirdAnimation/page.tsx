'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Bird1 from './svg/bird-1.svg';
import Bird2 from './svg/bird-2.svg';
import Bird1Reversed from './svg/bird-1-reversed.svg';
import Bird2Reversed from './svg/bird-2-reversed.svg';

const BirdAnimation: React.FC<{ flip?: boolean }> = ({ flip = false }) => {
  const [flap, setFlap] = useState(true);

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
        src={flap ? (flip ? Bird1Reversed.src : Bird1.src) : (flip ? Bird2Reversed.src : Bird2.src)}
        alt="Flying Bird"
        className="w-16 h-auto"
      />
    </motion.div>
  );
};

export default BirdAnimation;