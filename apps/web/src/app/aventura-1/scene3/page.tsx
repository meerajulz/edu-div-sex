'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura1Scene3Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-1', 'scene3', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    localStorage.setItem('aventura-1-return-to', '/aventura-1/juego1');
    router.push('/actividad-1/scene6');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-teal-500 via-blue-400 to-indigo-400">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
