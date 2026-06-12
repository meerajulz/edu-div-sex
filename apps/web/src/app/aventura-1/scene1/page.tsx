'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { setAvanzadoContext } from '../../utils/avanzadoContext';

export default function Aventura1Scene1Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-1', 'scene1', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    // Start the chain at actividad-1/scene2, then return into aventura-1/scene2
    // which continues to actividad-1/scene5 → scene6 → scene4.
    localStorage.setItem('aventura-1-return-to', '/aventura-1/scene2');
    setAvanzadoContext('AVENTURA 1 - Descubriendo mi sexualidad');
    router.push('/actividad-1/scene2');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-purple-500 via-pink-400 to-orange-300">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
