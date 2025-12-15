'use client';

import React, { useState, useEffect } from 'react';
import ErrorLogPanel from '../ErrorLogPanel/ErrorLogPanel';

/**
 * Global error log viewer that can be accessed via:
 * - Keyboard shortcut: Ctrl+Shift+E (or Cmd+Shift+E on Mac)
 * - URL parameter: ?debug=logs
 * - Small floating button (only in development)
 */
const GlobalErrorLogViewer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDebugButton, setShowDebugButton] = useState(false);

  useEffect(() => {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'logs') {
      setIsOpen(true);
    }

    // Show debug button if in dev mode or ?debug=1
    const debugParam = urlParams.get('debug') === '1';
    const showButton = process.env.NODE_ENV === 'development' || debugParam;
    setShowDebugButton(showButton);

    // Keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+E or Cmd+Shift+E
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating button - only in development or when ?debug=1 is in URL */}
      {showDebugButton && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-[9998] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Ver registros de errores (Ctrl+Shift+E)"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            !
          </span>
        </button>
      )}

      {/* Error log panel */}
      <ErrorLogPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default GlobalErrorLogViewer;
