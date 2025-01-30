'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BirdAnimation from '../BirdAnimation/page';

const BirdsFlying: React.FC<{ count?: number }> = ({ count = 5 }) => {
  const [birdPositions, setBirdPositions] = useState<
    { fromLeft: boolean; startX: string; endX: string; startY: string; endY: string; isDiagonal: boolean }[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);
  const birdSoundRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
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

    // Initialize bird sound
    birdSoundRef.current = new Audio('/ui-sound/bird.mp3');
    if (birdSoundRef.current) {
      birdSoundRef.current.volume = 0.3;
      birdSoundRef.current.loop = true;
    }

    // Initialize intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            // Play sound when birds come into view
            if (birdSoundRef.current) {
              birdSoundRef.current.play().catch(console.error);
              
              // Start volume variations
              soundIntervalRef.current = setInterval(() => {
                if (birdSoundRef.current) {
                  birdSoundRef.current.volume = Math.random() * 0.15 + 0.05;
                }
              }, 2000);
            }
          } else {
            // Stop sound when birds are out of view
            if (birdSoundRef.current) {
              birdSoundRef.current.pause();
              if (soundIntervalRef.current) {
                clearInterval(soundIntervalRef.current);
              }
            }
          }
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
      if (birdSoundRef.current) {
        birdSoundRef.current.pause();
        birdSoundRef.current = null;
      }
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
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
