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
  background: '#FFEB3B', // High-impact yellow
  card: '#FFFFFF',
  primary: '#000000', // Black primary for bold elements
  secondary: '#FF1744', // Vibrant Red accent
  text: '#000000',
  textSecondary: 'rgba(0,0,0,0.5)',
  border: '#000000',
  success: '#00C853', // Green accent
  warning: '#2979FF', // Blue accent
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('light');

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
