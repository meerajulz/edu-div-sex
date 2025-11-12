export const GAME_CONFIG_FEMALE = {
  id: 'juego_dos_actividad_3_female',

  // Button images
  buttonImages: {
    ok: '/image/actividad_3/juego2/ok.png',
    okHover: '/image/actividad_3/juego2/ok_hover.png',
    no: '/image/actividad_3/juego2/no.png',
    noHover: '/image/actividad_3/juego2/no_hover.png'
  },

  // Female content configuration
  title: {
    audio: '/audio/actividad-3/juego2/chicas/title.mp3',
    duration: 7000 // 7 seconds
  },

  situations: [
    {
      id: 'female_situation_1',
      title: 'Una persona tocándose el pecho por encima de la ropa',
      image: '/image/actividad_3/juego2/female/toca-pecho-female.png',
      audio: {
        description: '/audio/actividad-3/juego2/chicas/t-1.mp3',
        duration: 2000 // 2 seconds
      },
      correctAnswer: 'YES' as const,
      feedback: {
        text: '¡Eso es! Cuando te tocas el pecho puedes tener gustito',
        audio: '/audio/actividad-3/juego2/chicas/fb-1.mp3'
      }
    },
    {
      id: 'female_situation_2',
      title: 'Una persona tocándose la vulva en la cama',
      image: '/image/actividad_3/juego2/female/toca-vulva-female.png',
      audio: {
        description: '/audio/actividad-3/juego2/chicas/t-2.mp3',
        duration: 2000
      },
      correctAnswer: 'YES' as const,
      feedback: {
        text: 'Eso es. Cuando te tocas la vulva puedes tener gustito sexual.',
        audio: '/audio/actividad-3/juego2/chicas/fb-2.mp3'
      }
    },
    {
      id: 'female_situation_3',
      title: 'Una persona viendo un vídeo porno',
      image: '/image/actividad_3/juego2/female/ver-porno.png',
      audio: {
        description: '/audio/actividad-3/juego2/chicas/t-3.mp3',
        duration: 2000
      },
      correctAnswer: 'YES' as const,
      feedback: {
        text: 'Eso es. Cuando ves un vídeo porno puedes tener gustito sexual.',
        audio: '/audio/actividad-3/juego2/chicas/fb-3.mp3'
      }
    },
    {
      id: 'female_situation_4',
      title: 'Una persona comiendo',
      image: '/image/actividad_3/juego2/female/Comer.png',
      audio: {
        description: '/audio/actividad-3/juego2/chicas/t-4.mp3',
        duration: 2000
      },
      correctAnswer: 'NO' as const,
      feedback: {
        text: 'No, cuando estamos comiendo no tenemos gustito sexual, aunque nos guste mucho la comida.',
        audio: '/audio/actividad-3/juego2/chicas/fb-4.mp3'
      }
    },
    {
      id: 'female_situation_5',
      title: 'Una persona tocándose el brazo',
      image: '/image/actividad_3/juego2/female/toca-brazo.png',
      audio: {
        description: '/audio/actividad-3/juego2/chicas/t-5.mp3',
        duration: 2000
      },
      correctAnswer: 'NO' as const,
      feedback: {
        text: 'No, al tocarte el brazo no vas a tener gustito sexual.',
        audio: '/audio/actividad-3/juego2/chicas/fb-5.mp3'
      }
    }
  ],

  // Timing configuration
  timing: {
    titleDelay: 1000, // 1 second before title
    situationDelay: 1000, // 1 second between situations
    buttonDelay: 500, // 0.5 seconds after audio before showing buttons
    feedbackDuration: 4000 // 4 seconds for feedback
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
  situationsCorrect: boolean[];
  finalScore: number;
}
