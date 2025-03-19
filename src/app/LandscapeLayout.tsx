'use client';

import { useState, useEffect } from 'react';

interface LandscapeLayoutProps {
  children: React.ReactNode;
}

// Define a more specific type for the lock function
type LockFunction = (orientation: string) => Promise<void>;

const LandscapeLayout = ({ children }: LandscapeLayoutProps) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Optional: Lock screen to landscape if supported by the browser
    if (typeof window !== 'undefined') {
      // Check if the orientation API exists
      const screenOrientation = window.screen?.orientation;
      
      // Check if lock method exists and is a function
      if (screenOrientation && 
          typeof screenOrientation === 'object' && 
          'lock' in screenOrientation && 
          typeof screenOrientation.lock === 'function') {
        
        try {
          // Call the lock method
          screenOrientation.lock('landscape').catch(() => {
            // Silently fail if permission denied
            console.log('Could not lock screen orientation');
          });
        } catch {
          // Empty catch block - no variable needed
          console.log('Orientation API not supported');
        }
      }
    }
  }, []);
  
  return (
    <div className="landscape-container">
      <div className="app-content">
        {children}
      </div>
      
      {isClient && (
        <div className="rotation-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18.01" />
          </svg>
          <h2>Please Rotate Your Device</h2>
          <p>This application is optimized for landscape mode.</p>
          <p>Please rotate your device to continue.</p>
        </div>
      )}
    </div>
  );
};

export default LandscapeLayout;