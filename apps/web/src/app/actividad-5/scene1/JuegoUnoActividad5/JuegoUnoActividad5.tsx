'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FACIAL_EXPRESSION_GAME_CONFIG, GameSession, isScenarioCompleted, isGameCompleted } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';

interface JuegoUnoActividad5Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoUnoActividad5({ isVisible, onClose, onGameComplete }: JuegoUnoActividad5Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  // Game session state
  const [gameSession, setGameSession] = useState<GameSession>({
    scenarioIndex: 0,
    toneSelected: false,
    gestureSelected: false,
    toneCorrect: false,
    gestureCorrect: false,
    completed: false
  });
  
  // Track which tone and gesture are selected
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedGesture, setSelectedGesture] = useState<string | null>(null);
  
  // Track feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState<{
    isCorrect: boolean;
    text: string;
    audio: string;
  } | null>(null);
  
  // Refs for tracking sections (tone and gesture)
  const currentSection = useRef<'tone' | 'gesture'>('tone');
  
  // Get current scenario data
  const currentScenario = FACIAL_EXPRESSION_GAME_CONFIG.scenarios[gameSession.scenarioIndex];
  
  // Initialize game when it becomes visible
  useEffect(() => {
    if (isVisible) {
      resetGame();
    } else {
      // Clean up any audio when component is hidden
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
    }
  }, [isVisible]);
  
  // Play intro audio when game starts
  useEffect(() => {
    if (isVisible && gameState === 'intro') {
      const timer = setTimeout(() => {
        playAudio(FACIAL_EXPRESSION_GAME_CONFIG.audio.title, () => {
          setGameState('playing');
        }, FACIAL_EXPRESSION_GAME_CONFIG.audio.duration);
      }, FACIAL_EXPRESSION_GAME_CONFIG.timing.titleDelay);
      
      return () => clearTimeout(timer);
    }
  }, [gameState, isVisible]);
  
  // Check if scenario is complete and advance if needed
  useEffect(() => {
    if (gameState === 'playing' && isScenarioCompleted(gameSession)) {
      // If this was the last scenario, complete the game
      if (isGameCompleted(gameSession)) {
        const timer = setTimeout(() => {
          setGameState('completed');
        }, FACIAL_EXPRESSION_GAME_CONFIG.timing.transitionDelay);
        
        return () => clearTimeout(timer);
      } 
      // Otherwise, advance to the next scenario
      else {
        const timer = setTimeout(() => {
          setGameSession(prev => ({
            scenarioIndex: prev.scenarioIndex + 1,
            toneSelected: false,
            gestureSelected: false,
            toneCorrect: false,
            gestureCorrect: false,
            completed: false
          }));
          
          // Reset selections
          setSelectedTone(null);
          setSelectedGesture(null);
          
          // Reset to tone section
          currentSection.current = 'tone';
          
        }, FACIAL_EXPRESSION_GAME_CONFIG.timing.transitionDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [gameSession, gameState]);
  
  // Reset game to initial state
  const resetGame = () => {
    setGameState('intro');
    setGameSession({
      scenarioIndex: 0,
      toneSelected: false,
      gestureSelected: false,
      toneCorrect: false,
      gestureCorrect: false,
      completed: false
    });
    setSelectedTone(null);
    setSelectedGesture(null);
    setShowFeedback(false);
    setFeedbackInfo(null);
    currentSection.current = 'tone';
  };
  
  // Play audio helper
  const playAudio = (src: string, onEnded?: () => void, duration?: number) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      const audio = new Audio(src);
      audio.volume = 0.7;
      setCurrentAudio(audio);
      
      if (onEnded) {
        if (duration) {
          audio.play().catch(console.warn);
          setTimeout(onEnded, duration);
        } else {
          audio.onended = onEnded;
          audio.play().catch(console.warn);
        }
      } else {
        audio.play().catch(console.warn);
      }
    } catch (error) {
      console.warn('Could not play audio:', error);
      if (onEnded) onEnded();
    }
  };
  
  // Play feedback sound
  const playFeedbackSound = (correct: boolean) => {
    try {
      const audio = new Audio(
        correct 
          ? FACIAL_EXPRESSION_GAME_CONFIG.feedback.sounds.correct
          : FACIAL_EXPRESSION_GAME_CONFIG.feedback.sounds.incorrect
      );
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play feedback sound:', error);
    }
  };
  
  // Handle tone selection
  const handleToneSelect = (toneId: string) => {
    // Prevent selecting if already animating or showing feedback
    if (isAnimating || showFeedback) return;
    
    setIsAnimating(true);
    setSelectedTone(toneId);
    
    // Find the selected tone
    const toneOption = currentScenario.toneOptions.find(tone => tone.id === toneId);
    
    if (toneOption) {
      // Play the tone audio
      playAudio(toneOption.audio, () => {
        const isCorrect = toneOption.isCorrect;
        
        // Show feedback
        setFeedbackInfo({
          isCorrect,
          text: toneOption.feedback.text,
          audio: toneOption.feedback.audio
        });
        setShowFeedback(true);
        playFeedbackSound(isCorrect);
        
        // Play feedback audio
        playAudio(toneOption.feedback.audio, () => {
          setTimeout(() => {
            setShowFeedback(false);
            
            // Update game session
            setGameSession(prev => ({
              ...prev,
              toneSelected: isCorrect, // Only mark as selected if correct
              toneCorrect: isCorrect
            }));
            
            // If correct, move to gesture section
            if (isCorrect) {
              currentSection.current = 'gesture';
            } else {
              // If incorrect, allow trying again
              setSelectedTone(null);
            }
            
            setIsAnimating(false);
          }, 1000); // Short delay after feedback audio
        }, toneOption.feedback.duration);
      });
    }
  };
  
  // Handle gesture selection
  const handleGestureSelect = (gestureId: string) => {
    // Prevent selecting if animating, showing feedback, or tone not correct
    if (isAnimating || showFeedback || !gameSession.toneCorrect) return;
    
    setIsAnimating(true);
    setSelectedGesture(gestureId);
    
    // Find the selected gesture
    const gestureOption = currentScenario.gestureOptions.find(gesture => gesture.id === gestureId);
    
    if (gestureOption) {
      const isCorrect = gestureOption.isCorrect;
      
      // Show feedback
      setFeedbackInfo({
        isCorrect,
        text: gestureOption.feedback.text,
        audio: gestureOption.feedback.audio
      });
      setShowFeedback(true);
      playFeedbackSound(isCorrect);
      
      // Play feedback audio
      playAudio(gestureOption.feedback.audio, () => {
        setTimeout(() => {
          setShowFeedback(false);
          
          // Update game session
          setGameSession(prev => ({
            ...prev,
            gestureSelected: isCorrect, // Only mark as selected if correct
            gestureCorrect: isCorrect
          }));
          
          // If incorrect, allow trying again
          if (!isCorrect) {
            setSelectedGesture(null);
          }
          
          setIsAnimating(false);
        }, 1000); // Short delay after feedback audio
      }, gestureOption.feedback.duration);
    }
  };
  
  // Handle exit game
  const handleSalirJuego = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };
  
  // Handle game completion
  const handleCompleteGame = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
      onGameComplete();
      onClose();
    }, 500);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSalirJuego}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="bg-gradient-to-br from-green-200 via-yellow-100 to-green-200 rounded-xl shadow-2xl w-[85vw] h-[85vh] overflow-hidden relative border-4 border-green-300">
              
              {/* Floating particles (decorative) */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/30"
                    style={{
                      width: Math.random() * 30 + 10,
                      height: Math.random() * 30 + 10,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      x: [0, Math.random() * 10 - 5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              {/* Header with exit button */}
              <div className="relative z-10 flex justify-between items-center p-4">
                <motion.button
                  onClick={handleSalirJuego}
                  className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isAnimating}
                >
                  Salir Juego
                </motion.button>
              </div>
              
              {/* Game Content */}
              <div className="relative z-10 flex flex-col items-center h-[calc(100%-80px)] w-full p-4">
                
                {/* Intro State */}
                {gameState === 'intro' && (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 max-w-lg text-center shadow-lg">
                      <h2 className="text-2xl font-bold text-green-800 mb-4">
                        {FACIAL_EXPRESSION_GAME_CONFIG.title}
                      </h2>
                      <p className="text-lg text-green-700 mb-4">
                        {FACIAL_EXPRESSION_GAME_CONFIG.instruction}
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <span>Escuchando instrucciones</span>
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                          <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Playing State */}
                {gameState === 'playing' && currentScenario && (
                  <div className="flex flex-col items-center h-full w-full relative">
                    
                    {/* Feedback overlay - CENTERED RELATIVE TO MODAL */}
                    <AnimatePresence>
                      {showFeedback && feedbackInfo && (
                        <motion.div
                          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <div className="flex flex-col items-center pointer-events-auto">
                            <div className="w-20 h-20 mb-4">
                              <Image
                                src={feedbackInfo.isCorrect 
                                  ? FACIAL_EXPRESSION_GAME_CONFIG.feedback.images.correct 
                                  : FACIAL_EXPRESSION_GAME_CONFIG.feedback.images.incorrect}
                                alt={feedbackInfo.isCorrect ? "Correcto" : "Incorrecto"}
                                width={120}
                                height={120}
                                className="object-contain"
                              />
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-8 py-4 text-center shadow-xl max-w-md w-full">
                              <p className={`font-medium text-lg leading-relaxed ${feedbackInfo.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {feedbackInfo.text}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Face section at the top */}
                    <div className="relative mb-5">
                      {/* Face card image */}
                      <motion.div
                        className="w-36 h-36 md:w-48 md:h-48 relative mx-auto rounded-lg overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Image
                          src={currentScenario.faceImage}
                          alt={`Cara ${currentScenario.emotion}`}
                          fill
                          className="object-contain"
                        />
                      </motion.div>
                    </div>
                    
                    {/* Interactive sections (Tone & Gesture) */}
                    <div className="flex-grow flex flex-col md:flex-row gap-4 w-full">
                      {/* Tone Section - Left */}
                      <div className="w-full md:w-1/2">
                        <motion.div
                          className={`w-full h-full bg-blue-100 backdrop-blur-sm rounded-xl pt-2 shadow-md border-2 border-blue-300 
                            ${currentSection.current !== 'tone' && gameSession.toneCorrect ? 'opacity-60' : ''}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">
                            Tono de voz
                          </h3>
                          
                          <div className="flex flex-wrap justify-center gap-4">
                            {currentScenario.toneOptions.map((tone) => (
                              <motion.button
                                key={tone.id}
                                className={`relative w-20 h-20 md:w-28 md:h-28 rounded-lg overflow-hidden
                                  ${gameSession.toneCorrect && tone.isCorrect 
                                    ? 'ring-4 ring-green-500' 
                                    : ''
                                  }
                                `}
                                disabled={gameSession.toneCorrect || isAnimating || showFeedback}
                                onClick={() => handleToneSelect(tone.id)}
                                whileHover={(gameSession.toneCorrect || isAnimating || showFeedback) ? {} : { scale: 1.05 }}
                                whileTap={(gameSession.toneCorrect || isAnimating || showFeedback) ? {} : { scale: 0.95 }}
                              >
                                <Image
                                  src={selectedTone === tone.id ? tone.globeImageSelected : tone.globeImage}
                                  alt={`Tono ${tone.emotion}`}
                                  fill
                                  className="object-contain"
                                />
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Gesture Section - Right */}
                      <div className="w-full md:w-1/2">
                        <motion.div
                          className={`w-full h-full bg-yellow-100 backdrop-blur-sm rounded-xl pt-2 shadow-md border-2 border-yellow-300
                            ${!gameSession.toneCorrect ? 'opacity-60 pointer-events-none' : ''}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-xl font-bold text-yellow-800 mb-3 text-center">
                            Gestos corporales
                          </h3>
                          
                          <div className="flex flex-wrap justify-center gap-4">
                            {currentScenario.gestureOptions.map((gesture) => (
                              <motion.button
                                key={gesture.id}
                                className={`relative w-28 h-36 md:w-32 md:h-48 rounded-lg overflow-hidden bg-white
                                  ${gameSession.gestureCorrect && gesture.isCorrect 
                                    ? 'ring-4 ring-green-500' 
                                    : ''
                                  }
                                `}
                                disabled={gameSession.gestureCorrect || isAnimating || showFeedback || !gameSession.toneCorrect}
                                onClick={() => handleGestureSelect(gesture.id)}
                                whileHover={(gameSession.gestureCorrect || isAnimating || showFeedback || !gameSession.toneCorrect) ? {} : { scale: 1.05 }}
                                whileTap={(gameSession.gestureCorrect || isAnimating || showFeedback || !gameSession.toneCorrect) ? {} : { scale: 0.95 }}
                              >
                                <img
                                  src={gesture.image}
                                  alt={`Gesto ${gesture.emotion}`}
                                  className="w-full h-full object-contain pointer-events-none"
                                />
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="w-full max-w-md mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-800">Progreso</span>
                        <span className="text-sm font-medium text-green-800">
                          {gameSession.scenarioIndex + 1} / {FACIAL_EXPRESSION_GAME_CONFIG.scenarios.length}
                        </span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ 
                            width: `${((gameSession.scenarioIndex + (isScenarioCompleted(gameSession) ? 1 : 0)) / 
                                      FACIAL_EXPRESSION_GAME_CONFIG.scenarios.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Congratulations Overlay using CongratsOverlay component */}
                <CongratsOverlay
                  isVisible={gameState === 'completed'}
                  title="¡Felicidades!"
                  subtitle="Has completado exitosamente la actividad"
                  emoji="🎉"
                  bgColor="bg-green-500/20"
                  textColor="text-green-800"
                  onComplete={handleCompleteGame}
                  autoCloseDelay={3000}
                />
                
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}