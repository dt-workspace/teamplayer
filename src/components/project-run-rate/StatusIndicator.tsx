// src/components/project-run-rate/StatusIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { ProjectStatus } from './types';

type StatusIndicatorProps = {
  status: ProjectStatus;
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Ahead':
        return colors.success;
      case 'Behind':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Ahead':
        return 'arrow-up-circle';
      case 'Behind':
        return 'arrow-down-circle';
      default:
        return 'equal-circle';
    }
  };

  return (
    <View style={[styles.statusContainer, { borderColor: getStatusColor() }]}>
      <Icon 
        name={getStatusIcon()} 
        size={24} 
        color={getStatusColor()} 
      />
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        Project is {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    ...elevation.small,
  },
  statusText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
});