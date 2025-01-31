'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Volume2, User, Flag, Info, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface MenuItem {
  id: string;
  icon: React.ReactNode;
  href: string;
  sound?: string;
}

const FloatingMenu = () => {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number }[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    // Initialize audio on component mount
    useEffect(() => {
      const audioElement = new Audio('/ui-sound/click.mp3');
      audioElement.preload = 'auto';
      setAudio(audioElement);
    }, []);
    

  const menuItems: MenuItem[] = [
    { id: 'home', icon: <Home size={24} />, href: '/', sound: '/ui-sound/click.mp3' },
    { id: 'sound', icon: <Volume2 size={24} />, href: '/sound', sound: '/ui-sound/click.mp3' },
    { id: 'profile', icon: <User size={24} />, href: '/profile', sound: '/ui-sound/click.mp3' },
    { id: 'language', icon: <Flag size={24} />, href: '/language', sound: '/ui-sound/click.mp3' },
    { id: 'info', icon: <Info size={24} />, href: '/info', sound: '/ui-sound/click.mp3' },
    { id: 'exit', icon: <LogOut size={24} />, href: '#', sound: '/ui-sound/click.mp3' },
  ];

  const playSound = async () => {
    try {
      if (audio) {
        // Reset the audio to start
        audio.currentTime = 0;
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleClick = async (item: MenuItem, e: React.MouseEvent) => {
    // Get click coordinates relative to the button
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add ripple effect
    const rippleId = `${item.id}-${Date.now()}`;
    setRipples(prev => [...prev, { id: rippleId, x, y }]);

    // Play sound
    await playSound();

    // Set active state
    setActiveId(item.id);

    // Wait for animations
    await new Promise(resolve => setTimeout(resolve, 600));

    // Navigate
    router.push(item.href);
  };

  const removeRipple = (rippleId: string) => {
    setRipples(prev => prev.filter(r => r.id !== rippleId));
  };

  return (
    <motion.div
      className="fixed right-8 top-5 -translate-y-1/2 flex flex-col gap-6 bg-white/10 backdrop-blur-sm p-4 rounded-full shadow-lg"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {menuItems.map((item) => (
        <motion.div
          key={item.id}
          className="relative"
          initial={false}
        >
          <motion.button
            className={`w-12 h-12 rounded-full flex items-center justify-center 
              overflow-hidden relative
              ${activeId === item.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            onClick={(e) => handleClick(item, e)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={activeId === item.id ? {
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            } : {}}
            transition={{
              duration: 0.6,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={activeId === item.id ? {
                opacity: [1, 0, 1],
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {item.icon}
            </motion.div>

            <AnimatePresence>
              {ripples.map(ripple => ripple.id.startsWith(item.id) && (
                <motion.span
                  key={ripple.id}
                  className="absolute bg-blue-400/30"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    left: ripple.x - 5,
                    top: ripple.y - 5,
                  }}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 15, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onAnimationComplete={() => removeRipple(ripple.id)}
                />
              ))}
            </AnimatePresence>
          </motion.button>

          {/* Flash effect on active */}
          <AnimatePresence>
            {activeId === item.id && (
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Tooltip */}
          <motion.div
            className="absolute right-full mr-2 bg-gray-800 text-white px-2 py-1 rounded 
              text-sm whitespace-nowrap opacity-0 pointer-events-none"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: activeId === item.id ? 1 : 0,
              x: activeId === item.id ? 0 : -10 
            }}
            transition={{ duration: 0.2 }}
          >
            {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FloatingMenu;