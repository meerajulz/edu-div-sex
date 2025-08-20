export const GAME_CONFIG = {
  id: 'juego_dos_actividad_2',
  title: 'Mi cuerpo y mi espacio',
  
  // Global audio files
  globalAudio: {
    titleGame: '/audio/actividad-2/juego2/title-game.mp3',
    subtitle: '/audio/actividad-2/juego2/subtitulo.mp3', // NEW: Subtitle explaining the game
    buttonClick: '/audio/button/Bright.mp3', // Sound for button clicks
    incorrect: '/audio/actividad-2/juego2/incorrecto.mp3', // General "incorrect answer" audio
    correct: '/audio/actividad-2/juego2/correcto.mp3' // General "correct answer" audio
  },

  // Button images for Yes/No
  buttonImages: {
    yes: {
      normal: '/image/actividad_2/juego_2/yes.png',
      hover: '/image/actividad_2/juego_2/yes-hover.png',
      click: '/image/actividad_2/juego_2/yes.png'
    },
    no: {
      normal: '/image/actividad_2/juego_2/no.png',
      hover: '/image/actividad_2/juego_2/no-hover.png',
      click: '/image/actividad_2/juego_2/no.png'
    }
  },

  // Background image
  backgroundImage: '/image/actividad_2/juego_2/bg.png',

  // Body parts data
  bodyParts: [
    {
      id: 'vulva',
      name: 'Vulva',
      image: '/image/actividad_2/juego_2/Vulva_.png',
      isPrivate: true,
      correctAnswer: 'YES' as const,
      feedback: {
        audio: '/audio/actividad-2/juego2/text-vulva.mp3',
        correctText: '¡Exacto! La vulva es una parte sexual para todos y es íntima. Solo tú decides quién puede verte o tocarte ahí.',
        incorrectText: 'La respuesta correcta es SÍ. La vulva es una parte sexual para todos y es íntima. Solo tú decides quién puede verte o tocarte ahí.'
      }
    },
    {
      id: 'pene',
      name: 'Pene y testículos',
      image: '/image/actividad_2/juego_2/Pene.png',
      isPrivate: true,
      correctAnswer: 'YES' as const,
      feedback: {
        audio: '/audio/actividad-2/juego2/text-pene.mp3',
        correctText: '¡Exacto! El pene y los testículos son partes sexuales para todos y son íntimas. Solo tú decides quién puede verte o tocarte ahí.',
        incorrectText: 'La respuesta correcta es SÍ. El pene y los testículos son partes sexuales para todos y son íntimas. Solo tú decides quién puede verte o tocarte ahí.'
      }
    },
    {
      id: 'pecho',
      name: 'Pecho',
      image: '/image/actividad_2/juego_2/Pechos_.png',
      isPrivate: true,
      correctAnswer: 'YES' as const,
      feedback: {
        audio: '/audio/actividad-2/juego2/text-pecho.mp3',
        correctText: '¡Exacto! El pecho es una parte sexual para todos y es íntimo. Solo tú decides quién puede verte o tocarte ahí.',
        incorrectText: 'La respuesta correcta es SÍ. El pecho es una parte sexual para todos y es íntimo. Solo tú decides quién puede verte o tocarte ahí.'
      }
    },
    {
      id: 'nalgas',
      name: 'Nalgas',
      image: '/image/actividad_2/juego_2/Culo_.png',
      isPrivate: true,
      correctAnswer: 'YES' as const,
      feedback: {
        audio: '/audio/actividad-2/juego2/text-culo.mp3',
        correctText: '¡Exacto! Las nalgas son partes sexuales para todos y son íntimas. Solo tú decides quién puede verte o tocarte ahí.',
        incorrectText: 'La respuesta correcta es SÍ. Las nalgas son partes sexuales para todos y son íntimas. Solo tú decides quién puede verte o tocarte ahí.'
      }
    },
    {
      id: 'manos',
      name: 'Manos',
      image: '/image/actividad_2/juego_2/Mano_.png',
      isPrivate: false,
      correctAnswer: 'NO' as const,
      feedback: {
        audio: '/audio/actividad-2/juego2/text-mano.mp3',
        correctText: '¡No! Recuerda, las manos no son partes sexuales, no son partes íntimas.',
        incorrectText: 'La respuesta correcta es NO. Recuerda, las manos no son partes sexuales, no son partes íntimas.'
      }
    },
    {
      id: 'pies',
      name: 'Pies',
      image: '/image/actividad_2/juego_2/Pie_.png',
      isPrivate: false,
      correctAnswer: 'NO' as const,
      feedback: {
        audio: '/audio/actividad-2/juego2/text-pies.mp3',
        correctText: '¡No! Recuerda, los pies no son partes sexuales, no son partes íntimas.',
        incorrectText: 'La respuesta correcta es NO. Recuerda, los pies no son partes sexuales, no son partes íntimas.'
      }
    },
    {
      id: 'cabeza',
      name: 'Cabeza',
      image: '/image/actividad_2/juego_2/Cabeza_.png',
      isPrivate: false,
      correctAnswer: 'NO' as const,
      feedback: {
        audio: '/audio/actividad-2/juego2/text-cabeza.mp3',
        correctText: '¡No! Recuerda, la cabeza no es una parte sexual, no es una parte íntima.',
        incorrectText: 'La respuesta correcta es NO. Recuerda, la cabeza no es una parte sexual, no es una parte íntima.'
      }
    },
    {
      id: 'brazos',
      name: 'Brazos',
      image: '/image/actividad_2/juego_2/Brazo_.png',
      isPrivate: false,
      correctAnswer: 'NO' as const,
      feedback: {
        audio: '/audio/actividad-2/juego2/text-brazo.mp3',
        correctText: '¡No! Recuerda, los brazos no son partes sexuales, no son partes íntimas.',
        incorrectText: 'La respuesta correcta es NO. Recuerda, los brazos no son partes sexuales, no son partes íntimas.'
      }
    }
  ],

  // Timing configuration
  timing: {
    imageAnimation: 500,
    feedbackDuration: 4000,
    buttonDelay: 1000,
    titleAudioDelay: 1000,
    subtitleAudioDelay: 2000, // NEW: Delay before playing subtitle
    incorrectAudioDelay: 1500, // Delay between incorrect audio and specific feedback
    congratsDuration: 3000  // Add this line to fix the error
  },

  // Animation settings
  animations: {
    imageEntry: {
      initial: { opacity: 0, scale: 0.8, y: -50 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    buttonPress: {
      scale: [1, 0.95, 1],
      transition: { duration: 0.15 }
    }
  }
} as const;

// Utility function to shuffle array (for random order)
export const shuffleArray = <T>(array: readonly T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Types for the game
export interface BodyPartAttempt {
  gameId: string;
  bodyPartId: string;
  userId?: string;
  sessionId?: string;
  selectedAnswer: 'YES' | 'NO';
  correctAnswer: 'YES' | 'NO';
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
  totalBodyParts: number;
  correctAnswers: number;
  finalScore: number;
  bodyPartsOrder: string[]; // Track the random order used
}