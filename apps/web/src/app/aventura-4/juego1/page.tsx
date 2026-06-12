'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FloatingMenu from '../../components/FloatingMenu/FloatingMenu';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking, clearLastActivity } from '../../hooks/useActivityTracking';
import JuegoUnoAventura4 from './JuegoUnoAventura4/JuegoUnoAventura4';
import { setAvanzadoContext } from '../../utils/avanzadoContext';

export default function Aventura4Juego1Page() {
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  useActivityTracking();

  const [showGame, setShowGame] = useState(true);

  const handleGameComplete = async () => {
    setShowGame(false);
    saveProgress('aventura-4', 'juego1', 'completed', 100, {
      completed_at: new Date().toISOString(),
    });
    // Chain to JuegoDos (actividad-5/scene1-1), which returns to /aventura-4
    localStorage.setItem('aventura-4-return-to', '/aventura-4');
    setAvanzadoContext('AVENTURA 4 - Nos entendemos y respetamos');
    router.push('/actividad-5/scene1-1');
  };

  const handleClose = async () => {
    // Clear any stale aventura-4 flags so the hub doesn't redirect back
    localStorage.removeItem('aventura-4-return-to');
    localStorage.removeItem('aventura-4-video-only');
    // Clear last activity so ContinueButton doesn't point back to the video page
    await clearLastActivity();
    router.replace('/aventura-4');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-400">
      <div className="absolute top-0 right-0 z-50">
        <FloatingMenu />
      </div>
      <JuegoUnoAventura4
        isVisible={showGame}
        onClose={handleClose}
        onGameComplete={handleGameComplete}
      />
    </div>
  );
}
