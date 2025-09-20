export const TONE_GAME_CONFIG = {
  id: 'juego_dos_actividad_5',
  title: '¿Qué dice mi tono de voz?',
  instruction: 'El robot no sabe usar los tonos de voz de forma correcta. ¡Ayúdale! Escoge el tono adecuado. NOA te ayudará.',
  
  // Shared audio and visual feedback
  feedback: {
    sounds: {
      correct: '/audio/actividad-5/juego2/fb-correct.mp3',
      incorrect: '/audio/actividad-5/juego2/fb-wrong.mp3'
    },
    images: {
      correct: '/image/actividad_5/juego2/yes.png',
      incorrect: '/image/actividad_5/juego2/no.png'
    },
    stars: '/image/actividad_5/juego2/starts.png'
  },
  
  // Audio for title and game elements
  audio: {
    title: '/audio/actividad-5/juego2/title.mp3',
    questionTone: '/audio/actividad-5/juego2/tono.mp3', // "¿Cuál es el tono correcto?"
    finalGame: '/audio/actividad-5/juego2/final-game.mp3',
    duration: 9000 // Title is 9 seconds
  },
  
  // Characters images
  characters: {
    robot: {
      static: '/image/actividad_5/juego2/robot-static.gif',
      talking: '/image/actividad_5/juego2/robot.gif'
    },
    noa: {
      imperative: {
        talking: '/image/actividad_5/juego2/noa-i.gif',
        static: '/image/actividad_5/juego2/noa-i-static.gif'
      },
      supplicating: {
        talking: '/image/actividad_5/juego2/noa-s.gif',
        static: '/image/actividad_5/juego2/noa-s-s.gif'
      }
    }
  },
  
  // Speech bubbles
  speechBubbles: {
    robot: '/image/actividad_5/juego2/globo-robot.png',
    noa: '/image/actividad_5/juego2/globo-noa.png'
  },
  
  // Game scenarios
  scenarios: [
    {
      id: 'scenario_1',
      robotText: '¡Oye, siéntate aquí!',
      robotAudio: '/audio/actividad-5/juego2/robot/s-1-neutra.mp3',
      correctAnswer: 'imperative', // This phrase should be said with imperative tone
      
      noaOptions: [
        {
          id: 'noa_imperative',
          type: 'imperative',
          audio: '/audio/actividad-5/juego2/noa/s-1-noa-imperactivo.mp3',
          label: 'Tono A - Imperativo',
          isCorrect: true,
          feedback: {
            text: '¡Eso es! Un comando directo necesita tono imperativo.',
            audio: '/audio/actividad-5/juego2/fb-correct.mp3'
          }
        },
        {
          id: 'noa_supplicating',
          type: 'supplicating',
          audio: '/audio/actividad-5/juego2/noa/s-1-noa-suplica.mp3',
          label: 'Tono B - Súplica',
          isCorrect: false,
          feedback: {
            text: 'Prueba otra vez. Un comando directo no necesita súplica.',
            audio: '/audio/actividad-5/juego2/fb-wrong.mp3'
          }
        }
      ]
    },
    {
      id: 'scenario_2',
      robotText: 'Por favor, ¿puedes sentarte conmigo?',
      robotAudio: '/audio/actividad-5/juego2/robot/s-2-neutra.mp3',
      correctAnswer: 'supplicating', // This phrase should be said with supplicating tone
      
      noaOptions: [
        {
          id: 'noa_imperative',
          type: 'imperative',
          audio: '/audio/actividad-5/juego2/noa/s-2-noa-imperactivo.mp3',
          label: 'Tono A - Imperativo',
          isCorrect: false,
          feedback: {
            text: 'Prueba otra vez. Una petición amable necesita tono de súplica.',
            audio: '/audio/actividad-5/juego2/fb-wrong.mp3'
          }
        },
        {
          id: 'noa_supplicating',
          type: 'supplicating',
          audio: '/audio/actividad-5/juego2/noa/s-2-noa-suplica.mp3',
          label: 'Tono B - Súplica',
          isCorrect: true,
          feedback: {
            text: '¡Eso es! Una petición amable necesita tono de súplica.',
            audio: '/audio/actividad-5/juego2/fb-correct.mp3'
          }
        }
      ]
    }
  ],
  
  // Timing configuration
  timing: {
    titleDelay: 1000,
    robotSpeechDuration: 4000,
    noaListenDelay: 1000,
    questionDelay: 2000,
    feedbackDuration: 3000,
    transitionDelay: 2000,
    completionDelay: 2000
  }
};

// Type definitions for game state tracking
export interface ToneGameSession {
  scenarioIndex: number;
  gamePhase: 'intro' | 'robot_speaking' | 'question_asking' | 'noa_listening' | 'noa_selection' | 'feedback' | 'completed';
  listenedOptions: string[]; // Track which NOA options user has listened to
  selectedOption: string | null;
  completed: boolean;
  correctAnswersCount: number; // Track correct answers to advance scenarios
}

// Helper function to check if scenario is completed
export const isScenarioCompleted = (gameSession: ToneGameSession): boolean => {
  return gameSession.selectedOption !== null;
};

// Helper function to check if entire game is completed
export const isToneGameCompleted = (gameSession: ToneGameSession): boolean => {
  return gameSession.scenarioIndex >= TONE_GAME_CONFIG.scenarios.length - 1 && isScenarioCompleted(gameSession);
};

// Helper function to get current scenario
export const getCurrentScenario = (gameSession: ToneGameSession) => {
  return TONE_GAME_CONFIG.scenarios[gameSession.scenarioIndex];
};