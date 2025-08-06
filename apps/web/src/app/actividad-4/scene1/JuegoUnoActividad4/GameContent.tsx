'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Character } from './JuegoUnoActividad4';
import Step1 from './Step1';
import Step2 from './Step2';

interface GameContentProps {
  selectedCharacter: Character;
  onGameComplete: () => void;
  onClose: () => void;
}

export default function GameContent({ selectedCharacter, onGameComplete, onClose }: GameContentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const handleStepComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      setCompletedSteps(prev => prev + 1);
      
      // Move to next step
      if (currentStep === 1) {
        setTimeout(() => {
          console.log('Step 1 completed! Moving to Step 2...');
          setCurrentStep(2);
        }, 1000);
      } else if (currentStep === 2) {
        setTimeout(() => {
          console.log('Step 2 completed! Ready for Step 3...');
          // TODO: Add Step 3 here
          
          // Temporary: Complete game after Step 2
          onGameComplete();
          onClose();
        }, 1000);
      }
      // Add more steps here as they're created
    }
    // If incorrect, step will reset itself and user can try again
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1 
            character={selectedCharacter} 
            onStepComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <Step2 
            character={selectedCharacter} 
            onStepComplete={handleStepComplete}
          />
        );
      default:
        return (
          <Step1 
            character={selectedCharacter} 
            onStepComplete={handleStepComplete}
          />
        );
    }
  };

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Game Box with border image */}
      <div 
        className="relative w-[80%] h-[80%] flex items-center justify-center"
        style={{
          backgroundImage: 'url(/image/actividad_4/juego1/Caja.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Game content based on selected character */}
        <div className="w-full h-full">
          {renderCurrentStep()}
        </div>
      </div>
    </motion.div>
  );
}