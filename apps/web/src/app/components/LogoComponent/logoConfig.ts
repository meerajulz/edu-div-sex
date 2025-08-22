// Configuration for Logo Component across all pages
export interface LogoConfig {
  image: string;
  text: string;
  bgColor: string;
}

export const logoConfigs: Record<string, LogoConfig> = {
  // Actividad 1 Scenes - Red background
  'actividad-1-scene1': {
    image: '/image/logo-image/aventura-1.png',
    text: 'AVENTURA 1',
    bgColor: 'bg-red-500'
  },
  'actividad-1-scene2': {
    image: '/image/logo-image/aventura-1.png',
    text: 'AVENTURA 1',
    bgColor: 'bg-red-500'
  },
  
  // Actividad 2 Scenes - Blue background
  'actividad-2-scene1': {
    image: '/image/logo-image/aventura-2.png',
    text: 'AVENTURA 2',
    bgColor: 'bg-blue-500'
  },
  'actividad-2-scene2': {
    image: '/image/logo-image/aventura-2.png',
    text: 'AVENTURA 2',
    bgColor: 'bg-blue-500'
  },
  
  // Actividad 3 Scenes - Green background
  'actividad-3-scene1': {
    image: '/image/logo-image/aventura-3.png',
    text: 'AVENTURA 3',
    bgColor: 'bg-green-500'
  },
  'actividad-3-scene2': {
    image: '/image/logo-image/aventura-3.png',
    text: 'AVENTURA 3',
    bgColor: 'bg-green-500'
  },
  
  // Actividad 4 Scenes - Purple background
  'actividad-4-scene1': {
    image: '/image/logo-image/aventura-4.png',
    text: 'AVENTURA 4',
    bgColor: 'bg-purple-500'
  },
  'actividad-4-scene2': {
    image: '/image/logo-image/aventura-4.png',
    text: 'AVENTURA 4',
    bgColor: 'bg-purple-500'
  },
  
  // Actividad 5 Scenes - Orange background
  'actividad-5-scene1': {
    image: '/image/logo-image/aventura-5.png',
    text: 'AVENTURA 5',
    bgColor: 'bg-orange-500'
  },
  'actividad-5-scene2': {
    image: '/image/logo-image/aventura-5.png',
    text: 'AVENTURA 5',
    bgColor: 'bg-orange-500'
  },
  
  // Actividad 6 Scenes - Pink background
  'actividad-6-scene1': {
    image: '/image/logo-image/aventura-6.png',
    text: 'AVENTURA 6',
    bgColor: 'bg-pink-500'
  },
  'actividad-6-scene2': {
    image: '/image/logo-image/aventura-6.png',
    text: 'AVENTURA 6',
    bgColor: 'bg-pink-500'
  },
  'actividad-6-scene3': {
    image: '/image/logo-image/aventura-6.png',
    text: 'AVENTURA 6',
    bgColor: 'bg-pink-500'
  },
  'actividad-6-scene4': {
    image: '/image/logo-image/aventura-6.png',
    text: 'AVENTURA 6',
    bgColor: 'bg-pink-500'
  },
  
  // Default fallback
  'default': {
    image: '/image/logo-image/aventura-1.png',
    text: 'AVENTURA',
    bgColor: 'bg-gray-500'
  }
};




/*

* Configuration for Logo Component across all pages

// Method 1: Using config key
<LogoComponent configKey="actividad-6-scene1" />
lets use this but we need upodate the name of the scene her for each content

// Method 2: Using aventura number
<LogoComponent aventuraNumber={6} />

// Method 3: Completely custom
<LogoComponent 
  customImage="/image/special-logo.png" 
  customText="SPECIAL ADVENTURE" 
/>


*/