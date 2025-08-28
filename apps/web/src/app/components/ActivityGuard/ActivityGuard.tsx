'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ActivityGuardProps {
  activitySlug: string;
  sceneSlug?: string;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export default function ActivityGuard({
  activitySlug,
  sceneSlug,
  children,
  loadingComponent
}: ActivityGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accessStatus, setAccessStatus] = useState<'loading' | 'granted' | 'denied'>('loading');

  useEffect(() => {
    async function checkAccess() {
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
        console.log('🔒 Non-student user - granting access');
        setAccessStatus('granted');
        return;
      }

      try {
        console.log(`🔒 Checking access for student ${session.user.id} to ${activitySlug}${sceneSlug ? `/${sceneSlug}` : ''}`);
        
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
        
        if (result.canAccess) {
          console.log('✅ Access granted');
          setAccessStatus('granted');
        } else {
          console.log('❌ Access denied - redirecting to:', result.redirectTo);
          setAccessStatus('denied');
          router.push(result.redirectTo || '/home');
        }
      } catch (error) {
        console.error('Error checking activity access:', error);
        console.log('❌ Error occurred - redirecting to home');
        setAccessStatus('denied');
        router.push('/home');
      }
    }

    checkAccess();
  }, [session, status, router, activitySlug, sceneSlug]);

  if (accessStatus === 'loading') {
    return (
      loadingComponent || (
        <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 flex items-center justify-center">
          <div className="text-white text-xl">Verificando acceso...</div>
        </div>
      )
    );
  }

  if (accessStatus === 'denied') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-400 to-pink-300 flex items-center justify-center">
        <div className="text-white text-xl">Redirigiendo...</div>
      </div>
    );
  }

  return <>{children}</>;
}