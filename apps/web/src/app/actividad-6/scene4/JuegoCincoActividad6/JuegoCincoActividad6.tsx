'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG, VideoSegment } from './config';
import CongratsOverlay from '../../../components/CongratsOverlay/CongratsOverlay';

interface JuegoCincoActividad6Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

export default function JuegoCincoActividad6({ 
  isVisible, 
  onClose, 
  onGameComplete 
}: JuegoCincoActividad6Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'si' | 'no' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isGameCompleting, setIsGameCompleting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const feedbackAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentSegment: VideoSegment | null = !showIntro && currentSegmentIndex < GAME_CONFIG.segments.length 
    ? GAME_CONFIG.segments[currentSegmentIndex] 
    : null;

  // Reset game state when modal closes
  useEffect(() => {
    if (!isVisible && !showIntro) {
      setCurrentSegmentIndex(0);
      setShowIntro(true);
      setIsPlayingVideo(false);
      setShowQuestion(false);
      setCanAnswer(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setShowCongrats(false);
      setIsGameCompleting(false);
    }
  }, [isVisible]);

  // Play intro audio when game starts
  useEffect(() => {
    if (isVisible && showIntro) {
      playAudio(GAME_CONFIG.introAudio, () => {
        setTimeout(() => {
          setShowIntro(false);
          setIsPlayingVideo(true);
        }, 500);
      });
    }
  }, [isVisible, showIntro]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (feedbackAudioRef.current) {
        feedbackAudioRef.current.pause();
        feedbackAudioRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current = null;
      }
    };
  }, []);

  const playAudio = (src: string, onEnded?: () => void) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(src);
      audioRef.current.volume = 0.7;
      
      audioRef.current.onended = () => {
        if (onEnded) onEnded();
      };
      
      audioRef.current.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play audio:', error);
      if (onEnded) onEnded();
    }
  };

  const playFeedbackAudio = (src: string, onEnded?: () => void) => {
    try {
      if (feedbackAudioRef.current) {
        feedbackAudioRef.current.pause();
      }
      feedbackAudioRef.current = new Audio(src);
      feedbackAudioRef.current.volume = 0.7;
      
      feedbackAudioRef.current.onended = () => {
        if (onEnded) onEnded();
      };
      
      feedbackAudioRef.current.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play feedback audio:', error);
      if (onEnded) onEnded();
    }
  };

  const playSound = (type: 'correct' | 'incorrect' | 'button') => {
    try {
      const soundMap = {
        correct: GAME_CONFIG.soundEffects.correct,
        incorrect: GAME_CONFIG.soundEffects.incorrect,
        button: GAME_CONFIG.soundEffects.buttonClick
      };
      const audio = new Audio(soundMap[type]);
      audio.volume = 0.5;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleVideoEnd = () => {
    setIsPlayingVideo(false);
    setShowQuestion(true);
    
    // Play question audio
    if (currentSegment) {
      playAudio(currentSegment.question.audioUrl, () => {
        setCanAnswer(true);
      });
    }
  };

  const handleAnswer = (answer: 'si' | 'no') => {
    if (!canAnswer || isAnimating || showFeedback || !currentSegment) return;
    
    setIsAnimating(true);
    setSelectedAnswer(answer);
    setCanAnswer(false);
    
    const correct = answer === currentSegment.correctAnswer;
    setIsCorrect(correct);
    
    // Play immediate sound effect
    playSound(correct ? 'correct' : 'incorrect');
    
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Show feedback
    setShowFeedback(true);
  
    // Play feedback audio
    const feedbackAudio = correct 
      ? currentSegment.feedback.correctAudioUrl 
      : currentSegment.feedback.incorrectAudioUrl;
    
    playFeedbackAudio(feedbackAudio, () => {
      setTimeout(() => {
        if (correct) {
          // Check if this was the last segment
          if (currentSegmentIndex === GAME_CONFIG.segments.length - 1) {
            setIsGameCompleting(true);
            setShowFeedback(false);
            setSelectedAnswer(null);
            setShowQuestion(false);
            setShowCongrats(true);
          } else {
            // Move to next segment
            nextSegment();
          }
        } else {
          // If incorrect, replay the same segment
          resetCurrentSegment();
        }
      }, 1000);
    });
    
    setIsAnimating(false);
  };

  const resetCurrentSegment = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setShowQuestion(false);
    setCanAnswer(false);
    setIsPlayingVideo(true);
    // Video will replay
  };

  const nextSegment = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setShowQuestion(false);
    setCanAnswer(false);
    setCurrentSegmentIndex(currentSegmentIndex + 1);
    setIsPlayingVideo(true);
  };

  const handleCongratsComplete = () => {
    setShowCongrats(false);
    onGameComplete();
  };

  const handleSalirJuego = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound('button');
    
    // Stop all media
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (feedbackAudioRef.current) {
      feedbackAudioRef.current.pause();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 rounded-xl shadow-2xl w-full max-w-[900px] h-[85vh] max-h-[650px] overflow-hidden relative border-4 border-purple-300">
              
              {/* Header */}
              <motion.button
                onClick={handleSalirJuego}
                className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                Salir Juego
              </motion.button>

              {/* Game Content */}
              <div className="relative h-full flex items-center justify-center">
                {showIntro ? (
                  // Intro Screen
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center px-8 max-w-2xl"
                  >
                    <h3 className="text-3xl font-bold text-gray-800 mb-6">
                      {GAME_CONFIG.title}
                    </h3>
                    
                    <div className="mt-8">
                      <motion.div
                        animate={{ scale: [2.5, 1.8, 2.2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block text-6xl"
                      >
                        🎬
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Video Player */}
                    {isPlayingVideo && currentSegment && (
                      <video
                        ref={videoRef}
                        key={`video-${currentSegment.id}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={currentSegment.videoUrl}
                        autoPlay
                        playsInline
                        onEnded={handleVideoEnd}
                      />
                    )}

                    {/* Question Screen with Background Image */}
                    {showQuestion && currentSegment && (
                      <>
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${currentSegment.backgroundImage})` }}
                        />
                        
                        {/* Overlay for better button visibility */}
                        <div className="absolute inset-0 bg-black/20" />

                        {/* SI/NO Buttons */}
                        <div className="absolute inset-0 flex items-center justify-between px-20">
                          {/* NO Button (Left) */}
                          <motion.button
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => handleAnswer('no')}
                            disabled={!canAnswer || showFeedback}
                            className={`relative transition-all duration-300 ${
                              !canAnswer ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
                            } ${
                              showFeedback && selectedAnswer !== 'no' ? 'opacity-30' : ''
                            }`}
                            whileHover={canAnswer && !showFeedback ? { scale: 1.1 } : {}}
                            whileTap={canAnswer && !showFeedback ? { scale: 0.95 } : {}}
                          >
                            <img 
                              src={GAME_CONFIG.buttons.no}
                              alt="NO"
                              className="w-32 h-32 drop-shadow-2xl"
                            />
                          </motion.button>

                          {/* SI Button (Right) */}
                          <motion.button
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => handleAnswer('si')}
                            disabled={!canAnswer || showFeedback}
                            className={`relative transition-all duration-300 ${
                              !canAnswer ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
                            } ${
                              showFeedback && selectedAnswer !== 'si' ? 'opacity-30' : ''
                            }`}
                            whileHover={canAnswer && !showFeedback ? { scale: 1.1 } : {}}
                            whileTap={canAnswer && !showFeedback ? { scale: 0.95 } : {}}
                          >
                            <img 
                              src={GAME_CONFIG.buttons.si}
                              alt="SI"
                              className="w-32 h-32 drop-shadow-2xl"
                            />
                          </motion.button>
                        </div>

                        {/* Feedback Indicator (Top Center) */}
                        <AnimatePresence>
                          {showFeedback && (
                            <motion.div
                              initial={{ opacity: 0, y: -50, scale: 0.5 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -50, scale: 0.5 }}
                              className="absolute top-8 left-1/2 transform -translate-x-1/2"
                            >
                              <motion.img
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  rotate: isCorrect ? [0, 10, -10, 0] : [0, -5, 5, 0]
                                }}
                                transition={{ 
                                  duration: 0.5,
                                  repeat: 2
                                }}
                                src={
                                  isCorrect 
                                    ? GAME_CONFIG.feedbackImages.correct
                                    : GAME_CONFIG.feedbackImages.incorrect
                                }
                                alt={isCorrect ? "Correct" : "Incorrect"}
                                className="w-24 h-24"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Congratulations Overlay */}
          <CongratsOverlay
            isVisible={showCongrats}
            title="¡Excelente trabajo!"
            subtitle="Has completado el juego Abusador"
            emoji="🎉"
            bgColor="bg-green-500/20"
            textColor="text-green-800"
            onComplete={handleCongratsComplete}
            autoCloseDelay={3000}
          />
        </>
      )}
    </AnimatePresence>
  );
}
