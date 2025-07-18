export const GAME_CONFIG = {
  id: 'juego_uno_actividad_3',
  title: 'Respuestas Corporales',
  
  // Title audio configuration
  titleAudio: {
    path: '/audio/actividad-3/juego1/title.mp3',
    duration: 20000, // 20 seconds
    delayAfter: 3000 // 3 seconds delay after title
  },

  // Scene image
  sceneImage: '/image/actividad_3/juego1/scene-love.png',

  // Button images
  buttonImages: {
    yes: '/image/actividad_3/juego1/yes.png',
    no: '/image/actividad_3/juego1/no.png'
  },

  // Situations data
  situations: [
    {
      id: 'situation_1',
      title: 'Una persona llorando',
      description: 'Una persona llorando',
      
      // Visual content
      image: '/image/actividad_3/juego1/Llorar.png',
      
      // Audio
      audio: {
        description: '/audio/actividad-3/juego1/t-1.mp3'
      },
      
      // Answer configuration
      correctAnswer: 'NO' as const,
      
      // Feedback configuration
      feedback: {
        correctText: 'No, algo que te gusta no te debe hacer llorar.',
        incorrectText: 'La respuesta correcta es NO. No, algo que te gusta no te debe hacer llorar.',
        audio: '/audio/actividad-3/juego1/fb-1.mp3'
      }
    },
    {
      id: 'situation_2',
      title: 'Una persona estornudando',
      description: 'Una persona estornudando',
      
      // Visual content
      image: '/image/actividad_3/juego1/Estornudo.png',
      
      // Audio
      audio: {
        description: '/audio/actividad-3/juego1/t-2.mp3'
      },
      
      // Answer configuration
      correctAnswer: 'NO' as const,
      
      // Feedback configuration
      feedback: {
        correctText: 'No, algo que te gusta no tiene por qué hacerte estornudar.',
        incorrectText: 'La respuesta correcta es NO. No, algo que te gusta no tiene por qué hacerte estornudar.',
        audio: '/audio/actividad-3/juego1/fb-2.mp3'
      }
    },
    {
      id: 'situation_3',
      title: 'Una persona con dolor de cabeza',
      description: 'Una persona con dolor de cabeza',
      
      // Visual content
      image: '/image/actividad_3/juego1/dolor-de-cabeza.png',
      
      // Audio
      audio: {
        description: '/audio/actividad-3/juego1/t-3.mp3'
      },
      
      // Answer configuration
      correctAnswer: 'NO' as const,
      
      // Feedback configuration
      feedback: {
        correctText: 'No, algo que te gusta no tiene por qué hacer que te duela la cabeza.',
        incorrectText: 'La respuesta correcta es NO. No, algo que te gusta no tiene por qué hacer que te duela la cabeza.',
        audio: '/audio/actividad-3/juego1/fb-3.mp3'
      }
    },
    {
      id: 'situation_4',
      title: 'Una persona con el pene erecto',
      description: 'Una persona con el pene erecto',
      
      // Visual content
      image: '/image/actividad_3/juego1/ereccion.png',
      
      // Audio
      audio: {
        description: '/audio/actividad-3/juego1/t-4.mp3'
      },
      
      // Answer configuration
      correctAnswer: 'YES' as const,
      
      // Feedback configuration
      feedback: {
        correctText: 'Sí, algo que te gusta puede hacer que se te ponga duro el pene.',
        incorrectText: 'La respuesta correcta es SÍ. Sí, algo que te gusta puede hacer que se te ponga duro el pene.',
        audio: '/audio/actividad-3/juego1/fb-4.mp3'
      }
    },
    {
      id: 'situation_5',
      title: 'Una persona con las bragas húmedas',
      description: 'Una persona con las bragas húmedas',
      
      // Visual content
      image: '/image/actividad_3/juego1/bragas-humedas.png',
      
      // Audio
      audio: {
        description: '/audio/actividad-3/juego1/t-5.mp3'
      },
      
      // Answer configuration
      correctAnswer: 'YES' as const,
      
      // Feedback configuration
      feedback: {
        correctText: 'Sí, algo que te gusta puede hacer que sientas calorcito en la vulva y mojes las bragas.',
        incorrectText: 'La respuesta correcta es SÍ. Sí, algo que te gusta puede hacer que sientas calorcito en la vulva y mojes las bragas.',
        audio: '/audio/actividad-3/juego1/fb-5.mp3'
      }
    },
    {
      id: 'situation_6',
      title: 'Una persona con el vello erizado',
      description: 'Una persona con el vello erizado',
      
      // Visual content
      image: '/image/actividad_3/juego1/vello-erizado.png',
      
      // Audio
      audio: {
        description: '/audio/actividad-3/juego1/t-6.mp3'
      },
      
      // Answer configuration
      correctAnswer: 'YES' as const,
      
      // Feedback configuration
      feedback: {
        correctText: 'Sí, algo que te gusta puede hacer que los pelos se pongan de punta.',
        incorrectText: 'La respuesta correcta es SÍ. Sí, algo que te gusta puede hacer que los pelos se pongan de punta.',
        audio: '/audio/actividad-3/juego1/fb-6.mp3'
      }
    },
    {
      id: 'situation_7',
      title: 'Una persona con palpitaciones',
      description: 'Una persona con palpitaciones',
      
      // Visual content
      image: '/image/actividad_3/juego1/Palpitaciones.png',
      
      // Audio
      audio: {
        description: '/audio/actividad-3/juego1/t-7.mp3'
      },
      
      // Answer configuration
      correctAnswer: 'YES' as const,
      
      // Feedback configuration
      feedback: {
        correctText: 'Sí, algo que te gusta puede hacer que el corazón te vaya más fuerte.',
        incorrectText: 'La respuesta correcta es SÍ. Sí, algo que te gusta puede hacer que el corazón te vaya más fuerte.',
        audio: '/audio/actividad-3/juego1/fb-7.mp3'
      }
    }
  ],

  // Timing configuration
  timing: {
    titleDelay: 3000, // 3 seconds after title finishes
    feedbackDuration: 4000, // 4 seconds for feedback
    situationDelay: 1000, // 1 second between situations
    buttonDelay: 500 // Delay before showing buttons
  }
} as const;

// Database tracking types
export interface SituationAttempt {
  gameId: string;
  situationId: string;
  userId?: string;
  sessionId?: string;
  selectedAnswer: 'YES' | 'NO';
  correctAnswer: 'YES' | 'NO';
  isCorrect: boolean;
  timestamp: Date;
  timeToAnswer?: number;
}

export interface GameSession {
  gameId: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  totalSituations: number;
  correctAnswers: number;
  situationsCorrect: boolean[]; // Track which situations have been answered correctly
  finalScore: number;
}