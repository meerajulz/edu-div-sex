'use client';

import React from 'react';

interface JuegoCuatroActividad3FemProps {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete?: () => void;
  userId?: string;
}

const JuegoCuatroActividad3Fem: React.FC<JuegoCuatroActividad3FemProps> = ({ 
  isVisible, 
  onClose, 
 // onGameComplete,
 // userId 
}) => {

  const handleClose = () => {
    console.log('🎮 Closing JuegoCuatroActividad3Fem modal...');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto p-4">
      {/* Modal with background - 800x500 responsive */}
      <div 
        className="relative w-full h-full max-w-[800px] max-h-[500px] rounded-xl shadow-xl pointer-events-auto overflow-hidden bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500"
        style={{ 
          aspectRatio: '800/500'
        }}
      >

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
        >
          Salir juego
        </button>

        {/* Placeholder Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-4">🎯</div>
            <div className="text-2xl font-bold mb-2">
              JuegoCuatroActividad3-Fem
            </div>
            <div className="text-lg opacity-80 mb-6">
              Placeholder Modal - Escena 2
            </div>
            <div className="text-sm opacity-60 max-w-md mx-auto leading-relaxed">
              Este es un modal placeholder para el juego JuegoCuatroActividad3-Fem.
              <br />
              Aquí se implementará la lógica del juego específica para la segunda escena.
            </div>
          </div>
        </div>

        {/* Floating animation elements - Different shapes for Scene 2 */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={`triangle-${i}`}
              className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${Math.random() * 3 + 2}s infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <div
              key={`square-${i}`}
              className="absolute w-3 h-3 bg-white/20 transform rotate-45 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-2 border-2 border-white/20 rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        </div>

      </div>
    </div>
  );
};

export default JuegoCuatroActividad3Fem;