'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from './UI/header/Header';
import TeacherSidebar from './UI/sidebar/TeacherSidebar';
import AdminSidebar from './UI/sidebar/AdminSidebar';
import OwnerSidebar from './UI/sidebar/OwnerSidebar';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

interface UserData {
  name: string;
  email: string;
  role?: string;
  first_name?: string;
  last_name?: string;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Session handling with proper loading states
  useEffect(() => {
    console.log('🔄 [TERMINAL] Dashboard wrapper - Session status:', status, 'Session exists:', !!session, 'User role:', session?.user?.role);
    
    if (status === 'authenticated' && session?.user) {
      console.log('✅ [TERMINAL] Dashboard wrapper - Session found for user:', session.user.email, 'Role:', session.user.role);
      
      // Check if user has access to dashboard (not student)
      if (session.user.role === 'student') {
        console.log('🔒 [TERMINAL] Dashboard wrapper - Student trying to access dashboard, redirecting to home');
        router.push('/home');
        return;
      }
      
      // Extract user data from session
      const user = session.user;
      setUserData({
        name: user.name || 'Usuario',
        email: user.email || '',
        role: (user as { role?: string }).role,
        first_name: (user as { first_name?: string }).first_name,
        last_name: (user as { last_name?: string }).last_name,
      });
    } else if (status === 'unauthenticated') {
      console.log('❌ [TERMINAL] Dashboard wrapper - No session found, redirecting to login');
      router.push('/');
    }
  }, [status, session, router]);

  const displayName = userData?.first_name && userData?.last_name 
    ? `${userData.first_name} ${userData.last_name}`
    : userData?.name || 'Usuario';

  const roleDisplay = userData?.role 
    ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
    : '';

  const renderSidebar = () => {
    switch (userData?.role) {
      case 'owner':
        return <OwnerSidebar />;
      case 'admin':
        return <AdminSidebar />;
      case 'teacher':
        return <TeacherSidebar />;
      default:
        return <TeacherSidebar />; // Default fallback
    }
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-purple-300">
        <div className="text-white text-xl mb-4">Loading session...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Don't render anything if unauthenticated
  if (status === 'unauthenticated') {
    return null;
  }

  // Don't render if still loading userData but we have session
  if (status === 'authenticated' && !userData) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <div className="text-gray-600 text-xl mb-4">Loading dashboard...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header 
        userName={displayName}
        userEmail={userData?.email}
        userRole={roleDisplay}
        isLoading={false}
      />
      <div className="flex flex-grow">
        {renderSidebar()}
        <main className="flex-grow p-4">
          {children}
        </main>
      </div>
    </div>
  );
}