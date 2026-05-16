export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  accent: '#000000', // Black as accent in light mode looks premium
  tabBar: '#FFFFFF',
  terracotta: '#E2694A',
  sage: '#7BAF7B',
  ochre: '#D4A84B',
  glass: 'rgba(255, 255, 255, 0.72)',
  glassBorder: '#E5E5EA',
  surface: '#FFFFFF',
  panel: '#F2F2F7',
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textMuted: '#C7C7CC',
  textCard: '#1C1C1E',
  danger: '#FF3B30',
  success: '#34C759',
  background: '#EBEBF0', // Light greyish background
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  xxl: 40,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
};

export const typography = {
  title: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.4 },
  subtitle: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.1 },
  caption: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.2 },
};
