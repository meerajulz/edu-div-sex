'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BirdAnimation from '../BirdAnimation/BirdAnimation';

const WindowBirds: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const [birdPositions, setBirdPositions] = useState<
    { fromLeft: boolean; startX: string; endX: string; startY: string; endY: string }[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Initialize bird positions with mostly horizontal paths
    const positions = Array.from({ length: count }).map(() => {
      const fromLeft = Math.random() > 0.5;
      
      // Generate a random base height between 20% and 80%
      const baseHeight = 20 + Math.random() * 60;
      // Small vertical variation (±10%)
      const heightVariation = Math.random() * 20 - 10;

      return {
        fromLeft,
        startX: fromLeft ? '-20%' : '120%',  // Start beyond window edges
        endX: fromLeft ? '120%' : '-20%',    // End beyond window edges
        startY: `${baseHeight}%`,
        endY: `${baseHeight + heightVariation}%`  // Slight vertical variation
      };
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
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [count]);

  return (
    <div 
      ref={containerRef}
      className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none"
    >
      {birdPositions.map((bird, index) => (
        <motion.div
          key={index}
          className="absolute w-full h-full pointer-events-none"
          initial={{ x: bird.startX, y: bird.startY }}
          animate={isVisible ? {
            x: bird.endX,
            y: bird.endY,
            rotate: bird.fromLeft ? -5 : 5,  // Slight rotation for more natural look
          } : { x: bird.startX, y: bird.startY }}
          transition={{
            duration: Math.random() * 4 + 3,  // Faster movement
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2,
          }}
        >
          <div className="scale-[0.25]">
            <BirdAnimation flip={!bird.fromLeft} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WindowBirds;