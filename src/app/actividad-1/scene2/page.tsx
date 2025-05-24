'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
export default function Scene2Page() {
  const router = useRouter();

  const handleJugarClick = () => {
    console.log('Start Scene 2 game');
    // placeholder action
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-blue-200 to-pink-300 z-0" />

      {/* Floating bubbles */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating menu */}
      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

      {/* Jugar Button */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <JugarButton onClick={handleJugarClick} />
      </div>
    </motion.div>
  );
}
