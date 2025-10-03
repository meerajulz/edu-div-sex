export const GAME_CONFIG = {
  id: 'juego_cuatro_actividad_2',
  title: '¿Qué hacer si alguien no respeta tu intimidad?',
  
  // Global audio files
  globalAudio: {
    title: '/audio/actividad-2/juego4/title.mp3', // "Clica a la imagen correcto"
    subtitle: '/audio/actividad-2/juego4/subtitle.mp3', // Subtitle explaining the game
    congratulations: '/audio/actividad-2/juego4/muybien.mp3',
    animationSound: '/audio/button/Bright.mp3' // Sound for image animations
  },

  // Global feedback images
  feedbackImages: {
    correct: '/image/actividad_2/juego_4/ok.png',
    incorrect: '/image/actividad_2/juego_4/no.png'
  },

  // Situations data - easily expandable
  situations: [
    {
      id: 'situation_1',
      title: 'Situación 1',
      description: 'Alguien toca la puerta del baño mientras Marta se está cambiándose. ¿Qué debe hacer Marta?',
      
      // Visual content
      images: {
        situation: '/image/actividad_2/juego_4/Caso_1_situation.png',
        correct: '/image/actividad_2/juego_4/Caso_1_correct.png',
        incorrect: '/image/actividad_2/juego_4/Caso_1_incorrect.png'
      },
      
      // Audio sequence
      audio: {
        situation: '/audio/actividad-2/juego4/situation1.mp3',
        imageCorrect: '/audio/actividad-2/juego4/s1-image-c.mp3', // Audio for correct image
        imageIncorrect: '/audio/actividad-2/juego4/s1-image-i.mp3.mp3', // Audio for incorrect image
        correct: '/audio/actividad-2/juego4/s_1_c_1_correct.mp3',
        correctFeedback: '/audio/actividad-2/juego4/s_1_c_1_correct_feedback.mp3',
        incorrect: '/audio/actividad-2/juego4/s_1_c_1_incorrect.mp3',
        incorrectFeedback: '/audio/actividad-2/juego4/s_1_c_1_incorrect_feedback.mp3'
      },
      
      // Answer options text (for accessibility/future use)
      options: {
        correct: 'Decir: Espera, estoy cambiándome.',
        incorrect: 'No decir nada y dejar que entre.'
      },
      
      // Feedback text
      feedback: {
        correct: '¡Muy bien! Decir "Espera" es la mejor opción. Tu intimidad es importante.',
        incorrect: 'Recuerda, siempre debes decir algo si alguien intenta entrar mientras estás cambiándote.'
      }
    },
    {
      id: 'situation_2',
      title: 'Situación 2',
      description: 'Pepe intenta besar a Marta en el parque. ¿Qué debe hacer Marta?',
      
      // Visual content
      images: {
        situation: '/image/actividad_2/juego_4/Caso_2_situation.png',
        correct: '/image/actividad_2/juego_4/Caso_2_correct.png',
        incorrect: '/image/actividad_2/juego_4/Caso_2_incorrect.png'
      },
      
      // Audio sequence
      audio: {
        situation: '/audio/actividad-2/juego4/situation2.mp3',
        imageCorrect: '/audio/actividad-2/juego4/s2-image-c.mp3.mp3', // Audio for correct image
        imageIncorrect: '/audio/actividad-2/juego4/s2-image-1.mp3.mp3', // Audio for incorrect image
        correct: '/audio/actividad-2/juego4/s_2_c_2_correct.mp3',
        correctFeedback: '/audio/actividad-2/juego4/s_2_c_2_correct_feedback.mp3',
        incorrect: '/audio/actividad-2/juego4/s_2_c_2_incorrect.mp3',
        incorrectFeedback: '/audio/actividad-2/juego4/s_2_c_2_incorrect_feedback.mp3'
      },
      
      // Answer options text
      options: {
        correct: 'No, el parque es un lugar público.',
        incorrect: 'No decir nada y aceptar el beso.'
      },
      
      // Feedback text
      feedback: {
        correct: '¡Exacto! Decir no, si no es el lugar adecuado, está bien.',
        incorrect: 'Recuerda, puedes decir lo que sientes. ¡Tu cuerpo es tuyo!'
      }
    },
    {
      id: 'situation_3',
      title: 'Situación 3',
      description: 'Alex y Dani siempre van juntos a todas partes. Un desconocido le ha preguntado a Alex si son novios. ¿Qué debe contestar Alex?',
      
      // Visual content
      images: {
        situation: '/image/actividad_2/juego_4/Caso_3_situation.png',
        correct: '/image/actividad_2/juego_4/Caso_3_2_correct.png',
        incorrect: '/image/actividad_2/juego_4/Caso_3_3_incorrect.png'
      },
      
      // Audio sequence
      audio: {
        situation: '/audio/actividad-2/juego4/situation3.mp3',
        imageCorrect: '/audio/actividad-2/juego4/s3-image-c.mp3.mp3', // Audio for correct image
        imageIncorrect: '/audio/actividad-2/juego4/s3-image-i.mp3.mp3', // Audio for incorrect image
        correct: '/audio/actividad-2/juego4/s_3_c_3_correct.mp3',
        correctFeedback: '/audio/actividad-2/juego4/s_3_c_3_correct_feedback.mp3',
        incorrect: '/audio/actividad-2/juego4/s_3_c_3_incorrect.mp3',
        incorrectFeedback: '/audio/actividad-2/juego4/s_3_c_3_incorrect_feedback.mp3'
      },
      
      // Answer options text
      options: {
        correct: 'Prefiero no hablar de eso.',
        incorrect: 'Le cuente todo.'
      },
      
      // Feedback text
      feedback: {
        correct: '¡Exacto! No tienes que compartir todo con cualquiera.',
        incorrect: 'Vuelve a intentarlo. Recuerda que hay información que nos guardamos para nosotros y no le contamos a desconocidos.'
      }
    }
  ],

  // Timing configuration
  timing: {
    titleAudioDelay: 5000, // 5 seconds total for title (audio + delay)
    situationImageDelay: 100, // Delay before showing situation image
    imageCorrectDelay: 800, // Delay before showing correct image
    imageIncorrectDelay: 800, // Delay before showing incorrect image
    optionsDelay: 800, // Delay after image audios before enabling interaction
    feedbackImageDelay: 200, // Delay before showing ok/no feedback image
    feedbackAudioDelay: 800, // Delay before playing feedback audio
    nextSituationDelay: 4000, // 6 seconds for feedback + 500ms buffer
    congratsDelay: 1000, // Delay before showing congratulations
    retryDelay: 6500, // 6 seconds for feedback + 500ms buffer before allowing retry
    congratsDuration: 3000 // Duration for the congratulations message
  },

  // Animation configuration
  animations: {
    situationImage: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    optionImages: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    feedbackImage: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  }
} as const;

// Database tracking types for future implementation
export interface SituationAttempt {
  gameId: string;
  situationId: string;
  userId?: string;
  sessionId?: string;
  selectedAnswer: 'correct' | 'incorrect';
  isCorrect: boolean;
  timestamp: Date;
  timeToAnswer?: number;
  attemptsCount: number; // How many times user tried this situation
}

export interface GameSession {
  gameId: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  totalSituations: number;
  correctAnswersFirstTry: number; // Correct on first attempt
  totalAttempts: number; // Total clicks across all situations
  finalScore: number;
}

// Helper function to easily add new situations
export const addNewSituation = (situation: typeof GAME_CONFIG.situations[0]) => {
  // This function would be used in the future to dynamically add situations
  // For now it's just a template for the structure needed
  return situation;
};