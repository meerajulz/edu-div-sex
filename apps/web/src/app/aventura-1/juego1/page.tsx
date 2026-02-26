'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura1Juego1Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-1', 'juego1', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    localStorage.setItem('aventura-1-return-to', '/aventura-1/scene4');
    localStorage.setItem('aventura-1-skip-video', 'true');
    router.push('/actividad-1/scene4');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-green-500 via-emerald-400 to-teal-300">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
