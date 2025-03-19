import { StyleSheet } from 'react-native';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title:{
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  importButton: {
    width: 36,
    height: 36,
    backgroundColor: colors.secondary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    ...elevation.small,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.small,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  emptyStateText: {
    marginTop: spacing.md,
    color: colors.textTertiary,
    fontSize: typography.fontSizes.md,
  },
  taskCardContainer: {
    marginVertical: spacing.sm,
  },
  taskCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    ...elevation.medium,
    overflow: 'hidden',
    flexDirection: 'row',
    borderLeftWidth: 0,
  },
  completedTaskCard: {
    opacity: 0.85,
    backgroundColor: colors.card,
  },
  statusLine: {
    width: 6,
    height: '100%',
  },
  taskContent: {
    flex: 1,
    padding: spacing.md,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    borderRadius: borderRadius.round,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    ...elevation.small,
  },
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskName: {
    fontSize: typography.fontSizes.md + 1,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  completedIcon: {
    marginLeft: spacing.xs,
  },
  deleteButton: {
    padding: 6,
    marginRight: -4,
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priorityBadge: {
    borderRadius: 12,
   marginRight: spacing.md,

  },
  priorityText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium as any,
    color: colors.card,
    marginLeft: spacing.xs,
  },
  taskStatusContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold as any,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dueDateIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  overdueIconContainer: {
    backgroundColor: colors.error,
  },
  todayIconContainer: {
    backgroundColor: colors.primary,
  },
  dueDateText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  overdueText: {
    color: colors.error,
    fontWeight: typography.fontWeights.medium as any,
  },
  todayText: {
    color: colors.primary,
    fontWeight: typography.fontWeights.medium as any,
  },
  progressSection: {
    marginTop: spacing.xs,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium as any,
    color: colors.textSecondary,
  },
  subtaskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.md,
  },
  subtaskText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium as any,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  progressContainer: {
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
