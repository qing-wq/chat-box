import React from 'react';
import { useAppSelector } from '../hooks';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme: themeMode } = useAppSelector((state) => state.config);

  // Apply theme class to document
  React.useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return <>{children}</>;
};

export default ThemeProvider;