// Configuration for Juego 3: Secretos buenos y malos
export interface Scenario {
  id: number;
  text: string;
  imageUrl: string;
  audioUrl: string;
  correctAnswer: 'thumbsUp' | 'thumbsDown';
  secretType: 'good' | 'bad';
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
  title: "Secretos buenos y malos",
  introAudio: "/audio/actividad-6/juego3/t.mp3",
  introText: "¿Cuál de estos secretos es bueno y cuál es malo? Si crees que es un secreto bueno, marca la mano con el pulgar hacia arriba. Si crees que es un secreto malo, marca la mano con el pulgar hacia abajo.",
  
  // Button images
  buttons: {
    thumbsUp: {
      normal: "/image/actividad_6/juego3/ok.png",
      active: "/image/actividad_6/juego3/ok-2.png"
    },
    thumbsDown: {
      normal: "/image/actividad_6/juego3/no.png",
      active: "/image/actividad_6/juego3/no-2.png"
    }
  },
  
  // Feedback indicators
  feedbackImages: {
    alert: "/image/actividad_6/juego3/alert.png",
    fista: "/image/actividad_6/juego3/fista.png",
    gift: "/image/actividad_6/juego3/gift.png"
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
      text: "Es el cumpleaños de mi hermana. Mi madre me ha dicho que le va a comprar una pelota de fútbol, pero no se lo puedo decir a nadie porque es sorpresa.",
      imageUrl: "/image/actividad_6/juego3/card-cumpleanos-hermana.png",
      audioUrl: "/audio/actividad-6/juego3/c1.mp3",
      correctAnswer: "thumbsUp",
      secretType: "good",
      feedbackCorrect: {
        text: "Muy bien, este secreto te hace sentir alegre.",
        audioUrl: "/audio/actividad-6/juego3/c1-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Este secreto es bueno, porque te hace sentir alegre y luego se va a contar.",
        audioUrl: "/audio/actividad-6/juego3/c1-fb-incorrect.mp3"
      }
    },
    {
      id: 2,
      text: "Mi compañera de clase me ha pegado en el centro ocupacional y me ha dicho que no me chive.",
      imageUrl: "/image/actividad_6/juego3/card-pegado-en-clase.png",
      audioUrl: "/audio/actividad-6/juego3/c2.mp3",
      correctAnswer: "thumbsDown",
      secretType: "bad",
      feedbackCorrect: {
        text: "¡Exacto! Este secreto es malo, porque hace daño.",
        audioUrl: "/audio/actividad-6/juego3/c2-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Este secreto es malo, porque hace daño.",
        audioUrl: "/audio/actividad-6/juego3/c2-fb-incorrect.mp3"
      }
    },
    {
      id: 3,
      text: "Mi amigo me ha tocado la vulva en el baño y me ha dicho que es nuestro secreto.",
      imageUrl: "/image/actividad_6/juego3/card-tocado-vulva.png",
      audioUrl: "/audio/actividad-6/juego3/c3.mp3",
      correctAnswer: "thumbsDown",
      secretType: "bad",
      feedbackCorrect: {
        text: "Muy bien, este secreto es malo, porque hace daño.",
        audioUrl: "/audio/actividad-6/juego3/c3-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Este secreto es malo, porque hace daño.",
        audioUrl: "/audio/actividad-6/juego3/c3-fb-incorrect.mp3"
      }
    },
    {
      id: 4,
      text: "Mi abuela estaba en el hospital y ha vuelto a casa. Vamos a hacerle una fiesta sorpresa para celebrarlo. Ella no debe enterarse.",
      imageUrl: "/image/actividad_6/juego3/card-avuela-home.png",
      audioUrl: "/audio/actividad-6/juego3/c4.mp3",
      correctAnswer: "thumbsUp",
      secretType: "good",
      feedbackCorrect: {
        text: "Muy bien, este secreto es bueno, porque te hace sentir alegre.",
        audioUrl: "/audio/actividad-6/juego3/c4-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Este secreto es bueno, porque te hace sentir alegre y luego se va a contar.",
        audioUrl: "/audio/actividad-6/juego3/c4-fb-incorrect.mp3"
      }
    },
    {
      id: 5,
      text: "He visto a mi tío tocándole el culo a mi hermana y me ha dicho que no se lo diga a nadie.",
      imageUrl: "/image/actividad_6/juego3/card-tio-toca-vulva.png",
      audioUrl: "/audio/actividad-6/juego3/c5.mp3",
      correctAnswer: "thumbsDown",
      secretType: "bad",
      feedbackCorrect: {
        text: "Este secreto es malo, porque hace daño.",
        audioUrl: "/audio/actividad-6/juego3/c5-fb-correct.mp3"
      },
      feedbackIncorrect: {
        text: "Este secreto es malo, porque hace daño.",
        audioUrl: "/audio/actividad-6/juego3/c5-fb-incorrect.mp3"
      }
    }
  ] as Scenario[]
};