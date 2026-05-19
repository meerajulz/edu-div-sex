export interface QuestionConfig {
  id: number;
  image: string;
  questionAudio: string;
  correctAnswer: 'no';
  correctFeedbackAudio: string;
  wrongFeedbackAudio: string;
}

export const questions: QuestionConfig[] = [
  {
    id: 1,
    image: '/image/avanzado/aventura6/juego2/Escena1.png',
    questionAudio: '/audio/advance--aventura-6/juego2/p-1.mp3',
    correctAnswer: 'no',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego2/p1-incorrecto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego2/p1-correcto.mp3',
  },
  {
    id: 2,
    image: '/image/avanzado/aventura6/juego2/Escena2.png',
    questionAudio: '/audio/advance--aventura-6/juego2/p-2.mp3',
    correctAnswer: 'no',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego2/p-2-incorrecto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego2/p-2-correcto.mp3',
  },
  {
    id: 3,
    image: '/image/avanzado/aventura6/juego2/Escena3.png',
    questionAudio: '/audio/advance--aventura-6/juego2/p-3.mp3',
    correctAnswer: 'no',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego2/p-3-incorrecto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego2/p-3-correcto.mp3',
  },
];

export const titleAudio = '/audio/advance--aventura-6/juego2/title.mp3';
export const yesButtonSound = '/audio/YES.mp3';
export const noButtonSound = '/audio/NO.mp3';
