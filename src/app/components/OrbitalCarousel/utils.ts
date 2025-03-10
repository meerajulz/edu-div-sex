import { ContainerSize, Position } from './types';

/**
 * Calculate the position of an item in the carousel
 */
export const calculatePosition = (
  index: number, 
  activeIndex: number, 
  totalItems: number, 
  containerSize: ContainerSize
): Position => {
  const angleStep = 360 / totalItems;
  const angle = ((index - activeIndex) * angleStep) % 360;
  const angleRad = (angle * Math.PI) / 180;
  
  // Keep original radius proportions
  const radiusX = containerSize.width * 0.357; // Maintains proportion of 150/420
  const radiusY = containerSize.height * 0.444; // Maintains proportion of 80/180
  
  const x = Math.sin(angleRad) * radiusX;
  const y = Math.cos(angleRad) * radiusY;
  
  const scale = 0.6 + Math.cos(angleRad) * 0.4;
  const zIndex = Math.round((Math.cos(angleRad) + 1) * 500);

  return {
    x,
    y: y / 2,
    scale,
    zIndex,
    opacity: 0.8 + Math.cos(angleRad) * 0.5
  };
};

/**
 * Play audio with error handling
 */
export const playSound = async (audio: HTMLAudioElement | null): Promise<void> => {
  try {
    if (audio) {
      audio.currentTime = 0;
      await audio.play();
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

/**
 * Get the default carousel items
 */
export const getDefaultItems = () => [
  {
    id: 1,
    label: "Actividad 1",
    url: "/actividad-1",
    svgPath: "/svg/menu/orbital/activity1-descubriendo-mi-cuerpo.svg",
    isUnlocked: true // First module is always unlocked
  },
  {
    id: 2,
    label: "Actividad 2",
    url: "/actividad-2",
    svgPath: "/svg/menu/orbital/activity2-intimidad.svg",
    isUnlocked: true
  },
  {
    id: 3,
    label: "Actividad 3",
    url: "/actividad-3",
    svgPath: "/svg/menu/orbital/activity3-placer-sexual.svg",
    isUnlocked: false
  },
  {
    id: 4,
    label: "Actividad 4",
    url: "/actividad-4",
    svgPath: "/svg/menu/orbital/activity4cuido-mi-sexualidad.svg",
    isUnlocked: false
  },
  {
    id: 5,
    label: "Actividad 5",
    url: "/actividad-5",
    svgPath: "/svg/menu/orbital/activity5-entender-respectar.svg",
    isUnlocked: false
  },
  {
    id: 6,
    label: "Actividad 6",
    url: "/actividad-6",
    svgPath: "/svg/menu/orbital/activity6.svg",
    isUnlocked: false
  }
];