'use client';

import { motion } from 'framer-motion';

interface SkipVideoButtonProps {
  onClick: () => void;
  className?: string;
}

const SkipVideoButton: React.FC<SkipVideoButtonProps> = ({
  onClick,
  className = 'fixed top-20 left-8 z-30',
}) => {
  return (
    <motion.button
      className={`${className} bg-blue-500/80 hover:bg-blue-600/90 text-white font-bold py-3 px-7 rounded-full border-2 border-blue-300/60 backdrop-blur-lg text-base flex items-center gap-2 transition-all duration-200`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={onClick}
    >
      Saltar
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </motion.button>
  );
};

export default SkipVideoButton;
