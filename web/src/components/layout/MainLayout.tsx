import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Bot } from 'lucide-react';
import { useAppSelector } from '../../hooks';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, modelConfig } = useAppSelector(state => state.config);
  
  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out h-full bg-card shadow-sm",
          collapsed ? "w-0" : "w-64 md:w-80"
        )}
      >
        <div className={cn("h-full", collapsed ? "invisible" : "visible")}>
          <Sidebar />
        </div>
      </div>

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden animate-fadeIn"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 sm:px-6 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8"
            >
              {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="text-sm sm:text-base font-medium truncate">
                {modelConfig.modelName || 'Chat Assistant'}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Right side of header */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs text-muted-foreground">
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-hidden bg-background px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
