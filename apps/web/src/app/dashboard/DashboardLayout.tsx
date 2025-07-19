import React from 'react';
import DashboardWrapper from './DashboardWrapper';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
}