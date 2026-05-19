export type ThumbAnswer = 'yes' | 'no';

export interface SituationConfig {
  id: number;
  image: string;
  situationAudio: string;
  correctAnswer: ThumbAnswer;
  correctFeedbackAudio: string;
  wrongFeedbackAudio: string;
}

export const situations: SituationConfig[] = [
  {
    id: 1,
    image: '/image/avanzado/aventura7/juego1/s1.png',
    situationAudio: '/audio/advance-aventura7/juego1/s1.mp3',
    correctAnswer: 'yes',
    correctFeedbackAudio: '/audio/advance-aventura7/juego1/s1-fb-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance-aventura7/juego1/s1-fb-incorrecto.mp3',
  },
  {
    id: 2,
    image: '/image/avanzado/aventura7/juego1/s2.png',
    situationAudio: '/audio/advance-aventura7/juego1/s2.mp3',
    correctAnswer: 'yes',
    correctFeedbackAudio: '/audio/advance-aventura7/juego1/s2-fb-correcto.mp3',
    wrongFeedbackAudio: '/audio/advance-aventura7/juego1/s2-fb-incorrecto.mp3',
  },
];

export const titleAudio = '/audio/advance-aventura7/juego1/titlle.mp3';
export const subtitleAudio = '/audio/advance-aventura7/juego1/subtitle.mp3';
export const yesButtonSound = '/audio/YES.mp3';
export const noButtonSound = '/audio/NO.mp3';
