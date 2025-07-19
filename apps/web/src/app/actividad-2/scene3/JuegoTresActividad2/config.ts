export const GAME_CONFIG = {
  id: 'juego_tres_actividad_2',
  title: 'Privado vs Público',
  
  // Global audio files
  globalAudio: {
    titleGame: '/audio/actividad-2/juego3/title.mp3',
    buttonClick: '/audio/button/Bright.mp3',
    correct: '/audio/actividad-2/juego3/correcto.mp3',
    incorrect: '/audio/actividad-2/juego3/ops-respuesta-mal.mp3',
    tryAgain: '/audio/actividad-2/juego3/tryagain.mp3'
  },

  // Drop zones configuration
  dropZones: {
    private: {
      id: 'PRIVATE',
      name: 'PRIVADO',
      color: '#ffb672', // Orange
      position: 'left'
    },
    public: {
      id: 'PUBLIC', 
      name: 'PÚBLICO',
      color: '#c1e3e4', // Blue
      position: 'right'
    }
  },

  // Background image
  backgroundImage: '/image/actividad-2/juego_3/bg.png',

  // Situations data
  situations: [
    {
      id: 'saludar_amigos',
      name: 'Saludar a amigos',
      image: '/image/actividad_2/juego_3/PUB-saludar-amigos.png',
      dragAudio: '/audio/actividad-2/juego3/saludar-amigos.mp3',
      isPrivate: false,
      correctAnswer: 'PUBLIC' as const,
      feedback: {
        audio: '/audio/actividad-2/juego3/text-saludar-amigos.mp3',
        correctText: '¡Muy bien! Saludar a amigos es algo que podemos hacer en espacios públicos.',
        incorrectText: 'Ohhh, tu respuesta está mal. Saludar a amigos es algo que podemos hacer en espacios públicos.'
      }
    },
    {
      id: 'cambiarse_ropa',
      name: 'Cambiarse de ropa',
      image: '/image/actividad_2/juego_3/PRI-cambiarse-ropa.png',
      dragAudio: '/audio/actividad-2/juego3/cambioropa.mp3',
      isPrivate: true,
      correctAnswer: 'PRIVATE' as const,
      feedback: {
        audio: '/audio/actividad-2/juego3/text-cambiar-ropa.mp3',
        correctText: '¡Muy bien! Cambiarse de ropa es algo que podemos hacer en espacios privados, en la habitación o en el baño.',
        incorrectText: 'Ohhh, tu respuesta está mal. Cambiarse de ropa es algo privado. No lo hacemos en público.'
      }
    },
    {
      id: 'besar_en_la_boca',
      name: 'Besar en la boca',
      image: '/image/actividad_2/juego_3/PRI-besar-pareja.png',
      dragAudio: '/audio/actividad-2/juego3/besoboca.mp3',
      isPrivate: true,
      correctAnswer: 'PRIVATE' as const,
      feedback: {
        audio: '/audio/actividad-2/juego3/text-beso-boca.mp3',
        correctText: '¡Muy bien! Besar en la boca es algo que podemos hacer en espacios privados cuando estamos solos con nuestra pareja.',
        incorrectText: 'Ohhh, tu respuesta está mal. Besar en la boca es algo que podemos hacer en espacios privados. No lo hacemos en público. ¡Inténtalo de nuevo!'
      }
    },
    {
      id: 'besar_en_la_mejilla',
      name: 'Besar en la mejilla',
      image: '/image/actividad_2/juego_3/PUB-dar-dos-besos.png',
      dragAudio: '/audio/actividad-2/juego3/besarmejilla.mp3',
      isPrivate: false,
      correctAnswer: 'PUBLIC' as const,
      feedback: {
        audio: '/audio/actividad-2/juego3/text-besar-mejilla.mp3',
        correctText: '¡Muy bien! ¡Muy bien! Besar en la mejilla es algo que podemos hacer en espacios públicos.',
        incorrectText: 'Ohhh, tu respuesta está mal. Besar en la mejilla es algo que podemos hacer en espacios públicos. ¡Inténtalo de nuevo!'
      }
    },
    {
      id: 'jugar_a_las_cartas',
      name: 'Jugar a las cartas',
      image: '/image/actividad_2/juego_3/PUB_Jugar-cartas.png',
      dragAudio: '/audio/actividad-2/juego3/jugar.mp3',
      isPrivate: false,
      correctAnswer: 'PUBLIC' as const,
      feedback: {
        audio: '/audio/actividad-2/juego3/text-jugar-cartas.mp3',
        correctText: '¡Muy bien! Jugar a las cartas es algo que podemos hacer en espacios públicos.',
        incorrectText: 'Ohhh, tu respuesta está mal. Jugar a las cartas es algo que hacemos en espacios públicos. ¡Inténtalo de nuevo!'
      }
    },
    {
      id: 'masturbarse_bano',
      name: 'Masturbarse en el baño',
      image: '/image/actividad_2/juego_3/PRI-Masturbarse.png',
      dragAudio: '/audio/actividad-2/juego3/masturbar-bano.mp3',
      isPrivate: true,
      correctAnswer: 'PRIVATE' as const,
      feedback: {
        audio: '/audio/actividad-2/juego3/text-tocar-pene.mp3',
        correctText: '¡Muy bien! Tocarse (el pene o la vulva) es algo privado que hacemos en un lugar y momento en que estamos solos.',
        incorrectText: 'Ohhh, tu respuesta está mal. Tocarse (el pene o la vulva) es algo que podemos hacer en espacios privados. No lo hacemos en público. ¡Inténtalo de nuevo!'
      }
    },
    {
      id: 'abrazarse',
      name: 'Abrazarse',
      image: '/image/actividad_2/juego_3/PUB-saludar-amigos.png',
      dragAudio: '/audio/actividad-2/juego3/abrazo.mp3',
      isPrivate: false,
      correctAnswer: 'PUBLIC' as const,
      feedback: {
        audio: '/audio/actividad-2/juego3/text-abrazo.mp3',
        correctText: '¡Muy bien! Abrazarse es algo que que podemos hacer en espacios públicos.',
        incorrectText: 'Si es incorrecto: Ohhh, tu respuesta está mal. Abrazarse es algo que podemos hacer en espacios públicos. ¡Inténtalo de nuevo!'
      }
    }
  ],

  // Timing configuration
  timing: {
    dragAudioDelay: 300,
    feedbackDuration: 5000,
    tryAgainDelay: 2000,
    titleAudioDelay: 1000
  },

  // Animation settings
  animations: {
    situationEntry: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    dropZoneHover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    dragItem: {
      scale: 1.1,
      zIndex: 1000,
      transition: { duration: 0.2 }
    }
  }
} as const;

// Utility function to shuffle array
export const shuffleArray = <T>(array: readonly T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Types for the game
export interface SituationAttempt {
  gameId: string;
  situationId: string;
  userId?: string;
  sessionId?: string;
  selectedZone: 'PRIVATE' | 'PUBLIC';
  correctZone: 'PRIVATE' | 'PUBLIC';
  isCorrect: boolean;
  isPrivate: boolean;
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
  finalScore: number;
  situationsOrder: string[];
}