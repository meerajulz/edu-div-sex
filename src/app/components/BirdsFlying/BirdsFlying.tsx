'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BirdAnimation from '../BirdAnimation/BirdAnimation';

const BirdsFlying: React.FC<{ count?: number }> = ({ count = 5 }) => {
  const [birdPositions, setBirdPositions] = useState<
    { fromLeft: boolean; startX: string; endX: string; startY: string; endY: string; isDiagonal: boolean }[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize bird positions
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

    // Initialize intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1 // Trigger when at least 10% of the component is visible
      }
    );

    // Start observing
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [count]);

  return (
    <div 
      ref={containerRef}
      className="absolute w-full h-screen top-0 left-0 overflow-hidden pointer-events-none z-50 h-[50vh]"
    >
      {birdPositions.map((bird, index) => (
        <motion.div
          key={index}
          className="absolute w-full h-full z-50 pointer-events-none"
          initial={{ x: bird.startX, y: bird.startY }}
          animate={isVisible ? {
            x: bird.endX,
            y: bird.endY,
            rotate: bird.fromLeft ? (bird.isDiagonal ? [-10, -5, 0] : 0) : (bird.isDiagonal ? [10, 5, 0] : 0),
          } : { x: bird.startX, y: bird.startY }}
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