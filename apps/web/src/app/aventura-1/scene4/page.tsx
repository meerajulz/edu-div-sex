'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

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
    // Chain: actividad-4/scene1 (video+game) → actividad-1/scene4 (skip video, game) → aventura-1/juego2
    localStorage.setItem('aventura-1-return-to', '/actividad-1/scene4');
    localStorage.setItem('aventura-1-skip-video-on-return', 'true');
    localStorage.setItem('aventura-1-next-return-to', '/aventura-1/juego2');
    router.push('/actividad-4/scene1');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-cyan-500 via-sky-400 to-blue-400">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
