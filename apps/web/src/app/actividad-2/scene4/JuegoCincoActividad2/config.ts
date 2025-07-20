export const GAME_CONFIG = {
  id: 'juego_cinco_actividad_2',
  title: 'Tu cofre de la Intimidad',
  
  // Global audio files
  globalAudio: {
    title: '/audio/actividad-2/juego5/title.mp3', // 22 seconds
    cofreOpen: '/audio/actividad-2/juego5/super-bright.mp3',
    dragDrop: '/audio/actividad-2/juego5/Drag_Drop.mp3',
    correctSound: '/audio/actividad-2/juego5/Game_Score.mp3',
    incorrectSound: '/audio/actividad-2/juego5/Game_No_Score.mp3',
    congratulations: '/audio/actividad-2/juego5/muybien.mp3'
  },

  // Global images
  globalImages: {
    cofreClosed: '/image/actividad_2/juego_5/cofre.png',
    cofreOpen: '/image/actividad_2/juego_5/cofre-open.png',
    checkYes: '/image/actividad_2/juego_5/check_ok.png',
    checkNo: '/image/actividad_2/juego_5/check_NO.png',
    decorationStar: '/image/actividad_2/juego_5/star_right.png',
    decorationStarLeft: '/image/actividad_2/juego_5/star_left.png'
  },

  // Background gradients
  backgrounds: {
    normal: 'bg-gradient-to-b from-[#daed6c] via-[#eff4a7] to-[#fefad1]',
    error: 'bg-gradient-to-b from-[#ff4d24] via-[#ff9462] to-[#ffefb2]'
  },

  // Game items - easily expandable
  items: [
    {
      id: 'item_1',
      name: 'carta_amor',
      image: '/image/actividad_2/juego_5/carta_amor.png',
      isPrivate: true,
      audio: {
        click: '/audio/actividad-2/juego5/1-title.mp3',
        feedback: '/audio/actividad-2/juego5/1-fb.mp3'
      },
      feedbackText: {
        correct: '¡Muy bien! Una carta de amor es algo personal. Puedes decidir quién la lee.',
        incorrect: 'Recuerda, tu carta de amor es privada. Solo tú decides quién la lee.'
      },
      position: { top: '20%', left: '15%' }
    },
    {
      id: 'item_2',
      name: 'cepillo',
      image: '/image/actividad_2/juego_5/cepillo.png',
      isPrivate: true,
      audio: {
        click: '/audio/actividad-2/juego5/2-title.mp3',
        feedback: '/audio/actividad-2/juego5/2-fb.mp3'
      },
      feedbackText: {
        correct: '¡Muy bien! Un cepillo de dientes es algo personal. Otras personas pueden verlo en el baño, pero no deberían usarlo.',
        incorrect: 'Recuerda, un cepillo de dientes es privado. Otras personas pueden verlo en el baño, pero no deberían usarlo.'
      },
      position: { top: '15%', right: '20%' }
    },
    {
      id: 'item_3',
      name: 'camiseta',
      image: '/image/actividad_2/juego_5/camiseta.png',
      isPrivate: false,
      audio: {
        click: '/audio/actividad-2/juego5/3-title.mp3',
        feedback: '/audio/actividad-2/juego5/3-fb.mp3'
      },
      feedbackText: {
        correct: '',
        incorrect: 'Recuerda, tu camiseta no es privada. Otras personas pueden verla.'
      },
      position: { bottom: '25%', left: '10%' }
    },
    {
      id: 'item_4',
      name: 'bragas',
      image: '/image/actividad_2/juego_5/bragas.png',
      isPrivate: true,
      audio: {
        click: '/audio/actividad-2/juego5/4-title.mp3',
        feedback: '/audio/actividad-2/juego5/4-fb.mp3'
      },
      feedbackText: {
        correct: '¡Muy bien! Unas bragas/calzoncillos son algo privados. Otras personas no deben usarlos. Tampoco verlos sin tu permiso. Son solo para ti.',
        incorrect: 'Recuerda, tus bragas/calzoncillos son privados. Solo tú decides a quien enseñárselos.'
      },
      position: { top: '60%', right: '15%' }
    },
    {
      id: 'item_5',
      name: 'underwear',
      image: '/image/actividad_2/juego_5/underwear.png',
      isPrivate: true,
      audio: {
        click: '/audio/actividad-2/juego5/5-title.mp3',
        feedback: '/audio/actividad-2/juego5/5-fb.mp3'
      },
      feedbackText: {
        correct: '¡Muy bien! Unas bragas/calzoncillos son algo privados. Otras personas no deben usarlos. Tampoco verlos sin tu permiso. Son solo para ti.',
        incorrect: 'Recuerda, tus bragas/calzoncillos son privados. Solo tú decides a quien enseñárselos.'
      },
      position: { top: '70%', left: '25%' }
    },
    {
      id: 'item_6',
      name: 'shoes',
      image: '/image/actividad_2/juego_5/shoes.png',
      isPrivate: false,
      audio: {
        click: '/audio/actividad-2/juego5/6-title.mp3',
        feedback: '/audio/actividad-2/juego5/6-fb.mp3'
      },
      feedbackText: {
        correct: '',
        incorrect: 'Recuerda, tus zapatos no son privados. Otras personas pueden verlos.'
      },
      position: { bottom: '15%', right: '25%' }
    }
  ],

  // Timing configuration
  timing: {
    titleDuration: 22000, // 22 seconds
    itemShowDelay: 500, // Delay between showing each item
    feedbackDuration: 5000, // 4-5 seconds for feedback
    errorBackgroundDuration: 5500, // Slightly longer than feedback
    congratsDelay: 1000
  },

  // Animation configuration
  animations: {
    cofreOpen: {
      initial: { scale: 1 },
      animate: { scale: [1, 1.1, 1] },
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    itemAppear: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    itemDrag: {
      whileDrag: { scale: 1.1, zIndex: 100 },
      transition: { duration: 0.2 }
    },
    feedbackIcon: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  },

  // Drop zone configuration
  dropZone: {
    center: { x: '50%', y: '50%' },
    size: { width: 200, height: 150 },
    tolerance: 50 // pixels tolerance for drop detection
  }
} as const;

// Database tracking types for future implementation
export interface ItemAttempt {
  gameId: string;
  itemId: string;
  userId?: string;
  sessionId?: string;
  wasCorrect: boolean;
  isPrivate: boolean;
  timestamp: Date;
  timeToDecision?: number;
}

export interface GameSession {
  gameId: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  totalItems: number;
  correctItems: number;
  incorrectAttempts: number;
  finalScore: number;
}

// Helper function to get private items count
export const getPrivateItemsCount = () => {
  return GAME_CONFIG.items.filter(item => item.isPrivate).length;
};