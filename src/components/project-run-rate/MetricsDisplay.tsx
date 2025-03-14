// src/components/project-run-rate/MetricsDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { MetricsData } from './types';

type MetricsDisplayProps = {
  metrics: MetricsData;
};

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  const { prr, rprr } = metrics;
  
  return (
    <View style={styles.metricsContainer}>
      <View style={[styles.metricCard, styles.prrCard]}>
        <View style={styles.metricHeader}>
          <Icon name="speedometer" size={24} color={colors.primary} />
          <Text style={styles.metricTitle}>Current Run Rate (PRR)</Text>
        </View>
        <Text style={styles.metricValue}>{prr.toFixed(2)}</Text>
        <Text style={styles.metricUnit}>points/dev/day</Text>
      </View>
      
      <View style={[styles.metricCard, styles.rprrCard]}>
        <View style={styles.metricHeader}>
          <Icon name="target" size={24} color={colors.secondary} />
          <Text style={styles.metricTitle}>Required Run Rate (RPRR)</Text>
        </View>
        <Text style={styles.metricValue}>{rprr.toFixed(2)}</Text>
        <Text style={styles.metricUnit}>points/dev/day</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.small,
  },
  prrCard: {
    marginRight: spacing.xs,
  },
  rprrCard: {
    marginLeft: spacing.xs,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metricTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginLeft: spacing.xs,
    flex: 1,
  },
  metricValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  metricUnit: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});