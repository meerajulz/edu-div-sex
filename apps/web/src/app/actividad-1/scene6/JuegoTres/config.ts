// JuegoTres Configuration - Easy to modify and track for database

export const GAME_CONFIG = {
  id: 'juego_tres',
  title: '¿Qué es una erección?',
  question: 'Señala el pene que está en erección',
  
  // Audio files
  audio: {
    introduction: '/audio/actividad-1/escena_1/juego3/ES6_DANI_07-inicio.mp3',
    instructions: '/audio/actividad-1/escena_1/juego3/ES6_DANI_08-second.mp3',
    correct: '/audio/actividad-1/escena_1/juego3/ES6_DANI_09-correcto.mp3',
    incorrect: '/audio/actividad-1/escena_1/juego3/ES6_DANI_08-incorrecto.mp3',
    celebration: '/audio/actividad-1/escena_2/elements/muy_bien_bright.mp3'
  },

  // Game options
  options: [
    {
      id: 'flaccid_penis',
      type: 'incorrect',
      images: {
        normal: '/image/escena_1/juego_3/pene-image.png',
        feedback: '/image/escena_1/juego_3/pene-image-red.png'
      },
      alt: 'Pene flácido'
    },
    {
      id: 'erect_penis', 
      type: 'correct',
      images: {
        normal: '/image/escena_1/juego_3/pene-img-erecto.png',
        feedback: '/image/escena_1/juego_3/pene-img-erecto-green.png'
      },
      alt: 'Pene erecto'
    }
  ],

  // Feedback messages (for future database storage)
  feedback: {
    correct: '¡Eso es! Las erecciones ocurren cuando el pene está grande y duro.',
    incorrect: 'No pasa nada. Vuelve a intentarlo.'
  },

  // Timing configuration
  timing: {
    audioDelay: 500,
    feedbackDuration: 2000,
    congratsDuration: 2500
  }
};

// Database tracking types
export interface GameAttempt {
  gameId: string;
  userId?: string;
  sessionId?: string;
  selectedOption: string;
  isCorrect: boolean;
  attempts: number;
  timestamp: Date;
  timeToComplete?: number;
}

export interface GameSession {
  gameId: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  totalAttempts: number;
  correctAnswer: string;
  finalResult: 'success' | 'abandoned';
}