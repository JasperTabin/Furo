// hooks/useTheme.ts - Custom hook for dark/light mode management

import { useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorageState<'light' | 'dark'>('theme', {
    defaultValue: 'light',
  });

  useEffect(() => {
    // Apply theme class to html element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};