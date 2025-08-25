'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { logoConfigs } from './logoConfig';

interface LogoComponentProps {
  // Option 1: Use predefined config key
  configKey?: string;
  
  // Option 2: Use aventura number
  aventuraNumber?: 1 | 2 | 3 | 4 | 5 | 6;
  
  // Option 3: Completely custom
  customText?: string;
  customImage?: string;
  customBgColor?: string;
}

export default function LogoComponent({ 
  configKey,
  aventuraNumber, 
  customText,
  customImage,
  customBgColor 
}: LogoComponentProps) {
  
  let imageSrc: string;
  let text: string;
  let bgColor: string;

  // Default colors for each aventura number
  const aventuraColors = {
    1: 'bg-green-500',
    2: 'bg-blue-500',
    3: 'bg-pink-500',
    4: 'bg-red-500',
    5: 'bg-yellow-500',
    6: 'bg-orange-500'
  };

  // Priority: custom values > config key > aventura number > default
  if (customImage && customText) {
    imageSrc = customImage;
    text = customText;
    bgColor = customBgColor || 'bg-gray-500';
  } else if (configKey && logoConfigs[configKey]) {
    imageSrc = logoConfigs[configKey].image;
    text = logoConfigs[configKey].text;
    bgColor = logoConfigs[configKey].bgColor;
  } else if (aventuraNumber) {
    imageSrc = `/image/logo-image/aventura-${aventuraNumber}.png`;
    text = `AVENTURA ${aventuraNumber}`;
    bgColor = aventuraColors[aventuraNumber];
  } else {
    // Default fallback
    imageSrc = logoConfigs['default'].image;
    text = logoConfigs['default'].text;
    bgColor = logoConfigs['default'].bgColor;
  }

  return (
    <motion.div
      className="absolute top-4 left-4 z-40 flex items-center space-x-3"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Logo Image Container with colored circle background */}
      <motion.div
        className="relative w-14 h-14 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* Colored circle background */}
        <div className={`absolute inset-0 ${bgColor} rounded-full shadow-lg`} />
        
        {/* Logo image */}
        <div className="relative z-10">
          <Image
            src={imageSrc}
            alt={text}
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        className="backdrop-blur-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
          {text}
        </h2>
      </motion.div>
    </motion.div>
  );
}