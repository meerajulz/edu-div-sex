// Configuration for Juego 2: Victimización
export interface Scenario {
  id: number;
  text: string;
  imageUrl: string;
  audioUrl: string;
  correctAnswer: 'thumbsUp' | 'thumbsDown';
  feedbackCorrect: {
    text: string;
    audioUrl: string;
  };
  feedbackIncorrect: {
    text: string;
    audioUrl: string;
  };
}

export const GAME_CONFIG = {
  title: "Victimización",
  introAudio: "/audio/actividad-6/juego2/t.mp3",
  introText: "Vamos a ver algunas situaciones. Si crees que la situación está bien, pulsa la mano con el pulgar hacia arriba. Si te parece que la situación está mal, pulsa la mano con el pulgar hacia abajo ¿Empezamos?",
  
  // Button images
  buttons: {
    thumbsUp: {
      normal: "/image/actividad_6/juego2/ok.png",
      active: "/image/actividad_6/juego2/ok-2.png"
    },
    thumbsDown: {
      normal: "/image/actividad_6/juego2/no.png",
      active: "/image/actividad_6/juego2/no-2.png"
    }
  },
  
  // Feedback indicators
  feedbackImages: {
    alert: "/image/actividad_6/juego2/alert.png",
    correct: "/image/actividad_6/juego2/correct.png"
  },
  
  // Sound effects
  soundEffects: {
    correct: "/audio/YES.mp3",
    incorrect: "/audio/NO.mp3",
    buttonClick: "/audio/button/Bright.mp3"
  },
  
  // Game scenarios
  scenarios: [
    {
      id: 1,
      text: "Papá me da un abrazo",
      imageUrl: "/image/actividad_6/juego2/card-papa-abrazo.png",
      audioUrl: "/audio/actividad-6/juego2/c1.mp3",
      correctAnswer: "thumbsUp",
      feedbackCorrect: {
        text: "¡Muy bien! Que una persona que te quiere te abrace está bien.",
        audioUrl: "/audio/actividad-6/juego2/c1-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Que una persona que te quiere te abrace está bien.",
        audioUrl: "/audio/actividad-6/juego2/c1-fb-incorrecto.mp3"
      }
    },
    {
      id: 2,
      text: "Mi tío me besa en la boca",
      imageUrl: "/image/actividad_6/juego2/card-tio-besa.png",
      audioUrl: "/audio/actividad-6/juego2/c2.mp3",
      correctAnswer: "thumbsDown",
      feedbackCorrect: {
        text: "Eso es, no debemos besar en la boca a las personas de nuestra familia.",
        audioUrl: "/audio/actividad-6/juego2/c2-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "No debemos besar en la boca a las personas de nuestra familia.",
        audioUrl: "/audio/actividad-6/juego2/c2-fb-incorrect.mp3"
      }
    },
    {
      id: 3,
      text: "Un compañero me toca el culo",
      imageUrl: "/image/actividad_6/juego2/card--toca-culo.png",
      audioUrl: "/audio/actividad-6/juego2/c3.mp3",
      correctAnswer: "thumbsDown",
      feedbackCorrect: {
        text: "Eso es, está mal que alguien te toque el culo si tú no quieres.",
        audioUrl: "/audio/actividad-6/juego2/c3-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal que alguien te toque el culo si tú no quieres.",
        audioUrl: "/audio/actividad-6/juego2/c3-fb-incorrect.mp3"
      }
    },
    {
      id: 4,
      text: "Mi prima me obliga a tocar su vulva",
      imageUrl: "/image/actividad_6/juego2/card-toca-vulva.png",
      audioUrl: "/audio/actividad-6/juego2/c4.mp3",
      correctAnswer: "thumbsDown",
      feedbackCorrect: {
        text: "Exacto, está mal que alguien te obligue a tocar su vulva.",
        audioUrl: "/audio/actividad-6/juego2/c4-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal que alguien te obligue a tocar su vulva.",
        audioUrl: "/audio/actividad-6/juego2/c4-fb-incorrect.mp3"
      }
    },
    {
      id: 5,
      text: "Mi compañera me mira mientras me cambio de ropa",
      imageUrl: "/image/actividad_6/juego2/card-mira-cambio.png",
      audioUrl: "/audio/actividad-6/juego2/c5.mp3",
      correctAnswer: "thumbsDown",
      feedbackCorrect: {
        text: "Exacto, está mal que alguien me mire mientras me cambio de ropa.",
        audioUrl: "/audio/actividad-6/juego2/c5-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal que alguien me mire mientras me cambio de ropa.",
        audioUrl: "/audio/actividad-6/juego2/c5-fb-incorrect.mp3"
      }
    },
    {
      id: 6,
      text: "Me pide que le toque el pene a cambio de mis golosinas preferidas",
      imageUrl: "/image/actividad_6/juego2/card-toca-pene.png",
      audioUrl: "/audio/actividad-6/juego2/c6.mp3",
      correctAnswer: "thumbsDown",
      feedbackCorrect: {
        text: "Eso es, está mal que una persona me obligue a tocarle a cambio de algo. Tengo que decirle que no quiero.",
        audioUrl: "/audio/actividad-6/juego2/c6-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal que una persona me obligue a tocarle a cambio de algo. Tengo que decirle que no quiero.",
        audioUrl: "/audio/actividad-6/juego2/c6-fb-incorrect.mp3"
      }
    },
    {
      id: 7,
      text: "Me ha obligado a mirar su pene y me ha dicho que no se lo puedo contar a nadie",
      imageUrl: "/image/actividad_6/juego2/card-mirar-pene.png",
      audioUrl: "/audio/actividad-6/juego2/c7.mp3",
      correctAnswer: "thumbsDown",
      feedbackCorrect: {
        text: "Eso es, está mal que una persona me obligue a mirar sus partes privadas. Esto no es un secreto. Se lo tengo que contar a otra persona para que me ayude.",
        audioUrl: "/audio/actividad-6/juego2/c7-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal que una persona me obligue a mirar sus partes privadas. Esto no es un secreto. Se lo tengo que contar a otra persona para que me ayude.",
        audioUrl: "/audio/actividad-6/juego2/c7-fb-incorrect.mp3"
      }
    }
  ] as Scenario[]
};