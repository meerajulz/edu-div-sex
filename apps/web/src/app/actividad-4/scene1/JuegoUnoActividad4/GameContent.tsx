'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Character } from './JuegoUnoActividad4';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';

interface GameContentProps {
  selectedCharacter: Exclude<Character, null>; // ✅ only 'dani' | 'cris'
  onGameComplete: () => void;
  //onClose: () => void;
}

export default function GameContent({ selectedCharacter, onGameComplete }: GameContentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const handleStepComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      setCompletedSteps(prev => prev + 1);

      setTimeout(() => {
        switch (currentStep) {
          case 1:
            console.log('Step 1 completed! Moving to Step 2...');
            setCurrentStep(2);
            break;
          case 2:
            console.log('Step 2 completed! Moving to Step 3...');
            setCurrentStep(3);
            break;
          case 3:
            console.log('Step 3 completed! Moving to Step 4...');
            setCurrentStep(4);
            break;
          case 4:
            console.log('Step 4 completed! Moving to Step 5...');
            setCurrentStep(5);
            break;
          case 5:
            console.log('Step 5 completed! Moving to Step 6...');
            setCurrentStep(6);
            break;
          case 6:
            console.log('Step 6 completed! Game finished!');
            // Instead of calling onClose directly, just trigger the congratulations
            onGameComplete();
            break;
          default:
            break;
        }
      }, 1000);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 character={selectedCharacter} onStepComplete={handleStepComplete} />;
      case 2:
        return <Step2 character={selectedCharacter} onStepComplete={handleStepComplete} />;
      case 3:
        return <Step3 character={selectedCharacter} onStepComplete={handleStepComplete} />;
      case 4:
        return <Step4 character={selectedCharacter} onStepComplete={handleStepComplete} />;
      case 5:
        return <Step5 character={selectedCharacter} onStepComplete={handleStepComplete} />;
      case 6:
        return <Step6 character={selectedCharacter} onStepComplete={handleStepComplete} />;
      default:
        return <Step1 character={selectedCharacter} onStepComplete={handleStepComplete} />;
    }
  };

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress Badge - Top left */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-2 bg-orange-500 text-white rounded-full shadow-lg text-center font-bold text-sm">
          Paso {currentStep}/6
        </div>
      </div>

      <div className="relative w-[85%] h-[85%] bg-yellow-100/30 border-4 border-yellow-600 rounded-xl backdrop-blur-sm shadow-lg flex items-center justify-center overflow-hidden">
        <div className="w-full h-full p-4">
          {renderCurrentStep()}
        </div>
      </div>
    </motion.div>
  );
}