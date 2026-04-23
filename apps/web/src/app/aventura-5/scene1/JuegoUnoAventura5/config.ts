export interface SceneConfig {
  id: number;
  image: string;
}

export interface EmotionConfig {
  id: string;
  label: string;
  image: string;
  clickAudio: string;
  feedbackAudio: string;
}

export const scenes: SceneConfig[] = [
  { id: 1, image: '/image/avanzado/aventura5/juego1/Escena 1.png' },
  { id: 2, image: '/image/avanzado/aventura5/juego1/Escena 2.png' },
  { id: 3, image: '/image/avanzado/aventura5/juego1/Escena 3.png' },
  { id: 4, image: '/image/avanzado/aventura5/juego1/Escena 4.png' },
  { id: 5, image: '/image/avanzado/aventura5/juego1/Escena 5.png' },
  { id: 6, image: '/image/avanzado/aventura5/juego1/Escena 6.png' },
];

export const emotions: EmotionConfig[] = [
  {
    id: 'confuso',
    label: 'Confusión',
    image: '/image/avanzado/aventura5/juego1/caritas/Confuso.png',
    clickAudio: '/audio/advance-aventura5/juego1/Confusión.mp3',
    feedbackAudio: '/audio/advance-aventura5/juego1/FB_confusion.mp3',
  },
  {
    id: 'disgusto',
    label: 'Disgusto',
    image: '/image/avanzado/aventura5/juego1/caritas/Disgusto.png',
    clickAudio: '/audio/advance-aventura5/juego1/Disgusto.mp3',
    feedbackAudio: '/audio/advance-aventura5/juego1/r-disgusto.mp3',
  },
  {
    id: 'enfado',
    label: 'Enfado',
    image: '/image/avanzado/aventura5/juego1/caritas/Enfado.png',
    clickAudio: '/audio/advance-aventura5/juego1/Enfado.mp3',
    feedbackAudio: '/audio/advance-aventura5/juego1/FB-enfado.mp3',
  },
  {
    id: 'indiferencia',
    label: 'Indiferencia',
    image: '/image/avanzado/aventura5/juego1/caritas/Indiferencia.png',
    clickAudio: '/audio/advance-aventura5/juego1/Indiferencia.mp3',
    feedbackAudio: '/audio/advance-aventura5/juego1/r-diferentes.mp3',
  },
  {
    id: 'sorpresa',
    label: 'Sorpresa',
    image: '/image/avanzado/aventura5/juego1/caritas/Sorpresa.png',
    clickAudio: '/audio/advance-aventura5/juego1/Sorpresa.mp3',
    feedbackAudio: '/audio/advance-aventura5/juego1/FB_sorpresa.mp3',
  },
  {
    id: 'susto',
    label: 'Susto',
    image: '/image/avanzado/aventura5/juego1/caritas/Susto.png',
    clickAudio: '/audio/advance-aventura5/juego1/Susto.mp3',
    feedbackAudio: '/audio/advance-aventura5/juego1/FB-susto.mp3',
  },
  {
    id: 'verguenza',
    label: 'Vergüenza',
    image: '/image/avanzado/aventura5/juego1/caritas/Verguenza.png',
    clickAudio: '/audio/advance-aventura5/juego1/Vergüenza.mp3',
    feedbackAudio: '/audio/advance-aventura5/juego1/FB-verguenza.mp3',
  },
];

export const instructionsAudio = '/audio/advance-aventura5/juego1/description.mp3';
