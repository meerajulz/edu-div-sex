export type Zone = 'green' | 'red';

export interface SceneConfig {
  id: number;
  image: string;
  questionAudio: string;
  correctZone: Zone;
  correctFeedbackAudio: string;
  wrongFeedbackAudio: string;
}

export const scenes: SceneConfig[] = [
  {
    id: 1,
    image: '/image/avanzado/aventura6/juego4/ESCENA1.png',
    questionAudio: '/audio/advance--aventura-6/juego4/s1.mp3',
    correctZone: 'green',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego4/s1-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego4/s1-incorrecto.mp3',
  },
  {
    id: 2,
    image: '/image/avanzado/aventura6/juego4/ESCENA2.png',
    questionAudio: '/audio/advance--aventura-6/juego4/s2.mp3',
    correctZone: 'red',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego4/s2-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego4/s2-incorrecto.mp3',
  },
  {
    id: 3,
    image: '/image/avanzado/aventura6/juego4/ESCENA3.png',
    questionAudio: '/audio/advance--aventura-6/juego4/s3.mp3',
    correctZone: 'green',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego4/s3-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego4/s3-incorrecto.mp3',
  },
  {
    id: 4,
    image: '/image/avanzado/aventura6/juego4/ESCENA4.png',
    questionAudio: '/audio/advance--aventura-6/juego4/s4.mp3',
    correctZone: 'red',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego4/s4-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego4/s4-incorrecto.mp3',
  },
  {
    id: 5,
    image: '/image/avanzado/aventura6/juego4/ESCENA5.png',
    questionAudio: '/audio/advance--aventura-6/juego4/s5.mp3',
    correctZone: 'green',
    correctFeedbackAudio: '/audio/advance--aventura-6/juego4/s5-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance--aventura-6/juego4/s5-incorrecto.mp3',
  },
];
