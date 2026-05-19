const AUDIO = '/audio/advance-aventura7/aventura7/juego4';
const IMG = '/image/avanzado/aventura7/juego4';

export const titleAudio = `${AUDIO}/t.mp3`;
export const subtitleAudio = `${AUDIO}/subtitle.mp3`;
export const situationIntroAudio = `${AUDIO}/titulo-everytitme.mp3`;

export const situations = [
  {
    id: 1,
    options: [
      { id: '1', image: `${IMG}/S1/S1-1.png`, correct: true },
      { id: '2', image: `${IMG}/S1/S1-2.png`, correct: false },
    ],
    correctFeedbackAudio: `${AUDIO}/s1-correcto.mp3`,
    wrongFeedbackAudio: `${AUDIO}/s1-incorrecto.mp3`,
  },
  {
    id: 2,
    options: [
      { id: '1', image: `${IMG}/S2/S2-1.png`, correct: false },
      { id: '2', image: `${IMG}/S2/S2-2.png`, correct: true },
    ],
    correctFeedbackAudio: `${AUDIO}/s2-correcto.mp3`,
    wrongFeedbackAudio: `${AUDIO}/s2-incorrecto.mp3`,
  },
  {
    id: 3,
    options: [
      { id: '1', image: `${IMG}/S3/S3-1.png`, correct: false },
      { id: '2', image: `${IMG}/S3/S3-2.png`, correct: true },
    ],
    correctFeedbackAudio: `${AUDIO}/s3-correcto.mp3`,
    wrongFeedbackAudio: `${AUDIO}/s3-incorrecto.mp3`,
  },
  {
    id: 4,
    options: [
      { id: '1', image: `${IMG}/S4/S4-1.png`, correct: true },
      { id: '2', image: `${IMG}/S4/S4-2.png`, correct: false },
    ],
    correctFeedbackAudio: `${AUDIO}/s4-correcto.mp3`,
    wrongFeedbackAudio: `${AUDIO}/s4-incorrecto.mp3`,
  },
];

export const finale = {
  img1: `${IMG}/img1.png`,
  img2: `${IMG}/img2.png`,
  f1Audio: `${AUDIO}/f1.mp3`,
  f2Audio: `${AUDIO}/f2.mp3`,
  f3Audio: `${AUDIO}/f3.mp3`,
  f3Text: 'LAS RELACIONES SEXUALES SON ALGO BONITO CUANDO HAY AFECTO, RESPETO Y CUIDADO DE LA OTRA PERSONA.',
};
