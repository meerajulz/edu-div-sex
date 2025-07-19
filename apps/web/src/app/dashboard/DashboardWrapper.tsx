// File: app/components/DashboardWrapper.tsx
// A reusable component to avoid duplicating the header and sidebar in every page
import React from 'react';
import Header from './UI/header/Header';
import Sidebar from './UI/sidebar/sidebar';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  // You can fetch user data here
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