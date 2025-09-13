'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Hook that provides activity access protection
 * Only runs after component mounts to prevent hydration issues
 */
export function useActivityProtection() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      // Only check for activity paths
      const activityMatch = pathname.match(/^\/actividad-(\d+)(?:\/(.+))?$/);
      if (!activityMatch) {
        console.log('🔒 Not an activity page, skipping protection:', pathname);
        return; // Not an activity page
      }
      
      console.log('🔒 Activity protection checking path:', pathname, 'Match:', activityMatch);

      // Wait for session to load - this is critical to prevent false redirects
      if (status === 'loading') {
        console.log('🔒 Session is loading, waiting...');
        return;
      }
      
      // Only redirect to login if we're certain the user is not authenticated
      // After the session has fully loaded
      if (status === 'unauthenticated') {
        console.log('🔒 User not authenticated - redirecting to login');
        router.push('/auth/login');
        return;
      }

      // Only check access for students
      const userRole = (session?.user as { role?: string })?.role;
      if (!session?.user?.id) {
        console.log('🔒 No user ID found in session');
        return; // Allow access if no user ID
      }
      
      if (userRole !== 'student') {
        console.log('🔒 User is not a student, allowing access. Role:', userRole);
        return; // Allow access for non-students
      }

      const activitySlug = `actividad-${activityMatch[1]}`;
      const sceneSlug = activityMatch[2];
      
      // Temporarily allow access to all Activity 1 pages without API check
      if (activityMatch[1] === '1') {
        console.log('🔒 Allowing access to Activity 1 pages without API check:', pathname);
        return;
      }

      try {
        console.log(`🔒 Checking access to ${activitySlug}${sceneSlug ? `/${sceneSlug}` : ''}`);
        console.log(`🔒 User info:`, { 
          userId: session.user.id, 
          role: userRole 
        });

        console.log('🔒 About to make API call to /api/student/activity-access');

        const response = await fetch('/api/student/activity-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            activitySlug,
            sceneSlug
          }),
        });

        console.log('🔒 API response received:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('🔒 API error response:', errorText);
          throw new Error(`Access check failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        console.log('🔒 Access check result:', result);
        
        if (!result.canAccess) {
          const redirectUrl = result.redirectTo || '/home';
          console.log('🔒 Access denied - redirecting to:', redirectUrl);
          router.push(redirectUrl);
        } else {
          console.log('🔒 Access granted');
        }
      } catch (error) {
        console.error('🔒 Error checking activity access:', error);
        console.log('🔒 Error occurred - ALLOWING ACCESS (fail-safe mode)');
        // Don't redirect on API errors - allow access by default
        // This prevents blocking users when the API is down
      }
    }

    // Only run the check if session status is not loading
    // This prevents premature redirects
    if (status !== 'loading') {
      // Longer delay to ensure page and session are fully loaded
      const timeoutId = setTimeout(checkAccess, 1000);
      return () => clearTimeout(timeoutId);
    }

  }, [pathname, session, status, router]);
}

/**
 * Component wrapper that applies activity protection
 * Uses the hook internally to protect any activity page
 */
export function ActivityProtectionWrapper({ children }: { children: React.ReactNode }) {
  useActivityProtection();
  return <>{children}</>;
}