// Password generator for mentally disabled children
// Creates secure but memorable passwords using simple words

const SIMPLE_WORDS = [
  // Animales (Animals)
  'gato', 'perro', 'pájaro', 'pez', 'oso', 'león', 'pato', 'rana', 'vaca', 'cerdo',
  'zorro', 'búho', 'abeja', 'hormiga', 'murciélago', 'ciervo', 'cabra', 'cordero', 'foca', 'lobo',
  'conejo', 'ratón', 'caballo', 'pollo', 'oveja', 'mono', 'elefante', 'jirafa', 'tigre', 'zebra',
  
  // Colores (Colors)
  'rojo', 'azul', 'verde', 'amarillo', 'rosa', 'morado', 'naranja', 'blanco', 'negro', 'marrón',
  'gris', 'dorado', 'plateado', 'violeta',
  
  // Objetos simples (Simple objects)
  'pelota', 'libro', 'carro', 'árbol', 'casa', 'sol', 'luna', 'estrella', 'piedra', 'barco',
  'bici', 'lápiz', 'taza', 'sombrero', 'bolsa', 'caja', 'llave', 'puerta', 'juguete', 'campana',
  'mesa', 'silla', 'cama', 'flor', 'agua', 'fuego', 'tierra', 'aire', 'nube', 'lluvia',
  
  // Partes del cuerpo (Body parts - appropriate for educational context)
  'mano', 'pie', 'cabeza', 'ojo', 'oreja', 'nariz', 'brazo', 'pierna', 'pelo', 'cara',
  'boca', 'diente', 'lengua', 'cuello', 'espalda', 'barriga', 'corazón',
  
  // Acciones simples (Simple actions)
  'correr', 'caminar', 'saltar', 'jugar', 'leer', 'comer', 'dormir', 'cantar', 'bailar', 'ayudar',
  'amar', 'abrazar', 'sonreír', 'reír', 'mirar', 'ver', 'oír', 'hablar', 'dibujar', 'escribir',
  'nadar', 'volar', 'cocinar', 'limpiar', 'estudiar', 'trabajar', 'pensar', 'soñar',
  
  // Adjetivos simples (Simple adjectives)
  'grande', 'pequeño', 'rápido', 'lento', 'feliz', 'triste', 'bueno', 'malo', 'caliente', 'frío',
  'tibio', 'fresco', 'suave', 'duro', 'nuevo', 'viejo', 'limpio', 'sucio', 'bonito', 'feo',
  'alto', 'bajo', 'gordo', 'flaco', 'fuerte', 'débil', 'rico', 'dulce', 'salado',
  
  // Números como palabras (Numbers as words)
  'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  
  // Familia (Family)
  'mamá', 'papá', 'hijo', 'hija', 'hermano', 'hermana', 'abuelo', 'abuela', 'tío', 'tía',
  
  // Comida simple (Simple food)
  'pan', 'leche', 'queso', 'manzana', 'plátano', 'naranja', 'uva', 'fresa', 'tomate', 'papa',
  'arroz', 'pasta', 'pollo', 'pescado', 'huevo', 'sopa', 'dulce', 'helado',
  
  // Tiempo y días (Time and days)
  'día', 'noche', 'mañana', 'tarde', 'ayer', 'hoy', 'lunes', 'martes', 'sábado', 'domingo'
];

export interface GeneratedPassword {
  password: string;
  words: string[];
  strength: 'medium' | 'strong';
}

/**
 * Generates a secure but simple password using three random Spanish words with spaces
 * Example: "gato azul correr" or "feliz árbol cinco"
 */
export function generateSimplePassword(): GeneratedPassword {
  // Select 3 random words
  const selectedWords: string[] = [];
  const usedIndices = new Set<number>();
  
  while (selectedWords.length < 3) {
    const randomIndex = Math.floor(Math.random() * SIMPLE_WORDS.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedWords.push(SIMPLE_WORDS[randomIndex]);
    }
  }
  
  const password = selectedWords.join(' ');
  
  // Calculate strength based on entropy
  // 3 words from ~100 word pool = ~100^3 = 1,000,000 combinations
  // Plus spaces make it even stronger against dictionary attacks
  const strength = password.length >= 12 ? 'strong' : 'medium';
  
  return {
    password,
    words: selectedWords,
    strength
  };
}

/**
 * Validates that a password follows our simple password format
 */
export function validateSimplePassword(password: string): boolean {
  // Check if password is 3 words separated by spaces
  const words = password.trim().split(' ');
  
  if (words.length !== 3) {
    return false;
  }
  
  // Check if all words are in our approved list
  return words.every(word => SIMPLE_WORDS.includes(word.toLowerCase()));
}

/**
 * Generates a username from first and last name
 * Format: firstname.lastname or firstname.lastname.number (if duplicate)
 */
export function generateUsername(firstName: string, lastName: string, existingUsernames: string[] = []): string {
  const baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  
  // Remove any non-alphanumeric characters except dots
  const cleanUsername = baseUsername.replace(/[^a-z0-9.]/g, '');
  
  // Check if username already exists
  if (!existingUsernames.includes(cleanUsername)) {
    return cleanUsername;
  }
  
  // If it exists, add a number
  let counter = 1;
  let newUsername = `${cleanUsername}.${counter}`;
  
  while (existingUsernames.includes(newUsername)) {
    counter++;
    newUsername = `${cleanUsername}.${counter}`;
  }
  
  return newUsername;
}

/**
 * Gets password strength description for display (in Spanish for users)
 */
export function getPasswordStrengthDescription(password: string): string {
  const words = password.trim().split(' ');
  
  if (words.length !== 3) {
    return 'La contraseña debe ser exactamente 3 palabras simples separadas por espacios';
  }
  
  if (!validateSimplePassword(password)) {
    return 'La contraseña debe usar solo palabras simples aprobadas';
  }
  
  return password.length >= 12 ? 'Contraseña fuerte' : 'Contraseña buena';
}

/**
 * Gets password strength description in English for internal API responses
 */
export function getPasswordStrengthDescriptionEN(password: string): string {
  const words = password.trim().split(' ');
  
  if (words.length !== 3) {
    return 'Password must be exactly 3 simple words separated by spaces';
  }
  
  if (!validateSimplePassword(password)) {
    return 'Password must use only approved simple words';
  }
  
  return password.length >= 12 ? 'Strong password' : 'Good password';
}