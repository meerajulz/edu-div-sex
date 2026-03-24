'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura3Scene1Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-3', 'scene1', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });

    // Video only — no game yet
    localStorage.setItem('aventura-3-video-only', 'true');
    localStorage.setItem('aventura-3-return-to', '/aventura-3/scene2');
    router.push('/actividad-3/scene1');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-purple-500 via-pink-400 to-yellow-400">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
