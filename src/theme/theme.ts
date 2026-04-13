export const COLORS = {
  background: '#F6F8FC',
  surface: '#FFFFFF',
  surfaceLight: '#EEF3FB',

  cardOrange: '#F5B78E',
  cardPurple: '#8D8BFF',
  cardGreen: '#8FD0BC',
  cardYellow: '#EBCB85',
  cardIndigo: '#4F46E5',

  primary: '#2F6BFF',
  accent: '#00A38C',
  primaryGradient: ['#4B8CFF', '#2F6BFF'] as const,

  textPrimary: '#0F172A',
  textSecondary: '#4B5568',
  textMuted: '#7A8498',

  // Status
  success: '#10B981',
  error: '#EF4444',

  // Glass & Borders
  glassBorder: 'rgba(15, 23, 42, 0.08)',
  glassBackground: 'rgba(255, 255, 255, 0.82)',
  cardShadow: 'rgba(17, 24, 39, 0.15)',
};

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 32,
  full: 9999,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 40,
    fontWeight: '800' as const,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '600' as const,
    opacity: 0.8,
  },
};
