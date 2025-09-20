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
 * Activity progress interface for OrbitalCarousel
 */
export interface OrbitalActivityProgress {
  activityId: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  completedAt?: string;
}

/**
 * Check if activity is unlocked based on user progress
 */
export const checkActivityUnlocked = async (activityId: number): Promise<boolean> => {
  try {
    const response = await fetch('/api/user/activity-progress');
    
    if (!response.ok) {
      // Fallback: only activity 1 unlocked
      return activityId === 1;
    }
    
    const data = await response.json();
    const activityCompletion = data.activityCompletion || {};
    
    // Activity 1 is always unlocked
    if (activityId === 1) return true;
    
    // Check if previous activity is completed
    let lastCompletedActivity = 0;
    for (let i = 1; i < activityId; i++) {
      const activityData = activityCompletion[i];
      if (activityData?.isCompleted) {
        lastCompletedActivity = i;
      }
    }
    
    // Activity is unlocked if previous activity is completed
    return activityId <= lastCompletedActivity + 1;
    
  } catch (error) {
    console.error('❌ Failed to check activity progress:', error);
    // Fallback: only activity 1 unlocked
    return activityId === 1;
  }
};

/**
 * Get the next unlocked activity ID
 */
export const getNextUnlockedActivity = async (): Promise<number | null> => {
  try {
    const progress = await getOrbitalActivityProgress();
    
    // Find the first unlocked activity that hasn't been completed
    const nextActivity = progress.find(p => p.isUnlocked && !p.isCompleted);
    return nextActivity ? nextActivity.activityId : null;
    
  } catch (error) {
    console.error('❌ Failed to get next unlocked activity:', error);
    return 1; // Default to activity 1
  }
};

/**
 * Get all activities progress for OrbitalCarousel
 */
export const getOrbitalActivityProgress = async (): Promise<OrbitalActivityProgress[]> => {
  try {
    const response = await fetch('/api/user/activity-progress');
    
    if (!response.ok) {
      // Fallback: only activity 1 unlocked
      return [
        { activityId: 1, isCompleted: false, isUnlocked: true },
        { activityId: 2, isCompleted: false, isUnlocked: false },
        { activityId: 3, isCompleted: false, isUnlocked: false },
        { activityId: 4, isCompleted: false, isUnlocked: false },
        { activityId: 5, isCompleted: false, isUnlocked: false },
        { activityId: 6, isCompleted: false, isUnlocked: false },
      ];
    }
    
    const data = await response.json();
    const activityCompletion = data.activityCompletion || {};
    const progress: OrbitalActivityProgress[] = [];
    
    // Activity 1 is always unlocked
    let lastCompletedActivity = 0;
    
    // Process activities 1-6
    for (let i = 1; i <= 6; i++) {
      const activityData = activityCompletion[i];
      const isCompleted = activityData ? activityData.isCompleted : false;
      
      if (isCompleted) {
        lastCompletedActivity = i;
      }
      
      // Activity is unlocked if it's activity 1 or previous activity is completed
      const isUnlocked = i === 1 || i <= lastCompletedActivity + 1;
      
      progress.push({
        activityId: i,
        isCompleted,
        isUnlocked,
        completedAt: activityData?.lastUpdated
      });
    }
    
    return progress;
    
  } catch (error) {
    console.error('❌ Failed to fetch orbital activity progress:', error);
    // Fallback: only activity 1 unlocked
    return [
      { activityId: 1, isCompleted: false, isUnlocked: true },
      { activityId: 2, isCompleted: false, isUnlocked: false },
      { activityId: 3, isCompleted: false, isUnlocked: false },
      { activityId: 4, isCompleted: false, isUnlocked: false },
      { activityId: 5, isCompleted: false, isUnlocked: false },
      { activityId: 6, isCompleted: false, isUnlocked: false },
    ];
  }
};

/**
 * Get the default carousel items with dynamic unlock status
 */
export const getDefaultItems = async () => {
  const progress = await getOrbitalActivityProgress();
  
  return [
    {
      id: 1,
      label: "Aventura 1",
      url: "/actividad-1", // Updated to go to activity menu
      svgPath: "/svg/menu/orbital/activity1-descubriendo-mi-cuerpo.svg",
      isUnlocked: progress.find(p => p.activityId === 1)?.isUnlocked || true
    },
    {
      id: 2,
      label: "Aventura 2", 
      url: "/actividad-2", // Updated to match ActivityLabels
      svgPath: "/svg/menu/orbital/activity2-intimidad.svg",
      isUnlocked: progress.find(p => p.activityId === 2)?.isUnlocked || false
    },
    {
      id: 3,
      label: "Aventura 3",
      url: "/actividad-3", // Updated to go to activity menu page
      svgPath: "/svg/menu/orbital/activity3-placer-sexual.svg",
      isUnlocked: progress.find(p => p.activityId === 3)?.isUnlocked || false
    },
    {
      id: 4,
      label: "Aventura 4",
      url: "/actividad-4/scene1", // Updated to match ActivityLabels
      svgPath: "/svg/menu/orbital/activity4cuido-mi-sexualidad.svg",
      isUnlocked: progress.find(p => p.activityId === 4)?.isUnlocked || false
    },
    {
      id: 5,
      label: "Actividad 5",
      url: "/actividad-5/scene1", // Updated to match ActivityLabels
      svgPath: "/svg/menu/orbital/activity5-entender-respectar.svg",
      isUnlocked: progress.find(p => p.activityId === 5)?.isUnlocked || false
    },
    {
      id: 6,
      label: "Actividad 6",
      url: "/actividad-6/scene1", // Updated to match ActivityLabels
      svgPath: "/svg/menu/orbital/activity6.svg",
      isUnlocked: progress.find(p => p.activityId === 6)?.isUnlocked || false
    }
  ];
};