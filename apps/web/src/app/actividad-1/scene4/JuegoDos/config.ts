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

// acceptsId: which draggable ID is correct for this drop zone.
// position = where the visible circle marker sits (the "aim here" hint for kids).
// hit = the invisible drop area (rectangle). Big, non-overlapping vertical bands
//   (armpits on top, a wide pecho band in the middle, vagina at the bottom) so a
//   drop always maps to exactly one body part and every target is easy to hit.
//   All values are % of the image box (which is locked to the image aspect ratio).
export const dropZones = [
  { id: 'AXILA_IZQ', acceptsId: 'AXILA', position: { top: '24%', left: '59%' }, hit: { top: '13%', left: '48%', width: '20%', height: '22%' } },
  { id: 'AXILA_DER', acceptsId: 'AXILA', position: { top: '24%', left: '77%' }, hit: { top: '13%', left: '68%', width: '22%', height: '22%' } },
  { id: 'PECHO',     acceptsId: 'PECHO', position: { top: '46%', left: '68%' }, hit: { top: '35%', left: '48%', width: '42%', height: '22%' } },
  { id: 'VAGINA',    acceptsId: 'VAGINA', position: { top: '66%', left: '68%' }, hit: { top: '57%', left: '52%', width: '34%', height: '21%' } },
];
