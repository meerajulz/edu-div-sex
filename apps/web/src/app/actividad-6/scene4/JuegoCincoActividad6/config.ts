// Configuration for Juego 5: Abusador (Video-based)
export interface VideoSegment {
  id: number;
  videoUrl: string;
  backgroundImage: string;
  question: {
    text: string;
    audioUrl: string;
  };
  correctAnswer: 'si' | 'no';
  feedback: {
    correctAudioUrl: string;
    incorrectAudioUrl: string;
    correctText: string;
    incorrectText: string;
  };
}

export const GAME_CONFIG = {
  title: "Abusador",
  introAudio: "/audio/actividad-6/juego5/t.mp3",
  
  // Button images
  buttons: {
    si: "/image/actividad_6/juego5/si.png",
    no: "/image/actividad_6/juego5/no.png"
  },
  
  // Feedback indicators
  feedbackImages: {
    correct: "/image/actividad_6/juego5/correct.png",
    incorrect: "/image/actividad_6/juego5/incorrect.png"
  },
  
  // Sound effects
  soundEffects: {
    correct: "/audio/YES.mp3",
    incorrect: "/audio/NO.mp3",
    buttonClick: "/audio/button/Bright.mp3"
  },
  
  // Video segments with questions
  segments: [
    {
      id: 1,
      videoUrl: "/image/actividad_6/juego5/card-1-video.mp4",
      backgroundImage: "/image/actividad_6/juego5/bg/card-1-video-image.jpg",
      question: {
        text: "¿Está bien lo que está haciendo Alex?",
        audioUrl: "/audio/actividad-6/juego5/s1-question.mp3"
      },
      correctAnswer: "no",
      feedback: {
        correctAudioUrl: "/audio/actividad-6/juego5/s1-fb-correct.mp3",
        incorrectAudioUrl: "/audio/actividad-6/juego5/s1-fb-incorrect.mp3",
        correctText: "Muy bien, recuerda que siempre tenemos que preguntar cuando queramos ver o tocar el cuerpo de otra persona.",
        incorrectText: "Está mal porque no le ha preguntado si ella quería quitarse la camisa. Recuerda que siempre tenemos que preguntar cuando queramos ver o tocar el cuerpo de otra persona."
      }
    },
    {
      id: 2,
      videoUrl: "/image/actividad_6/juego5/card-2-video.mp4",
      backgroundImage: "/image/actividad_6/juego5/bg/card-2-video-image.jpg",
      question: {
        text: "¿A Cris le está gustando?",
        audioUrl: "/audio/actividad-6/juego5/s2-question.mp3"
      },
      correctAnswer: "no",
      feedback: {
        correctAudioUrl: "/audio/actividad-6/juego5/s2-fb-correct.mp3",
        incorrectAudioUrl: "/audio/actividad-6/juego5/s2-fb-incorrect.mp3",
        correctText: "Muy bien. Fíjate qué cara pone Cris. Está incómoda. No le gusta que le toque Alex. Si una persona está incómoda cuando le tocas, debemos parar.",
        incorrectText: "Fíjate qué cara pone Cris. Está incómoda. No le gusta que le toque Alex. Si una persona está incómoda cuando le tocas, debemos parar."
      }
    },
    {
      id: 3,
      videoUrl: "/image/actividad_6/juego5/card-3-video.mp4",
      backgroundImage: "/image/actividad_6/juego5/bg/card-3-video-image.jpg",
      question: {
        text: "¿Está bien que Alex amenace a Cris?",
        audioUrl: "/audio/actividad-6/juego5/s3-question.mp3"
      },
      correctAnswer: "no",
      feedback: {
        correctAudioUrl: "/audio/actividad-6/juego5/s3-fb-correct.mp3",
        incorrectAudioUrl: "/audio/actividad-6/juego5/s3-fb-incorrect.mp3",
        correctText: "Eso es, los amigos no amenazan con dejar de querer.",
        incorrectText: "No es correcto. Los amigos no amenazan con dejar de querer."
      }
    },
    {
      id: 4,
      videoUrl: "/image/actividad_6/juego5/card-4-video.mp4",
      backgroundImage: "/image/actividad_6/juego5/bg/card-4-video-image.jpg",
      question: {
        text: "¿Está bien insistir a alguien para que nos toque?",
        audioUrl: "/audio/actividad-6/juego5/s4-question.mp3"
      },
      correctAnswer: "no",
      feedback: {
        correctAudioUrl: "/audio/actividad-6/juego5/s4-fb-correct.mp3",
        incorrectAudioUrl: "/audio/actividad-6/juego5/s4-fb-incorrect.mp3",
        correctText: "Muy bien. Está mal insistir en que te toque si ya nos ha dicho que no quiere.",
        incorrectText: "No, está mal insistir en que te toque si ya nos ha dicho que no quiere."
      }
    },
    {
      id: 5,
      videoUrl: "/image/actividad_6/juego5/card-5-video.mp4",
      backgroundImage: "/image/actividad_6/juego5/bg/card-5-video-image.jpg",
      question: {
        text: "¿Podemos obligar a alguien a que nos toque?",
        audioUrl: "/audio/actividad-6/juego5/s5-question.mp3"
      },
      correctAnswer: "no",
      feedback: {
        correctAudioUrl: "/audio/actividad-6/juego5/s5-fb-correct.mp3",
        incorrectAudioUrl: "/audio/actividad-6/juego5/s5-fb-incorrect.mp3",
        correctText: "Eso es. No puedes obligar a nadie a que te toque si no quiere.",
        incorrectText: "¡Nunca! No puedes obligar a nadie a que te toque si no quiere."
      }
    },
    {
      id: 6,
      videoUrl: "/image/actividad_6/juego5/card-6-video.mp4",
      backgroundImage: "/image/actividad_6/juego5/bg/card-6-video-image.jpg",
      question: {
        text: "¿Crees que Cris se sentirá contenta?",
        audioUrl: "/audio/actividad-6/juego5/s6-question.mp3"
      },
      correctAnswer: "no",
      feedback: {
        correctAudioUrl: "/audio/actividad-6/juego5/s6-fb-correct.mp3",
        incorrectAudioUrl: "/audio/actividad-6/juego5/s6-fb-incorrect.mp3",
        correctText: "Muy bien. Los amigos no amenazan con dejar de quererte. Comportándote de esa manera Cris se va a asustar y a enfadar y entonces sí que dejará de ser tu amiga.",
        incorrectText: "No, no está contenta, Cris está asustada, fíjate en su cara. Probablemente ya no va a querer ser tu amiga."
      }
    }
  ] as VideoSegment[]
};