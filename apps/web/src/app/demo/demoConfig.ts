// ─── DEMO MODE ──────────────────────────────────────────────────────────────
// This file only exists on the `demo` branch.
// When DEMO_MODE is true the app runs WITHOUT login:
//   /            → /demo (level selector)
//   /auth/login  → /demo
//   Nivel Básico   → /actividad-2/scene1  (Intimidad: "¿Es privado?" video + game)
//   Nivel Avanzado → /aventura-8/scene1   (Abuso: "Zonas privadas" video + game)
//   After the game → /demo/fin?nivel=...
// All visible demo texts live here so they are easy to edit.

export const DEMO_MODE = true;

export type DemoLevel = 'basico' | 'avanzado';

export const DEMO_LEVELS: Record<DemoLevel, {
  label: string;
  title: string;
  description: string;
  url: string;
  image: string;
  gradient: string;
}> = {
  basico: {
    label: 'Nivel Básico',
    title: 'Intimidad',
    description: '¿Qué es privado y qué no? Aprendemos a cuidar nuestra intimidad y la de los demás.',
    url: '/actividad-2/scene1',
    image: '/svg/menu/orbital/activity2-intimidad.svg',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
  },
  avanzado: {
    label: 'Nivel Avanzado',
    title: 'Prevención del abuso',
    description: 'Conocemos nuestras zonas privadas y aprendemos a protegernos.',
    url: '/aventura-8/scene1',
    image: '/svg/menu/orbital/aventura8.svg',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
  },
};

export const DEMO_TEXT = {
  selectorTitle: 'Saludiversex',
  selectorSubtitle:
    'Programa de educación afectivo-sexual adaptado para personas con discapacidad intelectual',
  selectorHint: 'Elige un nivel para probar la demo',

  endTitle: '¡Fin de la demo!',
  endIntro:
    'Esto es solo una muestra. El programa completo incluye 6 aventuras en el Nivel Básico y 8 en el Nivel Avanzado.',
  endHighlights: [
    'Contenidos adaptados al nivel de apoyo de cada persona',
    'Vídeos con personajes cercanos y situaciones de la vida real',
    'Juegos interactivos con audio en cada paso: no hace falta saber leer',
    'Seguimiento del progreso para profesionales y familias',
  ],
  tryOther: 'Probar el otro nivel',
  backToStart: 'Volver al inicio',
};
