// Configuration for Juego 4: Abusador
export interface Scenario {
  id: number;
  text: string;
  imageUrl: string;
  audioUrl: string;
  correctAnswer: 'thumbsUp' | 'thumbsDown';
  situationType: 'appropriate' | 'inappropriate';
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
  title: "Abusador",
  introAudio: "/audio/actividad-6/juego4/t.mp3",
  introText: "Vamos a ver algunas situaciones. Si crees que la situación es correcta, pulsa la mano con el pulgar hacia arriba. Si te parece que la situación es incorrecta, pulsa la mano con el pulgar hacia abajo ¿Empezamos?",
  
  // Button images
  buttons: {
    thumbsUp: {
      normal: "/image/actividad_6/juego4/ok.png",
      active: "/image/actividad_6/juego4/ok-2.png"
    },
    thumbsDown: {
      normal: "/image/actividad_6/juego4/no.png",
      active: "/image/actividad_6/juego4/no-2.png"
    }
  },
  
  // Feedback indicators
  feedbackImages: {
    lock: "/image/actividad_6/juego4/lock.png",
    party: "/image/actividad_6/juego4/party.png",
    stars: "/image/actividad_6/juego4/starts.png"
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
      text: "Le pregunto a mi vecino: ¿Te puedo dar un abrazo?",
      imageUrl: "/image/actividad_6/juego4/1-card-vecino-abrazo.png",
      audioUrl: "/audio/actividad-6/juego4/c1.mp3",
      correctAnswer: "thumbsUp",
      situationType: "appropriate",
      feedbackCorrect: {
        text: "Muy bien, tenemos que preguntar si quiere un abrazo.",
        audioUrl: "/audio/actividad-6/juego4/c1-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está bien, porque le estamos pidiendo permiso.",
        audioUrl: "/audio/actividad-6/juego4/c1-fb-incorrect.mp3"
      }
    },
    {
      id: 2,
      text: "Le doy un beso en la boca a mi compañera de clase.",
      imageUrl: "/image/actividad_6/juego4/2-card-beso-compi-class.png",
      audioUrl: "/audio/actividad-6/juego4/c2.mp3",
      correctAnswer: "thumbsDown",
      situationType: "inappropriate",
      feedbackCorrect: {
        text: "Tenemos que preguntarle si quiere que le dé un beso.",
        audioUrl: "/audio/actividad-6/juego4/c2-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Tenemos que preguntarle si quiere que le dé un beso.",
        audioUrl: "/audio/actividad-6/juego4/c2-fb-incorrect.mp3"
      }
    },
    {
      id: 3,
      text: "Le toco el culo a mi maestro de taller cuando pasa cerca de mí.",
      imageUrl: "/image/actividad_6/juego4/3-card-toca-culo.png",
      audioUrl: "/audio/actividad-6/juego4/c3.mp3",
      correctAnswer: "thumbsDown",
      situationType: "inappropriate",
      feedbackCorrect: {
        text: "Exacto, está mal tocarle el culo a mi maestro de taller. Es una parte privada.",
        audioUrl: "/audio/actividad-6/juego4/c3-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal tocarle el culo a mi maestro de taller. Es una parte privada.",
        audioUrl: "/audio/actividad-6/juego4/c3-fb-incorrect.mp3"
      }
    },
    {
      id: 4,
      text: "Le toco las tetas a mi tía.",
      imageUrl: "/image/actividad_6/juego4/4-card-toca-teta-tia.png",
      audioUrl: "/audio/actividad-6/juego4/c4.mp3",
      correctAnswer: "thumbsDown",
      situationType: "inappropriate",
      feedbackCorrect: {
        text: "Eso es, está mal tocarle las tetas a mi tía. Son partes privadas.",
        audioUrl: "/audio/actividad-6/juego4/c4-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal tocarle las tetas a mi tía. Son partes privadas.",
        audioUrl: "/audio/actividad-6/juego4/c4-fb-incorrect.mp3"
      }
    },
    {
      id: 5,
      text: "Enseño las tetas en medio del comedor del centro ocupacional.",
      imageUrl: "/image/actividad_6/juego4/5-card-esena-teta.png",
      audioUrl: "/audio/actividad-6/juego4/c5.mp3",
      correctAnswer: "thumbsDown",
      situationType: "inappropriate",
      feedbackCorrect: {
        text: "Exacto, no puedo enseñar las tetas en el centro ocupacional. Son partes privadas.",
        audioUrl: "/audio/actividad-6/juego4/c5-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal enseñar mis tetas en el centro ocupacional. Son partes privadas.",
        audioUrl: "/audio/actividad-6/juego4/c5-fb-incorrect.mp3"
      }
    },
    {
      id: 6,
      text: "Hago un trato para que me chupe el pene a cambio de mis galletas de chocolate.",
      imageUrl: "/image/actividad_6/juego4/6-card-chupe-pene.png",
      audioUrl: "/audio/actividad-6/juego4/c6.mp3",
      correctAnswer: "thumbsDown",
      situationType: "inappropriate",
      feedbackCorrect: {
        text: "Exacto, no puedo obligar a una persona a que me chupe el pene a cambio de algo.",
        audioUrl: "/audio/actividad-6/juego4/c6-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal obligar a que me chupen el pene a cambio de algo.",
        audioUrl: "/audio/actividad-6/juego4/c6-fb-incorrect.mp3"
      }
    },
    {
      id: 7,
      text: "Entro en el baño, aunque la puerta está cerrada para mirar a mi madre desnuda en la ducha.",
      imageUrl: "/image/actividad_6/juego4/7-card-entra-bano.png",
      audioUrl: "/audio/actividad-6/juego4/c7.mp3",
      correctAnswer: "thumbsDown",
      situationType: "inappropriate",
      feedbackCorrect: {
        text: "Eso es, está mal mirar a otras personas cuando están desnudas. También tengo que llamar a la puerta antes de entrar.",
        audioUrl: "/audio/actividad-6/juego4/c7-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Está mal mirar a otras personas cuando están desnudas. También tengo que llamar a la puerta antes de entrar.",
        audioUrl: "/audio/actividad-6/juego4/c7-fb-incorrect.mp3"
      }
    }
  ] as Scenario[]
};