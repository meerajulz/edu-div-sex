// /actividad-6/scene1/JuegoUnoActividad6/config.ts
export const juego1Config = {
  title: "Mis partes privadas",
  titleAudio: "/audio/actividad-6/t.mp3",
  
  // Game completion audio
  completionAudio: "/audio/muy_bien_bright.mp3",
  
  // Private parts that need to be found to win
  privateParts: [
    {
      id: 'vulva',
      name: 'Vulva',
      dollIndex: 0, // doll-front-1
      coordinates: { x: 25, y: 60, width: 50, height: 15 }, // Will be updated with debug
      clickAudio: "/audio/actividad-6/vulva.mp3",
      feedbackAudio: "/audio/actividad-6/fb-vulva.mp3",
      highlightImage: "/image/actividad_6/juego1/dolls/doll-front-1-vulva-highlight.png"
    },
    {
      id: 'pechos-doll1',
      name: 'Pechos',
      dollIndex: 0, // doll-front-1
      coordinates: { x: 32, y: 40, width: 40, height: 10 },
      clickAudio: "/audio/actividad-6/pechos.mp3",
      feedbackAudio: "/audio/actividad-6/fb-pechos.mp3", 
      highlightImage: "/image/actividad_6/juego1/dolls/doll-front-1-pecho-highlight.png"
    },
    {
      id: 'culo',
      name: 'Culo',
      dollIndex: 1, // doll-back
      coordinates: { x: 32, y: 65, width: 40, height: 10 },
      clickAudio: "/audio/actividad-6/culo.mp3",
      feedbackAudio: "/audio/actividad-6/fb-culo.mp3",
      highlightImage: "/image/actividad_6/juego1/dolls/doll-back-culo-highlight.png"
    },
    {
      id: 'penis-testiculos',
      name: 'Pene y testículos',
      dollIndex: 2, // doll-front-2-penis
      coordinates: { x: 32, y: 60, width: 40, height: 13 },
      clickAudio: "/audio/actividad-6/pene.mp3",
      feedbackAudio: "/audio/actividad-6/fb-pene.mp3",
      highlightImage: "/image/actividad_6/juego1/dolls/doll-front-2-penis-penis-hightlight.png"
    },
    {
      id: 'pechos-doll3',
      name: 'Pechos',
      dollIndex: 2, // doll-front-2-penis (can also have pechos)
      coordinates: { x: 32, y: 40, width: 40, height: 10 },
      clickAudio: "/audio/actividad-6/pechos.mp3",
      feedbackAudio: "/audio/actividad-6/fb-pechos.mp3",
      highlightImage: "/image/actividad_6/juego1/dolls/doll-front-2-penis-pechos-hightlight.png"
    }
  ],
  
  // Incorrect feedback
  incorrectFeedback: {
    clickAudio: "/audio/NO.mp3",
    feedbackAudio: "/audio/actividad-6/fb-no-private.mp3"
  },
  
  // Correct feedback
  correctFeedback: {
    clickAudio: "/audio/YES.mp3"
  },
  
  // Images
  images: {
    // Baúl states
    baulClosed: "/image/actividad_6/juego1/bau-1.png",
    baulOpen: "/image/actividad_6/juego1/bau-2.png",
    
    // Dolls (vertical inline layout)
    dolls: [
      "/image/actividad_6/juego1/dolls/doll-front-1.png",           // Index 0
      "/image/actividad_6/juego1/dolls/doll-back.png",              // Index 1  
      "/image/actividad_6/juego1/dolls/doll-front-2-penis.png"      // Index 2
    ],
    
    // Non-private click highlights
    nonPrivateHighlights: [
      "/image/actividad_6/juego1/dolls/doll-front-1-no-private-click.png",         // Index 0
      "/image/actividad_6/juego1/dolls/doll-back-no-private-highlight.png",        // Index 1
      "/image/actividad_6/juego1/dolls/doll-front-2-penis-no-private-click.png"    // Index 2
    ],
    
    // Feedback icons
    feedbackIcons: {
      correct: "/image/actividad_6/juego1/yes.png",
      incorrect: "/image/actividad_6/juego1/no.png"
    }
  },
  
  // Game settings
  settings: {
    debugMode: true, // Enable coordinate logging
    showClickableAreas: false, // Show visual borders for clickable zones
    feedbackDuration: 2000, // 2 seconds
    modalMaxWidth: "800px",
    dollSpacing: "2rem" // Space between dolls horizontally
  }
};