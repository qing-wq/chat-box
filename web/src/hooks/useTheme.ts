import { useAppSelector } from './useAppSelector';
import { ThemeMode } from '../types';

export const useTheme = (): { theme: ThemeMode; isDarkMode: boolean } => {
  const theme = useAppSelector((state) => state.config.theme);
  const isDarkMode = theme === 'dark';
  
  return { theme, isDarkMode };
};