'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';
import { getCharacterGameConfig, HYGIENE_GAME_CONFIG } from './config';
import { playGameAudio, createGameAudio } from '../../../utils/gameAudio';

interface Step2Props {
  character: Character;
  onStepComplete: (isCorrect: boolean) => void;
}

interface ClickableElementProps {
  id: string;
  image: string;
  alt: string;
  isCorrect: boolean;
  onClick: (isCorrect: boolean) => void;
  isClicked: boolean;
  newImage?: string;
}

interface FeedbackOverlayProps {
  isVisible: boolean;
  isCorrect: boolean;
  onComplete: () => void;
}

const ClickableElement: React.FC<ClickableElementProps> = ({ 
  //id, 
  image, 
  alt, 
  isCorrect, 
  onClick, 
  isClicked,
  newImage 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating || isClicked) return;
    
    setIsAnimating(true);
    onClick(isCorrect);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const currentImage = (isClicked && newImage) ? newImage : image;

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={handleClick}
      whileHover={!isClicked ? { scale: 1.05 } : {}}
      whileTap={!isClicked ? { scale: 0.95 } : {}}
      animate={isAnimating ? {
        scale: [1, 1.2, 1],
        rotate: [0, isCorrect ? 5 : -5, 0]
      } : {}}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="relative w-48 h-56 md:w-64 md:h-72">
        <Image
          src={currentImage}
          alt={alt}
          fill
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
};

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ isVisible, isCorrect, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // Show feedback for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`absolute top-1/2 transform -translate-y-1/2 z-50 ${
        isCorrect ? 'right-8' : 'left-8'
      }`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        <Image
          src={isCorrect ? HYGIENE_GAME_CONFIG.feedbackImages.correct : HYGIENE_GAME_CONFIG.feedbackImages.incorrect}
          alt={isCorrect ? 'Correcto' : 'Incorrecto'}
          fill
          className="object-contain"
        />
      </div>
    </motion.div>
  );
};

export default function Step2({ character, onStepComplete }: Step2Props) {
  const [titlePlayed, setTitlePlayed] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [showerClicked, setShowerClicked] = useState(false);
  const [soapClicked, setSoapClicked] = useState(false);
  const [elementClicked, setElementClicked] = useState(false);

  const config = getCharacterGameConfig(character!);
  const stepData = config?.steps?.[1]; // Step 2 data

  // Play title audio when component mounts - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    if (!stepData) return;

    const timer = setTimeout(() => {
      try {
        const audio = createGameAudio(stepData.audio.title, 0.7, 'Step2 Title Audio');
        setCurrentAudio(audio);

        audio.play().then(() => {
          setTimeout(() => {
            setTitlePlayed(true);
            setShowElements(true);
            setCurrentAudio(null);
          }, stepData.audio.duration);
        }).catch(console.warn);
      } catch (error) {
        console.warn('Could not play title audio:', error);
        setTimeout(() => {
          setTitlePlayed(true);
          setShowElements(true);
        }, 2000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [stepData]);

  // Cleanup audio on unmount - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  // Early return AFTER hooks
  if (!stepData) {
    console.error('Step 2 data not found in config');
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-white text-lg">Error: Step 2 configuration not found</div>
      </div>
    );
  }

  const playFeedbackAudio = (correct: boolean) => {
    try {
      // Play immediate feedback sound
      playGameAudio(
        correct ? HYGIENE_GAME_CONFIG.feedbackSounds.correct : HYGIENE_GAME_CONFIG.feedbackSounds.incorrect,
        0.7,
        `Step2 ${correct ? 'Correct' : 'Incorrect'} Feedback`
      );

      // Play descriptive feedback after a short delay
      setTimeout(() => {
        const descriptionAudio = createGameAudio(
          correct ? stepData.feedback.correct.audio : stepData.feedback.incorrect.audio,
          0.7,
          `Step2 ${correct ? 'Correct' : 'Incorrect'} Description`
        );
        setCurrentAudio(descriptionAudio);
        
        // Use the actual audio duration, not config duration
        descriptionAudio.addEventListener('loadedmetadata', () => {
          const audioDuration = Math.ceil(descriptionAudio.duration * 1000);
          
          descriptionAudio.play().then(() => {
            setTimeout(() => {
              setCurrentAudio(null);
              
              if (correct) {
                onStepComplete(true);
              } else {
                // Reset for another attempt
                setElementClicked(false);
                setShowerClicked(false);
                setSoapClicked(false);
                setShowFeedback(false);
              }
            }, audioDuration + 500);
          }).catch(console.warn);
        });

        // Fallback if metadata doesn't load
        setTimeout(() => {
          if (currentAudio === descriptionAudio) {
            setCurrentAudio(null);
            if (correct) {
              onStepComplete(true);
            } else {
              setElementClicked(false);
              setShowerClicked(false);
              setSoapClicked(false);
              setShowFeedback(false);
            }
          }
        }, (correct ? stepData.feedback.correct.duration : stepData.feedback.incorrect.duration) + 1000);
        
      }, 1000);
    } catch (error) {
      console.warn('Could not play feedback audio:', error);
      setTimeout(() => {
        if (correct) {
          onStepComplete(true);
        } else {
          setElementClicked(false);
          setShowerClicked(false);
          setSoapClicked(false);
          setShowFeedback(false);
        }
      }, correct ? stepData.feedback.correct.duration : stepData.feedback.incorrect.duration);
    }
  };

  const handleElementClick = (correct: boolean) => {
    if (elementClicked) return;
    
    setElementClicked(true);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setShowerClicked(true);
    } else {
      setSoapClicked(true);
    }

    // Play feedback audio
    playFeedbackAudio(correct);
  };

  const handleFeedbackComplete = () => {
    setShowFeedback(false);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Title display */}
      {!titlePlayed && (
        <motion.div
          className="text-center text-white text-2xl font-bold bg-orange-500 backdrop-blur-sm rounded-lg px-8 py-6 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {stepData.title}
        </motion.div>
      )}

      {/* Game elements */}
      {showElements && (
        <div className="flex items-center justify-center w-full h-full px-4 py-8">
          <div className="flex items-center w-full max-w-2xl relative">
            {/* Left: Shower */}
            <motion.div
              className="flex flex-col items-center space-y-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ClickableElement
                id="shower"
                image="/image/actividad_4/juego1/abrir-grifo/Ducha_.png"
                newImage="/image/actividad_4/juego1/abrir-grifo/Ducha_2.png"
                alt="Ducha"
                isCorrect={true}
                onClick={handleElementClick}
                isClicked={showerClicked}
              />
            </motion.div>

            {/* Arrow pointing to shower - positioned very close */}
            <motion.div
              className="absolute left-44 top-10 transform -translate-y-1/2 z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: [0, 10, 0] // Left-right animation
              }}
              transition={{ 
                delay: 0.7,
                x: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <div className="relative w-12 h-12 md:w-16 md:h-16">
                <Image
                  src="/image/actividad_4/juego1/abrir-grifo/Flecha_.png"
                  alt="Flecha apuntando a la ducha"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Right: Soap */}
            <motion.div
              className="flex flex-col items-center space-y-3 ml-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ClickableElement
                id="soap"
                image="/image/actividad_4/juego1/abrir-grifo/Jabon_.png"
                alt="Jabón"
                isCorrect={false}
                onClick={handleElementClick}
                isClicked={soapClicked}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Feedback overlay */}
      <FeedbackOverlay
        isVisible={showFeedback}
        isCorrect={isCorrect}
        onComplete={handleFeedbackComplete}
      />
    </div>
  );
}