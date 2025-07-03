'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import JugarButton from '../../../components/JugarButton/JugarButton';
import React, { useState } from 'react';

export default function JuegoDos() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const audio = new Audio('/audio/button/Bright.mp3');
    audio.volume = 0.7;
    audio.play().catch(console.warn);
    setTimeout(() => {
      setIsAnimating(false);
      router.push('/actividad-1/scene5');
    }, 800);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-300 to-pink-200 text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6">Juego 2 (Placeholder)</h1>
      <p className="mb-8 text-center max-w-md">
        Aquí irá el contenido del Juego 2. Haz clic en “Jugar” para continuar a la Escena 5.
      </p>
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <JugarButton onClick={handleClick} disabled={isAnimating} />
      </motion.div>
    </motion.div>
  );
}
