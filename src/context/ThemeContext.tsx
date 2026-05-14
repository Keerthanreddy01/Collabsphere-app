import React, { createContext, useContext, useMemo } from 'react';

import { colors } from '../theme/colors';

type ThemeContextType = {
  colors: typeof colors;
};

const ThemeContext = createContext<ThemeContextType>({ colors });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo(() => ({ colors }), []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
