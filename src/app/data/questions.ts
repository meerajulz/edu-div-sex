export interface Question {
  id: number;
  question: string;
  supportType: "1" | "0" | null; // "1" = Ninguno, "0" = Supervisión
  frequency: "1" | "0" | null; // "1" = Siempre, "0" = A veces
}

export const questionsData: Question[] = [
  { id: 1, question: "Usar el transporte público", supportType: null, frequency: null },
  { id: 2, question: "Manejar dinero en efectivo para realizar pagos simples", supportType: null, frequency: null },
  { id: 3, question: "Completar tareas siguiendo instrucciones simples", supportType: null, frequency: null },
  { id: 4, question: "Repetir actividades después de una demostración práctica", supportType: null, frequency: null },
  { id: 5, question: "Pedir aclaraciones o ayuda cuando no comprende algo", supportType: null, frequency: null },
  { id: 6, question: "Leer frases simples y comprender su significado", supportType: null, frequency: null },
  { id: 7, question: "Comprender instrucciones básicas escritas", supportType: null, frequency: null },
  { id: 8, question: "Comprender y responder adecuadamente a preguntas simples", supportType: null, frequency: null },
  { id: 9, question: "Escuchar una breve historia y responder preguntas relacionadas", supportType: null, frequency: null },
  { id: 10, question: "Comprende el significado de oraciones compuestas", supportType: null, frequency: null },
  { id: 11, question: "Ducharse o bañarse", supportType: null, frequency: null },
  { id: 12, question: "Utilizar el baño (retrete) de forma autónoma y adecuada", supportType: null, frequency: null },
];
