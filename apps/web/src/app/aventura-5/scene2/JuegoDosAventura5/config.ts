export interface OptionConfig {
  id: string;
  image: string;
  audio: string;
  isCorrect: boolean;
  feedbackAudio: string;
}

export interface QuestionConfig {
  id: number;
  situationImage: string;
  situationAudio: string;
  options: [OptionConfig, OptionConfig];
}

export const questions: QuestionConfig[] = [
  {
    id: 1,
    situationImage: '/image/avanzado/aventura5/juego2/Situacion1.png',
    situationAudio: '/audio/advance-aventura5/juego2/q-1/q-1-s-1.mp3',
    options: [
      {
        id: 'q1-opt1',
        image: '/image/avanzado/aventura5/juego2/elements/S1-no-contar.png',
        audio: '/audio/advance-aventura5/juego2/q-1/q-1-Opcion-1.mp3',
        isCorrect: true,
        feedbackAudio: '/audio/advance-aventura5/juego2/q-1/q-1-fb-correcto.mp3',
      },
      {
        id: 'q1-opt2',
        image: '/image/avanzado/aventura5/juego2/elements/S1-contat-incorrecto.png',
        audio: '/audio/advance-aventura5/juego2/q-1/q-1-Opcion-2.mp3',
        isCorrect: false,
        feedbackAudio: '/audio/advance-aventura5/juego2/q-1/q-1-fb-incorrect.mp3',
      },
    ],
  },
  {
    id: 2,
    situationImage: '/image/avanzado/aventura5/juego2/Situacion2.png',
    situationAudio: '/audio/advance-aventura5/juego2/q-2/q-2-s-2.mp3',
    options: [
      {
        id: 'q2-opt1',
        image: '/image/avanzado/aventura5/juego2/elements/S2-incorrecto.png',
        audio: '/audio/advance-aventura5/juego2/q-2/q-2-opcion-1.mp3',
        isCorrect: false,
        feedbackAudio: '/audio/advance-aventura5/juego2/q-2/q-2-fb-incorrecto.mp3',
      },
      {
        id: 'q2-opt2',
        image: '/image/avanzado/aventura5/juego2/elements/S2-correcto.png',
        audio: '/audio/advance-aventura5/juego2/q-2/q-2-opcion-2.mp3',
        isCorrect: true,
        feedbackAudio: '/audio/advance-aventura5/juego2/q-2/q-2-fb-correcto.mp3',
      },
    ],
  },
  {
    id: 3,
    situationImage: '/image/avanzado/aventura5/juego2/Situacion3.png',
    situationAudio: '/audio/advance-aventura5/juego2/q-3/q-3-s-3.mp3',
    options: [
      {
        id: 'q3-opt1',
        image: '/image/avanzado/aventura5/juego2/elements/S3-correcto.png',
        audio: '/audio/advance-aventura5/juego2/q-3/q-3-option-1.mp3',
        isCorrect: true,
        feedbackAudio: '/audio/advance-aventura5/juego2/q-3/q-3-fb-correcto.mp3',
      },
      {
        id: 'q3-opt2',
        image: '/image/avanzado/aventura5/juego2/elements/S3-incorrecto.png',
        audio: '/audio/advance-aventura5/juego2/q-3/q-3-option-2.mp3',
        isCorrect: false,
        feedbackAudio: '/audio/advance-aventura5/juego2/q-3/q-3-fb-inorrecto.mp3',
      },
    ],
  },
];

export const introAudio = '/audio/advance-aventura5/juego2/intro.mp3';
