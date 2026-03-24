'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';

export default function Aventura2Scene6Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const hasRedirected = useRef(false);

  useActivityTracking();
  useActivityProtection();

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    saveProgress('aventura-2', 'scene6', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    localStorage.setItem('aventura-2-return-to', '/aventura-2');
    router.push('/actividad-2/scene5');
  }, [saveProgress, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200">
      <div className="text-white text-xl animate-pulse">Cargando...</div>
    </div>
  );
}
