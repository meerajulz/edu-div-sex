export const GAME_CONFIG = {
  id: 'juego_tres_actividad_3',
  
  // Gender-specific configurations
  genderConfig: {
    male: {
      title: {
        audio: '/audio/actividad-3/juego3/males/title.mp3',
        duration: 7000 // 7 seconds
      },
      situations: [
        {
          id: 'male_situation_1',
          title: 'Situación 1',
          description: {
            audio: '/audio/actividad-3/juego3/males/s-1.mp3',
            image: '/image/actividad_3/juego3/male/s1.png'
          },
          options: [
            {
              id: 'option_a',
              audio: '/audio/actividad-3/juego3/males/r-c-1.mp3',
              image: '/image/actividad_3/juego3/male/S1-1-1c.png',
              isCorrect: true,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-1.mp3'
              }
            },
            {
              id: 'option_b',
              audio: '/audio/actividad-3/juego3/males/r-w-1.mp3',
              image: '/image/actividad_3/juego3/male/S1-1-1w.png',
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-w-1.mp3'
              }
            }
          ]
        },
        {
          id: 'male_situation_2',
          title: 'Situación 2',
          description: {
            audio: '/audio/actividad-3/juego3/males/s-2.mp3',
            image: '/image/actividad_3/juego3/male/s2.png'
          },
          options: [
            {
              id: 'option_a',
              audio: '/audio/actividad-3/juego3/males/r-c-2.mp3',
              image: '/image/actividad_3/juego3/male/S2-1-1c.png',
              isCorrect: true,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-c-2.mp3'
              }
            },
            {
              id: 'option_b',
              audio: '/audio/actividad-3/juego3/males/r-w-2.mp3',
              image: '/image/actividad_3/juego3/male/S2-1-1w.png', // Fixed: was referencing correct image
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-w-2.mp3'
              }
            }
          ]
        },
        {
          id: 'male_situation_3',
          title: 'Situación 3',
          description: {
            audio: '/audio/actividad-3/juego3/males/s-3.mp3',
            image: '/image/actividad_3/juego3/male/s3.png'
          },
          options: [
            {
              id: 'option_a',
              audio: '/audio/actividad-3/juego3/males/r-c-3.mp3',
              image: '/image/actividad_3/juego3/male/correct.gif',
              isCorrect: true,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-c-3.mp3'
              }
            },
            {
              id: 'option_b',
              audio: '/audio/actividad-3/juego3/males/r-w-3.mp3',
              image: '/image/actividad_3/juego3/male/slow.gif',
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-w--3.mp3' // Fixed typo
              }
            },
            {
              id: 'option_c',
              audio: '/audio/actividad-3/juego3/males/r-w-3-1.mp3',
              image: '/image/actividad_3/juego3/male/wrong.gif',
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-w-3-c.mp3'
              }
            }
          ]
        },
        {
          id: 'male_situation_4',
          title: 'Situación 4',
          description: {
            audio: '/audio/actividad-3/juego3/males/s-4.mp3',
            image: '/image/actividad_3/juego3/male/s4.png'
          },
          options: [
            {
              id: 'option_a',
              audio: '/audio/actividad-3/juego3/males/r-c-4.mp3',
              image: '/image/actividad_3/juego3/male/S4-1-1c.png',
              isCorrect: true,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-4.mp3'
              }
            },
            {
              id: 'option_b',
              audio: '/audio/actividad-3/juego3/males/r-w-4.mp3',
              image: '/image/actividad_3/juego3/male/S4-1-1w.png',
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/males/fb-w-4.mp3'
              }
            }
          ]
        }
      ]
    },
    female: {
      title: {
        audio: '/audio/actividad-3/juego3/female/title.mp3', 
        duration: 7000 // 7 seconds
      },
      situations: [
        {
          id: 'female_situation_1',
          title: 'Situación 1',
          description: {
            audio: '/audio/actividad-3/juego3/female/s-1.mp3',
            image: '/image/actividad_3/juego3/female/s1.png'
          },
          options: [
            {
              id: 'option_a',
              audio: '/audio/actividad-3/juego3/female/r-c-1.mp3',
              image: '/image/actividad_3/juego3/female/S1-1-1c.png',
              isCorrect: true,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-c-1.mp3'
              }
            },
            {
              id: 'option_b',
              audio: '/audio/actividad-3/juego3/female/r-w-1.mp3',
              image: '/image/actividad_3/juego3/female/S1-1-1w.png',
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-w-1.mp3'
              }
            }
          ]
        },
        {
          id: 'female_situation_2',
          title: 'Situación 2',
          description: {
            audio: '/audio/actividad-3/juego3/female/s-2.mp3',
            image: '/image/actividad_3/juego3/female/s2.png'
          },
          options: [
            {
              id: 'option_a',
              audio: '/audio/actividad-3/juego3/female/r-c-2.mp3',
              image: '/image/actividad_3/juego3/female/S2-1-1c.png',
              isCorrect: true,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-c-2.mp3'
              }
            },
            {
              id: 'option_b',
              audio: '/audio/actividad-3/juego3/female/r-w-2.mp3',
              image: '/image/actividad_3/juego3/female/S2-1-1w.png', // Fixed: was pointing to correct image
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-w-2.mp3'
              }
            }
          ]
        },
        {
          id: 'female_situation_3',
          title: 'Situación 3',
          description: {
            audio: '/audio/actividad-3/juego3/female/s-3.mp3',
            image: '/image/actividad_3/juego3/female/s3.png'
          },
          options: [
            {
              id: 'option_a',
              audio: '/audio/actividad-3/juego3/female/r-c-3.mp3',
              image: '/image/actividad_3/juego3/female/correct.gif',
              isCorrect: true,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-c-3.mp3'
              }
            },
            {
              id: 'option_b',
              audio: '/audio/actividad-3/juego3/female/r-w-3.mp3',
              image: '/image/actividad_3/juego3/female/wrong.gif', // Fixed: was pointing to male folder
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-w-3.mp3' // Fixed typo
              }
            },
            {
              id: 'option_c',
              audio: '/audio/actividad-3/juego3/female/r-w-3-1.mp3',
              image: '/image/actividad_3/juego3/female/faster.gif', //
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-w-3-3.mp3'
              }
            }
          ]
        },
        {
          id: 'female_situation_4',
          title: 'Situación 4',
          description: {
            audio: '/audio/actividad-3/juego3/female/s-4.mp3',
            image: '/image/actividad_3/juego3/female/s4.png' // Fixed: was pointing to male folder
          },
          options: [
            {
              id: 'option_a',
              audio: '/audio/actividad-3/juego3/female/r-c-4.mp3',
              image: '/image/actividad_3/juego3/female/S4-1-1c.png',
              isCorrect: true,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-4.mp3'
              }
            },
            {
              id: 'option_b',
              audio: '/audio/actividad-3/juego3/female/r-w-4.mp3',
              image: '/image/actividad_3/juego3/female/S4-1-1w.png',
              isCorrect: false,
              feedback: {
                audio: '/audio/actividad-3/juego3/female/fb-w-4.mp3'
              }
            }
          ]
        }
      ]
    }
  },

  // Feedback images (shared)
  feedbackImages: {
    correct: '/image/actividad_3/juego3/ok.png',
    incorrect: '/image/actividad_3/juego3/no.png'
  },

  // Timing configuration
  timing: {
    titleDelay: 1000, // 1 second before title
    situationDelay: 1000, // 1 second between situations
    optionDelay: 500, // 0.5 seconds between options
    feedbackDuration: 4000, // 4 seconds for feedback
    nextSituationDelay: 1500 // 1.5 seconds before next situation
  }
} as const;

// Mock gender detection (easy to replace with real backend data)
export const getMockUserGender = (): 'male' | 'female' => {
  // TODO: Replace with real user data from backend
  // For now, you can change this to test both versions
  return 'female'; // Change to 'female' to test female version
};

// Helper function to get current game config based on gender
export const getCurrentGameConfig = (gender: 'male' | 'female') => {
  return GAME_CONFIG.genderConfig[gender];
};

// Database tracking types
export interface SituationAttempt {
  gameId: string;
  situationId: string;
  optionId: string;
  userId?: string;
  sessionId?: string;
  selectedOption: string;
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