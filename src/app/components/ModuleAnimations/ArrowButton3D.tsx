// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Image from 'next/image';
// import { playAudio } from '../../utils/audioPlayer';

// interface ArrowButtonProps {
//   isVisible: boolean;
//   targetId: number; // ID of the activity to point to
//   text?: string; // Text to display (default: "CLICK")
//   position?: {
//     top?: string;
//     left?: string;
//     right?: string;
//     bottom?: string;
//     transform?: string;
//   };
//   soundSrc?: string; // Sound to play when appearing
//   clickSoundSrc?: string; // Sound to play when clicked
//   onClick?: () => void; // Callback for when arrow is clicked
//   delay?: number; // Delay before showing the arrow
//   size?: {
//     width: number;
//     height: number;
//   };
//   pulseAnimation?: boolean; // Whether to add a pulse animation
//   customColor?: string; // Custom color for the arrow
//   targetPositions?: { [key: number]: { x: number; y: number } }; // Positions for different target IDs
// }

// const ArrowButton: React.FC<ArrowButtonProps> = ({
//   isVisible = false,
//   targetId = 1,
//   text = "CLICK",
//   position = {
//     bottom: '30%',
//     left: '50%',
//     transform: 'translateX(-50%) rotate(0deg)'
//   },
//   soundSrc = '/audio/whoosh.mp3',
//   clickSoundSrc = '/audio/click-aventura.mp3',
//   onClick,
//   delay = 0.5,
//   size = { width: 120, height: 80 },
//   pulseAnimation = true,
//   customColor,
//   targetPositions
// }) => {
//   const [isReady, setIsReady] = useState(false);
//   const [hasPlayedSound, setHasPlayedSound] = useState(false);
//   const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
//   const [arrowRotation, setArrowRotation] = useState(0);
  
//   // Ref to track if component is mounted
//   const isMountedRef = useRef(true);
  
//   // Set initial state when component becomes visible
//   useEffect(() => {
//     if (isVisible) {
//       // Small delay before showing the arrow
//       const timer = setTimeout(() => {
//         if (isMountedRef.current) {
//           setIsReady(true);
          
//           // Play appearance sound
//           if (soundSrc && !hasPlayedSound) {
//             playAudio(soundSrc, undefined, 0.7).catch(e => 
//               console.warn("Failed to play arrow appearance sound:", e)
//             );
//             setHasPlayedSound(true);
//           }
//         }
//       }, 100);
      
//       return () => clearTimeout(timer);
//     } else {
//       setIsReady(false);
//       setHasPlayedSound(false);
//     }
//   }, [isVisible, soundSrc, hasPlayedSound]);
  
//   // Calculate the arrow position and rotation based on target ID
//   useEffect(() => {
//     // Default position points to the center
//     let newTargetPosition = { x: 0, y: 0 };
//     let newRotation = 0;
    
//     // If custom target positions are provided, use those
//     if (targetPositions && targetPositions[targetId]) {
//       newTargetPosition = targetPositions[targetId];
      
//       // Calculate rotation based on the position (point toward the target)
//       newRotation = Math.atan2(newTargetPosition.y, newTargetPosition.x) * (180 / Math.PI);
//     } else {
//       // Default positions based on target ID
//       switch (targetId) {
//         case 1: // First activity (usually in front)
//           newTargetPosition = { x: 0, y: -100 };
//           newRotation = -90; // Point upward
//           break;
//         case 2: // Second activity (usually to the left)
//           newTargetPosition = { x: -150, y: -150 };
//           newRotation = -135; // Point up-left
//           break;
//         case 3: // Third activity (usually to the right)
//           newTargetPosition = { x: 150, y: -150 };
//           newRotation = -45; // Point up-right
//           break;
//         case 4: // Fourth activity (far right)
//           newTargetPosition = { x: 200, y: -200 };
//           newRotation = -30; // Point up-right
//           break;
//         default:
//           newTargetPosition = { x: 0, y: -100 };
//           newRotation = -90; // Default to pointing upward
//       }
//     }
    
//     setTargetPosition(newTargetPosition);
//     setArrowRotation(newRotation);
//   }, [targetId, targetPositions]);
  
//   // Handle cleanup when component unmounts
//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);
  
//   // Handle click event
//   const handleClick = () => {
//     // Play click sound
//     if (clickSoundSrc) {
//       playAudio(clickSoundSrc).catch(e => 
//         console.warn("Failed to play arrow click sound:", e)
//       );
//     }
    
