/**
 * Menu items shown in the OrbitalCarousel for each supervision level.
 * Add new items here as new advanced activities are created.
 */

export interface MenuLevelItem {
  id: number;
  label: string;
  url: string;
  svgPath: string;
}

// ─── Nivel 1 (Básico) ───────────────────────────────────────────────────────
// All 6 existing activities. Unlock order follows user progress.
export const NIVEL_BASICO_ITEMS: MenuLevelItem[] = [
  {
    id: 1,
    label: 'Aventura 1',
    url: '/actividad-1',
    svgPath: '/svg/menu/orbital/activity1-descubriendo-mi-cuerpo.svg',
  },
  {
    id: 2,
    label: 'Aventura 2',
    url: '/actividad-2',
    svgPath: '/svg/menu/orbital/activity2-intimidad.svg',
  },
  {
    id: 3,
    label: 'Aventura 3',
    url: '/actividad-3',
    svgPath: '/svg/menu/orbital/activity3-placer-sexual.svg',
  },
  {
    id: 4,
    label: 'Aventura 4',
    url: '/actividad-4',
    svgPath: '/svg/menu/orbital/activity4cuido-mi-sexualidad.svg',
  },
  {
    id: 5,
    label: 'Aventura 5',
    url: '/actividad-5',
    svgPath: '/svg/menu/orbital/activity5-entender-respectar.svg',
  },
  {
    id: 6,
    label: 'Aventura 6',
    url: '/actividad-6',
    svgPath: '/svg/menu/orbital/activity6.svg',
  },
];

// ─── Nivel Avanzado ─────────────────────────────────────────────────────────
// Advanced level 2 activities. Add more here as they are built.
export const NIVEL_AVANZADO_ITEMS: MenuLevelItem[] = [
  {
    id: 1,
    label: 'Aventura 1',
    url: '/aventura-1',
    svgPath: '/svg/menu/orbital/activity1-descubriendo-mi-cuerpo.svg',
  },
  {
    id: 2,
    label: 'Aventura 2',
    url: '/aventura-2',
    svgPath: '/svg/menu/orbital/activity2-intimidad.svg',
  },
  {
    id: 3,
    label: 'Aventura 3',
    url: '/aventura-3',
    svgPath: '/svg/menu/orbital/activity3-placer-sexual.svg',
  },
  {
    id: 4,
    label: 'Aventura 4',
    url: '/aventura-4',
    svgPath: '/svg/menu/orbital/activity5-entender-respectar.svg',
  },
  // Add more advanced activities here as they are created
];
