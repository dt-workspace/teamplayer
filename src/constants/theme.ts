// src/constants/theme.ts

/**
 * Theme constants for the Team Player app
 * Following Material Design principles
 */

export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0062CC',
  primaryLight: '#66AFFF',
  
  // Secondary colors
  secondary: '#FF9500',
  secondaryDark: '#CC7A00',
  secondaryLight: '#FFAA33',
  
  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FFCC00',
  info: '#5AC8FA',
  
  // Status indicators
  free: '#34C759',  // Green for 'Free' status
  occupied: '#FF9500',  // Orange for 'Occupied' status
  
  // Neutral colors
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C7C7CC',
  divider: '#E5E5EA',
  disabled: '#C7C7CC',
  placeholder: '#C7C7CC',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const elevation = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};