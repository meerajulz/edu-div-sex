export const sharedParts = [
  {
    id: 'BRAZO',
    label: 'Brazo',
    image: '/image/escena_1/juego/BRAZO.png',
    sound: '/audio/actividad-1/escena_1/elements/Brazos.mp3',
    position: { top: '39%', left: '61%' }
  },
  {
    id: 'OJO',
    label: 'Ojo',
    image: '/image/escena_1/juego/OJO.png',
    sound: '/audio/actividad-1/escena_1/elements/Ojos.mp3',
    position: { top: '17%', left: '41%' }
  },
  {
    id: 'NARIZ',
    label: 'nariz',
    image: '/image/escena_1/juego/NARIZ.png',
    sound: '/audio/actividad-1/escena_1/elements/Nariz.mp3',
    position: { top: '22%', left: '46%' }
  },
    {
    id: 'BOCA',
    label: 'Boca',
    image: '/image/escena_1/juego/BOCA.png',
    sound: '/audio/actividad-1/escena_1/elements/Boca.mp3',
    position: { top: '32%', left: '45%' }
  },
  {
    id: 'OREJA',
    label: 'oreja',
    image: '/image/escena_1/juego/OREJA.png',
        sound: '/audio/actividad-1/escena_1/elements/Orejas.mp3',
    position: { top: '22%', left: '58%' }
  },
  {
    id: 'PECHO',
    label: 'pecho',
    image: '/image/escena_1/juego/PECHO.png',
        sound: '/audio/actividad-1/escena_1/elements/Pecho.mp3',
    position: { top: '44%', left: '45%' }
  },
  // {
  //   id: 'PENIS',
  //   label: 'penis',
  //   image: '/image/escena_1/juego/PENIS.png',
  //       sound: '/audio/actividad-1/escena_1/elements/Pene.mp3',
  //   position: { top: '64%', left: '45%' }
  // },
    {
    id: 'PIE',
    label: 'pie',
    image: '/image/escena_1/juego/PIE.png',
        sound: '/audio/actividad-1/escena_1/elements/Pies.mp3',
    position: { top: '86%', left: '34%' }
  },
    {
    id: 'PIERNAS',
    label: 'piernas',
    image: '/image/escena_1/juego/PIERNAS.png',
        sound: '/audio/actividad-1/escena_1/elements/Piernas.mp3',
    position: { top: '70%', left: '59%' }
  }
];

export const boyBodyParts = [
    ...sharedParts,
  // All common parts...
  {
    id: 'PENIS',
    label: 'Pene',
    image: '/image/escena_1/juego/PENIS.png',
    sound: '/audio/actividad-1/escena_1/elements/Pene.mp3',
    position: { top: '64%', left: '45%' }
  },
];

export const girlBodyParts = [
    ...sharedParts,
  // All common parts...
  {
    id: 'VULVA',
    label: 'Vulva',
    image: '/image/escena_1/juego/VULVA.png',
    sound: '/audio/actividad-1/escena_1/elements/Vulva.mp3',
    position: { top: '64%', left: '45%' }
  },
];

