const IMG = '/image/avanzado/aventura4/juego1';
const AUD = '/audio/advance-actividad-4/juego1';

export const TITLE_AUDIO = `${AUD}/title.mp3`;
export const YES_SOUND   = '/audio/YES.mp3';
export const NO_SOUND    = '/audio/NO.mp3';

export const NOA_GIF = `${IMG}/Noa.gif`;

export const ALEX_FACES = {
  enfadado: `${IMG}/Enfadado.png`,
  triste:   `${IMG}/Triste-1.png`,
  contento: `${IMG}/Contento-1.png`,
};

export const OPTION_IMGS = {
  triste:   { neutral: `${IMG}/Triste.png`,   acierto: `${IMG}/Triste-acierto.png`,   error: `${IMG}/Triste-error.png` },
  contento: { neutral: `${IMG}/Contento.png`, acierto: `${IMG}/Contento-acierto.png`, error: `${IMG}/Contento-error.png` },
  enfadado: { neutral: `${IMG}/Enfado.png`,    acierto: `${IMG}/Enfadado-acierto.png`, error: `${IMG}/Enfadado-error.png` },
};

export const YES_IMG    = `${IMG}/yes.png`;
export const YES_HOVER  = `${IMG}/yes-hover.png`;
export const NO_IMG     = `${IMG}/no.png`;
export const NO_HOVER   = `${IMG}/no-hover.png`;

export type Emotion = 'enfadado' | 'triste' | 'contento';

// Fixed option order: top → bottom
export const OPTION_ORDER: Emotion[] = ['triste', 'contento', 'enfadado'];

export interface Situation {
  id: number;
  sentence: string;
  alexEmotion: Emotion;
  correctOption: Emotion;
  sentenceAudio: string;
  feedbackAudio: Record<Emotion, string>;
  feedbackText:  Record<Emotion, string>;
}

export const SITUATIONS: Situation[] = [
  {
    id: 1,
    sentence: 'El domingo tengo que ir a comer con mis abuelos y mis primos. No quiero ir. Mi prima es mala.',
    alexEmotion: 'enfadado',
    correctOption: 'enfadado',
    sentenceAudio: `${AUD}/s1-enfado.mp3`,
    feedbackAudio: {
      enfadado: `${AUD}/s1-correcto-enfado.mp3`,
      triste:   `${AUD}/s1-incorrecto-triste.mp3`,
      contento: `${AUD}/s1-incorrecto-happy.mp3`,
    },
    feedbackText: {
      enfadado: '¡Eso es! El personaje está enfadado.',
      triste:   'Prueba otra vez, no está triste.',
      contento: 'Prueba otra vez, no está contento.',
    },
  },
  {
    id: 2,
    sentence: 'El domingo tengo que ir a comer con mis abuelos y mis primos. No quiero ir porque mi primo preferido no va.',
    alexEmotion: 'triste',
    correctOption: 'triste',
    sentenceAudio: `${AUD}/s2-triste.mp3`,
    feedbackAudio: {
      enfadado: `${AUD}/s2-incorrecto-enfado.mp3`,
      triste:   `${AUD}/s2-correcto-triste.mp3`,
      contento: `${AUD}/s2-incorrecto-happy.mp3`,
    },
    feedbackText: {
      enfadado: 'Prueba otra vez, no está enfadado.',
      triste:   '¡Eso es! El personaje está triste.',
      contento: 'Prueba otra vez, no está contento.',
    },
  },
  {
    id: 3,
    sentence: 'El domingo voy a comer con mis abuelos y mis primos. Seguro que lo paso bien.',
    alexEmotion: 'contento',
    correctOption: 'contento',
    sentenceAudio: `${AUD}/s3.mp3`,
    feedbackAudio: {
      enfadado: `${AUD}/s3-incorrecto-enfado.mp3`,
      triste:   `${AUD}/s3-incorrecto-triste.mp3`,
      contento: `${AUD}/s3-correcto-happy.mp3`,
    },
    feedbackText: {
      enfadado: 'Prueba otra vez, no está enfadado.',
      triste:   'Prueba otra vez, no está triste.',
      contento: '¡Eso es! El personaje está contento.',
    },
  },
];
