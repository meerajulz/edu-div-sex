export const draggables = [
  {
    id: 'AXILA',
    label: 'Axila',
    image: '/image/juego_2/pelo.png',
    sound: '/audio/actividad-1/escena_1/elements/vello.mp3',
  },
  {
    id: 'PECHO',
    label: 'Pecho',
    image: '/image/juego_2/pecho.png',
    sound: '/audio/actividad-1/escena_1/elements/Pecho.mp3',
  },
  {
    id: 'VAGINA',
    label: 'Vagina',
    image: '/image/juego_2/vagina.png',
    sound: '/audio/actividad-1/escena_1/elements/Vulva.mp3',
  }
];

// acceptsId: which draggable ID is correct for this drop zone
export const dropZones = [
  { id: 'AXILA_IZQ', acceptsId: 'AXILA', position: { top: '23%', left: '56%' } },
  { id: 'AXILA_DER', acceptsId: 'AXILA', position: { top: '23%', left: '74%' } },
  { id: 'PECHO',     acceptsId: 'PECHO', position: { top: '38%', left: '66%' } },
  { id: 'VAGINA',    acceptsId: 'VAGINA', position: { top: '61%', left: '66%' } },
];
