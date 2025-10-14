'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TONE_GAME_CONFIG, ToneGameSession, isScenarioCompleted, isToneGameCompleted, getCurrentScenario } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
import { playGameAudio, createGameAudio } from '../../../utils/gameAudio';

interface JuegoDosActividad5Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoDosActividad5({ isVisible, onClose, onGameComplete }: JuegoDosActividad5Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  // Game session state
  const [gameSession, setGameSession] = useState<ToneGameSession>({
    scenarioIndex: 0,
    gamePhase: 'intro',
    listenedOptions: [],
    selectedOption: null,
    completed: false,
    correctAnswersCount: 0
  });
  
  // Track feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState<{
    isCorrect: boolean;
    text: string;
    audio: string;
  } | null>(null);
  
  // Track character states
  const [robotSpeaking, setRobotSpeaking] = useState(false);
  const [noaSpeaking, setNoaSpeaking] = useState<{
    type: 'imperative' | 'supplicating' | null;
    speaking: boolean;
  }>({ type: null, speaking: false });
  
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
        // Play title audio and transition to robot speaking
        const timer = setTimeout(() => {
          playAudio(TONE_GAME_CONFIG.audio.title, () => {
            setGameSession(prev => ({ ...prev, gamePhase: 'robot_speaking' }));
          });
        }, TONE_GAME_CONFIG.timing.titleDelay);
        
        return () => clearTimeout(timer);
        
      case 'robot_speaking':
        // Robot speaks the neutral phrase
        setRobotSpeaking(true);
        playAudio(currentScenario.robotAudio, () => {
          setRobotSpeaking(false);
          setTimeout(() => {
            setGameSession(prev => ({ ...prev, gamePhase: 'question_asking' }));
          }, TONE_GAME_CONFIG.timing.noaListenDelay);
        }, TONE_GAME_CONFIG.timing.robotSpeechDuration);
        break;
        
      case 'question_asking':
        // Ask "¿Cuál es el tono correcto?" before showing NOA options
        playAudio(TONE_GAME_CONFIG.audio.questionTone, () => {
          setGameSession(prev => ({ ...prev, gamePhase: 'noa_listening' }));
        });
        break;
        
      case 'noa_listening':
        // Wait for user to listen to NOA options
        // This phase is handled by user interactions
        break;
        
      case 'noa_selection':
        // NOA options are now in selection mode
        break;
        
      case 'feedback':
        // Handle feedback and transition
        if (isScenarioCompleted(gameSession)) {
          // Check if answer was correct
          const selectedOption = currentScenario.noaOptions.find(opt => opt.id === gameSession.selectedOption);
          const wasCorrect = selectedOption?.isCorrect || false;
          
          if (wasCorrect) {
            // Correct answer - advance to next scenario or complete game
            if (isToneGameCompleted(gameSession)) {
              // Game completed
              const timer = setTimeout(() => {
                playAudio(TONE_GAME_CONFIG.audio.finalGame, () => {
                  setGameSession(prev => ({ ...prev, gamePhase: 'completed' }));
                });
              }, TONE_GAME_CONFIG.timing.transitionDelay);
              
              return () => clearTimeout(timer);
            } else {
              // Move to next scenario
              const timer = setTimeout(() => {
                setGameSession(prev => ({
                  scenarioIndex: prev.scenarioIndex + 1,
                  gamePhase: 'robot_speaking',
                  listenedOptions: [],
                  selectedOption: null,
                  completed: false,
                  correctAnswersCount: prev.correctAnswersCount + 1
                }));
              }, TONE_GAME_CONFIG.timing.transitionDelay);
              
              return () => clearTimeout(timer);
            }
          } else {
            // Wrong answer - retry same scenario
            const timer = setTimeout(() => {
              setGameSession(prev => ({
                ...prev,
                gamePhase: 'robot_speaking',
                listenedOptions: [],
                selectedOption: null
              }));
            }, TONE_GAME_CONFIG.timing.transitionDelay);
            
            return () => clearTimeout(timer);
          }
        }
        break;
    }
  }, [gameSession.gamePhase, isVisible]);
  
  // Check if user can move to selection phase (after listening to both options)
  useEffect(() => {
    if (gameSession.gamePhase === 'noa_listening' && gameSession.listenedOptions.length >= 2) {
      // User has listened to both options, move to selection phase after a delay
      const timer = setTimeout(() => {
        setGameSession(prev => ({ ...prev, gamePhase: 'noa_selection' }));
      }, TONE_GAME_CONFIG.timing.questionDelay);
      
      return () => clearTimeout(timer);
    }
  }, [gameSession.listenedOptions, gameSession.gamePhase]);
  
  // Reset game to initial state
  const resetGame = () => {
    setGameSession({
      scenarioIndex: 0,
      gamePhase: 'intro',
      listenedOptions: [],
      selectedOption: null,
      completed: false,
      correctAnswersCount: 0
    });
    setShowFeedback(false);
    setFeedbackInfo(null);
    setRobotSpeaking(false);
    setNoaSpeaking({ type: null, speaking: false });
  };
  
  // Play audio helper
  const playAudio = (src: string, onEnded?: () => void, duration?: number) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = createGameAudio(src, 0.7, 'JuegoDos playAudio');
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
      const audioPath = correct
        ? TONE_GAME_CONFIG.feedback.sounds.correct
        : TONE_GAME_CONFIG.feedback.sounds.incorrect;
      playGameAudio(audioPath, 0.7, 'JuegoDos feedback sound');
    } catch (error) {
      console.warn('Could not play feedback sound:', error);
    }
  };
  
  // Handle NOA option listen
  const handleNoaListen = (optionId: string) => {
    if (isAnimating || showFeedback || gameSession.gamePhase !== 'noa_listening') return;
    
    const option = currentScenario.noaOptions.find(opt => opt.id === optionId);
    if (!option) return;
    
    setIsAnimating(true);
    setNoaSpeaking({ type: option.type as 'imperative' | 'supplicating', speaking: true });
    
    // Play NOA audio
    playAudio(option.audio, () => {
      setNoaSpeaking({ type: option.type as 'imperative' | 'supplicating', speaking: false });
      setIsAnimating(false);
      
      // Add to listened options if not already there
      setGameSession(prev => ({
        ...prev,
        listenedOptions: prev.listenedOptions.includes(optionId) 
          ? prev.listenedOptions 
          : [...prev.listenedOptions, optionId]
      }));
    });
  };
  
  // Handle NOA option selection
  const handleNoaSelect = (optionId: string) => {
    if (isAnimating || showFeedback || gameSession.gamePhase !== 'noa_selection') return;
    
    const option = currentScenario.noaOptions.find(opt => opt.id === optionId);
    if (!option) return;
    
    setIsAnimating(true);
    
    // Show feedback
    setFeedbackInfo({
      isCorrect: option.isCorrect,
      text: option.feedback.text,
      audio: option.feedback.audio
    });
    setShowFeedback(true);
    playFeedbackSound(option.isCorrect);
    
    // Play feedback audio
    playAudio(option.feedback.audio, () => {
      setTimeout(() => {
        setShowFeedback(false);
        
        // Update game session
        setGameSession(prev => ({
          ...prev,
          selectedOption: optionId,
          gamePhase: 'feedback'
        }));
        
        setIsAnimating(false);
      }, 1000);
    }, TONE_GAME_CONFIG.timing.feedbackDuration);
  };
  
  // Handle exit game
  const handleSalirJuego = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoDos exit button');
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
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'JuegoDos complete button');
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
    playAudio(TONE_GAME_CONFIG.audio.title);
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
            <div className="bg-gradient-to-br from-teal-200 via-cyan-100 to-blue-200 rounded-xl shadow-2xl w-[85vw] h-[85vh] overflow-hidden relative border-4 border-teal-300">
              
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
              
              {/* Header with buttons */}
              <div className="relative z-[120] flex justify-between items-center p-4">
                {/* Listen Instructions Button */}
                <EscucharInstruccionesButton
                  onPlayInstructions={handleListenInstructions}
                  position="side-by-side"
                />

                <motion.button
                  onClick={handleSalirJuego}
                  className="absolute top-4 right-4 z-[110] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isAnimating}
                >
                  Salir Juego
                </motion.button>
              </div>

              {/* Progress Badge - Top left */}
              {(gameSession.gamePhase === 'robot_speaking' ||
                gameSession.gamePhase === 'question_asking' ||
                gameSession.gamePhase === 'noa_listening' ||
                gameSession.gamePhase === 'noa_selection' ||
                gameSession.gamePhase === 'feedback') && (
                <div className="absolute top-4 left-4 z-[120]">
                  <div className="px-3 py-2 bg-orange-500 text-white rounded-full shadow-lg text-center font-bold text-sm">
                    Paso {gameSession.scenarioIndex + 1}/{TONE_GAME_CONFIG.scenarios.length}
                  </div>
                </div>
              )}

              {/* Game Content */}
              <div className="relative z-[5] flex flex-col items-center h-[calc(100%-80px)] w-full p-4">
                
                {/* Intro State */}
                {gameSession.gamePhase === 'intro' && (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 max-w-2xl text-center shadow-lg">
                      <h2 className="text-2xl font-bold text-teal-800 mb-4">
                        {TONE_GAME_CONFIG.title}
                      </h2>
                      <p className="text-lg text-teal-700 mb-4">
                        {TONE_GAME_CONFIG.instruction}
                      </p>
                      <div className="bg-teal-100 border-2 border-teal-300 rounded-lg px-6 py-3 inline-flex items-center space-x-3">
                        <span className="text-lg font-semibold text-teal-800">Escuchando instrucciones</span>
                        <div className="flex space-x-1">
                          <span className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                          <span className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <span className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Playing States */}
                {(gameSession.gamePhase === 'robot_speaking' ||
                  gameSession.gamePhase === 'question_asking' ||
                  gameSession.gamePhase === 'noa_listening' ||
                  gameSession.gamePhase === 'noa_selection' ||
                  gameSession.gamePhase === 'feedback') && currentScenario && (
                  <div className="flex flex-col h-full w-full">

                    {/* Header Section - Centered Above */}
                    <div className="flex items-center justify-center pt-4 pb-2">
                      <div className="bg-teal-100 border-2 border-teal-300 rounded-lg px-6 py-3 flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-teal-700">Noa te ayuda</h3>
                        <div className="w-px h-8 bg-teal-300"></div>
                        <p className="text-lg font-semibold text-teal-800">
                          {gameSession.gamePhase === 'question_asking' && 'Escuchando pregunta...'}
                          {gameSession.gamePhase === 'noa_listening' && 'Escucha ambos tonos de voz'}
                          {gameSession.gamePhase === 'noa_selection' && 'Ahora elige el tono correcto'}
                          {gameSession.gamePhase === 'robot_speaking' && 'Esperando...'}
                        </p>
                      </div>
                    </div>

                    {/* Main Content - Two Columns */}
                    <div className="flex flex-1 w-full">
                      {/* Robot Section - LEFT */}
                      <div className="w-1/2 flex flex-col items-center justify-center p-4 relative">
                        <motion.div
                          className="relative"
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {/* Robot Character */}
                          <div className="relative w-[400px] h-[400px] mb-0">
                            <Image
                              src={robotSpeaking
                                ? TONE_GAME_CONFIG.characters.robot.talking
                                : TONE_GAME_CONFIG.characters.robot.static}
                              alt="Robot"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* NOA Section - RIGHT */}
                      <div className="w-1/2 flex flex-col items-center justify-center p-4">
                        <motion.div
                          className="relative w-full"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {/* NOA Options */}
                        {(gameSession.gamePhase === 'noa_listening' || gameSession.gamePhase === 'noa_selection') && (
                          <div className="grid grid-cols-2 gap-4 w-full">
                            {currentScenario.noaOptions.map((option) => (
                              <motion.div
                                key={option.id}
                                className={`relative bg-white/70 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 ${
                                  gameSession.gamePhase === 'noa_selection' 
                                    ? 'border-teal-400 shadow-lg hover:shadow-xl hover:border-teal-500' 
                                    : 'border-teal-200 hover:border-teal-300'
                                } ${
                                  gameSession.selectedOption === option.id 
                                    ? 'ring-4 ring-green-500' 
                                    : ''
                                }`}
                                whileHover={gameSession.gamePhase !== 'robot_speaking' ? { scale: 1.02 } : {}}
                                whileTap={gameSession.gamePhase !== 'robot_speaking' ? { scale: 0.98 } : {}}
                                onClick={() => {
                                  if (gameSession.gamePhase === 'noa_listening') {
                                    handleNoaListen(option.id);
                                  } else if (gameSession.gamePhase === 'noa_selection') {
                                    handleNoaSelect(option.id);
                                  }
                                }}
                              >
                                <div className="flex flex-col items-center space-y-3 relative">
                                  {/* NOA Character */}
                                  <div className="relative w-48 h-80">
                                    <Image
                                      src={
                                        noaSpeaking.type === option.type && noaSpeaking.speaking
                                          ? TONE_GAME_CONFIG.characters.noa[option.type as 'imperative' | 'supplicating'].talking
                                          : TONE_GAME_CONFIG.characters.noa[option.type as 'imperative' | 'supplicating'].static
                                      }
                                      alt={`NOA ${option.type}`}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  
                                  {/* Option Info */}
                                  <div className="text-center">
                                    <p className="font-semibold text-teal-800 text-lg mb-2">{option.label}</p>
                                    <div className="bg-teal-100 border-2 border-teal-300 rounded-lg px-4 py-3 mt-2 flex items-center justify-center gap-3">
                                      <p className="text-base font-medium text-teal-800">
                                        {gameSession.gamePhase === 'noa_listening' && gameSession.listenedOptions.includes(option.id) && '✓ Escuchado'}
                                        {gameSession.gamePhase === 'noa_listening' && !gameSession.listenedOptions.includes(option.id) && 'Clic para escuchar'}
                                        {gameSession.gamePhase === 'noa_selection' && 'Clic para seleccionar'}
                                      </p>

                                      {/* Selection Mode Indicator inside background */}
                                      {gameSession.gamePhase === 'noa_selection' && (
                                        <div className="w-7 h-7 rounded-full border-2 border-teal-600 flex items-center justify-center flex-shrink-0 bg-white">
                                          {gameSession.selectedOption === option.id && (
                                            <div className="w-4 h-4 rounded-full bg-green-500" />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        </motion.div>
                      </div>
                    </div>
                    
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
                                  ? TONE_GAME_CONFIG.feedback.images.correct 
                                  : TONE_GAME_CONFIG.feedback.images.incorrect}
                                alt={feedbackInfo.isCorrect ? "Correcto" : "Incorrecto"}
                                width={120}
                                height={120}
                                className="object-contain"
                              />
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-4 text-center shadow-xl">
                              <p className={`font-medium text-lg ${feedbackInfo.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {feedbackInfo.text}
                              </p>
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
                  subtitle="Has aprendido sobre los tonos de voz. Recuerda: si queremos que una persona haga algo, no podemos hablar obligándole."
                  emoji="🎉"
                  bgColor="bg-teal-500/20"
                  textColor="text-teal-900"
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