export const GAME_CONFIG = {
  id: 'juego_dos_actividad_4',
  title: 'Higiene Menstrual',
  
  // Title audio configuration
  titleAudio: {
    path: '/audio/actividad-4/juego2/title.mp3',
    duration: 20000, // 20 seconds estimate
    delayAfter: 2000 // 2 seconds delay after title
  },

  // Feedback audio
  feedbackAudio: {
    correct: '/audio/actividad-4/juego2/fb.mp3',
    incorrect: '/audio/actividad-4/juego2/fb-i.mp3'
  },

  // Sound effects
  sounds: {
    correct: '/audio/YES.mp3',
    incorrect: '/audio/NO.mp3'
  },

  // Feedback icons
  feedbackIcons: {
    correct: '/image/actividad_4/juego2/ok.png',
    incorrect: '/image/actividad_4/juego2/no.png'
  },

  // Images data - correct order
  images: [
    {
      id: '1',
      order: 1,
      path: '/image/actividad_4/juego2/1.png',
      audio: '/audio/actividad-4/juego2/1.mp3',
      alt: 'Noa va al baño'
    },
    {
      id: '2',
      order: 2,
      path: '/image/actividad_4/juego2/2.png',
      audio: '/audio/actividad-4/juego2/2.mp3',
      alt: 'Se quita la compresa sucia/manchada'
    },
    {
      id: '3',
      order: 3,
      path: '/image/actividad_4/juego2/3.png',
      audio: '/audio/actividad-4/juego2/3.mp3',
      alt: 'Dobla la compresa'
    },
    {
      id: '4',
      order: 4,
      path: '/image/actividad_4/juego2/4.png',
      audio: '/audio/actividad-4/juego2/4.mp3',
      alt: 'Tira la compresa a la basura'
    },
    {
      id: '5',
      order: 5,
      path: '/image/actividad_4/juego2/5.png',
      audio: '/audio/actividad-4/juego2/5.mp3',
      alt: 'Coge una compresa nueva'
    },
    {
      id: '6',
      order: 6,
      path: '/image/actividad_4/juego2/6.png',
      audio: '/audio/actividad-4/juego2/6.mp3',
      alt: 'Abre la compresa nueva y la pega en las bragas'
    },
    {
      id: '7',
      order: 7,
      path: '/image/actividad_4/juego2/7.png',
      audio: '/audio/actividad-4/juego2/7.mp3',
      alt: 'Se lava las manos'
    }
  ],

  // Drop zone configuration
  dropZones: {
    total: 7,
    layout: [
      { row: 1, positions: [0, 1] }, // First row: 2 images
      { row: 2, positions: [2, 3, 4] }, // Middle row: 3 images  
      { row: 3, positions: [5, 6] } // Last row: 2 images
    ]
  },

  // Timing configuration
  timing: {
    titleDelay: 2000, // 2 seconds after title finishes
    feedbackDuration: 2000, // 2 seconds for feedback
    completionDelay: 1000 // 1 second before showing completion
  }
} as const;

// Database tracking types
export interface DropAttempt {
  gameId: string;
  imageId: string;
  position: number;
  isCorrect: boolean;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

export interface GameSession {
  gameId: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  totalImages: number;
  correctPlacements: number;
  finalSequence: (string | null)[];
  finalScore: number;
}