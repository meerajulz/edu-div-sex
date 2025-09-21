'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Hook to track user's current activity URL
 * Saves the current URL to the database so users can continue where they left off
 */
export function useActivityTracking() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only track if user is authenticated and on an activity page
    if (status !== 'authenticated' || !session?.user?.id) {
      return;
    }

    // Only track activity pages (actividad-*/scene*)
    const isActivityPage = /^\/actividad-\d+\/scene\d+/.test(pathname);
    
    if (!isActivityPage) {
      return;
    }

    // Save the current URL with a debounce to avoid too many requests
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch('/api/user/last-activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: pathname }),
        });

        if (response.ok) {
          console.log('✅ Activity URL saved:', pathname);
        } else {
          console.error('Failed to save activity URL');
        }
      } catch (error) {
        console.error('Error saving activity URL:', error);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [pathname, session, status]);
}

/**
 * Function to get the user's last activity URL with enhanced logic
 */
export async function getLastActivityUrl(): Promise<{
  lastUrl: string | null;
  showButton: boolean;
  hasProgress: boolean;
  allCompleted: boolean;
} | null> {
  try {
    const response = await fetch('/api/user/last-activity');

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      lastUrl: data.lastUrl || null,
      showButton: data.showButton || false,
      hasProgress: data.hasProgress || false,
      allCompleted: data.allCompleted || false
    };
  } catch (error) {
    console.error('Error fetching last activity URL:', error);
    return null;
  }
}

/**
 * Function to hide the continue button (called when user clicks it)
 */
export async function hideContinueButton(): Promise<boolean> {
  try {
    const response = await fetch('/api/user/last-activity', {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error hiding continue button:', error);
    return false;
  }
}

/**
 * Clear the last activity tracking when an activity is completed
 * This prevents the continue button from showing completed activities
 */
export async function clearLastActivity(): Promise<boolean> {
  try {
    const response = await fetch('/api/user/last-activity', {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('✅ Last activity tracking cleared after completion');
    }

    return response.ok;
  } catch (error) {
    console.error('Failed to clear last activity:', error);
    return false;
  }
}