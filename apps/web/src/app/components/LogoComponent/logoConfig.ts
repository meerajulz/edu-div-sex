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
    text: 'AVENTURA 1 -  Descubriendo el cuerpo humano',
    bgColor: 'bg-green-500'
  },
  // Actividad 2 Scenes - Blue background
  'actividad-2-scene1': {
    image: '/image/logo-image/aventura-2.png',
    text: 'AVENTURA 2 - Intimidad',
    bgColor: 'bg-blue-500'
  },  
  // Actividad 3 Scenes - Green background
  'actividad-3-scene1': {
    image: '/image/logo-image/aventura-3.png',
    text: 'AVENTURA 3. Placer sexual',
    bgColor: 'bg-green-500'
  },
  
  // Actividad 4 Scenes - Purple background
  'actividad-4-scene1': {
    image: '/image/logo-image/aventura-4.png',
    text: 'AVENTURA 4 - Cuido de mi sexualidad.',
    bgColor: 'bg-pink-300'
  },  
  // Actividad 5 Scenes - Orange background
  'actividad-5-scene1': {
    image: '/image/logo-image/aventura-5.png',
    text: 'AVENTURA 5 - Nos entendemos y respetamos',
    bgColor: 'bg-orange-500'
  },
  // Actividad 6 Scenes - Pink background
  'actividad-6-scene1': {
    image: '/image/logo-image/aventura-6.png',
    text: 'AVENTURA 6 -  Abuso',
    bgColor: 'bg-red-500'
  },
  'actividad-6-scene2': {
    image: '/image/logo-image/aventura-6.png',
    text: 'AVENTURA 6 - Abuso',
    bgColor: 'bg-yellow-500'
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