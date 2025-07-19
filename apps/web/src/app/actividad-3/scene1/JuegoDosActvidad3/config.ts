export const GAME_CONFIG = {
  id: 'juego_dos_actividad_3',
  
  // Button images (shared)
  buttonImages: {
    ok: '/image/actividad_3/juego2/ok.png',
    okHover: '/image/actividad_3/juego2/ok_hover.png',
    no: '/image/actividad_3/juego2/no.png',
    noHover: '/image/actividad_3/juego2/no_hover.png'
  },

  // Gender-specific configurations
  genderConfig: {
    male: {
      title: {
        audio: '/audio/actividad-3/juego2/chicos/title.mp3',
        duration: 7000 // 7 seconds
      },
      situations: [
        {
          id: 'male_situation_1',
          title: 'Una persona tocándose el pene',
          image: '/image/actividad_3/juego2/male/toca-pene.png',
          audio: {
            description: '/audio/actividad-3/juego2/chicos/t-1.mp3',
            duration: 2000 // 2 seconds
          },
          correctAnswer: 'YES' as const,
          feedback: {
            text: '¡Eso es! El semen puede salir en momentos como este',
            audio: '/audio/actividad-3/juego2/chicos/fb-1.mp3'
          }
        },
        {
          id: 'male_situation_2',
          title: 'Una persona tocándose la vulva',
          image: '/image/actividad_3/juego2/male/toca-vulva.png',
          audio: {
            description: '/audio/actividad-3/juego2/chicos/t-2.mp3',
            duration: 2000
          },
          correctAnswer: 'NO' as const,
          feedback: {
            text: 'No, por la vulva no sale semen.',
            audio: '/audio/actividad-3/juego2/chicos/fb-2.mp3'
          }
        },
        {
          id: 'male_situation_3',
          title: 'Una persona viendo un vídeo porno',
          image: '/image/actividad_3/juego2/male/ver-porno.png',
          audio: {
            description: '/audio/actividad-3/juego2/chicos/t-3.mp3',
            duration: 2000
          },
          correctAnswer: 'YES' as const,
          feedback: {
            text: '¡Eso es! El semen puede salir en momentos como este',
            audio: '/audio/actividad-3/juego2/chicos/fb-3.mp3'
          }
        },
        {
          id: 'male_situation_4',
          title: 'Una persona comiendo',
          image: '/image/actividad_3/juego2/male/Comer.png',
          audio: {
            description: '/audio/actividad-3/juego2/chicos/t-4.mp3',
            duration: 2000
          },
          correctAnswer: 'NO' as const,
          feedback: {
            text: 'No, cuando estamos comiendo no sale semen por el pene, aunque nos guste mucho la comida.',
            audio: '/audio/actividad-3/juego2/chicos/fb-4.mp3'
          }
        },
        {
          id: 'male_situation_5',
          title: 'Una persona tocándose el brazo',
          image: '/image/actividad_3/juego2/male/toca-brazo.png',
          audio: {
            description: '/audio/actividad-3/juego2/chicos/t-5.mp3',
            duration: 2000
          },
          correctAnswer: 'NO' as const,
          feedback: {
            text: 'No, al tocarte el brazo no va a salirte semen.',
            audio: '/audio/actividad-3/juego2/chicos/fb-5.mp3'
          }
        }
      ]
    },
    female: {
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
      ]
    }
  },

  // Timing configuration
  timing: {
    titleDelay: 1000, // 1 second before title
    situationDelay: 1000, // 1 second between situations
    buttonDelay: 500, // 0.5 seconds after audio before showing buttons
    feedbackDuration: 4000 // 4 seconds for feedback
  }
} as const;

// Mock gender detection (easy to replace with real backend data)
export const getMockUserGender = (): 'male' | 'female' => {
  // TODO: Replace with real user data from backend
  // For now, you can change this to test both versions
  return 'male'; // Change to 'female' to test female version
};

// Helper function to get current game config based on gender
export const getCurrentGameConfig = (gender: 'male' | 'female') => {
  return GAME_CONFIG.genderConfig[gender];
};

// Database tracking types
export interface SituationAttempt {
  gameId: string;
  situationId: string;
  userId?: string;
  sessionId?: string;
  selectedAnswer: 'YES' | 'NO';
  correctAnswer: 'YES' | 'NO';
  isCorrect: boolean;
  userGender: 'male' | 'female';
  timestamp: Date;
  timeToAnswer?: number;
}

export interface GameSession {
  gameId: string;
  userId?: string;
  sessionId: string;
  userGender: 'male' | 'female';
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  totalSituations: number;
  correctAnswers: number;
  situationsCorrect: boolean[];
  finalScore: number;
}