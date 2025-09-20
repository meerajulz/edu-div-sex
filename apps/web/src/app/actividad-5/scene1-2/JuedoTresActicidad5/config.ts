export const EMOTION_GAME_CONFIG = {
  id: 'juego_tres_actividad_5',
  title: '¿Qué cara pondrá?',
  instruction: 'Ayuda a los personajes a mostrar la expresión facial correcta',
  
  // Shared audio and visual feedback
  feedback: {
    sounds: {
      correct: '/audio/actividad-5/juego3/fb-yes.mp3',
      wrongAngry: '/audio/actividad-5/juego3/fb-no-enfado-cris.mp3',
      wrongSad: '/audio/actividad-5/juego3/fb-no-trsite.mp3'
    },
    images: {
      correct: '/image/actividad_5/juego3/yes.png',
      incorrect: '/image/actividad_5/juego3/no.png'
    }
  },
  
  // Audio for title and game elements
  audio: {
    title: '/audio/actividad-5/juego3/t.mp3',
    duration: 5000 // Estimated title duration
  },
  
  // Emotion options configuration
  emotionOptions: [
    {
      id: 'happy',
      type: 'happy' as const,
      images: {
        normal: '/image/actividad_5/juego3/globitos/happy.png',
        correct: '/image/actividad_5/juego3/globitos/happy-correct.png',
        error: '/image/actividad_5/juego3/globitos/happy-error.png'
      },
      size: { width: 120, height: 80 }
    },
    {
      id: 'sad',
      type: 'sad' as const,
      images: {
        normal: '/image/actividad_5/juego3/globitos/sad.png',
        correct: '/image/actividad_5/juego3/globitos/sad-correct.png',
        error: '/image/actividad_5/juego3/globitos/sad-error.png'
      },
      size: { width: 120, height: 80 }
    },
    {
      id: 'angry',
      type: 'angry' as const,
      images: {
        normal: '/image/actividad_5/juego3/globitos/angry.png',
        correct: '/image/actividad_5/juego3/globitos/angry-correct.png',
        error: '/image/actividad_5/juego3/globitos/angry-error.png'
      },
      size: { width: 120, height: 80 }
    }
  ],
  
  // Game scenarios
  scenarios: [
    {
      id: 'scenario_1',
      name: 'Noa and Cris',
      backgroundImages: {
        initial: '/image/actividad_5/juego3/part-1/image-fondo.png',
        completion: '/image/actividad_5/juego3/part-1/image-fondo-2.png'
      },
      itemQuestionAudio: '/audio/actividad-5/juego3/item-1-question.mp3',
      
      speaker: {
        name: 'Cris',
        speechBubble: {
          image: '/image/actividad_5/juego3/part-1/cris-ask-noa.png',
          size: { width: 170, height: 100 }
        },
        audio: '/audio/actividad-5/juego3/c-question.mp3'
      },
      
      responder: {
        name: 'Noa',
        images: {
          listening: '/image/actividad_5/juego3/part-1/noa-1.png',
          responding: '/image/actividad_5/juego3/part-1/noa-1.png',
          final: '/image/actividad_5/juego3/part-1/noa-2.png'
        },
        speechBubble: {
          image: '/image/actividad_5/juego3/part-1/cris-ask-noa.png', // Reusing same bubble
          size: { width: 170, height: 100 }
        },
        audio: '/audio/actividad-5/juego3/n-answer.mp3',
        size: { width: 245, height: 235 }
      },
      
      correctEmotion: 'happy',
      feedbackAudio: {
        correct: '/audio/actividad-5/juego3/fb-yes.mp3',
        wrongAngry: '/audio/actividad-5/juego3/fb-no-enfado-cris.mp3',
        wrongSad: '/audio/actividad-5/juego3/fb-no-trsite.mp3'
      }
    },
    {
      id: 'scenario_2',
      name: 'Alex and Driver',
      backgroundImages: {
        initial: '/image/actividad_5/juego3/part2/fondo-1.png',
        completion: '/image/actividad_5/juego3/part2/fondo-2.png'
      },
      itemQuestionAudio: '/audio/actividad-5/juego3/itme-2-question.mp3',
      
      speaker: {
        name: 'Driver',
        speechBubble: {
          image: '/image/actividad_5/juego3/part2/bocadillo-conductor.png',
          size: { width: 170, height: 100 }
        },
        audio: '/audio/actividad-5/juego3/m-afirmation.mp3'
      },
      
      responder: {
        name: 'Alex',
        images: {
          listening: '/image/actividad_5/juego3/part2/alex-1.png',
          responding: '/image/actividad_5/juego3/part2/alex-1.png', // Same image for responding
          final: '/image/actividad_5/juego3/part2/alex-2.png'
        },
        speechBubble: {
          image: '/image/actividad_5/juego3/part2/bocadillo-alex.png',
          size: { width: 170, height: 100 }
        },
        audio: '/audio/actividad-5/juego3/a-replay.mp3',
        size: { width: 245, height: 235 }
      },
      
      correctEmotion: 'angry',
      feedbackAudio: {
        correct: '/audio/actividad-5/juego3/fb-yes.mp3',
        wrongHappy: '/audio/actividad-5/juego3/fb-yes.mp3', // TODO: Need proper feedback audio
        wrongSad: '/audio/actividad-5/juego3/fb-no-trsite.mp3' // TODO: Need proper feedback audio
      }
    }
  ],
  
  // Scene configuration
  scene: {
    background: {
      size: { width: 520, height: 320 }
    },
    feedbackImage: {
      size: { width: 140, height: 140 }
    }
  },
  
  // Timing configuration
  timing: {
    titleDelay: 1000,
    speakerToResponderDelay: 1000,
    responderToSelectionDelay: 1000,
    feedbackDuration: 3000,
    scenarioTransitionDelay: 2000,
    completionDelay: 1000
  }
};

