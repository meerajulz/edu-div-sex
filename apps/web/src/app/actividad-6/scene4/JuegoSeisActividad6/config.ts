// Configuration for Juego 6: ¿Qué hacer si sucede?
export interface Situation {
  id: number;
  mainCard: {
    imageUrl: string;
    audioUrl: string;
    description: string;
  };
  option1: {
    imageUrl: string;
    audioUrl: string;
    text: string;
    isCorrect: boolean;
  };
  option2: {
    imageUrl: string;
    audioUrl: string;
    text: string;
    isCorrect: boolean;
  };
  feedback: {
    correctAudioUrl: string;
    incorrectAudioUrl: string;
    correctText: string;
    incorrectText: string;
  };
}

export const GAME_CONFIG = {
  title: "¿Qué hacer si sucede?",
  introAudio: "/audio/actividad-6/juego6/t.mp3",
  introText: "Vamos a ver algunas situaciones y tienes que decir qué harías. ¿Empezamos?",
  
  // Feedback indicators
  feedbackImages: {
    correct: "/image/actividad_6/juego6/yes.png",
    incorrect: "/image/actividad_6/juego6/no.png"
  },
  
  // Sound effects
  soundEffects: {
    correct: "/audio/YES.mp3",
    incorrect: "/audio/NO.mp3",
    buttonClick: "/audio/button/Bright.mp3"
  },
  
  // Game situations
  situations: [
    {
      id: 1,
      mainCard: {
        imageUrl: "/image/actividad_6/juego6/1-card.png",
        audioUrl: "/audio/actividad-6/juego6/1-card.mp3",
        description: "Mientras el padre toca el pene de su hijo le dice que es un secreto. ¿Qué debe hacer el hijo?"
      },
      option1: {
        imageUrl: "/image/actividad_6/juego6/1-card-wrong.png",
        audioUrl: "/audio/actividad-6/juego6/1-card-wrong.mp3",
        text: "No decir nada porque es un secreto",
        isCorrect: false
      },
      option2: {
        imageUrl: "/image/actividad_6/juego6/1-card-correct.png",
        audioUrl: "/audio/actividad-6/juego6/1-card-correct.mp3",
        text: "Contárselo a la madre y al maestro de taller",
        isCorrect: true
      },
      feedback: {
        correctAudioUrl: "/audio/actividad-6/juego6/1-card-FB-correct.mp3",
        incorrectAudioUrl: "/audio/actividad-6/juego6/1-card-FB-incorrecto.mp3",
        correctText: "¡Muy bien! Debe contárselo a su madre y al maestro de taller.",
        incorrectText: "¡Incorrecto! Debe contárselo a su madre y al maestro de taller."
      }
    },
    {
      id: 2,
      mainCard: {
        imageUrl: "/image/actividad_6/juego6/2-card.png",
        audioUrl: "/audio/actividad-6/juego6/2-card.mp3",
        description: "Un compañero le toca la vulva a una compañera por encima de la ropa en el centro ocupacional. ¿Qué debe hacer la compañera?"
      },
      option1: {
        imageUrl: "/image/actividad_6/juego6/2-card-correct.png",
        audioUrl: "/audio/actividad-6/juego6/2-card-correct.mp3",
        text: "Debe decir: '¡No me gusta, para!'",
        isCorrect: true
      },
      option2: {
        imageUrl: "/image/actividad_6/juego6/2-card-incorrect.png",
        audioUrl: "/audio/actividad-6/juego6/2-card-incorrect.mp3",
        text: "Dejarle que toque su vulva",
        isCorrect: false
      },
      feedback: {
        correctAudioUrl: "/audio/actividad-6/juego6/2-card-FB-correct.mp3",
        incorrectAudioUrl: "/audio/actividad-6/juego6/2-card-FB-incorrect.mp3",
        correctText: "¡Muy bien! Debe decir 'no' cuando alguien le toca la vulva sin permiso.",
        incorrectText: "¡Incorrecto! Debe decir 'no' cuando alguien le toca la vulva sin permiso."
      }
    }
  ] as Situation[]
};