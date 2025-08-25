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
  
  // Get the spacing factor (if it exists in containerSize, otherwise default to 1)
  const spacing = containerSize.spacing || 1;
  
  // Apply spacing factor to reduce radius on smaller screens
  const radiusX = containerSize.width * 0.357 * spacing; // Maintains proportion of 150/420
  const radiusY = containerSize.height * 0.444 * spacing; // Maintains proportion of 80/180
  
  const x = Math.sin(angleRad) * radiusX;
  const y = Math.cos(angleRad) * radiusY;
  
  // Adjust scale for small screens
  let scaleFactor = 0.4;
  if (containerSize.iconSize < 70) {
    scaleFactor = 0.3; // Less difference between front and back items on mobile
  }
  
  const scale = 0.6 + Math.cos(angleRad) * scaleFactor;
  const zIndex = Math.round((Math.cos(angleRad) + 1) * 500);
  
  // Adjust opacity for better visibility on small screens
  const opacityFactor = containerSize.iconSize < 70 ? 0.4 : 0.5;
  const opacity = 0.8 + Math.cos(angleRad) * opacityFactor;

  return {
    x,
    y: y / 2,
    scale,
    zIndex,
    opacity
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
    label: "Aventura 1",
    url: "/actividad-1",
    svgPath: "/svg/menu/orbital/activity1-descubriendo-mi-cuerpo.svg",
    isUnlocked: true // First module is always unlocked
  },
  {
    id: 2,
    label: "Aventura 2",
    url: "/actividad-2",
    svgPath: "/svg/menu/orbital/activity2-intimidad.svg",
    isUnlocked: true
  },
  {
    id: 3,
    label: "Aventura 3",
    url: "/actividad-3",
    svgPath: "/svg/menu/orbital/activity3-placer-sexual.svg",
    isUnlocked: true
  },
  {
    id: 4,
    label: "Aventura 4",
    url: "/actividad-4",
    svgPath: "/svg/menu/orbital/activity4cuido-mi-sexualidad.svg",
    isUnlocked: false
  },
  // {
  //   id: 5,
  //   label: "Actividad 5",
  //   url: "/actividad-5",
  //   svgPath: "/svg/menu/orbital/activity5-entender-respectar.svg",
  //   isUnlocked: false
  // },
  // {
  //   id: 6,
  //   label: "Actividad 6",
  //   url: "/actividad-6",
  //   svgPath: "/svg/menu/orbital/activity6.svg",
  //   isUnlocked: false
  // }
];