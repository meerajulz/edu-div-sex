'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AlexSVG from '../AlexVariants/page';

const WalkingAlex = () => {
  const [isWalkingDone, setIsWalkingDone] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(true);
  const [blinkCount, setBlinkCount] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [isArmUp, setIsArmUp] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  
  // Audio refs
  const holaAudio = useRef<HTMLAudioElement | null>(null);
  const clickAventuraAudio = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on client side only
  useEffect(() => {
    let mounted = true;
    
    // Create and load audio elements
    const initAudio = () => {
      holaAudio.current = new Audio('/audio/hola.mp3');
      clickAventuraAudio.current = new Audio('/audio/click-aventura.mp3');

      Promise.all([
        holaAudio.current.load(),
        clickAventuraAudio.current.load()
      ]).then(() => {
        if (mounted) {
          setIsAudioLoaded(true);
        }
      });
    };

    // Try to initialize immediately
    initAudio();

    // Also try to initialize after a short delay (for reload cases)
    const timeoutId = setTimeout(initAudio, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      if (holaAudio.current) {
        holaAudio.current.pause();
        holaAudio.current = null;
      }
      if (clickAventuraAudio.current) {
        clickAventuraAudio.current.pause();
        clickAventuraAudio.current = null;
      }
    };
  }, []);

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
    // Play hola audio when starting to talk
    if (holaAudio.current) {
      holaAudio.current.currentTime = 0;
      holaAudio.current.play().catch(console.error);
    }
    
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
    // Play click aventura audio when starting arm up animation
    if (clickAventuraAudio.current) {
      clickAventuraAudio.current.currentTime = 0;
      clickAventuraAudio.current.play().catch(console.error);
    }
    
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
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
            initial={{ width: 100, height: 50, bottom: -50 }}
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
          <motion.div
            variants={walkingMotion}
            animate={!isWalkingDone ? "walking" : "stopped"}
          >
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