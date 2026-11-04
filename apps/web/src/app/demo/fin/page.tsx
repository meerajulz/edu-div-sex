'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DEMO_LEVELS, DEMO_TEXT, DemoLevel } from '../demoConfig';

export default function DemoEndPage() {
  const router = useRouter();
  // Read ?nivel= on the client (avoids useSearchParams Suspense requirement)
  const [nivel, setNivel] = useState<DemoLevel | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('nivel');
    if (param === 'basico' || param === 'avanzado') setNivel(param);
  }, []);

  const other: DemoLevel | null = nivel === 'basico' ? 'avanzado' : nivel === 'avanzado' ? 'basico' : null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200" />

      <div className="absolute top-4 left-4 z-10">
        <Image src="/svg/logo/logo.svg" alt="Saludiversex" width={120} height={40} className="w-auto h-auto" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <motion.div
          className="w-full max-w-2xl rounded-3xl bg-white/95 p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <div className="text-center text-6xl">🎉</div>
          <h1 className="mt-2 text-center text-4xl font-extrabold text-fuchsia-700">{DEMO_TEXT.endTitle}</h1>
          <p className="mt-4 text-center text-lg text-gray-700">{DEMO_TEXT.endIntro}</p>

          <ul className="mt-6 space-y-3">
            {DEMO_TEXT.endHighlights.map((text, i) => (
              <motion.li
                key={text}
                className="flex items-start gap-3 rounded-xl bg-pink-50 px-4 py-3 text-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
              >
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-600 text-sm font-bold text-white">✓</span>
                <span className="font-medium">{text}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {other && (
              <button
                onClick={() => router.push(DEMO_LEVELS[other].url)}
                className={`rounded-full bg-gradient-to-r ${DEMO_LEVELS[other].gradient} px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105`}
              >
                {DEMO_TEXT.tryOther}: {DEMO_LEVELS[other].label}
              </button>
            )}
            <button
              onClick={() => router.push('/demo')}
              className="rounded-full border-2 border-fuchsia-600 bg-white px-6 py-3 font-bold text-fuchsia-700 shadow transition-transform hover:scale-105"
            >
              {DEMO_TEXT.backToStart}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
