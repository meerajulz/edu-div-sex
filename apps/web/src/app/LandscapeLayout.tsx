'use client';

import { useState, useEffect } from 'react';

interface LandscapeLayoutProps {
  children: React.ReactNode;
}

const LandscapeLayout = ({ children }: LandscapeLayoutProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Check if device is mobile or tablet
    const checkDevice = () => {
      // Check for touch capability and screen size
      const hasTouchScreen = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 || 
                            // @ts-expect-error - msMaxTouchPoints is a legacy property that may not be in TypeScript definitions
                            navigator.msMaxTouchPoints > 0;
      
      // Check screen width (typically tablets are under 1024px)
      const screenWidth = window.innerWidth;
      const isSmallScreen = screenWidth <= 1024;
      
      // Check user agent for mobile/tablet devices
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Combine checks: must have touch AND (small screen OR mobile UA)
      const isMobileDevice = hasTouchScreen && (isSmallScreen || isMobileUA);
      
      setIsMobileOrTablet(isMobileDevice);
      
      // Only attempt to lock orientation on mobile/tablet devices
      if (isMobileDevice && typeof window !== 'undefined') {
        const screenOrientation = window.screen?.orientation;
        
        if (screenOrientation && 
            typeof screenOrientation === 'object' && 
            'lock' in screenOrientation && 
            typeof screenOrientation.lock === 'function') {
          
          try {
            screenOrientation.lock('landscape').catch(() => {
              console.log('Could not lock screen orientation');
            });
          } catch {
            console.log('Orientation API not supported');
          }
        }
      }
    };
    
    checkDevice();
    
    // Re-check on window resize
    const handleResize = () => {
      checkDevice();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Unlock orientation when component unmounts
      if (window.screen?.orientation?.unlock) {
        try {
          window.screen.orientation.unlock();
        } catch {
          // Silently fail
        }
      }
    };
  }, []);
  
  return (
    <>
      {children}
      
      {isClient && isMobileOrTablet && (
        <div className="rotation-message fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-95 portrait:flex landscape:hidden">
          <div className="text-center p-8">
            <div className="mb-6">
              <svg 
                className="w-16 h-16 mx-auto text-gray-600 animate-pulse" 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18.01" />
              </svg>
              <svg 
                className="w-8 h-8 mx-auto mt-4 text-gray-500" 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                <polyline points="21 4 21 12 13 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Please Rotate Your Device</h2>
            <p className="text-gray-600 mb-1">This application is optimized for landscape mode.</p>
            <p className="text-gray-600">Please rotate your device to continue.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default LandscapeLayout;