import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { PersonalTask } from '@models/PersonalTask';
import dayjs from 'dayjs';
import { TaskTimeRemaining } from './TaskTimeRemaining';

interface TaskInfoProps {
    task: PersonalTask;
    getPriorityColor: (priority: string) => string;
    getTaskTypeIcon: (taskType?: string) => string;
}

export const TaskInfo: React.FC<TaskInfoProps> = ({
    task,
    getPriorityColor,
    getTaskTypeIcon
}) => {
    console.log(task)
    return (
        <>
            <View style={styles.taskHeaderCard}>
                <Text style={styles.taskTitle}>{task.name}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]} >
                    <Text style={styles.priorityText}>{task.priority}</Text>
                </View>
            </View>
            
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <View style={styles.infoIconContainer}>
                            <Icon name="calendar-clock" size={22} color={colors.white} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Due Date</Text>
                            <Text style={styles.infoValue}>
                                {dayjs(task.dueDate).format('MMM D, YYYY')}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <View style={[styles.infoIconContainer, { backgroundColor: colors.secondary }]}>
                            <Icon name="tag" size={22} color={colors.white} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Category</Text>
                            <Text style={styles.infoValue}>{task.category || 'Uncategorized'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <View style={[styles.infoIconContainer, { backgroundColor: colors.success }]}>
                            <Icon name={'resize'} size={22} color={colors.white} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Task Type</Text>
                            <Text style={styles.infoValue}>
                                {task.taskType || 'Standard'}
                                {task.points ? ` (${task.points} pts)` : ''}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={{ flex: 1,marginLeft: spacing.md,height: 65 }}>
                        
                    <TaskTimeRemaining task={task} compact={true} />
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    taskHeaderCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...elevation.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskTitle: {
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        flex: 1,
        marginRight: spacing.sm,
    },
    priorityBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    priorityText: {
        color: colors.white,
        fontWeight: typography.fontWeights.medium,
        fontSize: typography.fontSizes.sm,
    },
    infoCard: {
        
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        maxWidth: '48%',
        borderRadius: borderRadius.lg,
        backgroundColor: colors.white,
        padding: spacing.md,
        ...elevation.small,
    },
    infoIconContainer: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        marginRight: spacing.md,
    },
    infoLabel: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.medium,
        color: colors.text,
    },
    infoValue: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.regular,
        color: colors.text,
    },
});
