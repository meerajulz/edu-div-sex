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
            title: '/audio/actividad-4/juego1/t-step1.mp3',
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
          id: 'step_3_soap',
          title: 'Enjabonarse',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/juego1/ejabonarse/t-step3.mp3',
            duration: 3000
          },
          elements: {
            draggable: {
              image: '/image/actividad_4/juego1/enjabonarse/jabon.png',
              alt: 'Jabón'
            },
            dropZones: [
              {
                id: 'correct_area',
                image: '/image/actividad_4/juego1/enjabonarse/pene-2-glande.png',
                alt: 'Pene - glande (correcto)',
                position: 'left',
                isCorrect: true
              },
              {
                id: 'incorrect_area',
                image: '/image/actividad_4/juego1/enjabonarse/pene-1.png',
                alt: 'Pene (incorrecto)',
                position: 'right',
                isCorrect: false
              }
            ]
          },
          feedback: {
            correct: {
              text: '¡Muy bien! Es importante lavarse por dentro el pene.',
              audio: '/audio/actividad-4/juego1/ejabonarse/dani/fb-step-3.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'Inténtalo de nuevo. Es importante lavar correctamente.',
              audio: '/audio/actividad-4/juego1/ejabonarse/dani/fb-i-step-3.mp3',
              duration: 5000
            }
          }
        },
        {
          id: 'step_4_rinse',
          title: 'Enjuagarse',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/juego1/enjugarse/t-step4.mp3',
            duration: 3000
          },
          elements: {
            draggable: {
              image: '/image/actividad_4/juego1/enjugarse/ducha_1.png',
              imageOnDrag: '/image/actividad_4/juego1/enjugarse/ducha_2.png',
              alt: 'Ducha'
            },
            dropZones: [
              {
                id: 'correct_area',
                image: '/image/actividad_4/juego1/enjugarse/pene-ok.png',
                alt: 'Pene (correcto)',
                position: 'left',
                isCorrect: true
              },
              {
                id: 'incorrect_area',
                image: '/image/actividad_4/juego1/enjugarse/pene-jabon.png',
                alt: 'Pene con jabón (incorrecto)',
                position: 'right',
                isCorrect: false
              }
            ]
          },
          feedback: {
            correct: {
              text: '¡Genial! Es importante retirar bien el jabón para que no pique y no tengamos enfermedades.',
              audio: '/audio/actividad-4/juego1/enjugarse/fb-step4.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'Inténtalo de nuevo, recuerda que debes subir la piel del pene cuando acabas de lavarlo.',
              audio: '/audio/actividad-4/juego1/enjugarse/dani/fb-i-step4.mp3',
              duration: 5000
            }
          }
        },
        {
          id: 'step_5_dry',
          title: 'Secarse',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/juego1/t-step5.mp3',
            duration: 3000
          },
          elements: {
            draggable: {
              images: [
                {
                  id: 'cris_towel',
                  image: '/image/actividad_4/juego1/secar/toalla-cris.png',
                  alt: 'Toalla de Cris'
                },
                {
                  id: 'dani_towel',
                  image: '/image/actividad_4/juego1/secar/toalla-dani.png',
                  alt: 'Toalla de Dani'
                }
              ]
            },
            correctId: 'dani_towel',
            characterImage: '/image/actividad_4/juego1/secar/dani-secar.png'
          },
          feedback: {
            correct: {
              text: '¡Muy bien! Hay que secarse bien al final.',
              audio: '/audio/actividad-4/juego1/fb-step5.mp3',
              duration: 4000
            },
            incorrect: {
              text: 'Esa no es tu toalla. Inténtalo de nuevo.',
              audio: '/audio/actividad-4/juego1/fb-i-step5.mp3',
              duration: 4000
            }
          }
        },
        {
          id: 'step_6_dress',
          title: 'Ponerse ropa limpia',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/t-step6.mp3',
            duration: 3000
          },
          elements: {
            characterImage: '/image/actividad_4/juego1/poner-ropa-limpia/dani/body-dani.png', // or dani
            dressedImage: '/image/actividad_4/juego1/poner-ropa-limpia/dani/ropa-ok.png', // or dani
            correctId: 'clothes-ok',
            draggable: {
              left: [
                {
                  id: 'clothes-ok',
                  image: '/image/actividad_4/juego1/poner-ropa-limpia/dani/ropa-ok.png',
                  alt: 'Ropa limpia correcta'
                }
              ],
              right: [
                {
                  id: 'clothes-no',
                  image: '/image/actividad_4/juego1/poner-ropa-limpia/dani/ropa-no.png',
                  alt: 'Ropa sucia incorrecta'
                }
              ]
            }
          },
          feedback: {
            correct: {
              text: '¡Muy bien! Has elegido la ropa limpia.',
              audio: '/audio/actividad-4/fb-step6.mp3',
              duration: 4000
            },
            incorrect: {
              text: 'Esa ropa no está limpia. Inténtalo de nuevo.',
              audio: '/audio/actividad-4/fb-i-step6.mp3',
              duration: 4000
            }
          }
        }


        
      ]
    },
    cris: {
      steps: [
        {
          id: 'step_1_clothes',
          title: 'Tirar la ropa sucia al cesto',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/juego1/t-step1.mp3',
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
          id: 'step_3_soap',
          title: 'Enjabonarse',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/juego1/ejabonarse/t-step3.mp3',
            duration: 3000
          },
          elements: {
            draggable: {
              image: '/image/actividad_4/juego1/enjabonarse/jabon.png',
              alt: 'Jabón'
            },
            dropZones: [
              {
                id: 'correct_area',
                image: '/image/actividad_4/juego1/enjabonarse/vulva.png',
                alt: 'Vulva (correcto)',
                position: 'left',
                isCorrect: true
              },
              {
                id: 'incorrect_area',
                image: '/image/actividad_4/juego1/enjabonarse/vulva-dentro.png',
                alt: 'Vulva dentro (incorrecto)',
                position: 'right',
                isCorrect: false
              }
            ]
          },
          feedback: {
            correct: {
              text: '¡Muy bien! Debemos lavar muy bien las zonas íntimas, pero sin meter jabón en la vagina.',
              audio: '/audio/actividad-4/juego1/ejabonarse/fb-step3.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'La vulva es importante que la limpiemos bien con jabón.',
              audio: '/audio/actividad-4/juego1/ejabonarse/fb-i-step3.mp3',
              duration: 5000
            }
          }
        },
        {
          id: 'step_4_rinse',
          title: 'Enjuagarse',
          type: 'drag_drop_multiple' as const,
          audio: {
            title: '/audio/actividad-4/juego1/enjugarse/t-step4.mp3',
            duration: 3000
          },
          elements: {
            draggable: {
              image: '/image/actividad_4/juego1/enjugarse/ducha_1.png',
              imageOnDrag: '/image/actividad_4/juego1/enjugarse/ducha_2.png',
              alt: 'Ducha'
            },
            dropZones: [
              {
                id: 'vulva_area',
                image: '/image/actividad_4/juego1/enjugarse/vulva.png',
                alt: 'Vulva',
                position: 'right',
                isCorrect: true,
                requiredDrops: 3
              }
            ]
          },
          feedback: {
            partial: {
              text: 'Continúa enjuagando...',
              audio: '/audio/actividad-4/juego1/enjugarse/cris/fb-i-step4.mp3',
              duration: 3000
            },
            correct: {
              text: '¡Genial! Es importante retirar bien el jabón para que no pique y no tengamos enfermedades.',
              audio: '/audio/actividad-4/juego1/enjugarse/fb-step4.mp3',
              duration: 3000
            },
            incorrect: {
              text: 'Intenta de nuevo. Recuerda que debes retirar el jabón con mucha agua.',
              audio: '/audio/actividad-4/juego1/enjugarse/cris/fb-i-step4.mp3',
              duration: 5000
            }
          }
        },
        {
          id: 'step_5_dry',
          title: 'Secarse',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/juego1/t-step5.mp3',
            duration: 3000
          },
          elements: {
            draggable: {
              images: [
                {
                  id: 'cris_towel',
                  image: '/image/actividad_4/juego1/secar/toalla-cris.png',
                  alt: 'Toalla de Cris'
                },
                {
                  id: 'dani_towel',
                  image: '/image/actividad_4/juego1/secar/toalla-dani.png',
                  alt: 'Toalla de Dani'
                }
              ]
            },
            correctId: 'dani_towel',
            characterImage: '/image/actividad_4/juego1/secar/dani-secar.png'
          },
          feedback: {
            correct: {
              text: '¡Muy bien! Hay que secarse bien al final.',
              audio: '/audio/actividad-4/juego1/fb-step5.mp3',
              duration: 4000
            },
            incorrect: {
              text: 'Esa no es tu toalla. Inténtalo de nuevo.',
              audio: '/audio/actividad-4/juego1/fb-i-step5.mp3',
              duration: 4000
            }
          }
        },
        {
          id: 'step_6_dress',
          title: 'Ponerse ropa limpia',
          type: 'drag_drop' as const,
          audio: {
            title: '/audio/actividad-4/t-step6.mp3',
            duration: 3000
          },
          elements: {
            characterImage: '/image/actividad_4/juego1/poner-ropa-limpia/cris/body-cris.png', // or dani
            dressedImage: '/image/actividad_4/juego1/poner-ropa-limpia/cris/cris-vestido.png', // or dani
            correctId: 'clothes-ok',
            draggable: {
              left: [
                {
                  id: 'clothes-ok',
                  image: '/image/actividad_4/juego1/poner-ropa-limpia/cris/ropa-ok.png',
                  alt: 'Ropa limpia correcta'
                }
              ],
              right: [
                {
                  id: 'clothes-no',
                  image: '/image/actividad_4/juego1/poner-ropa-limpia/cris/ropa-no.png',
                  alt: 'Ropa sucia incorrecta'
                }
              ]
            }
          },
          feedback: {
            correct: {
              text: '¡Muy bien! Has elegido la ropa limpia.',
              audio: '/audio/actividad-4/fb-step6.mp3',
              duration: 4000
            },
            incorrect: {
              text: 'Esa ropa no está limpia. Inténtalo de nuevo.',
              audio: '/audio/actividad-4/fb-i-step6.mp3',
              duration: 4000
            }
          }
        }
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