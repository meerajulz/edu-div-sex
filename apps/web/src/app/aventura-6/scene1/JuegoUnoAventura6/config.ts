export interface SituationConfig {
  id: number;
  image: string;
  questionAudio: string;
  correctAnswer: 'no';
  correctFeedbackAudio: string;
  wrongFeedbackAudio: string;
}

export const situations: SituationConfig[] = [
  {
    id: 1,
    image: '/image/avanzado/aventura6/juego1/situacion1.png',
    questionAudio: '/audio/advance--aventura-6/juego1/s1/s-1.mp3',
    correctAnswer: 'no',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego1/s1/s-1-incorrecto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego1/s1/s-1-correcto.mp3',
  },
  {
    id: 2,
    image: '/image/avanzado/aventura6/juego1/situacion2.png',
    questionAudio: '/audio/advance--aventura-6/juego1/s2/s-2.mp3',
    correctAnswer: 'no',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego1/s2/s-2-incorrecto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego1/s2/s-2-correcto.mp3',
  },
  {
    id: 3,
    image: '/image/avanzado/aventura6/juego1/situacion3.png',
    questionAudio: '/audio/advance--aventura-6/juego1/s3/s-3.mp3',
    correctAnswer: 'no',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego1/s3/s-3-incorrecto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego1/s3/s-3-correcto.mp3',
  },
  {
    id: 4,
    image: '/image/avanzado/aventura6/juego1/situacion4.png',
    questionAudio: '/audio/advance--aventura-6/juego1/s4/s-4.mp3',
    correctAnswer: 'no',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego1/s4/s-4-incorrecto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego1/s4/s-4-correcto.mp3',
  },
];

export const titleAudio = '/audio/advance--aventura-6/juego1/title.mp3';
export const subtitleAudio = '/audio/advance--aventura-6/juego1/subtitle.mp3';
export const yesButtonSound = '/audio/YES.mp3';
export const noButtonSound = '/audio/NO.mp3';
