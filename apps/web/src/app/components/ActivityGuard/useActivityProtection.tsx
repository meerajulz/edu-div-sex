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
        return; // Not an activity page
      }

      // Wait for session to load
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        console.log('🔒 User not authenticated - redirecting to login');
        router.push('/auth/login');
        return;
      }

      // Only check access for students
      if (!session?.user?.id || session.user.role !== 'student') {
        return; // Allow access for non-students
      }

      const activitySlug = `actividad-${activityMatch[1]}`;
      const sceneSlug = activityMatch[2];

      try {
        console.log(`🔒 Checking access to ${activitySlug}${sceneSlug ? `/${sceneSlug}` : ''}`);

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

        if (!response.ok) {
          throw new Error(`Access check failed: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.canAccess) {
          const redirectUrl = result.redirectTo || '/home';
          console.log('🔒 Access denied - redirecting to:', redirectUrl);
          router.push(redirectUrl);
        } else {
          console.log('🔒 Access granted');
        }
      } catch (error) {
        console.error('Error checking activity access:', error);
        console.log('🔒 Error occurred - redirecting to home');
        router.push('/home');
      }
    }

    // Small delay to ensure page is fully loaded
    const timeoutId = setTimeout(checkAccess, 100);
    return () => clearTimeout(timeoutId);

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