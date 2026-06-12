// Header context for "Nivel Avanzado" (aventura) flows.
//
// Aventura levels reuse basic-level scenes. When the user enters those scenes
// through an aventura, we want the video header (LogoComponent) to show the
// aventura title + menu-item name (e.g. "AVENTURA 1 - NUESTRO CUERPO CAMBIA")
// instead of the basic-level title.
//
// Each aventura wrapper page calls setAvanzadoContext() right before redirecting
// into a basic scene; the aventura menu page calls clearAvanzadoContext() on mount
// so the override never leaks into normal basic-level visits. A short TTL is a
// backstop in case the user exits without passing back through the menu.

const KEY = 'avanzado-context';
const TTL_MS = 15 * 60 * 1000; // 15 min backstop

export function setAvanzadoContext(text: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ text, expires: Date.now() + TTL_MS }));
  } catch {
    /* ignore unavailable storage */
  }
}

export function clearAvanzadoContext() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore unavailable storage */
  }
}
