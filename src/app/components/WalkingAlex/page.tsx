'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AlexSVG from '../AlexVariants/page';

const WalkingAlex = () => {
  const [isWalkingDone, setIsWalkingDone] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(true);
  const [blinkCount, setBlinkCount] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [isArmUp, setIsArmUp] = useState(false);

  // Expression change during walking
  useEffect(() => {
    if (!isWalkingDone) {
      const interval = setInterval(() => {
        setCurrentExpression((prev) => !prev);
      }, 300);
      return () => clearInterval(interval);
    } else {
      // When walking ends, wait 2 seconds then do 3 quick blinks
      setTimeout(() => {
        // First blink
        setCurrentExpression(true);
        setTimeout(() => {
          setCurrentExpression(false);
          setTimeout(() => {
            // Second blink
            setCurrentExpression(true);
            setTimeout(() => {
              setCurrentExpression(false);
              setTimeout(() => {
                // Third blink
                setCurrentExpression(true);
                setTimeout(() => {
                  setCurrentExpression(false);
                  // Start talking sequence after blinking
                  setTimeout(() => {
                    setIsTalking(true);
                    handleTalking();
                  }, 1000);
                }, 100);
              }, 500);
            }, 100);
          }, 500);
        }, 100);
      }, 2000);
    }
  }, [isWalkingDone]);

  const handleTalking = () => {
    let talkCount = 0;
    const talkInterval = setInterval(() => {
      talkCount++;
      setCurrentExpression(prev => !prev);
      
      if (talkCount >= 6) { // 3 complete mouth movements
        clearInterval(talkInterval);
        setCurrentExpression(false); // End with smiling
        setIsTalking(false);
        // Start arm up animation after talking
        setTimeout(() => {
          handleArmUpAnimation();
        }, 500);
      }
    }, 200);
  };

  const handleArmUpAnimation = () => {
    setIsArmUp(true);
    let armMoveCount = 0;
    const armInterval = setInterval(() => {
      armMoveCount++;
      setCurrentExpression(prev => !prev);
      
      if (armMoveCount >= 20) { // 4 seconds of movement (at 200ms intervals)
        clearInterval(armInterval);
        setIsArmUp(false);
        setCurrentExpression(false); // End with smiling
      }
    }, 200);
  };

  const getVariant = () => {
    if (isArmUp) {
      return currentExpression ? 'mouthOpenArmUp' : 'mouthClosedArmUp';
    }
    if (isTalking) {
      return currentExpression ? 'mouthOpen' : 'mouthClosed';
    }
    return currentExpression ? 'default' : 'smiling';
  };

  // Rest of your animations remain the same
  const walkAnimation = {
    initial: {
      x: '50%',
      y: '85%',
      scale: 0,
      opacity: 1
    },
    animate: {
      x: '80%',
      y: '300%',
      scale: 2.2,
      transition: {
        delay: 2,
        duration: 5,
        ease: "easeInOut",
      }
    }
  };

  const walkingMotion = {
    walking: {
      y: [-5, 5],
      rotate: [-2, 2],
      transition: {
        repeat: Infinity,
        duration: 0.4,
        ease: "linear"
      }
    },
    stopped: {
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute transform -translate-x-1/2"
        variants={walkAnimation}
        initial="initial"
        animate="animate"
        onAnimationComplete={() => setIsWalkingDone(true)}
      >
        <div className="relative">
          {/* Shadow beneath Alex */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
            initial={{ width: 200, height: 50, bottom: -20 }}
            animate={{
              width: 300,
              height: 75,
              bottom: -30,
              opacity: 0.3
            }}
            transition={{ 
              duration: 4,
              delay: 2,
              ease: "easeInOut"
            }}
          />

          {/* Walking motion container */}
          <motion.div
            variants={walkingMotion}
            animate={!isWalkingDone ? "walking" : "stopped"}
          >
            {/* Current expression */}
            <div className="relative">
              <AlexSVG 
                variant={getVariant()}
                className="w-48 h-48 transition-opacity duration-75" 
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalkingAlex;