'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { getLastActivityUrl, hideContinueButton } from '../../hooks/useActivityTracking';

interface ContinueButtonProps {
  onNavigate?: (url: string) => void;
  className?: string;
  showWhen?: boolean; // External control for when to show the button
  onHide?: () => void; // Callback when button is hidden
}

export default function ContinueButton({ onNavigate, className = "", showWhen = true, onHide }: ContinueButtonProps) {
  const { data: session, status } = useSession();
  const [showButton, setShowButton] = useState(false);
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      checkContinueStatus();
    } else {
      setIsLoading(false);
    }
  }, [status, session]);

  const checkContinueStatus = async () => {
    try {
      const result = await getLastActivityUrl();

      if (result && result.showButton && result.lastUrl) {
        setShowButton(true);
        setContinueUrl(result.lastUrl);
        console.log('📍 Continue button available for:', result.lastUrl);
      } else {
        setShowButton(false);
        console.log('📍 Continue button not shown:', {
          hasResult: !!result,
          showButton: result?.showButton,
          hasUrl: !!result?.lastUrl,
          hasProgress: result?.hasProgress,
          allCompleted: result?.allCompleted
        });
      }
    } catch (error) {
      console.warn('⚠️ Failed to check continue status:', error);
      setShowButton(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueClick = async () => {
    if (!continueUrl) return;

    console.log('🚀 Continuing from last activity:', continueUrl);

    // Hide the button immediately for better UX
    setShowButton(false);

    // Call onHide callback if provided
    if (onHide) {
      onHide();
    }

    // Clear the continue button from the database
    try {
      await hideContinueButton();
      console.log('✅ Continue button hidden in database');
    } catch (error) {
      console.warn('⚠️ Failed to hide continue button:', error);
    }

    // Navigate to the URL
    if (onNavigate) {
      onNavigate(continueUrl);
    } else {
      // Fallback: direct navigation
      window.location.href = continueUrl;
    }
  };

  // Don't render anything if loading, shouldn't show, or external control says no
  if (isLoading || !showButton || !continueUrl || !showWhen) {
    return null;
  }

  return (
    <motion.div
      className={`fixed top-[20%] left-0 right-0 z-[100] flex justify-center px-4 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={handleContinueClick}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 max-w-xs sm:max-w-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm sm:text-base">Continuar donde lo dejaste</span>
      </motion.button>
    </motion.div>
  );
}