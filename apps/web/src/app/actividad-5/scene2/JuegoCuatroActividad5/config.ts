

export const JUEGO_CUATRO_CONFIG = {
  id: 'juego_cuatro_actividad_5',
  title: '¿Qué hace Noa?',
  
  // Audio files
  audio: {
    title: '/audio/actividad-5/juego4/t.mp3',
    completion: '/audio/muy_bien_bright.mp3',
    correct: '/audio/YES.mp3',
    incorrect: '/audio/NO.mp3'
  },
  
  // Visual assets
  images: {
    background: '/image/actividad_5/juego4/fondo.png',
    introScene: '/image/actividad_5/juego4/scene-1/cris-noa-1.png',
    feedback: {
      correct: '/image/actividad_5/juego4/yes.png',
      incorrect: '/image/actividad_5/juego4/no.png',
      stars: '/image/actividad_5/juego4/stars.png'
    }
  },
  
  // Game options
  options: [
    {
      id: 1,
      image: '/image/actividad_5/juego4/scene-1/sit-1.png',
      clickSound: '/audio/actividad-5/juego4/s1.mp3',
      feedbackAudio: '/audio/actividad-5/juego4/fb-st-1.mp3',
      feedbackImage: '/image/actividad_5/juego4/scene-1/feedback/cris-marcha-wrong.png',
      size: { width: 350, height: 500 }, // Left image - wider and taller
      isCorrect: false,
      feedback: {
        text: 'Si le das la espalda a una persona, esa persona entenderá que no quieres hablar con ella',
        audio: '/audio/actividad-5/juego4/fb-st-1.mp3'
      }
    },
    {
      id: 2,
      image: '/image/actividad_5/juego4/scene-1/sit-2.png',
      clickSound: '/audio/actividad-5/juego4/s2.mp3',
      feedbackAudio: '/audio/actividad-5/juego4/fb-st-2.mp3',
      feedbackImage: '/image/actividad_5/juego4/scene-1/feedback/cris-espalda.png',
      size: { width: 210, height: 450 }, // Middle image - taller
      isCorrect: false,
      feedback: {
        text: 'Si te acercas mucho a una persona se puede sentir incómoda',
        audio: '/audio/actividad-5/juego4/fb-st-2.mp3'
      }
    },
    {
      id: 3,
      image: '/image/actividad_5/juego4/scene-1/sit-3.png',
      clickSound: '/audio/actividad-5/juego4/s3.mp3',
      feedbackAudio: '/audio/actividad-5/juego4/fb-st-3.mp3',
      feedbackImage: '/image/actividad_5/juego4/scene-1/feedback/noa-cris-ok.png',
      size: { width: 350, height: 450 }, // Right image - wider and taller
      isCorrect: true,
      feedback: {
        text: 'Cuando hablamos con otras personas es importante mantener la distancia adecuada y poner el cuerpo en su dirección',
        audio: '/audio/actividad-5/juego4/fb-st-3.mp3'
      }
    }
  ],

  // Modal configuration
  modal: {
    width: 900,
    height: 650,
    maxWidth: '90vw',
    maxHeight: '90vh'
  },
  
  // Timing configuration
  timing: {
    titleDelay: 1000,
    feedbackDelay: 1000,
    completionDelay: 2000,
    exitDelay: 500
  }
};

// Type definitions
export interface GameOption {
  id: number;
  image: string;
  clickSound: string;
  feedbackAudio: string;
  feedbackImage: string;
  size: { width: number; height: number };
  isCorrect: boolean;
  feedback: {
    text: string;
    audio: string;
  };
}

export type GamePhase = 'intro' | 'selection' | 'feedback' | 'completed';

// Helper function to get option by ID
export const getOptionById = (id: number): GameOption | undefined => {
  return JUEGO_CUATRO_CONFIG.options.find(option => option.id === id);
};

// Helper function to get correct option
export const getCorrectOption = (): GameOption => {
  return JUEGO_CUATRO_CONFIG.options.find(option => option.isCorrect)!;
};
