'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (session?.user) {
      // Extract user data from session
      const user = session.user;
      setUserData({
        name: user.name || 'Usuario',
        email: user.email || '',
        role: (user as any).role,
        first_name: (user as any).first_name,
        last_name: (user as any).last_name,
      });
    }
  }, [session]);

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

  return (
    <div className="flex flex-col h-screen">
      <Header 
        userName={displayName}
        userEmail={userData?.email}
        userRole={roleDisplay}
        isLoading={status === 'loading'}
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