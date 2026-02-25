'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { playGameAudio } from '../../utils/gameAudio';

export default function Aventura1Scene2Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  const [isSaving, setIsSaving] = useState(false);

  useActivityTracking();
  useActivityProtection();

  const handleViewContent = () => {
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound');
    saveProgress('aventura-1', 'scene2', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    localStorage.setItem('aventura-1-return-to', '/aventura-1/scene3');
    router.push('/actividad-1/scene5');
  };

  const handleNext = async () => {
    if (isSaving) return;
    setIsSaving(true);
    playGameAudio('/audio/button/Bright.mp3', 0.7, 'Button-Sound');

    await saveProgress('aventura-1', 'scene2', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });

    router.push('/aventura-1/scene3');
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 via-teal-400 to-cyan-300">
      <div className="absolute top-0 right-0 z-50">
        <FloatingMenu />
      </div>

      <div className="text-center text-white px-8 max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-widest mb-2 opacity-70">
          Aventura 1 &mdash; Escena 2
        </p>
        <h1 className="text-4xl font-bold mb-4">Cambios en Nico</h1>
        <p className="text-lg mb-3 opacity-80">
          Aprende sobre los cambios físicos que experimenta Nico durante la pubertad.
        </p>
        <button
          onClick={handleViewContent}
          className="mb-8 underline text-white/90 hover:text-white text-sm"
        >
          Ver contenido →
        </button>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/aventura-1')}
            className="bg-white/20 border-2 border-white text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-white/30 transition-colors"
          >
            Volver al inicio
          </button>
          <button
            onClick={handleNext}
            disabled={isSaving}
            className="bg-white text-blue-600 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors disabled:opacity-60"
          >
            {isSaving ? 'Guardando...' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
