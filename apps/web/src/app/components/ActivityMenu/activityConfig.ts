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
      soundClick: "/audio/labels/mAct1/a1.mp3",
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 18,
      rotateY: 15,
      delay: 0.2,
      brightness: 1
    },
    {
      id: 2,
      title: "¿QUÉ HA CAMBIADO?",
      scenes: ["/actividad-1/scene2", "/actividad-1/scene3", "/actividad-1/scene4", "/actividad-1/scene5"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-2-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-2-hover.svg",
      soundClick: "/audio/labels/mAct1/a2.mp3",
      xPosition: 100,
      yPosition: 350,
      zPosition: -50,
      scale: 1,
      rotateX: 18,
      rotateY: -45,
      delay: 0.5,
      brightness: 1
    },
    {
      id: 3,
      title: "¿QUÉ ES UNA ERECCIÓN?",
      scenes: ["/actividad-1/scene6"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-3-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-3-hover.svg",
      soundClick: "/audio/labels/mAct1/a3.mp3",
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.2,
      rotateX: 0,
      rotateY: 10,
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
      soundClick: "/audio/labels/mAct1/a4.mp3",
      xPosition: 100,
      yPosition: 250,
      zPosition: -300,
      scale: 1.2,
      rotateX: 28,
      rotateY: 20,
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
      soundClick: "/audio/labels/mAct2/a1.mp3",
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 28,
      rotateY: 15,
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
      soundClick: "/audio/labels/mAct2/a2.mp3",
      xPosition: 100,
      yPosition: 380,
      zPosition: -50,
      scale: 1.0,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 1
    },
    {
      id: 3,
      title: "¿QUÉ ES PRIVADO Y QUÉ ES PÚBLICO?",
      scenes: ["/actividad-2/scene3"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-3-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-3-hover.svg",
      soundClick: "/audio/labels/mAct2/a3.mp3",
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.1,
      rotateX: 0,
      rotateY: 20,
      delay: 0.9,
      brightness: 1
    },
    {
      id: 4,
      title: "¿QUÉ HACER SI ALGUIEN NO RESPETA TU INTIMIDAD?",
      scenes: ["/actividad-2/scene4"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      soundClick: "/audio/labels/mAct2/a4.mp3",
      xPosition: 80,
      yPosition: 350,
      zPosition: -500,
      scale: 1.2,
      rotateX: 15,
      rotateY: -20,
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
      soundClick: "/audio/labels/mAct2/a5.mp3", // We can add specific audio later
      xPosition: -50,
      yPosition: 250,
      zPosition: -700,
      scale: 1.3,
      rotateX: 10,
      rotateY: 30,
      delay: 1.4,
      brightness: 1
    }
  ]
};

// Activity 3 Configuration
export const ACTIVITY_3_CONFIG: ActivityConfig = {
  activityId: 3,
  activitySlug: 'actividad-3',
  title: 'Placer sexual',
  sections: [
    {
      id: 1,
      title: "¿QUÉ PASA CUANDO ME EXCITO?",
      scenes: ["/actividad-3/scene1"],
      isUnlocked: true, // First section always unlocked
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      soundClick: "/audio/labels/mAct3/a1.mp3",
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
      title: "EL ORGASMO MASCULINO: LA EYACULACIÓN",
      scenes: ["/actividad-3/scene1-1"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-2-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-2-hover.svg",
      soundClick: "/audio/labels/mAct3/a2.mp3",
      xPosition: 100,
      yPosition: 350,
      zPosition: -50,
      scale: 1,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 1
    },
    {
      id: 3,
      title: "EL ORGASMO FEMENINO",
      scenes: ["/actividad-3/scene1-2"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-3-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-3-hover.svg",
      soundClick: "/audio/labels/mAct3/a3.mp3",
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.1,
      rotateX: 0,
      rotateY: 20,
      delay: 0.7,
      brightness: 1
    },
    {
      id: 4,
      title: "LA MASTURBACIÓN",
      scenes: ["/actividad-3/scene2"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      soundClick: "/audio/labels/mAct3/a4.mp3",
      xPosition: 50,
      yPosition: 250,
      zPosition: -500,
      scale: 1.2,
      rotateX: 0,
      rotateY: -30,
      delay: 0.9,
      brightness: 1
    }
  ]
};

// Activity 4 Configuration
export const ACTIVITY_4_CONFIG: ActivityConfig = {
  activityId: 4,
  activitySlug: 'actividad-4',
  title: 'Higiene Sexual',
  sections: [
    {
      id: 1,
      title: "LA HIGIENE DE LOS CHICOS Y LAS CHICAS",
      scenes: ["/actividad-4/scene1"],
      isUnlocked: true, // First section always unlocked
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      soundClick: "/audio/labels/mAct4/a1.mp3",
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 18,
      rotateY: 15,
      delay: 0.2,
      brightness: 1
    },
    {
      id: 2,
      title: "HIGIENE MENSTRUAL",
      scenes: ["/actividad-4/scene2"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-2-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-2-hover.svg",
      soundClick: "/audio/labels/mAct4/a2.mp3",
      xPosition: 100,
      yPosition: 350,
      zPosition: -50,
      scale: 1.1,
      rotateX: 0,
      rotateY: -25,
      delay: 0.5,
      brightness: 1
    }
  ]
};

// Activity 5 Configuration
export const ACTIVITY_5_CONFIG: ActivityConfig = {
  activityId: 5,
  activitySlug: 'actividad-5',
  title: 'Entender y respetar',
  sections: [
    {
      id: 1,
      title: "¿QUÉ DICE MI CARA?",
      scenes: ["/actividad-5/scene1"],
      isUnlocked: true, // First section always unlocked
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      soundClick: "/audio/labels/mAct5/a1.mp3",
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 18,
      rotateY: 15,
      delay: 0.2,
      brightness: 1
    },
    {
      id: 2,
      title: "JUEGO 1: ¿QUÉ DICEN MI CARA Y MI TONO DE VOZ?",
      scenes: ["/actividad-5/scene1-1"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-2-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-2-hover.svg",
      soundClick: "/audio/labels/mAct5/a2.mp3",
      xPosition: 120,
      yPosition: 380,
      zPosition: -40,
      scale: 1.1,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 1
    },
    {
      id: 3,
      title: "JUEGO 2: ¿QUÉ CARA PONDRÁ?",
      scenes: ["/actividad-5/scene1-2"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-3-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-3-hover.svg",
      soundClick: "/audio/labels/mAct5/a3.mp3",
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.1,
      rotateX: 0,
      rotateY: 20,
      delay: 0.9,
      brightness: 1
    },
    {
      id: 4,
      title: "APRENDEMOS A LIGAR",
      scenes: ["/actividad-5/scene2"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      soundClick: "/audio/labels/mAct5/a4.mp3",
      xPosition: 30,
      yPosition: 300,
      zPosition: -500,
      scale: 1.2,
      rotateX: 15,
      rotateY: -25,
      delay: 1.1,
      brightness: 1
    }
  ]
};

// Activity 6 Configuration
export const ACTIVITY_6_CONFIG: ActivityConfig = {
  activityId: 6,
  activitySlug: 'actividad-6',
  title: 'Abuso',
  sections: [
    {
      id: 1,
      title: "MIS PARTES PRIVADAS",
      scenes: ["/actividad-6/scene1"],
      isUnlocked: true, // First section always unlocked
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      soundClick: "/audio/labels/mAct6/a1.mp3",
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 18,
      rotateY: 35,
      delay: 0.2,
      brightness: 1
    },
    {
      id: 2,
      title: "ME DEFIENDO",
      scenes: ["/actividad-6/scene2"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-2-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-2-hover.svg",
      soundClick: "/audio/labels/mAct6/a2.mp3",
      xPosition: 100,
      yPosition: 400,
      zPosition: -50,
      scale: 1.1,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 1
    },
    {
      id: 3,
      title: "SECRETOS BUENOS Y MALOS",
      scenes: ["/actividad-6/scene3"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-3-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-3-hover.svg",
      soundClick: "/audio/labels/mAct6/a3.mp3",
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.1,
      rotateX: 0,
      rotateY: 20,
      delay: 0.9,
      brightness: 1
    },
    {
      id: 4,
      title: "RESPETAMOS",
      scenes: ["/actividad-6/scene4"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      soundClick: "/audio/labels/mAct6/a4.mp3",
      xPosition: 150,
      yPosition: 320,
      zPosition: -500,
      scale: 1.2,
      rotateX: 15,
      rotateY: -10,
      delay: 1.1,
      brightness: 1
    },
    {
      id: 5,
      title: "¿QUÉ HACER SI SUCEDE?",
      scenes: ["/actividad-6/scene4-1"],
      isUnlocked: false,
      isCompleted: false,
      activeImage: "/svg/menu-actividad/cartell-active.svg", // We can create a specific one later
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      soundClick: "/audio/labels/mAct6/a5.mp3", 
      xPosition: -30,
      yPosition: 250,
      zPosition: -700,
      scale: 1.3,
      rotateX: 10,
      rotateY: 30,
      delay: 1.4,
      brightness: 1
    }
  ]
};

// Aventura 3 – Nivel Avanzado
export const AVENTURA_3_CONFIG: ActivityConfig = {
  activityId: 13,
  activitySlug: 'aventura-3',
  title: 'Placer Sexual',
  sections: [
    {
      id: 1,
      title: '¿QUÉ PASA CUANDO ME EXCITO?',
      scenes: ['/aventura-3/scene1'],
      isUnlocked: true,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-hover.svg',
      soundClick: '/audio/labels/mAct3/a1.mp3',
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 28,
      rotateY: 15,
      delay: 0.2,
      brightness: 1,
    },
    {
      id: 2,
      title: 'EL ORGASMO MASCULINO',
      scenes: ['/aventura-3/scene2'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-2-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-2-hover.svg',
      soundClick: '/audio/labels/mAct3/a2.mp3',
      xPosition: 100,
      yPosition: 380,
      zPosition: -50,
      scale: 1.0,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 1,
    },
    {
      id: 3,
      title: 'JUEGO: ¿QUÉ PASA CUANDO ME EXCITO?',
      scenes: ['/aventura-3/juego1'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-3-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-3-hover.svg',
      soundClick: '/audio/labels/mAct3/a3.mp3',
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.1,
      rotateX: 0,
      rotateY: 20,
      delay: 0.9,
      brightness: 0.5,
    },
    {
      id: 4,
      title: 'EL ORGASMO FEMENINO',
      scenes: ['/aventura-3/scene3'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-4-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-4-hover.svg',
      soundClick: '/audio/labels/mAct3/a4.mp3',
      xPosition: 80,
      yPosition: 350,
      zPosition: -500,
      scale: 1.2,
      rotateX: 15,
      rotateY: -20,
      delay: 1.1,
      brightness: 0.5,
    },
    {
      id: 5,
      title: 'LA MASTURBACIÓN',
      scenes: ['/aventura-3/scene4'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-hover.svg',
      soundClick: '/audio/labels/mAct3/a4.mp3',
      xPosition: -180,
      yPosition: 250,
      zPosition: -850,
      scale: 1.3,
      rotateX: 10,
      rotateY: 30,
      delay: 1.4,
      brightness: 0.5,
    },
    {
      id: 6,
      title: 'PRÓXIMAMENTE',
      scenes: ['/aventura-3/scene5'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-2-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-2-hover.svg',
      soundClick: '/audio/labels/mAct3/a4.mp3',
      xPosition: 180,
      yPosition: 320,
      zPosition: -1050,
      scale: 1.4,
      rotateX: 5,
      rotateY: -15,
      delay: 1.7,
      brightness: 0.5,
    },
  ],
};

// Aventura 2 – Nivel Avanzado
export const AVENTURA_2_CONFIG: ActivityConfig = {
  activityId: 12,
  activitySlug: 'aventura-2',
  title: 'Intimidad',
  sections: [
    {
      id: 1,
      title: '¿ES PRIVADO?',
      scenes: ['/aventura-2/scene1'],
      isUnlocked: true,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-hover.svg',
      soundClick: '/audio/labels/mAct2/a1.mp3',
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 28,
      rotateY: 15,
      delay: 0.2,
      brightness: 1,
    },
    {
      id: 2,
      title: 'MI CUERPO Y MI ESPACIO',
      scenes: ['/aventura-2/scene2'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-2-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-2-hover.svg',
      soundClick: '/audio/labels/mAct2/a2.mp3',
      xPosition: 100,
      yPosition: 380,
      zPosition: -50,
      scale: 1.0,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 1,
    },
    {
      id: 3,
      title: '¿QUÉ ES PRIVADO Y QUÉ ES PÚBLICO?',
      scenes: ['/aventura-2/scene3'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-3-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-3-hover.svg',
      soundClick: '/audio/labels/mAct2/a3.mp3',
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.1,
      rotateX: 0,
      rotateY: 20,
      delay: 0.9,
      brightness: 0.5,
    },
    {
      id: 4,
      title: '¿QUÉ HACER SI ALGUIEN NO RESPETA TU INTIMIDAD?',
      scenes: ['/aventura-2/scene4'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-4-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-4-hover.svg',
      soundClick: '/audio/labels/mAct2/a4.mp3',
      xPosition: 80,
      yPosition: 350,
      zPosition: -500,
      scale: 1.2,
      rotateX: 15,
      rotateY: -20,
      delay: 1.1,
      brightness: 0.5,
    },
    {
      id: 5,
      title: 'PRÓXIMAMENTE',
      scenes: ['/aventura-2/scene5'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-hover.svg',
      soundClick: '/audio/labels/mAct2/a5.mp3',
      xPosition: -180,
      yPosition: 250,
      zPosition: -850,
      scale: 1.3,
      rotateX: 10,
      rotateY: 30,
      delay: 1.4,
      brightness: 0.5,
    },
    {
      id: 6,
      title: 'TU COFRE DE LA INTIMIDAD',
      scenes: ['/aventura-2/scene6'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-2-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-2-hover.svg',
      soundClick: '/audio/labels/mAct2/a5.mp3',
      xPosition: 180,
      yPosition: 320,
      zPosition: -1050,
      scale: 1.4,
      rotateX: 5,
      rotateY: -15,
      delay: 1.7,
      brightness: 0.5,
    },
  ],
};

// Aventura 1 – Nivel Avanzado
// Reuses scenes from actividad-1 and actividad-4 in a new order,
// plus new placeholder scenes under /aventura-1/.
export const AVENTURA_1_CONFIG: ActivityConfig = {
  activityId: 11,
  activitySlug: 'aventura-1',
  title: 'Descubriendo mi sexualidad',
  sections: [
    {
      id: 1,
      title: 'NUESTRO CUERPO CAMBIA',
      scenes: ['/aventura-1/scene1'],
      isUnlocked: true,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-hover.svg',
      soundClick: '/audio/labels/mAct1/a1.mp3',
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 18,
      rotateY: 15,
      delay: 0.2,
      brightness: 1,
    },
    {
      id: 2,
      title: 'CAMBIOS EN LA PUBERTAD',
      scenes: [
        '/aventura-1/scene2', // Cambios en Nico
        '/aventura-1/scene3', // Erección
        '/aventura-1/juego1', // Juego 1 – ¿Qué ha cambiado?
      ],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-2-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-2-hover.svg',
      soundClick: '/audio/labels/mAct1/a2.mp3',
      xPosition: 100,
      yPosition: 350,
      zPosition: -50,
      scale: 1,
      rotateX: 18,
      rotateY: -45,
      delay: 0.5,
      brightness: 1,
    },
    {
      id: 3,
      title: 'HIGIENE ÍNTIMA',
      scenes: [
        '/aventura-1/scene4', // Cuido de mi higiene
        '/aventura-1/juego2', // Juego 2 – Ayuda en la higiene
      ],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-3-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-3-hover.svg',
      soundClick: '/audio/labels/mAct1/a3.mp3',
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.2,
      rotateX: 0,
      rotateY: 10,
      delay: 0.9,
      brightness: 0.5,
    },
    {
      id: 4,
      title: 'EL CUERPO DE LOS MAYORES',
      scenes: [
        '/aventura-1/scene7', // El cuerpo de los mayores
      ],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-4-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-4-hover.svg',
      soundClick: '/audio/labels/mAct1/a4.mp3',
      xPosition: 100,
      yPosition: 250,
      zPosition: -300,
      scale: 1.2,
      rotateX: 28,
      rotateY: 20,
      delay: 1.1,
      brightness: 0.5,
    },
  ],
};

// Aventura 4 – Nivel Avanzado
export const AVENTURA_4_CONFIG: ActivityConfig = {
  activityId: 14,
  activitySlug: 'aventura-4',
  title: 'Nos entendemos y respetamos',
  sections: [
    {
      id: 1,
      title: '¿QUÉ DICE MI CARA?',
      scenes: ['/aventura-4/scene1'],
      isUnlocked: true,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-hover.svg',
      soundClick: '/audio/labels/mAct5/a1.mp3',
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 28,
      rotateY: 15,
      delay: 0.2,
      brightness: 1,
    },
    {
      id: 2,
      title: '¿QUÉ DICE MI TONO DE VOZ?',
      scenes: ['/aventura-4/scene2'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-2-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-2-hover.svg',
      soundClick: '/audio/labels/mAct5/a2.mp3',
      xPosition: 100,
      yPosition: 380,
      zPosition: -50,
      scale: 1.0,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 0.5,
    },
    {
      id: 3,
      title: 'JUEGO 2: ¿QUÉ CARA PONDRÁ?',
      scenes: ['/aventura-4/scene3'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-3-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-3-hover.svg',
      soundClick: '/audio/labels/mAct5/a3.mp3',
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 1.1,
      rotateX: 0,
      rotateY: 20,
      delay: 0.9,
      brightness: 0.5,
    },
    {
      id: 4,
      title: '¿QUÉ CARA PONDRÁ?',
      scenes: ['/aventura-4/scene4'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-4-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-4-hover.svg',
      soundClick: '/audio/labels/mAct5/a4.mp3',
      xPosition: 80,
      yPosition: 350,
      zPosition: -500,
      scale: 1.2,
      rotateX: 15,
      rotateY: -20,
      delay: 1.1,
      brightness: 0.5,
    },
    {
      id: 5,
      title: 'APRENDEMOS A LIGAR',
      scenes: ['/aventura-4/scene5'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-hover.svg',
      soundClick: '/audio/labels/mAct5/a4.mp3',
      xPosition: -50,
      yPosition: 250,
      zPosition: -700,
      scale: 1.3,
      rotateX: 10,
      rotateY: 30,
      delay: 1.4,
      brightness: 0.5,
    },
    {
      id: 6,
      title: '¿CÓMO LE PIDO SALIR A LA PERSONA QUE ME GUSTA?',
      scenes: ['/aventura-4/scene6'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-2-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-2-hover.svg',
      soundClick: '/audio/labels/mAct5/a4.mp3',
      xPosition: 180,
      yPosition: 320,
      zPosition: -900,
      scale: 1.4,
      rotateX: 5,
      rotateY: -15,
      delay: 1.7,
      brightness: 0.5,
    },
    {
      id: 7,
      title: '¿CÓMO DECIR QUE NO?',
      scenes: ['/aventura-4/scene7'],
      isUnlocked: false,
      isCompleted: false,
      activeImage: '/svg/menu-actividad/cartell-3-active.svg',
      inactiveImage: '/svg/menu-actividad/cartell-3-hover.svg',
      soundClick: '/audio/labels/mAct5/a4.mp3',
      xPosition: -340,
      yPosition: 280,
      zPosition: -1100,
      scale: 1.5,
      rotateX: 2,
      rotateY: 20,
      delay: 2.0,
      brightness: 0.5,
    },
  ],
};

// Helper functions
export function getActivityConfig(activityId: number): ActivityConfig | null {
  switch (activityId) {
    case 1:
      return ACTIVITY_1_CONFIG;
    case 2:
      return ACTIVITY_2_CONFIG;
    case 3:
      return ACTIVITY_3_CONFIG;
    case 4:
      return ACTIVITY_4_CONFIG;
    case 5:
      return ACTIVITY_5_CONFIG;
    case 6:
      return ACTIVITY_6_CONFIG;
    case 11:
      return AVENTURA_1_CONFIG;
    case 12:
      return AVENTURA_2_CONFIG;
    case 13:
      return AVENTURA_3_CONFIG;
    case 14:
      return AVENTURA_4_CONFIG;
    default:
      return null;
  }
}

export function getNextUnlockedSection(sections: ActivitySection[]): ActivitySection | null {
  return sections.find(section => section.isUnlocked && !section.isCompleted) || null;
}