'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TreeProps {
  // Position properties
  left?: string;
  right?: string;
  bottom?: string;
  // Size properties
  scale?: number;
  height?: string;
  width?: string;
  // Z-index for layering
  zIndex?: number;
  // Animation delay
  animationDelay?: number;
  // Animation complete callback
  onAnimationComplete?: () => void;
  // Custom styles
  className?: string;
}

const Tree: React.FC<TreeProps> = ({
  left,
  right,
  bottom = '5%',
  scale = 1,
  height = '250px',
  width = '200px',
  zIndex = 15,
  animationDelay = 0,
  onAnimationComplete,
  className = '',
}) => {
  // Animation variants for tree - comes from above
  const treeVariants = {
    hidden: {
      y: '-100vh', // Start from above the screen
      opacity: 0,
      scale: scale * 0.8, // Start slightly smaller
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: scale,
      transition: {
        type: 'spring',
        damping: 15, // Less damping for more bounce
        stiffness: 70,
        delay: animationDelay, // Custom delay passed as prop
        duration: 1.2,
      },
    },
  };

  // Determine the positioning style with proper TypeScript typing
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    bottom,
    zIndex,
  };

  // Apply left or right position (not both)
  if (left) positionStyle.left = left;
  if (right) positionStyle.right = right;

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={positionStyle}
      initial="hidden"
      animate="visible"
      variants={treeVariants}
      onAnimationComplete={() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }}
    >
      <div
        className="relative"
        style={{
          height,
          width,
        }}
      >
        <Image
          src="/svg/actividad1/tree.svg"
          alt="Tree"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
    </motion.div>
  );
};

export default Tree;