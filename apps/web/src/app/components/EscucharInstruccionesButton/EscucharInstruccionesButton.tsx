'use client';

import React from 'react';

interface EscucharInstruccionesButtonProps {
  onPlayInstructions: () => void;
  className?: string;
  disabled?: boolean;
  position?: 'top-right' | 'below-exit' | 'top-left' | 'side-by-side';
}

const EscucharInstruccionesButton: React.FC<EscucharInstruccionesButtonProps> = ({
  onPlayInstructions,
  className = '',
  disabled = false,
  position = 'top-right'
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-48',
    'below-exit': 'top-16 right-4',
    'top-left': 'top-4 left-4',
    'side-by-side': 'top-4 right-40'
  };

  return (
    <button
      onClick={onPlayInstructions}
      disabled={disabled}
      className={`absolute ${positionClasses[position]} z-10 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold ${className}`}
    >
      🔊 Escuchar instrucciones
    </button>
  );
};

export default EscucharInstruccionesButton;