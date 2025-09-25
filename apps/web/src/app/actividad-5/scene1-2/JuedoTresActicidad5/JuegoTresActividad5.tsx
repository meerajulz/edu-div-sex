'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  EMOTION_GAME_CONFIG,
  EmotionGameSession,
  isScenarioCompletedCorrectly,
  isEmotionGameCompleted,
  getCurrentScenario,
  getFeedbackAudio
} from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { playGameAudio, createGameAudio } from '../../../utils/gameAudio';

interface JuegoTresActividad5Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoTresActividad5({ isVisible, onClose, onGameComplete }: JuegoTresActividad5Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  // Game session state
  const [gameSession, setGameSession] = useState<EmotionGameSession>({
    scenarioIndex: 0,
    gamePhase: 'intro',
    selectedEmotion: null,
    completed: false,
    correctAnswersCount: 0
  });
  
  // Track feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState<{
    isCorrect: boolean;
    audio: string;
  } | null>(null);
  
  // Track character states
  const [speakerTalking, setSpeakerTalking] = useState(false);
  const [responderTalking, setResponderTalking] = useState(false);
  
  // Get current scenario data
  const currentScenario = getCurrentScenario(gameSession);
  
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
  
  // Handle game phase transitions
  useEffect(() => {
    if (!isVisible) return;
    
    switch (gameSession.gamePhase) {
      case 'intro':
        // Play title audio and transition
        const timer = setTimeout(() => {
          playAudio(EMOTION_GAME_CONFIG.audio.title, () => {
            setGameSession(prev => ({ ...prev, gamePhase: 'item_question' }));
          });
        }, EMOTION_GAME_CONFIG.timing.titleDelay);
        
        return () => clearTimeout(timer);
        
      case 'item_question':
        // Play item question audio
        playAudio(currentScenario.itemQuestionAudio, () => {
          setGameSession(prev => ({ ...prev, gamePhase: 'speaker_talking' }));
        });
        break;
        
      case 'speaker_talking':
        // Speaker talks
        setSpeakerTalking(true);
        playAudio(currentScenario.speaker.audio, () => {
          setSpeakerTalking(false);
          setTimeout(() => {
            setGameSession(prev => ({ ...prev, gamePhase: 'responder_talking' }));
          }, EMOTION_GAME_CONFIG.timing.speakerToResponderDelay);
        });
        break;
        
      case 'responder_talking':
        // Responder talks
        setResponderTalking(true);
        playAudio(currentScenario.responder.audio, () => {
          setResponderTalking(false);
          setTimeout(() => {
            setGameSession(prev => ({ ...prev, gamePhase: 'emotion_selection' }));
          }, EMOTION_GAME_CONFIG.timing.responderToSelectionDelay);
        });
        break;
        
      case 'emotion_selection':
        // Wait for user to select emotion
        break;
        
      case 'feedback':
        // Handle feedback and transition
        if (isScenarioCompletedCorrectly(gameSession)) {
          // Correct answer - move to next scenario or complete
          setTimeout(() => {
            if (isEmotionGameCompleted(gameSession)) {
              setGameSession(prev => ({ ...prev, gamePhase: 'completed' }));
            } else {
              setGameSession(prev => ({ ...prev, gamePhase: 'next_scenario' }));
            }
          }, EMOTION_GAME_CONFIG.timing.scenarioTransitionDelay);
        } else {
          // Wrong answer - allow user to try again immediately
          setTimeout(() => {
            setGameSession(prev => ({
              ...prev,
              gamePhase: 'emotion_selection',
              selectedEmotion: null
            }));
            setIsAnimating(false); // Make sure to reset animation state
          }, EMOTION_GAME_CONFIG.timing.feedbackDuration);
        }
        break;
        
      case 'next_scenario':
        // Move to next scenario
        setGameSession(prev => ({
          ...prev,
          scenarioIndex: prev.scenarioIndex + 1,
          gamePhase: 'item_question',
          selectedEmotion: null,
          correctAnswersCount: prev.correctAnswersCount + 1
        }));
        break;
    }
  }, [gameSession.gamePhase, isVisible]);
  
  // Reset entire game
  const resetGame = () => {
    setGameSession({
      scenarioIndex: 0,
      gamePhase: 'intro',
      selectedEmotion: null,
      completed: false,
      correctAnswersCount: 0
    });
    setShowFeedback(false);
    setFeedbackInfo(null);
    setSpeakerTalking(false);
    setResponderTalking(false);
  };
  
  // Play audio helper
  const playAudio = (src: string, onEnded?: () => void) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = createGameAudio(src, 0.7, 'JuegoTres playAudio');
      setCurrentAudio(audio);

      if (onEnded) {
        audio.onended = onEnded;
      }

      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play audio:', error);
      if (onEnded) onEnded();
    }
  };
  
  // Handle emotion selection
  const handleEmotionSelect = (emotionType: 'happy' | 'sad' | 'angry') => {
    if (isAnimating || gameSession.gamePhase !== 'emotion_selection') return;
    
    setIsAnimating(true);
    
    const isCorrect = emotionType === currentScenario.correctEmotion;
    const feedbackAudio = getFeedbackAudio(gameSession, emotionType);
    
    setFeedbackInfo({
      isCorrect,
      audio: feedbackAudio
    });
    
    setShowFeedback(true);
    
    // Update game session
    setGameSession(prev => ({
      ...prev,
      selectedEmotion: emotionType,
      gamePhase: 'feedback'
    }));
    
    // Play feedback audio
    playAudio(feedbackAudio, () => {
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnimating(false); // Reset animation state here
      }, 1000);
    });
  };
  
  // Handle exit game
  const handleSalirJuego = () => {
    if (isAnimating && !showFeedback) return; // Allow exit during feedback
    setIsAnimating(true);

    // Stop any current audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }

    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoTres exit button');
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
    setIsAnimating(true);

    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoTres complete button');
    } catch (error) {
      console.warn('Could not play sound:', error);
    }

    setTimeout(() => {
      setIsAnimating(false);
      onGameComplete();
      onClose();
    }, 500);
  };

  // Handle listen instructions
  const handleListenInstructions = () => {
    playAudio(EMOTION_GAME_CONFIG.audio.title);
  };
  
  // Get current background image
  const getCurrentBackground = () => {
    if (gameSession.gamePhase === 'feedback' && feedbackInfo?.isCorrect) {
      return currentScenario.backgroundImages.completion;
    }
    return currentScenario.backgroundImages.initial;
  };
  
  // Get current responder image and size
  const getCurrentResponderImageInfo = () => {
    let imageSrc, width, height;
    
    if (gameSession.gamePhase === 'feedback' && feedbackInfo?.isCorrect) {
      imageSrc = currentScenario.responder.images.final;
      // Different sizes for different characters and states
      if (currentScenario.responder.name === 'Noa') {
        width = 150; // Noa with arm is bigger
        height = 150;
      } else {
        width = 150;
        height = 150;
      }
    } else if (responderTalking) {
      imageSrc = currentScenario.responder.images.responding;
      width = 150;
      height = 150;
    } else {
      imageSrc = currentScenario.responder.images.listening;
      width = 150;
      height = 150;
    }
    
    return { imageSrc, width, height };
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
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="bg-gradient-to-br from-yellow-200 via-orange-100 to-red-200 rounded-xl shadow-2xl w-[85vw] h-[85vh] overflow-hidden relative border-4 border-yellow-300">

              {/* Listen Instructions Button */}
              <EscucharInstruccionesButton
                onPlayInstructions={handleListenInstructions}
                position="top-right"
              />

              {/* Exit button */}
              <motion.button
                onClick={handleSalirJuego}
                className="absolute top-4 right-48 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                Salir Juego
              </motion.button>
              
              {/* Game Content */}
              <div className="relative z-10 flex flex-col items-center h-full w-full p-4">
                
                {/* Intro State */}
                {gameSession.gamePhase === 'intro' && (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 max-w-2xl text-center shadow-lg">
                      <h2 className="text-3xl font-bold text-orange-800 mb-4">
                        {EMOTION_GAME_CONFIG.title}
                      </h2>
                      <p className="text-lg text-orange-700 mb-4">
                        {EMOTION_GAME_CONFIG.instruction}
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-orange-600">
                        <span>Escuchando instrucciones</span>
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                          <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Game Playing States */}
                {(gameSession.gamePhase === 'item_question' || 
                  gameSession.gamePhase === 'speaker_talking' || 
                  gameSession.gamePhase === 'responder_talking' || 
                  gameSession.gamePhase === 'emotion_selection' || 
                  gameSession.gamePhase === 'feedback') && currentScenario && (
                  <div className="flex flex-col h-full w-full relative">
                    
                    {/* Emotion Selection Buttons at Top */}
                    {(gameSession.gamePhase === 'emotion_selection' || gameSession.gamePhase === 'feedback') && (
                      <motion.div
                        className="flex justify-center space-x-4 mb-4 relative z-20"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {EMOTION_GAME_CONFIG.emotionOptions.map((emotion) => {
                          let currentImage = emotion.images.normal;
                          
                          if (gameSession.selectedEmotion === emotion.type && showFeedback) {
                            currentImage = feedbackInfo?.isCorrect 
                              ? emotion.images.correct 
                              : emotion.images.error;
                          }
                          
                          return (
                            <motion.button
                              key={emotion.id}
                              onClick={() => handleEmotionSelect(emotion.type)}
                              className="relative transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed"
                              whileHover={gameSession.gamePhase === 'emotion_selection' ? { scale: 1.1 } : {}}
                              whileTap={gameSession.gamePhase === 'emotion_selection' ? { scale: 0.95 } : {}}
                              disabled={gameSession.gamePhase !== 'emotion_selection' || isAnimating}
                            >
                              <div className="relative w-[120px] h-[80px]">
                                <Image
                                  src={currentImage}
                                  alt={`${emotion.type} emotion`}
                                  width={120}
                                  height={80}
                                  className="object-contain"
                                />
                              </div>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                    
                    {/* Main Game Area with Bus Scene */}
                    <div className="flex items-center justify-center relative h-[400px]">
                      <div className="relative w-[520px] h-[300px] mx-auto">
                        
                        {/* Background Bus Scene */}
                        <div className="absolute inset-0">
                          <Image
                            src={getCurrentBackground()}
                            alt="Bus scene"
                            width={520}
                            height={300}
                            className="object-contain rounded-lg"
                          />
                        </div>
                        
                        {/* Speaker Speech Bubble (centered-top) */}
                        {speakerTalking && (
                          <motion.div
                            className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                          >
                            <div className="relative w-[170px] h-[100px]">
                              <Image
                                src={currentScenario.speaker.speechBubble.image}
                                alt="Speaker speech bubble"
                                width={170}
                                height={100}
                                className="object-contain"
                              />
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Responder Speech Bubble (positioned more to the left) */}
                        {responderTalking && (
                          <motion.div
                            className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-10"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                          >
                            <div className="relative w-[170px] h-[100px]">
                              <Image
                                src={currentScenario.responder.speechBubble.image}
                                alt="Responder speech bubble"
                                width={170}
                                height={100}
                                className="object-contain"
                              />
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Responder Character (bottom-left) */}
                        <motion.div
                          className="absolute bottom-0 left-4 z-5"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {(() => {
                            const { imageSrc, width, height } = getCurrentResponderImageInfo();
                            return (
                              <div className={'relative overflow-hidden w-[200px] h-[150px]'}>
                                <Image
                                  src={imageSrc}
                                  alt={currentScenario.responder.name}
                                  width={width}
                                  height={height}
                                  className="object-contain"
                                />
                              </div>
                            );
                          })()}
                        </motion.div>
                        
                      </div>
                    </div>
                    
                    {/* Feedback overlay */}
                    <AnimatePresence>
                      {showFeedback && feedbackInfo && (
                        <motion.div
                          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-[140px] h-[140px]">
                              <Image
                                src={feedbackInfo.isCorrect 
                                  ? EMOTION_GAME_CONFIG.feedback.images.correct
                                  : EMOTION_GAME_CONFIG.feedback.images.incorrect}
                                alt={feedbackInfo.isCorrect ? "Correcto" : "Incorrecto"}
                                width={140}
                                height={140}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                  </div>
                )}
                
                {/* Congratulations Overlay using CongratsOverlay component */}
                <CongratsOverlay
                  isVisible={gameSession.gamePhase === 'completed'}
                  title="¡Felicidades!"
                  subtitle="Has aprendido a reconocer las expresiones faciales correctas según las emociones"
                  emoji="🎉"
                  bgColor="bg-orange-500/20"
                  textColor="text-orange-800"
                  onComplete={handleCompleteGame}
                  autoCloseDelay={3000}
                />
                
                {/* Progress indicator */}
                {(gameSession.gamePhase === 'item_question' || 
                  gameSession.gamePhase === 'speaker_talking' || 
                  gameSession.gamePhase === 'responder_talking' || 
                  gameSession.gamePhase === 'emotion_selection' || 
                  gameSession.gamePhase === 'feedback') && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-orange-800">Progreso</span>
                      <span className="text-sm font-medium text-orange-800">
                        {gameSession.scenarioIndex + 1} / {EMOTION_GAME_CONFIG.scenarios.length}
                      </span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2.5">
                      <div 
                        className="bg-orange-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${((gameSession.scenarioIndex + (gameSession.gamePhase === 'feedback' && feedbackInfo?.isCorrect ? 1 : 0)) / EMOTION_GAME_CONFIG.scenarios.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}