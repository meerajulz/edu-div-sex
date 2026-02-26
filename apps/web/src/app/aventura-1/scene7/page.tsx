'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura1Scene7Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-1', 'scene7', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    localStorage.setItem('aventura-1-return-to', '/aventura-1');
    router.push('/actividad-1/scene7');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-amber-500 via-orange-400 to-yellow-300">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
