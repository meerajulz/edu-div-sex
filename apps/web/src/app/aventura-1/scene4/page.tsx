'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { setAvanzadoContext } from '../../utils/avanzadoContext';

export default function Aventura1Scene4Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-1', 'scene4', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    // Chain: actividad-4/scene1 (higiene video+game) → aventura-1/juego2
    // (Client feedback: the Clara game must NOT repeat after the higiene scene.)
    localStorage.setItem('aventura-1-return-to', '/aventura-1/juego2');
    setAvanzadoContext('AVENTURA 1 - Descubriendo mi sexualidad');
    router.push('/actividad-4/scene1');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-cyan-500 via-sky-400 to-blue-400">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
