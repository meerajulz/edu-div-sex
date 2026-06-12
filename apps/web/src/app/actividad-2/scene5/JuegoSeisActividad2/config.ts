const IMG = '/image/avanzado/aventura2/juego5';
const PERSONAJES = '/image/avanzado/aventura2/juego5/personajes';
const AUD = '/audio/advance-actividad2/juego5';
const Q1 = `${AUD}/question1`;
const P2 = `${AUD}/second-part`;

export const ELEMENTS = {
  yes:       `${IMG}/elements/yes.png`,
  yesHover:  `${IMG}/elements/yes-hover.png`,
  no:        `${IMG}/elements/no.png`,
  noHover:   `${IMG}/elements/no-hover.png`,
  bocadillo: `${IMG}/elements/Bocadillo.png`,
  boc:       `${IMG}/elements/Boc.png`,
};

export const INTRO_VO_AUDIO  = `${AUD}/VO.mp3`;
export const PART2_TITLE_AUDIO = `${P2}/title.mp3`;

export type CircleId = 'green' | 'yellow' | 'red';

export interface Person {
  id: string;
  name: string;
  correctCircle: CircleId;
  image: string;
  audio: string;
}

export interface Part2Question {
  id: string;
  question: string;
  audio: string;
  correctCircle: CircleId;
  feedbackCorrectAudio: string;
  feedbackIncorrectAudio: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

export const CIRCLES: {
  id: CircleId;
  label: string;
  color: string;
  circleImg: string;
  squareImg: string;
  correctAudio: string;
  incorrectAudio: string;
  correctText: string;
  incorrectText: string;
}[] = [
  {
    id: 'green',
    label: 'Íntimo',
    color: '#22c55e',
    circleImg:  `${IMG}/Verde-circulo.png`,
    squareImg:  `${IMG}/Verde-cuadrado.png`,
    correctAudio:   `${Q1}/VERDE-correcto.mp3`,
    incorrectAudio: `${Q1}/VERDE-INCORRECTO.mp3`,
    correctText:   '¡Muy bien! La familia, los mejores amigos y nuestra pareja son personas de mucha confianza.',
    incorrectText: 'No. Recuerda, solo la familia, los mejores amigos y nuestra pareja son personas de mucha confianza.',
  },
  {
    id: 'yellow',
    label: 'Intimidad compartida',
    color: '#eab308',
    circleImg:  `${IMG}/Amarillo-circulo.png`,
    squareImg:  `${IMG}/Amarillo-cuadrdo.png`,
    correctAudio:   `${Q1}/AMARILLO-correcto.mp3`,
    incorrectAudio: `${Q1}/AMARILLO-incorrecto.mp3`,
    correctText:   '¡Muy bien! Los vecinos y los compañeros son personas que conocemos, pero con menos confianza que la familia y los amigos.',
    incorrectText: 'No. Recuerda, aquí están las personas que conocemos, pero con las que no tenemos tanta confianza.',
  },
  {
    id: 'red',
    label: 'Público',
    color: '#ef4444',
    circleImg:  `${IMG}/Rojo-circulo.png`,
    squareImg:  `${IMG}/Rojo-cuadrdo.png`,
    correctAudio:   `${Q1}/RED_CORRECT.mp3`,
    incorrectAudio: `${Q1}/RED-INCORRECT.mp3`,
    correctText:   '¡Muy bien! Los desconocidos son personas que vemos por la calle o en las tiendas, pero no sabemos cómo se llaman ni tenemos confianza.',
    incorrectText: 'No. Recuerda, los desconocidos son personas que vemos por la calle pero con las que no tenemos confianza.',
  },
];

export const PEOPLE: Person[] = [
  {
    id: 'cris',
    name: 'Cris',
    correctCircle: 'green',
    image: `${PERSONAJES}/Amiga.png`,
    audio: `${Q1}/cris.mp3`,
  },
  {
    id: 'mama',
    name: 'Mamá',
    correctCircle: 'green',
    image: `${PERSONAJES}/Madre.png`,
    audio: `${Q1}/mama.mp3`,
  },
  {
    id: 'companero',
    name: 'Compañero',
    correctCircle: 'yellow',
    image: `${PERSONAJES}/Companero.png`,
    audio: `${Q1}/compi.mp3`,
  },
  {
    id: 'pareja',
    name: 'Pareja',
    correctCircle: 'green',
    image: `${PERSONAJES}/Pareja.png`,
    audio: `${Q1}/pareja.mp3`,
  },
  {
    id: 'educadora',
    name: 'María',
    correctCircle: 'green',
    image: `${PERSONAJES}/Educadora.png`,
    audio: `${Q1}/maria-educadora.mp3`,
  },
  {
    id: 'cajero',
    name: 'Cajero',
    correctCircle: 'red',
    image: `${PERSONAJES}/Cajera.png`,
    audio: `${Q1}/cajero.mp3`,
  },
  {
    id: 'conductor',
    name: 'Conductor',
    correctCircle: 'red',
    image: `${PERSONAJES}/Bus.png`,
    audio: `${Q1}/conductor-bus.mp3`,
  },
];

export const PART2_QUESTIONS: Part2Question[] = [
  {
    id: 'abrazo',
    question: '¿A quién saludaría con un abrazo?',
    audio: `${P2}/q1.mp3`,
    correctCircle: 'green',
    feedbackCorrectAudio:   `${P2}/q1C.mp3`,
    feedbackIncorrectAudio: `${P2}/q1I.mp3`,
    feedbackCorrect:   '¡Muy bien! Las personas del círculo íntimo nos quieren mucho y nos cuidan.',
    feedbackIncorrect: 'Incorrecto, no podemos saludar con un abrazo a personas que conocemos poco o que no conocemos.',
  },
  {
    id: 'secreto',
    question: '¿A quién le contaría un secreto?',
    audio: `${P2}/Q2.mp3`,
    correctCircle: 'green',
    feedbackCorrectAudio:   `${P2}/Q2C.mp3`,
    feedbackIncorrectAudio: `${P2}/Q2I.mp3`,
    feedbackCorrect:   '¡Muy bien! Las personas del círculo íntimo nos quieren mucho y nos cuidan.',
    feedbackIncorrect: 'Incorrecto, no podemos contar un secreto a personas que conocemos poco o que no conocemos.',
  },
  {
    id: 'problema',
    question: '¿A quién le contaría un problema?',
    audio: `${P2}/Q3.mp3`,
    correctCircle: 'green',
    feedbackCorrectAudio:   `${P2}/Q3C.mp3`,
    feedbackIncorrectAudio: `${P2}/Q3I.mp3`,
    feedbackCorrect:   '¡Muy bien! Las personas del círculo íntimo nos quieren mucho y nos cuidan.',
    feedbackIncorrect: 'Incorrecto, no podemos contar un problema a personas que conocemos poco o que no conocemos.',
  },
  {
    id: 'favor',
    question: '¿A quién le pediría un favor?',
    audio: `${P2}/Q4.mp3`,
    correctCircle: 'green',
    feedbackCorrectAudio:   `${P2}/Q4C.mp3`,
    feedbackIncorrectAudio: `${P2}/Q4I.mp3`,
    feedbackCorrect:   '¡Muy bien! Las personas del círculo íntimo nos quieren mucho y nos cuidan.',
    feedbackIncorrect: 'Incorrecto, no podemos pedirle un favor a personas que conocemos poco o que no conocemos.',
  },
  {
    id: 'oido',
    question: '¿A quién le hablaría al oído?',
    audio: `${P2}/Q5.mp3`,
    correctCircle: 'green',
    feedbackCorrectAudio:   `${P2}/Q5C.mp3`,
    feedbackIncorrectAudio: `${P2}/Q5I.mp3`,
    feedbackCorrect:   '¡Muy bien! Las personas del círculo íntimo nos quieren mucho y nos cuidan.',
    feedbackIncorrect: 'No, debemos mantener la distancia cuando hablamos con personas que conocemos poco o que no conocemos.',
  },
  {
    id: 'casa',
    question: '¿A quién no invitaría a su casa?',
    audio: `${P2}/Q6.mp3`,
    correctCircle: 'red',
    feedbackCorrectAudio:   `${P2}/Q6C.mp3`,
    feedbackIncorrectAudio: `${P2}/Q6I.mp3`,
    feedbackCorrect:   'Recuerda, a las personas desconocidas o que conocemos poco no debemos dejarles entrar en nuestro espacio íntimo.',
    feedbackIncorrect: 'No, a las personas cercanas las podemos invitar a casa.',
  },
];

export function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
