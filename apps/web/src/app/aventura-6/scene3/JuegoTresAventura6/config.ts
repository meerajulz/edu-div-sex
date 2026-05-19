export type OptionId = 'A' | 'B' | 'C';

export interface OptionConfig {
  id: OptionId;
  image: string;
  audio: string;
}

export interface QuestionConfig {
  id: number;
  questionAudio: string;
  correctAnswer: OptionId;
  correctFeedbackAudio: string;
  wrongFeedbackAudio: string;
  options: [OptionConfig, OptionConfig, OptionConfig];
}

export const questions: QuestionConfig[] = [
  {
    id: 1,
    questionAudio: '/audio/advance--aventura-6/juego3/p-1.mp3',
    correctAnswer: 'B',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego3/p-1-fb-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego3/p-1-fb-incorrecto.mp3',
    options: [
      { id: 'A', image: '/image/avanzado/aventura6/juego3/pregunta1/A.png', audio: '/audio/advance--aventura-6/juego3/p-1-o-A.mp3' },
      { id: 'B', image: '/image/avanzado/aventura6/juego3/pregunta1/B.png', audio: '/audio/advance--aventura-6/juego3/p-1-o-B.mp3' },
      { id: 'C', image: '/image/avanzado/aventura6/juego3/pregunta1/C.png', audio: '/audio/advance--aventura-6/juego3/p-1-o-C.mp3' },
    ],
  },
  {
    id: 2,
    questionAudio: '/audio/advance--aventura-6/juego3/p-2.mp3',
    correctAnswer: 'C',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego3/p-2-fb-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego3/p-2-fb-incorrecto.mp3',
    options: [
      { id: 'A', image: '/image/avanzado/aventura6/juego3/pregunta2/A.png', audio: '/audio/advance--aventura-6/juego3/p-2-o-A.mp3' },
      { id: 'B', image: '/image/avanzado/aventura6/juego3/pregunta2/B.png', audio: '/audio/advance--aventura-6/juego3/p-2-o-B.mp3' },
      { id: 'C', image: '/image/avanzado/aventura6/juego3/pregunta2/C.png', audio: '/audio/advance--aventura-6/juego3/p-2-o-C.mp3' },
    ],
  },
  {
    id: 3,
    questionAudio: '/audio/advance--aventura-6/juego3/p-3.mp3',
    correctAnswer: 'A',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego3/p-3-fb-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego3/p-3-fb-incorrecto.mp3',
    options: [
      { id: 'A', image: '/image/avanzado/aventura6/juego3/pregunta3/A.png', audio: '/audio/advance--aventura-6/juego3/p-3-o-A.mp3' },
      { id: 'B', image: '/image/avanzado/aventura6/juego3/pregunta3/B.png', audio: '/audio/advance--aventura-6/juego3/p-3-o-B.mp3' },
      { id: 'C', image: '/image/avanzado/aventura6/juego3/pregunta3/C.png', audio: '/audio/advance--aventura-6/juego3/p-3-o-C.mp3' },
    ],
  },
  {
    id: 4,
    questionAudio: '/audio/advance--aventura-6/juego3/p-4.mp3',
    correctAnswer: 'A',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego3/p-4-fb-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego3/p-4-fb-incorrecto.mp3',
    options: [
      { id: 'A', image: '/image/avanzado/aventura6/juego3/pregunta4/A.png', audio: '/audio/advance--aventura-6/juego3/p-4-o-A.mp3' },
      { id: 'B', image: '/image/avanzado/aventura6/juego3/pregunta4/B.png', audio: '/audio/advance--aventura-6/juego3/p-4-o-B.mp3' },
      { id: 'C', image: '/image/avanzado/aventura6/juego3/pregunta4/C.png', audio: '/audio/advance--aventura-6/juego3/p-4-o-C.mp3' },
    ],
  },
];

export const alexImages = [
  '/image/avanzado/aventura6/juego3/Alex1.png',
  '/image/avanzado/aventura6/juego3/Alex2.png',
  '/image/avanzado/aventura6/juego3/Alex3.png',
];

export const crisImages = [
  '/image/avanzado/aventura6/juego3/Cris1.png',
  '/image/avanzado/aventura6/juego3/Cris2.png',
  '/image/avanzado/aventura6/juego3/Cris3.png',
];
