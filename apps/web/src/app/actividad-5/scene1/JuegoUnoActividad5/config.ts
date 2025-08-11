export const FACIAL_EXPRESSION_GAME_CONFIG = {
  id: 'juego_uno_actividad_5',
  title: '¿Qué dice mi cara?',
  instruction: 'Mira la cara y clica en el tono y los gestos correctos: Sonriente, triste y enfadado.',
  
  // Shared audio and visual feedback
  feedback: {
    sounds: {
      correct: '/audio/YES.mp3',
      incorrect: '/audio/NO.mp3'
    },
    images: {
      correct: '/image/actividad_5/juego1/yes.png',
      incorrect: '/image/actividad_5/juego1/no.png'
    },
    stars: '/image/actividad_5/juego1/stars.png'
  },
  
  // Audio for title
  audio: {
    title: '/audio/actividad-5/juego1/title.mp3',
    duration: 4000
  },
  
  // Scenarios with different emotions
  scenarios: [
    {
      id: 'scenario_1',
      sentence: 'El domingo voy a comer con mis abuelos y mis primos.',
      emotion: 'enfadado', // angry
      faceImage: '/image/actividad_5/juego1/card/a-e.png', // angry face card
      
      // Tone options
      toneOptions: [
        {
          id: 'tone_angry',
          audio: '/audio/actividad-5/juego1/s-e.mp3', // angry tone
          emotion: 'enfadado',
          globeImage: '/image/actividad_5/juego1/globo/angry-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/angry-2.png',
          isCorrect: true,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-c-enfadado.mp3',
            text: '¡Eso es! El personaje está enfadado.',
            duration: 3000
          }
        },
        {
          id: 'tone_sad',
          audio: '/audio/actividad-5/juego1/s-t.mp3', // sad tone
          emotion: 'triste',
          globeImage: '/image/actividad_5/juego1/globo/sad-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/sad-2.png',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-triste.mp3',
            text: 'Prueba otra vez, no está triste.',
            duration: 3000
          }
        },
        {
          id: 'tone_happy',
          audio: '/audio/actividad-5/juego1/s-c.mp3', // happy tone
          emotion: 'contento',
          globeImage: '/image/actividad_5/juego1/globo/smile-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/smile-2.png',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-contento.mp3',
            text: 'Prueba otra vez, no está contento.',
            duration: 3000
          }
        }
      ],
      
      // Gesture options
      gestureOptions: [
        {
          id: 'gesture_sad',
          image: '/image/actividad_5/juego1/a-sad.gif',
          emotion: 'triste',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-triste.mp3',
            text: 'Prueba otra vez, no está triste.',
            duration: 3000
          }
        },
        {
          id: 'gesture_angry',
          image: '/image/actividad_5/juego1/a-angry.gif',
          emotion: 'enfadado',
          isCorrect: true,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-c-enfadado.mp3',
            text: '¡Eso es! El personaje está enfadado.',
            duration: 3000
          }
        },
        {
          id: 'gesture_happy',
          image: '/image/actividad_5/juego1/a-happy.gif',
          emotion: 'contento',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-contento.mp3',
            text: 'Prueba otra vez, no está contento.',
            duration: 3000
          }
        }
      ]
    },
    {
      id: 'scenario_2',
      sentence: 'El domingo voy a comer con mis abuelos y mis primos.',
      emotion: 'triste', // sad
      faceImage: '/image/actividad_5/juego1/card/a-t.png', // sad face card
      
      // Tone options
      toneOptions: [
        {
          id: 'tone_angry',
          audio: '/audio/actividad-5/juego1/s-e.mp3', // angry tone
          emotion: 'enfadado',
          globeImage: '/image/actividad_5/juego1/globo/angry-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/angry-2.png',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-enfadado.mp3',
            text: 'Prueba otra vez, no está enfadado.',
            duration: 3000
          }
        },
        {
          id: 'tone_sad',
          audio: '/audio/actividad-5/juego1/s-t.mp3', // sad tone
          emotion: 'triste',
          globeImage: '/image/actividad_5/juego1/globo/sad-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/sad-2.png',
          isCorrect: true,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-c-triste.mp3',
            text: '¡Eso es! El personaje está triste.',
            duration: 3000
          }
        },
        {
          id: 'tone_happy',
          audio: '/audio/actividad-5/juego1/s-c.mp3', // happy tone
          emotion: 'contento',
          globeImage: '/image/actividad_5/juego1/globo/smile-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/smile-2.png',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-contento.mp3',
            text: 'Prueba otra vez, no está contento.',
            duration: 3000
          }
        }
      ],
      
      // Gesture options
      gestureOptions: [
        {
          id: 'gesture_sad',
          image: '/image/actividad_5/juego1/a-sad.gif',
          emotion: 'triste',
          isCorrect: true,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-c-triste.mp3',
            text: '¡Eso es! El personaje está triste.',
            duration: 3000
          }
        },
        {
          id: 'gesture_angry',
          image: '/image/actividad_5/juego1/a-angry.gif',
          emotion: 'enfadado',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-enfadado.mp3',
            text: 'Prueba otra vez, no está enfadado.',
            duration: 3000
          }
        },
        {
          id: 'gesture_happy',
          image: '/image/actividad_5/juego1/a-happy.gif',
          emotion: 'contento',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-contento.mp3',
            text: 'Prueba otra vez, no está contento.',
            duration: 3000
          }
        }
      ]
    },
    {
      id: 'scenario_3',
      sentence: 'El domingo voy a comer con mis abuelos y mis primos.',
      emotion: 'contento', // happy
      faceImage: '/image/actividad_5/juego1/card/a-f.png', // happy face card
      
      // Tone options
      toneOptions: [
        {
          id: 'tone_angry',
          audio: '/audio/actividad-5/juego1/s-e.mp3', // angry tone
          emotion: 'enfadado',
          globeImage: '/image/actividad_5/juego1/globo/angry-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/angry-2.png',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-enfadado.mp3',
            text: 'Prueba otra vez, no está enfadado.',
            duration: 3000
          }
        },
        {
          id: 'tone_sad',
          audio: '/audio/actividad-5/juego1/s-t.mp3', // sad tone
          emotion: 'triste',
          globeImage: '/image/actividad_5/juego1/globo/sad-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/sad-2.png',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-triste.mp3',
            text: 'Prueba otra vez, no está triste.',
            duration: 3000
          }
        },
        {
          id: 'tone_happy',
          audio: '/audio/actividad-5/juego1/s-c.mp3', // happy tone
          emotion: 'contento',
          globeImage: '/image/actividad_5/juego1/globo/smile-1.png',
          globeImageSelected: '/image/actividad_5/juego1/globo/smile-2.png',
          isCorrect: true,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-c-content.mp3',
            text: '¡Eso es! El personaje está contento.',
            duration: 3000
          }
        }
      ],
      
      // Gesture options
      gestureOptions: [
        {
          id: 'gesture_sad',
          image: '/image/actividad_5/juego1/a-sad.gif',
          emotion: 'triste',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-triste.mp3',
            text: 'Prueba otra vez, no está triste.',
            duration: 3000
          }
        },
        {
          id: 'gesture_angry',
          image: '/image/actividad_5/juego1/a-angry.gif',
          emotion: 'enfadado',
          isCorrect: false,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-i-no-enfadado.mp3',
            text: 'Prueba otra vez, no está enfadado.',
            duration: 3000
          }
        },
        {
          id: 'gesture_happy',
          image: '/image/actividad_5/juego1/a-happy.gif',
          emotion: 'contento',
          isCorrect: true,
          feedback: {
            audio: '/audio/actividad-5/juego1/fb-c-content.mp3',
            text: '¡Eso es! El personaje está contento.',
            duration: 3000
          }
        }
      ]
    }
  ],
  
  // Timing configuration
  timing: {
    titleDelay: 1000, // 1 second before title
    feedbackDuration: 3000, // 3 seconds for feedback
    transitionDelay: 1000, // 1 second transition between scenarios
    completionDelay: 2000 // 2 seconds before game completion
  }
};

// Type definitions for game state tracking
export interface GameSession {
  scenarioIndex: number;
  toneSelected: boolean;
  gestureSelected: boolean;
  toneCorrect: boolean;
  gestureCorrect: boolean;
  completed: boolean;
}

// Helper function to get a random scenario
export const getRandomScenario = () => {
  const randomIndex = Math.floor(Math.random() * FACIAL_EXPRESSION_GAME_CONFIG.scenarios.length);
  return FACIAL_EXPRESSION_GAME_CONFIG.scenarios[randomIndex];
};

// Helper function to check if all parts of the current scenario are completed correctly
export const isScenarioCompleted = (gameSession: GameSession): boolean => {
  return gameSession.toneCorrect && gameSession.gestureCorrect;
};

// Helper function to check if the entire game is completed
export const isGameCompleted = (gameSession: GameSession): boolean => {
  return gameSession.scenarioIndex >= FACIAL_EXPRESSION_GAME_CONFIG.scenarios.length - 1 && isScenarioCompleted(gameSession);
};

