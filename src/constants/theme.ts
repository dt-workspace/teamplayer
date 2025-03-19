// src/constants/theme.ts

/**
 * Theme constants for the Team Player app
 * Following Material Design principles
 */

export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0062CC',
  primaryLight: '#70a9d4',     // Light variant of primary color
  
  // Secondary colors
  secondary: '#FF9500',
  secondaryDark: '#CC7A00',
  secondaryLight: '#FFAA33',
  
  // Status colors
  success: '#34C759',
  successLight: '#70d49f',     // Light variant of success color
  error: '#FF3B30',
  errorLight: '#ff7c7c',       // Light variant of error color
  warning: '#FFCC00',
  warningLight: '#f0c170',     // Light variant of warning color
  info: '#5AC8FA',
  
  // Status indicators
  free: '#34C759',  // Green for 'Free' status
  occupied: '#FF9500',  // Orange for 'Occupied' status
  
  // Neutral colors
  background: '#F2F2F7',
  backgroundSecondary: '#f5f5f7', // Secondary background for subtle components
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  border: '#C7C7CC',
  divider: '#E5E5EA',
  disabled: '#C7C7CC',
  placeholder: '#C7C7CC',
  white: '#FFFFFF',
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
    xs: 10,    // For overline
    sm: 12,    // For caption
    md: 14,    // For body2, button, subtitle2
    lg: 16,    // For body1
    xl: 20,    // For h3
    xxl: 24,   // For h2
    xxxl: 30,  // For h1
  },
  fontWeights: {
    regular: '400',  // For body1, body2, caption
    medium: '500',   // For overline, subtitle2
    semibold: '600', // For button, h2, h3
    bold: '700',     // For h1
  },
  h1: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
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
  subtitle1: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
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
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  overline: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 16,
    textTransform: 'uppercase',
  }
};

export const elevation = {
  tiny: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.0,
    elevation: 1,
  },
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