// Type definitions for game state tracking
export interface EmotionGameSession {
  scenarioIndex: number;
  gamePhase: 'intro' | 'item_question' | 'speaker_talking' | 'responder_talking' | 'emotion_selection' | 'feedback' | 'next_scenario' | 'completed';
  selectedEmotion: 'happy' | 'sad' | 'angry' | null;
  completed: boolean;
  correctAnswersCount: number;
}

// Helper function to check if scenario is completed correctly
export const isScenarioCompletedCorrectly = (gameSession: EmotionGameSession): boolean => {
  const currentScenario = EMOTION_GAME_CONFIG.scenarios[gameSession.scenarioIndex];
  return gameSession.selectedEmotion === currentScenario.correctEmotion;
};

// Helper function to check if entire game is completed
export const isEmotionGameCompleted = (gameSession: EmotionGameSession): boolean => {
  return gameSession.scenarioIndex >= EMOTION_GAME_CONFIG.scenarios.length - 1 && isScenarioCompletedCorrectly(gameSession);
};

// Helper function to get current scenario
export const getCurrentScenario = (gameSession: EmotionGameSession) => {
  return EMOTION_GAME_CONFIG.scenarios[gameSession.scenarioIndex];
};

// Helper function to get feedback audio for wrong answer
export const getFeedbackAudio = (gameSession: EmotionGameSession, selectedEmotion: 'happy' | 'sad' | 'angry'): string => {
  const currentScenario = getCurrentScenario(gameSession);
  
  if (selectedEmotion === currentScenario.correctEmotion) {
    return currentScenario.feedbackAudio.correct;
  }
  
  // Return specific wrong answer feedback
  switch (selectedEmotion) {
    case 'angry':
      return currentScenario.feedbackAudio.wrongAngry || EMOTION_GAME_CONFIG.feedback.sounds.wrongAngry;
    case 'sad':
      return currentScenario.feedbackAudio.wrongSad || EMOTION_GAME_CONFIG.feedback.sounds.wrongSad;
    case 'happy':
      return currentScenario.feedbackAudio.wrongHappy || EMOTION_GAME_CONFIG.feedback.sounds.correct;
    default:
      return EMOTION_GAME_CONFIG.feedback.sounds.correct;
  }
};