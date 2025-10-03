// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
// import Image from 'next/image';
// import { Character } from './JuegoUnoActividad4';

// interface CharacterSelectionProps {
//   onCharacterSelect: (character: Character) => void;
//   isAnimating: boolean;
// }

// export default function CharacterSelection({ onCharacterSelect, isAnimating }: CharacterSelectionProps) {
//   const [showCharacters, setShowCharacters] = useState(true);

//   const handleCharacterClick = (character: Character) => {
//     if (isAnimating) return;
    
//     // Hide characters with animation
//     setShowCharacters(false);
    
//     // Delay the callback to allow exit animation
//     setTimeout(() => {
//       onCharacterSelect(character);
//     }, 500);
//   };

//   return (
//     <div className="flex items-center justify-center space-x-12 mt-10">
//       <AnimatePresence>
//         {showCharacters && (
//           <>
//             {/* Dani (Male) */}
//             <motion.div
//               className="text-center cursor-pointer"
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.5 }}
//               onClick={() => handleCharacterClick('dani')}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <div className="w-48 h-80 relative">
//                 <Image
//                   src="/image/actividad_4/juego1/dani.png"
//                   alt="Dani"
//                   fill
//                   className="object-contain"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.style.display = 'none';
//                   }}
//                 />
//               </div>
//               <div className="text-blue-800 font-bold text-lg bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-200">
//                 Dani (Chico)
//               </div>
//             </motion.div>

//             {/* Cris (Female) */}
//             <motion.div
//               className="text-center cursor-pointer"
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               onClick={() => handleCharacterClick('cris')}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <div className="w-48 h-80 relative">
//                 <Image
//                   src="/image/actividad_4/juego1/cris.png"
//                   alt="Cris"
//                   fill
//                   className="object-contain"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.style.display = 'none';
//                   }}
//                 />
//               </div>
//               <div className="text-pink-500 text-xl font-bold bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-pink-200">
//                 Cris (Chica)
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Character } from './JuegoUnoActividad4';

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void;
  isAnimating: boolean;
}

export default function CharacterSelection({ onCharacterSelect, isAnimating }: CharacterSelectionProps) {
  const [showCharacters, setShowCharacters] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // We track audio playing state passed from parent component
  useEffect(() => {
    // This state will be set by the parent component (JuegoUnoActividad4)
    // We're just adding this state to track when audio is playing
    const checkParentAudioState = () => {
      // If the parent has an audio player with id 'intro-audio'
      const parentAudio = document.getElementById('intro-audio') as HTMLAudioElement;
      if (parentAudio && !parentAudio.paused) {
        setIsAudioPlaying(true);
        
        // Check again when audio ends
        const checkAgain = () => {
          setIsAudioPlaying(false);
          parentAudio.removeEventListener('ended', checkAgain);
        };
        
        parentAudio.addEventListener('ended', checkAgain);
        return () => {
          parentAudio.removeEventListener('ended', checkAgain);
        };
      } else {
        // Fallback: assume audio plays for 3 seconds if we can't detect it
        setIsAudioPlaying(true);
        const timer = setTimeout(() => {
          setIsAudioPlaying(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };
    
    return checkParentAudioState();
  }, []);

  const handleCharacterClick = (character: Character) => {
    // Prevent clicking if animation is happening or audio is playing
    if (isAnimating || isAudioPlaying) return;
    
    // Hide characters with animation
    setShowCharacters(false);
    
    // Delay the callback to allow exit animation
    setTimeout(() => {
      onCharacterSelect(character);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center space-x-16 mt-24">
      <AnimatePresence>
        {showCharacters && (
          <>
            {/* Dani (Male) */}
            <motion.div
              className={`text-center ${isAudioPlaying ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isAudioPlaying ? 0.75 : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              onClick={() => handleCharacterClick('dani')}
              whileHover={isAudioPlaying ? {} : { scale: 1.1 }}
              whileTap={isAudioPlaying ? {} : { scale: 0.95 }}
            >
              <div className="w-64 h-96 relative">
                <Image
                  src="/image/actividad_4/juego1/dani.png"
                  alt="Dani"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-blue-800 font-bold text-lg bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-200">
                Dani (Chico)
              </div>
            </motion.div>

            {/* Cris (Female) */}
            <motion.div
              className={`text-center ${isAudioPlaying ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isAudioPlaying ? 0.75 : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => handleCharacterClick('cris')}
              whileHover={isAudioPlaying ? {} : { scale: 1.1 }}
              whileTap={isAudioPlaying ? {} : { scale: 0.95 }}
            >
              <div className="w-64 h-96 relative">
                <Image
                  src="/image/actividad_4/juego1/cris.png"
                  alt="Cris"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-pink-500 text-xl font-bold bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-pink-200">
                Cris (Chica)
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}