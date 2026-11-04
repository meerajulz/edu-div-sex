'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { setAvanzadoContext } from '../../utils/avanzadoContext';

// Aventura 1 chain step (after the girls' changes explanation, actividad-1/scene3):
// open the Clara game directly (actividad-1/scene4 without its menstruation video),
// then continue to aventura-1/scene4 (higiene).
// No saveProgress: there is no DB scene row for this hop (juego1 is saved by its own wrapper).
export default function Aventura1Juego1ClaraPage() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    localStorage.setItem('aventura-1-return-to', '/aventura-1/scene4');
    localStorage.setItem('aventura-1-skip-video', 'true');
    setAvanzadoContext('AVENTURA 1 - Descubriendo mi sexualidad');
    router.push('/actividad-1/scene4');
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-green-500 via-emerald-400 to-teal-300">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
