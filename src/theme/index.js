import { MD3DarkTheme } from 'react-native-paper';

export const colors = {
  // Primary colors
  primary: '#00D9FF', // Electric blue
  primaryDark: '#00A8CC',
  primaryLight: '#66E5FF',

  // Secondary/Accent colors
  accent: '#FF6B35', // Orange
  accentDark: '#E55A2B',
  accentLight: '#FF8C5A',

  // Background colors
  background: '#0A0A0A',
  surface: '#1A1A1A',
  surfaceVariant: '#252525',
  card: '#1E1E1E',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#666666',

  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  // Other
  border: '#333333',
  divider: '#2A2A2A',
  disabled: '#555555',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textTransform: 'uppercase',
  },
};

export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.accent,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    error: colors.error,
    onPrimary: colors.background,
    onSecondary: colors.text,
    onBackground: colors.text,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
  },
  roundness: borderRadius.md,
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  paperTheme,
};
