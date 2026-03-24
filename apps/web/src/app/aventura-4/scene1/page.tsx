'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura4Scene1Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-4', 'scene1', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });

    localStorage.setItem('aventura-4-return-to', '/aventura-4');
    router.push('/actividad-5/scene1');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-400">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
