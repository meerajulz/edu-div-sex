'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { setAvanzadoContext } from '../../utils/avanzadoContext';

// Aventura 4, Cartel 1 chain step: after "¿Qué dicen mi cara y mi tono de voz?"
// (actividad-5/scene1-1) → Juego 2 "¿Qué cara pondrá…?" (actividad-5/scene1-2) → map.
// No saveProgress here: there is no DB scene row for this hop (section 1 completion
// is tracked by aventura-4/scene1).
export default function Aventura4Juego2Page() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    localStorage.setItem('aventura-4-return-to', '/aventura-4');
    setAvanzadoContext('AVENTURA 4 - Nos entendemos y respetamos');
    router.push('/actividad-5/scene1-2');
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-400">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
