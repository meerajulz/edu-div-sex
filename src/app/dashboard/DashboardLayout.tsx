import React from 'react';
import Header from './UI/header/Header';
import Sidebar from './UI/sidebar/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: DashboardLayoutProps) {
  // You can fetch user data here or pass it through context
  const userName = "User"; // Replace with actual user data fetching

  return (
    <div className="flex flex-col h-screen">
      <Header userName={userName} />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-4">
          {children}
        </main>
      </div>
    </div>
  );
}