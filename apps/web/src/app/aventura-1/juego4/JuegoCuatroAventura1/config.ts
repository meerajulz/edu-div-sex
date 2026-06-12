export const TITLE_AUDIO = '/audio/advanced-aventura1/juego4/TITLE.mp3';
export const SUBTITLE_AUDIO = '/audio/advanced-aventura1/juego4/SUBTITLE.mp3';
export const CORRECT_SOUND = '/audio/advanced-aventura1/juego4/RC.mp3';
export const INCORRECT_SOUND = '/audio/advanced-aventura1/juego4/RI.mp3';
export const YES_SOUND = '/audio/YES.mp3';
export const NO_SOUND = '/audio/NO.mp3';
export const YES_IMAGE = '/image/avanzado/aventura6/ok-hover.png';
export const NO_IMAGE = '/image/avanzado/aventura6/no-hover.png';

export interface Answer {
  image: string;
  audio: string;
}

export interface Question {
  id: number;
  image: string;
  audio: string;
  correct: Answer;
  incorrect: Answer;
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    image: '/image/avanzado/aventura1/juego4/pregunta1/Pregunta1.png',
    audio: '/audio/advanced-aventura1/juego4/P1.mp3',
    correct:   { image: '/image/avanzado/aventura1/juego4/pregunta1/Respuesta1.1.png', audio: '/audio/advanced-aventura1/juego4/P1C.mp3' },
    incorrect: { image: '/image/avanzado/aventura1/juego4/pregunta1/Respuesta1.2.png', audio: '/audio/advanced-aventura1/juego4/P1I.mp3' },
  },
  {
    id: 2,
    image: '/image/avanzado/aventura1/juego4/pregunta2/Pregunta2.png',
    audio: '/audio/advanced-aventura1/juego4/P2.mp3',
    correct:   { image: '/image/avanzado/aventura1/juego4/pregunta2/Respuesta2.1.png', audio: '/audio/advanced-aventura1/juego4/P2C.mp3' },
    incorrect: { image: '/image/avanzado/aventura1/juego4/pregunta2/Respuesta2.2.png', audio: '/audio/advanced-aventura1/juego4/P2I.mp3' },
  },
  {
    id: 3,
    image: '/image/avanzado/aventura1/juego4/pregunta3/Pregunta3.png',
    audio: '/audio/advanced-aventura1/juego4/P3.mp3',
    correct:   { image: '/image/avanzado/aventura1/juego4/pregunta3/Respuesta3.1.png', audio: '/audio/advanced-aventura1/juego4/P3C.mp3' },
    incorrect: { image: '/image/avanzado/aventura1/juego4/pregunta3/Respuesta3.2.png', audio: '/audio/advanced-aventura1/juego4/P3I.mp3' },
  },
  {
    id: 4,
    image: '/image/avanzado/aventura1/juego4/pregunta4/Pregunta4.png',
    audio: '/audio/advanced-aventura1/juego4/P4.mp3',
    correct:   { image: '/image/avanzado/aventura1/juego4/pregunta4/Respuesta4.1.png', audio: '/audio/advanced-aventura1/juego4/P4C.mp3' },
    incorrect: { image: '/image/avanzado/aventura1/juego4/pregunta4/Respuesta4.2.png', audio: '/audio/advanced-aventura1/juego4/P4I.mp3' },
  },
  {
    id: 5,
    image: '/image/avanzado/aventura1/juego4/pregunta5/Pregunta5.png',
    audio: '/audio/advanced-aventura1/juego4/P5.mp3',
    correct:   { image: '/image/avanzado/aventura1/juego4/pregunta5/Respuesta5.1.png', audio: '/audio/advanced-aventura1/juego4/P5C.mp3' },
    incorrect: { image: '/image/avanzado/aventura1/juego4/pregunta5/Respuesta5.2.png', audio: '/audio/advanced-aventura1/juego4/P5I.mp3' },
  },
  {
    id: 6,
    image: '/image/avanzado/aventura1/juego4/pregunta6/Pregunta6.png',
    audio: '/audio/advanced-aventura1/juego4/P6.mp3',
    correct:   { image: '/image/avanzado/aventura1/juego4/pregunta6/Respuesta6.1.png', audio: '/audio/advanced-aventura1/juego4/P6C.mp3' },
    incorrect: { image: '/image/avanzado/aventura1/juego4/pregunta6/Respuesta6.2.png', audio: '/audio/advanced-aventura1/juego4/P6I.mp3' },
  },
  {
    id: 7,
    image: '/image/avanzado/aventura1/juego4/pregunta7/Pregunta7.png',
    audio: '/audio/advanced-aventura1/juego4/P7.mp3',
    correct:   { image: '/image/avanzado/aventura1/juego4/pregunta7/Respuesta7.1.png',   audio: '/audio/advanced-aventura1/juego4/P7C.mp3' },
    incorrect: { image: '/image/avanzado/aventura1/juego4/pregunta7/Respuesta 7.2.png', audio: '/audio/advanced-aventura1/juego4/P7I.mp3' },
  },
];
