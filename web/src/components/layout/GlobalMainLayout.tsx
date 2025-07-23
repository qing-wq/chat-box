import React from 'react';
import { Outlet } from 'react-router-dom';
import GlobalSidebar from './GlobalSidebar';
import { cn } from '@/lib/utils';

const GlobalMainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Global Sidebar */}
      <GlobalSidebar />
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden animate-fadeIn">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GlobalMainLayout;