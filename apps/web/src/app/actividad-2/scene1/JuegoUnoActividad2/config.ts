export const GAME_CONFIG = {
  id: 'juego_uno_actividad_2',
  title: 'Privado vs No Privado',
  
  // Global audio files
  globalAudio: {
    question: '/audio/actividad-2/juego1/esta-bien-contar.mp3',
    yesButton: '/audio/actividad-2/juego1/si.mp3',
    noButton: '/audio/actividad-2/juego1/no.mp3'
  },

  // Feedback audio files
  feedbackAudio: {
    correctPrivate: '/audio/actividad-2/juego1/c-si-privado.mp3', // Correct: Situation IS private, answered NO
    incorrectPrivate: '/audio/actividad-2/juego1/i-si-privado.mp3', // Incorrect: Situation IS private, answered YES
    correctNotPrivate: '/audio/actividad-2/juego1/c-no-privado.mp3', // Correct: Situation NOT private, answered YES
    incorrectNotPrivate: '/audio/actividad-2/juego1/i-no-privado.mp3' // Incorrect: Situation NOT private, answered NO
  },

  // Button images
  buttonImages: {
    yes: '/image/actividad_2/juego_1/positivo.png',
    no: '/image/actividad_2/juego_1/negativo.png'
  },

  // Situations data
  situations: [
    {
      id: 'situation_1',
      title: 'Situación 1',
      description: 'Alex cuenta al oído a Rosa que le gusta Pepe y después ve que Rosa se lo cuenta a todos los amigos.',
      
      // Visual content
      image: '/image/actividad_2/juego_1/B_gustar.png',
      imagePosition: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
      
      // Audio sequence
      audio: {
        situation: '/audio/actividad-2/juego1/s1.mp3',
        text: '/audio/actividad-2/juego1/s1-text.mp3'
      },
      
      // Privacy and answer configuration
      isPrivate: true, // This situation IS private
      correctAnswer: 'NO' as const, // Correct answer is NO (shouldn't tell everyone)

      // Feedback configuration
      feedback: {
        correctAudio: 'correctPrivate', // User answered NO correctly - it IS private
        incorrectAudio: 'incorrectPrivate', // User answered YES incorrectly - it IS private
        correctText: '¡Correcto! Porque es privado',
        incorrectText: 'Incorrecto. Porque es privado'
      }
    },
    {
      id: 'situation_2',
      title: 'Situación 2',
      description: 'Alex cuenta al oído a Rosa que le gusta mucho el chocolate y después ve que Rosa se lo cuenta a todos los amigos.',
      
      // Visual content
      image: '/image/actividad_2/juego_1/B_chocolate.png',
      imagePosition: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
      
      // Audio sequence
      audio: {
        situation: '/audio/actividad-2/juego1/s2.mp3',
        text: '/audio/actividad-2/juego1/s2-text.mp3'
      },
      
      // Privacy and answer configuration
      isPrivate: false, // This situation is NOT private
      correctAnswer: 'YES' as const, // Correct answer is YES (okay to tell everyone)

      // Feedback configuration
      feedback: {
        correctAudio: 'correctNotPrivate', // User answered YES correctly - it's NOT private
        incorrectAudio: 'incorrectNotPrivate', // User answered NO incorrectly - it's NOT private
        correctText: '¡Correcto! No es privado',
        incorrectText: 'Incorrecto. Porque No es privado'
      }
    },
    {
      id: 'situation_3',
      title: 'Situación 3',
      description: 'Alex cuenta al oído a Rosa que le gusta ver fotos sexis y tocarse y después ve que Rosa se lo cuenta a todos los amigos.',
      
      // Visual content
      image: '/image/actividad_2/juego_1/B_tocarse.png',
      imagePosition: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
      
      // Audio sequence
      audio: {
        situation: '/audio/actividad-2/juego1/s3.mp3',
        text: '/audio/actividad-2/juego1/s3-text.mp3'
      },
      
      // Privacy and answer configuration
      isPrivate: true, // This situation IS private
      correctAnswer: 'NO' as const, // Correct answer is NO (not okay to tell everyone)

      // Feedback configuration
      feedback: {
        correctAudio: 'correctPrivate', // User answered NO correctly - it IS private
        incorrectAudio: 'incorrectPrivate', // User answered YES incorrectly - it IS private
        correctText: '¡Correcto! Porque es privado',
        incorrectText: 'Incorrecto. Porque es privado'
      }
    },
    {
      id: 'situation_4',
      title: 'Situación 4',
      description: 'Alex cuenta al oído a Rosa que le gustaría aprender a esquiar y después ve que Rosa se lo cuenta a todos los amigos.',
      
      // Visual content
      image: '/image/actividad_2/juego_1/B_esquiar.png',
      imagePosition: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
      
      // Audio sequence
      audio: {
        situation: '/audio/actividad-2/juego1/s4.mp3',
        text: '/audio/actividad-2/juego1/s4-text.mp3'
      },
      
      // Privacy and answer configuration
      isPrivate: false, // This situation is NOT private
      correctAnswer: 'YES' as const, // Correct answer is YES (okay to tell everyone)

      // Feedback configuration
      feedback: {
        correctAudio: 'correctNotPrivate', // User answered YES correctly - it's NOT private
        incorrectAudio: 'incorrectNotPrivate', // User answered NO incorrectly - it's NOT private
        correctText: '¡Correcto! No es privado',
        incorrectText: 'Incorrecto. Porque No es privado'
      }
    }
  ],

  // Timing configuration (updated)
  timing: {
    situationDelay: 1000,
    audioSequenceDelay: 4000, // Increased for proper audio timing
    feedbackDuration: 3000,
    buttonDelay: 2000,
    retryDelay: 3000,
    congratsDuration: 3000  // Add this line
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
  totalSituations: number;
  correctAnswers: number;
  finalScore: number;
}