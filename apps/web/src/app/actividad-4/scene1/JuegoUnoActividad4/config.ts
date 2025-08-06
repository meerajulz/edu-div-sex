export const HYGIENE_GAME_CONFIG = {
  id: 'juego_uno_actividad_4',
  
  // Feedback images (shared)
  feedbackImages: {
    correct: '/image/actividad_4/juego1/ok.png',
    correctHover: '/image/actividad_4/juego1/ok-hover.png',
    incorrect: '/image/actividad_4/juego1/no.png',
    incorrectHover: '/image/actividad_4/juego1/no-hover.png'
  },

  // Feedback sounds (shared)
  feedbackSounds: {
    correct: '/audio/YES.mp3',
    incorrect: '/audio/NO.mp3'
  },

  // Character-specific configurations
  characterConfig: {
    dani: {
      steps: [
        {
          id: 'step_1_clothes',
          title: 'Tirar la ropa sucia al cesto',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/juego1/ t-step1.mp3',
            duration: 2000
          },
          elements: {
            draggable: {
              image: '/image/actividad_4/juego1/tirar-ropa-sucia/ropa-sucia-dani.png',
              alt: 'Ropa sucia de Dani'
            },
            dropZones: [
              {
                id: 'basket',
                image: '/image/actividad_4/juego1/tirar-ropa-sucia/cesto-ropa-sucia.png',
                alt: 'Cesto de ropa sucia',
                position: 'left',
                isCorrect: true
              },
              {
                id: 'wc',
                image: '/image/actividad_4/juego1/tirar-ropa-sucia/wc.png',
                alt: 'WC',
                position: 'right',
                isCorrect: false
              }
            ]
          },
          feedback: {
            correct: {
              text: '¡Muy bien! La ropa no se puede quedar fuera del cesto.',
              audio: '/audio/actividad-4/juego1/fb-step1.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'La ropa debe estar en el cesto.',
              audio: '/audio/actividad-4/juego1/fb-i-step1.mp3',
              duration: 5000
            }
          }
        },
        {
          id: 'step_2_faucet',
          title: 'Abrir el grifo',
          type: 'click' as const,
          audio: {
            title: '/audio/actividad-4/juego1/t-step2.mp3',
            duration: 3000
          },
          elements: {
            clickables: [
              {
                id: 'shower',
                image: '/image/actividad_4/juego1/abrir-grifo/Ducha_.png',
                imageAfterClick: '/image/actividad_4/juego1/abrir-grifo/Ducha_2.png',
                alt: 'Ducha',
                position: 'left',
                isCorrect: true
              },
              {
                id: 'soap',
                image: '/image/actividad_4/juego1/abrir-grifo/Jabon_.png',
                alt: 'Jabón',
                position: 'right',
                isCorrect: false
              }
            ],
            arrow: {
              image: '/image/actividad_4/juego1/abrir-grifo/Flecha_.png',
              alt: 'Flecha apuntando a la ducha'
            }
          },
          feedback: {
            correct: {
              text: '¡Eso es! Hay que darse con agua antes de poner el jabón.',
              audio: '/audio/actividad-4/juego1/fb-step2.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'Vuelve a intentarlo. Es importante darse con agua antes de ponerse jabón.',
              audio: '/audio/actividad-4/juego1/fb-i-step2.mp3',
              duration: 5000
            }
          }
        },
        {
          id: 'step_2_faucet',
          title: 'Abrir el grifo',
          type: 'click' as const,
          audio: {
            title: '/audio/actividad-4/juego1/t-step2.mp3',
            duration: 3000
          },
          elements: {
            clickables: [
              {
                id: 'shower',
                image: '/image/actividad_4/juego1/abrir-grifo/Ducha_.png',
                imageAfterClick: '/image/actividad_4/juego1/abrir-grifo/Ducha_2.png',
                alt: 'Ducha',
                position: 'left',
                isCorrect: true
              },
              {
                id: 'soap',
                image: '/image/actividad_4/juego1/abrir-grifo/Jabon_.png',
                alt: 'Jabón',
                position: 'right',
                isCorrect: false
              }
            ],
            arrow: {
              image: '/image/actividad_4/juego1/abrir-grifo/Flecha_.png',
              alt: 'Flecha apuntando a la ducha'
            }
          },
          feedback: {
            correct: {
              text: '¡Eso es! Hay que darse con agua antes de poner el jabón.',
              audio: '/audio/actividad-4/juego1/fb-step2.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'Vuelve a intentarlo. Es importante darse con agua antes de ponerse jabón.',
              audio: '/audio/actividad-4/juego1/fb-i-step2.mp3',
              duration: 5000
            }
          }
        },
        {
          id: 'step_2_faucet',
          title: 'Abrir el grifo',
          type: 'click' as const,
          audio: {
            title: '/audio/actividad-4/juego1/t-step2.mp3',
            duration: 3000
          },
          elements: {
            clickables: [
              {
                id: 'shower',
                image: '/image/actividad_4/juego1/abrir-grifo/Ducha_.png',
                imageAfterClick: '/image/actividad_4/juego1/abrir-grifo/Ducha_2.png',
                alt: 'Ducha',
                position: 'left',
                isCorrect: true
              },
              {
                id: 'soap',
                image: '/image/actividad_4/juego1/abrir-grifo/Jabon_.png',
                alt: 'Jabón',
                position: 'right',
                isCorrect: false
              }
            ],
            arrow: {
              image: '/image/actividad_4/juego1/abrir-grifo/Flecha_.png',
              alt: 'Flecha apuntando a la ducha'
            }
          },
          feedback: {
            correct: {
              text: '¡Eso es! Hay que darse con agua antes de poner el jabón.',
              audio: '/audio/actividad-4/juego1/fb-step2.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'Vuelve a intentarlo. Es importante darse con agua antes de ponerse jabón.',
              audio: '/audio/actividad-4/juego1/fb-i-step2.mp3',
              duration: 5000
            }
          }
        }
        // More steps will be added here
      ]
    },
    cris: {
      steps: [
        {
          id: 'step_1_clothes',
          title: 'Tirar la ropa sucia al cesto',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/juego1/ t-step1.mp3',
            duration: 2000
          },
          elements: {
            draggable: {
              image: '/image/actividad_4/juego1/tirar-ropa-sucia/ropa-sucia-cris.png',
              alt: 'Ropa sucia de Cris'
            },
            dropZones: [
              {
                id: 'basket',
                image: '/image/actividad_4/juego1/tirar-ropa-sucia/cesto-ropa-sucia.png',
                alt: 'Cesto de ropa sucia',
                position: 'left',
                isCorrect: true
              },
              {
                id: 'wc',
                image: '/image/actividad_4/juego1/tirar-ropa-sucia/wc.png',
                alt: 'WC',
                position: 'right',
                isCorrect: false
              }
            ]
          },
          feedback: {
            correct: {
              text: '¡Muy bien! La ropa no se puede quedar fuera del cesto.',
              audio: '/audio/actividad-4/juego1/fb-step1.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'La ropa debe estar en el cesto.',
              audio: '/audio/actividad-4/juego1/fb-i-step1.mp3',
              duration: 5000
            }
          }
        }
        // More steps will be added here
      ]
    }
  },

  // Timing configuration
  timing: {
    titleDelay: 1000, // 1 second before title
    stepDelay: 1000, // 1 second between steps
    feedbackDuration: 3000, // 3 seconds for feedback
    nextStepDelay: 500 // 0.5 seconds after feedback before next step
  }
} as const;

// Helper function to get current game config based on character
export const getCharacterGameConfig = (character: 'dani' | 'cris') => {
  return HYGIENE_GAME_CONFIG.characterConfig[character];
};

// Types for game tracking
export interface StepAttempt {
  gameId: string;
  stepId: string;
  userId?: string;
  sessionId?: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  character: 'dani' | 'cris';
  timestamp: Date;
  timeToComplete?: number;
}

export interface HygieneGameSession {
  gameId: string;
  userId?: string;
  sessionId: string;
  character: 'dani' | 'cris';
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  totalSteps: number;
  completedSteps: number;
  stepsCorrect: boolean[];
  currentStep: number;
}