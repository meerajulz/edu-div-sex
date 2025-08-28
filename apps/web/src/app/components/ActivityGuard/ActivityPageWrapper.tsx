'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Auto-protecting wrapper that checks activity access based on URL path
 * This can be used in layouts or as a global component
 */
export default function ActivityPageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Prevent SSR mismatch by only running on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    async function checkActivityAccess() {
      // Only check for activity paths
      const activityMatch = pathname.match(/^\/actividad-(\d+)(?:\/(.+))?$/);
      if (!activityMatch) {
        return; // Not an activity page, allow access
      }

      const activitySlug = `actividad-${activityMatch[1]}`;
      const sceneSlug = activityMatch[2]; // Could be 'scene1', 'scene2', etc.

      console.log(`🔒 Auto-checking access to ${activitySlug}${sceneSlug ? `/${sceneSlug}` : ''}`);

      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        console.log('🔒 User not authenticated - redirecting to login');
        router.push('/auth/login');
        return;
      }

      if (!session?.user?.id) {
        console.log('🔒 No user ID in session - redirecting to login');
        router.push('/auth/login');
        return;
      }

      // Only check access for students
      if (session.user.role !== 'student') {
        console.log('🔒 Non-student user - allowing access');
        return;
      }

      try {
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
          console.log('❌ Access denied - redirecting to:', result.redirectTo);
          router.push(result.redirectTo || '/home');
        } else {
          console.log('✅ Access granted');
        }
      } catch (error) {
        console.error('Error checking activity access:', error);
        console.log('❌ Error occurred - redirecting to home');
        router.push('/home');
      }
    }

    checkActivityAccess();
  }, [pathname, session, status, router, isClient]);

  // Show children immediately - access control runs in background
  return <>{children}</>;
}