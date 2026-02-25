'use client';

// Juego 4 – ¡Concurso! (Nuevo – en desarrollo)
// Contenido pendiente de creación. Guarda progreso al completar.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { playGameAudio } from '../../utils/gameAudio';

export default function Aventura1Juego4Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const [isSaving, setIsSaving] = useState(false);

  // Track this URL so the ContinueButton knows where to resume
  useActivityTracking();
  useActivityProtection();

  const handleComplete = async () => {
    if (isSaving) return;
    setIsSaving(true);
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound');

    await saveProgress('aventura-1', 'juego4', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });

    router.push('/aventura-1');
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-orange-400 via-pink-400 to-purple-500">
      <div className="absolute top-0 right-0 z-50">
        <FloatingMenu />
      </div>

      <div className="text-center text-white px-8 max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-widest mb-2 opacity-70">
          Aventura 1 &mdash; Juego 4
        </p>
        <h1 className="text-4xl font-bold mb-4">¡Concurso!</h1>
        <p className="text-xl mb-10 opacity-80">Contenido en desarrollo...</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/aventura-1')}
            className="bg-white/20 border-2 border-white text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-white/30 transition-colors"
          >
            Volver al inicio
          </button>
          <button
            onClick={handleComplete}
            disabled={isSaving}
            className="bg-white text-purple-600 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-purple-50 transition-colors disabled:opacity-60"
          >
            {isSaving ? 'Guardando...' : '¡Completar aventura!'}
          </button>
        </div>
      </div>
    </div>
  );
}
