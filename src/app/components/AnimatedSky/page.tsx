'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudSVG } from './CloudSVG';

const AnimatedSky: React.FC = () => {
  // Define four layers of static clouds with improved spacing
  const cloudLayers = [
    { size: 0.6, opacity: 0.2, count: 3 }, // Deep far layer (smallest, most transparent)
    { size: 1.2, opacity: 0.4, count: 4 }, // Far layer
    { size: 1.8, opacity: 0.7, count: 4 }, // Middle layer
   // { size: 2.4, opacity: 1, count: 4 }, // Close layer (largest, most opaque)
  ];

  // Moving cloud layers
  const movingCloudLayers = [
    { size: 0.5, opacity: 0.3, speed: 30, count: 3, variant: 1 }, // Farthest moving clouds (smallest, slowest)
    { size: 0.8, opacity: 0.4, speed: 25, count: 3, variant: 1 }, // Mid-far moving clouds
    { size: 1.2, opacity: 0.5, speed: 20, count: 2, variant: 2 }, // Middle moving clouds
    { size: 2.2, opacity: 1, speed: 30, count: 2, variant: 1 }, // Middle moving clouds
  ];

  // Store cloud positions in state to prevent SSR mismatch
  const [cloudPositions, setCloudPositions] = useState<
    { top: number; left: number; layer: { size: number; opacity: number; count: number } }[]
  >([]);

  useEffect(() => {
    const positions = cloudLayers.flatMap((layer, index) => {
      const layerPositions: { top: number; left: number; layer: { size: number; opacity: number; count: number; }; }[] = [];
      for (let i = 0; i < layer.count; i++) {
        let top: number, left: number;
        let attempts = 0;
        do {
          top = index * 10 + Math.random() * 10; // Pushes clouds to the upper 50% of the screen
          left = 50 + (Math.random() * 40 - 20) * (index + 1); // Keeps the clouds staggered horizontally
          attempts++;
        } while (
          layerPositions.some(
            (pos) => Math.abs(pos.top - top) < 15 && Math.abs(pos.left - left) < 15
          ) && attempts < 10
        );
        layerPositions.push({ top, left, layer });
      }
      return layerPositions;
    });

    setCloudPositions(positions);
  }, [cloudLayers]); // Run only on mount to ensure consistent positions

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-0 w-full h-screen bg-gradient-to-b from-cyan-200 to-cyan-100">
      
      {/* 3D Cylinder Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 via-transparent to-white/10 z-5 blur-2xl"></div>

      {/* Cloud Container Limited to 50% Height */}
      <div className="absolute top-0 w-full h-[50vh]">
        {/* Moving Clouds with Layered Depth */}
        {movingCloudLayers.map((layer, layerIndex) => (
          Array.from({ length: layer.count }).map((_, index) => {
            let top = layerIndex * 10 + Math.random() * 10; // Creates a triangular depth shape
            let left = 50 + (Math.random() * 40 - 20) * (layerIndex + 1); // Staggered movement
            return (
              <motion.div
                key={`moving-${layerIndex}-${index}`}
                className="absolute z-10"
                initial={{ x: index % 2 === 0 ? '-110vw' : '110vw' }}
                animate={{ x: index % 2 === 0 ? '110vw' : '-110vw' }}
                transition={{
                  duration: layer.speed + index * 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: (index * layer.speed) / 3,
                }}
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  opacity: layer.opacity,
                  transform: `scale(${layer.size})`,
                  maxWidth: '8rem',
                  willChange: 'transform',
                }}
              >
                <CloudSVG variant={layer.variant} />
              </motion.div>
            );
          })
        ))}

        {/* Static Clouds with Four Layers, Ensuring Spacing & Triangular Shape */}
        {cloudPositions.map((pos: { top: any; left: any; layer: { opacity: any; size: any; }; }, index: number) => (
          <div
            key={`static-layer-${index}`}
            className="absolute z-20"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              opacity: pos.layer.opacity,
              transform: `scale(${pos.layer.size})`,
              maxWidth: '6rem',
            }}
          >
            <CloudSVG variant={(index + 1) % 2 + 1} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedSky;