import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'dark' | 'light';

interface ThemeColors {
  background: string;
  card: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
}

const DarkTheme: ThemeColors = {
  background: '#0A0A0A',
  card: '#111111',
  primary: '#7C3AED', // Purple
  secondary: '#1F2937',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#262626',
  success: '#10B981',
  warning: '#F59E0B',
};

const LightTheme: ThemeColors = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  primary: '#7C3AED',
  secondary: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#059669',
  warning: '#D97706',
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('dark');

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