//     // Call onClick callback if provided
//     if (onClick) {
//       onClick();
//     }
//   };
  
//   // Don't render if not visible or not ready
//   if (!isVisible || !isReady) {
//     return null;
//   }
  
//   // Create the position style from props
//   const positionStyle: React.CSSProperties = {
//     position: 'absolute',
//     zIndex: 55,
//   };
  
//   if (position.top) positionStyle.top = position.top;
//   if (position.bottom) positionStyle.bottom = position.bottom;
//   if (position.left) positionStyle.left = position.left;
//   if (position.right) positionStyle.right = position.right;
//   if (position.transform) positionStyle.transform = position.transform;
  
//   // Animations
//   const arrowVariants = {
//     hidden: { 
//       opacity: 0,
//       scale: 0.5,
//       y: 20
//     },
//     visible: { 
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: { 
//         type: 'spring',
//         damping: 12,
//         stiffness: 100,
//         delay
//       }
//     },
//     pulse: {
//       scale: [1, 1.1, 1],
//       transition: {
//         duration: 1.5,
//         repeat: Infinity,
//         repeatType: 'loop' as const
//       }
//     }
//   };
  
//   const textVariants = {
//     hidden: { 
//       opacity: 0,
//     },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         delay: delay + 0.3
//       }
//     }
//   };
  
//   return (
//     <div className="absolute inset-0 w-full h-full pointer-events-none z-55">
//       <div className="relative w-full h-full">
//         <motion.div
//           className="absolute cursor-pointer pointer-events-auto"
//           style={positionStyle}
//           initial="hidden"
//           animate={pulseAnimation ? ["visible", "pulse"] : "visible"}
//           variants={arrowVariants}
//           onClick={handleClick}
//         >
//           <div 
//             className="relative flex flex-col items-center"
//             style={{
//               width: `${size.width}px`,
//               height: `${size.height}px`
//             }}
//           >
//             {/* Arrow image */}
//             <div 
//               className="relative" 
//               style={{
//                 width: `${size.width * 0.8}px`,
//                 height: `${size.height * 0.6}px`,
//                 transform: `rotate(${arrowRotation}deg)`
//               }}
//             >
//               <svg 
//                 viewBox="0 0 60 40" 
//                 width="100%" 
//                 height="100%"
//                 fill={customColor || "#FF5722"}
//               >
//                 <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
//                   <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
//                 </filter>
//                 {/* Arrow shape */}
//                 <path 
//                   d="M10,20 L40,20 L40,10 L60,30 L40,50 L40,40 L10,40 Z" 
//                   filter="url(#shadow)"
//                 />
//               </svg>
//             </div>
            
//             {/* Text label */}
//             <motion.div
//               className="mt-2 bg-white rounded-full px-4 py-1 shadow-md"
//               initial="hidden"
//               animate="visible"
//               variants={textVariants}
//             >
//               <p className={`text-base font-bold text-center text-orange-600`}>
//                 {text}
//               </p>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ArrowButton;

/*
'use client';

import React from 'react';

interface ArrowButtonProps {
  isVisible: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-96 left-1/4 transform -translate-x-1/4 z-[9999] bg-red-500 p-4 rounded-lg text-white">
      Simple Arrow
    </div>
  );
};

export default ArrowButton;

*/

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ArrowButton3DProps {
  x: number;
  y: number;
  z: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  visible: boolean;
}

const ArrowButton3D: React.FC<ArrowButton3DProps> = ({
  x,
  y,
  z,
  scale = 1,
  rotateX = 0,
  rotateY = 0,
  visible
}) => {
  if (!visible) return null;

  return (
    <motion.div
      className="absolute"
      style={{ transformStyle: 'preserve-3d', zIndex: 50 }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        x,
        y: y - 120, // Arrow a bit above the label
        z,
        rotateX,
        rotateY,
        scale: scale * 1.2, // Maybe a little bigger
      }}
      transition={{ type: 'spring', damping: 12, stiffness: 70 }}
    >
      <div className="relative" style={{ width: '80px', height: '80px' }}>
        <svg viewBox="0 0 60 40" width="100%" height="100%" fill="#FF5722">
          <path d="M10,20 L40,20 L40,10 L60,30 L40,50 L40,40 L10,40 Z" />
        </svg>
      </div>
    </motion.div>
  );
};

export default ArrowButton3D;


