// src/components/personal-task/components/TaskItem.tsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { TaskItemProps } from './types';
import { getPriorityColor, getStatusColor, getCategoryIcon, formatDate } from './utils';
import { useNavigation } from '@react-navigation/native';

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, onDelete }) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity
            style={[styles.taskItem, { transform: [{ scale: 1 }] }]}
            onPress={() => navigation.navigate('TaskViewScreen', { task })}
            activeOpacity={0.9}
        >
            <View style={styles.taskHeader}>
                <View style={styles.taskTitleContainer}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{task.name}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                        <Text style={styles.priorityText}>{task.priority}</Text>
                    </View>

                </View>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(task.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name="delete-outline" size={20} color={colors.error} />
                </TouchableOpacity>
            </View>

            <View style={styles.taskDetails}>
                <View style={{ marginBottom: 6 }}>
                    {task.notes && (
                        <Text style={styles.taskDescription} numberOfLines={2}>
                            {task.notes}
                        </Text>
                    )}

                </View>

                <View style={styles.taskDetailRow}>
                    <Icon name="calendar-today" size={16} color={colors.primary} />
                    <Text style={styles.taskDetailText}>{formatDate(task.dueDate)}</Text>
                </View>

                <View style={styles.taskDetailRow}>
                    <Icon name={getCategoryIcon(task.category)} size={16} color={colors.primary} />
                    <Text style={styles.taskDetailText}>{task.category}</Text>
                </View>
            </View>

            <View style={styles.taskFooter}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <Icon name="checkbox-marked-circle-outline" size={14} color={colors.card} />
                    <Text style={styles.statusText}>{task.status}</Text>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[styles.progressBar, {
                                width: `${task.progress}%`,
                                backgroundColor: task.progress >= 100 ? colors.success : colors.primary
                            }]}
                        />
                    </View>
                    <Text style={styles.progressText}>{task.progress}%</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    taskItem: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...elevation.small
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm
    },
    taskTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    taskTitle: {
        ...typography.subtitle1,
        color: colors.text,
        flex: 1,
        marginRight: spacing.sm
    },
    taskDescription: {
        ...typography.body2,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        width: '100%'
    },
    priorityBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm
    },
    priorityText: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.regular,
        color: colors.card
    },
    deleteButton: {
        marginLeft: spacing.sm
    },
    taskDetails: {
        marginBottom: spacing.sm
    },
    taskDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs
    },
    taskDetailText: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.regular,
        color: colors.textSecondary,
        marginLeft: spacing.sm
    },
    taskFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm
    },
    statusText: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.regular,
        color: colors.card,
        marginLeft: spacing.xs
    },
    progressContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: spacing.md
    },
    progressBarBackground: {
        flex: 1,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: borderRadius.sm,
        marginRight: spacing.sm
    },
    progressBar: {
        height: '100%',
        borderRadius: borderRadius.sm
    },
    progressText: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.regular,
        color: colors.textSecondary,
        minWidth: 35
    }
});

export default memo(TaskItem);