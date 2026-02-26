'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura1Juego2Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-1', 'juego2', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    // Chain: scene4 (video only) → scene2 (full video+game) → scene6 (skip video, game) → /aventura-1
    localStorage.setItem('aventura-1-video-only', 'true');
    localStorage.setItem('aventura-1-return-to', '/actividad-4/scene2');
    localStorage.setItem('aventura-1-next-return-to', '/actividad-1/scene6');
    localStorage.setItem('aventura-1-skip-video-on-next-return', 'true');
    localStorage.setItem('aventura-1-after-next-return-to', '/aventura-1');
    router.push('/actividad-1/scene4');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-sky-500 via-blue-400 to-indigo-400">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
