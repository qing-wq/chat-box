import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import Sidebar from './Sidebar';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useAppSelector(state => state.config);
  
  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
      {/* Sidebar */}
      <div 
        className={`transition-all duration-300 ${
          collapsed ? 'w-0 -ml-64' : 'w-64'
        } h-full bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border`}
      >
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center px-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-light-text dark:text-dark-text"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div className="ml-4 text-lg font-medium text-light-text dark:text-dark-text">
            {useAppSelector(state => state.config.modelConfig.modelName)}
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
