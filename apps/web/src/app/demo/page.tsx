'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DEMO_LEVELS, DEMO_TEXT, DemoLevel } from './demoConfig';
import { playGameAudio } from '../utils/gameAudio';

export default function DemoSelectorPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState<DemoLevel | null>(null);

  const handleSelect = (level: DemoLevel) => {
    if (leaving) return;
    setLeaving(level);
    try {
      playGameAudio('/audio/button/Bright.mp3', 0.7, 'Demo-Select');
    } catch {
      /* audio is optional */
    }
    // Make sure the video plays from the start (no "skip" button on first view)
    try {
      localStorage.removeItem('a2-scene1-video-watched');
      localStorage.removeItem('a8-scene1-video-watched');
    } catch {
      /* ignore */
    }
    setTimeout(() => router.push(DEMO_LEVELS[level].url), 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-400 via-pink-300 to-orange-200" />
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/image/amigues.png"
          alt=""
          fill
          priority
          className="object-contain object-top opacity-20"
        />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Image src="/svg/logo/logo.svg" alt="Saludiversex" width={120} height={40} className="w-auto h-auto" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {DEMO_TEXT.selectorTitle}
        </motion.h1>
        <motion.p
          className="mt-3 max-w-2xl text-center text-lg md:text-xl text-white/95 font-medium drop-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
        >
          {DEMO_TEXT.selectorSubtitle}
        </motion.p>
        <p className="mt-6 mb-6 text-white font-bold uppercase tracking-wide drop-shadow">
          {DEMO_TEXT.selectorHint}
        </p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {(Object.keys(DEMO_LEVELS) as DemoLevel[]).map((level, i) => {
            const item = DEMO_LEVELS[level];
            return (
              <motion.button
                key={level}
                onClick={() => handleSelect(level)}
                className={`w-72 md:w-80 rounded-3xl bg-gradient-to-br ${item.gradient} p-6 text-white shadow-2xl text-left focus:outline-none focus:ring-4 focus:ring-white/70`}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  leaving === level
                    ? { scale: [1, 1.08, 0.9], opacity: [1, 1, 0] }
                    : { opacity: leaving ? 0.4 : 1, y: 0 }
                }
                transition={{ delay: leaving ? 0 : 0.3 + i * 0.15, duration: leaving ? 0.7 : 0.5 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="inline-block rounded-full bg-white/25 px-3 py-1 text-sm font-bold uppercase tracking-wide">
                  {item.label}
                </span>
                <div className="relative mx-auto my-4 h-32 w-32">
                  <Image src={item.image} alt={item.title} fill className="object-contain drop-shadow-lg" />
                </div>
                <h2 className="text-2xl font-extrabold">{item.title}</h2>
                <p className="mt-2 text-white/95 leading-snug">{item.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-bold text-gray-800">
                  ▶ Jugar
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
