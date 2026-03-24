'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura2Scene2Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-2', 'scene2', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    localStorage.setItem('aventura-2-return-to', '/aventura-2/scene3');
    router.push('/actividad-2/scene2');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-yellow-400 via-blue-200 to-pink-300">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
