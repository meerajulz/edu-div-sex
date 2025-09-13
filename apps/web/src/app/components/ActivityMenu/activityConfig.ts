export interface ActivitySection {
  id: number;
  title: string;
  description?: string;
  scenes: string[]; // Array of scene paths
  isUnlocked: boolean;
  isCompleted: boolean;
  activeImage: string;
  inactiveImage: string;
  soundClick: string;
  xPosition?: number;
  yPosition?: number;
  zPosition?: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  delay?: number;
  brightness?: number;
}

export interface ActivityConfig {
  activityId: number;
  activitySlug: string;
  title: string;
  sections: ActivitySection[];
}

// Activity 1 Configuration
export const ACTIVITY_1_CONFIG: ActivityConfig = {
  activityId: 1,
  activitySlug: 'actividad-1',
  title: 'Descubriendo Mi Cuerpo',
  sections: [
    {
      id: 1,
      title: "EL CUERPO DE LOS NIÑOS Y LAS NIÑAS",
      scenes: ["/actividad-1/scene1"],
      isUnlocked: true, // First section always unlocked
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      soundClick: "/audio/labels/actividad1.mp3",
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 18,
      rotateY: -15,
      delay: 0.2,
      brightness: 1
    },
    {
      id: 2,
      title: "¿QUÉ HA CAMBIADO?",
      scenes: ["/actividad-1/scene2", "/actividad-1/scene3", "/actividad-1/scene4"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-2-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-2-hover.svg",
      soundClick: "/audio/labels/actividad2.mp3",
      xPosition: 100,
      yPosition: 350,
      zPosition: -50,
      scale: 0.9,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 0.5
    },
    {
      id: 3,
      title: "¿QUÉ ES UNA ERECCIÓN?",
      scenes: ["/actividad-1/scene5", "/actividad-1/scene6"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-3-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-3-hover.svg",
      soundClick: "/audio/labels/actividad3.mp3",
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 0.9,
      rotateX: 0,
      rotateY: 20,
      delay: 0.9,
      brightness: 0.5
    },
    {
      id: 4,
      title: "EL CUERPO DE LOS MAYORES",
      scenes: ["/actividad-1/scene7"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      soundClick: "/audio/labels/actividad4.mp3",
      xPosition: 40,
      yPosition: 350,
      zPosition: -500,
      scale: 1,
      rotateX: 15,
      rotateY: -10,
      delay: 1.1,
      brightness: 0.5
    }
  ]
};

// Activity 2 Configuration
export const ACTIVITY_2_CONFIG: ActivityConfig = {
  activityId: 2,
  activitySlug: 'actividad-2',
  title: 'Intimidad',
  sections: [
    {
      id: 1,
      title: "¿ES PRIVADO?",
      scenes: ["/actividad-2/scene1"],
      isUnlocked: true, // First section always unlocked
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      soundClick: "/audio/labels/actividad1.mp3",
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 18,
      rotateY: -15,
      delay: 0.2,
      brightness: 1
    },
    {
      id: 2,
      title: "MI CUERPO Y MI ESPACIO",
      scenes: ["/actividad-2/scene2"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-2-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-2-hover.svg",
      soundClick: "/audio/labels/actividad2.mp3",
      xPosition: 100,
      yPosition: 350,
      zPosition: -50,
      scale: 0.9,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 0.5
    },
    {
      id: 3,
      title: "¿QUÉ ES PRIVADO Y QUÉ ES PÚBLICO?",
      scenes: ["/actividad-2/scene3"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-3-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-3-hover.svg",
      soundClick: "/audio/labels/actividad3.mp3",
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 0.9,
      rotateX: 0,
      rotateY: 20,
      delay: 0.9,
      brightness: 0.5
    },
    {
      id: 4,
      title: "¿QUÉ HACER SI ALGUIEN NO RESPETA TU INTIMIDAD?",
      scenes: ["/actividad-2/scene4"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      soundClick: "/audio/labels/actividad4.mp3",
      xPosition: 40,
      yPosition: 350,
      zPosition: -500,
      scale: 1,
      rotateX: 15,
      rotateY: -10,
      delay: 1.1,
      brightness: 0.5
    },
    {
      id: 5,
      title: "TU COFRE DE LA INTIMIDAD",
      scenes: ["/actividad-2/scene5"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-active.svg", // We can create a specific one later
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      soundClick: "/audio/labels/actividad1.mp3", // We can add specific audio later
      xPosition: -100,
      yPosition: 250,
      zPosition: -700,
      scale: 1,
      rotateX: 10,
      rotateY: 30,
      delay: 1.4,
      brightness: 0.5
    }
  ]
};

// Helper functions
export function getActivityConfig(activityId: number): ActivityConfig | null {
  switch (activityId) {
    case 1:
      return ACTIVITY_1_CONFIG;
    case 2:
      return ACTIVITY_2_CONFIG;
    default:
      return null;
  }
}

export function getNextUnlockedSection(sections: ActivitySection[]): ActivitySection | null {
  return sections.find(section => section.isUnlocked && !section.isCompleted) || null;
}