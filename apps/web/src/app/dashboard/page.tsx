// Improved dashboard page using the wrapper component
// File: app/dashboard/page.tsx

import React from 'react';
import DashboardWrapper from './DashboardWrapper'

export default function DashboardPage() {
  return (
    <DashboardWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard Content Here</h1>
        {/* Your dashboard content goes here */}
      </div>
    </DashboardWrapper>
  );
}